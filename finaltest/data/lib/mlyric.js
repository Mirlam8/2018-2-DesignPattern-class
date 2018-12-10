var db = require('./db.js');
var template = require('./template.js');
var addform = require('./add_form.js');
var qs = require('querystring');
exports.home = function(request, response){
    db.query(`SELECT * FROM listbase`, function(error, filelist){
      if(error){
        throw error;
      }

      var title = "Welcome";
      var description = '<div id="mainbg"></div>';
      var list = template.list(filelist);
      var html = template.HTML(title, list,
      `<p>${description}</p>`
      );
      // response.writeHead(200);
      // response.end(html);
      // 위와 같은 의미
      response.send(html);
    });
}

exports.menu_page = function(request, response){
    db.query(`SELECT * FROM listbase`, function(error, filelist){
        if(error){
          throw error;
        }
        var yearId = request.params.yearId;
        db.query(`SELECT * FROM listbase WHERE listname =?`,[yearId], function(error2, selected_year){
          if(error2){
            throw error2;
          }
          var yearCondition = selected_year[0].list_condition;
          db.query(`SELECT * FROM m_data WHERE ${yearCondition}`, function(error3, musiclist){
            if(error3){
              throw error3;
            }
            var title = yearId;
            var description = template.musicList(musiclist);
            var list = template.list(filelist);
            var html = template.HTML(title, list,
            `<h2>${title}</h2><p>${description}</p>`
            );
            response.send(html);  
          }); 
        });
      });
}

exports.music_page = function(request, response){
    db.query(`SELECT * FROM listbase`, function(error, filelist){
        if(error){
          throw error;
        }
        var musicId = request.params.musicId;
        db.query(`SELECT * FROM m_data WHERE m_id=?;`, [musicId], function(error2, m_data){
          if(error2){
            throw error2;
          }
          var title = m_data[0].m_title;
          var description = template.music_format(m_data[0]);
          var list = template.list(filelist);
          // 삭제시 확인 경고 창 띄우기
      
          // hidden 으로 기존 파일 제목 저장
          var html = template.HTML(title, list,
           `
           <div class="modified_bar">
               <li><a href="#" class="modified_a">Modified</a>
                 <ul>
                   <form action="/update" method="post">
                     <input type="hidden" name="music_id" value="${musicId}">
                     <li><input type="submit" id="update_button" class="modified" value="Update"></li>
                   </form>
                   <form action="/delete_process" method="post">
                     <input type="hidden" name="music_id" value="${musicId}">
                     <li><input type="submit" id="delete_button" class="modified" value="Delete"></li>
                   </form>
                 </ul>
               </li>
            </div>
            <p>${description}</p>
            `
          );
          response.send(html);  
        }); 
      });
}

exports.add_page = function(request, response){
    db.query(`SELECT * FROM listbase`, function(error, filelist){
        var title = "Add Lyric";
        var list = template.list(filelist);
        var add_temp = addform.text();
        var html = template.HTML(title, list, add_temp);
        response.send(html);
       });
}

exports.add_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body += data;
        if(body.length > 1e6) {
          body = '';
          request.connection.destroy();
        }
    });
    request.on('end', function(){
        var post = qs.parse(body);
        // post 받음: music_title, artist, releaseDate, music_url, music_lyric
        var music_title = post.music_title;
        var artist = post.artist;
        var releaseYear = post.releaseYear;
        var releaseDate = post.releaseDate;
        var music_url = post.music_url;
        var music_lyric = post.music_lyric;
        // db 에 저장
        db.query(`INSERT INTO m_data (m_title, m_artist, m_update, m_release, m_monthday, m_url, m_lyric) VALUES (?,?,now(),?,?,?,?)`,
        [music_title, artist, releaseYear, releaseDate, music_url, music_lyric],
        function(error, result){
          if(error){
            throw error;
          }
          // 새로 생성된 id 값을 받아 그 페이지로 이동
          response.writeHead(302, {Location: `/music/${result.insertId}`});
          response.end();
        })
    });
}

exports.update_page = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var musicId = post.music_id;
        // 기존 정보을 읽어서 정보를 가져온다
        db.query(`SELECT * FROM listbase`, function(error, filelist){
          if(error){
            throw error;
          }
          db.query(`SELECT * FROM m_data WHERE m_id=?`, [musicId], function(error2, datas){
            if(error2){
              throw error2;
            }
          var title = "Update Lyric";
          var list = template.list(filelist);
          var add_temp = addform.update_text(datas);
          var html = template.HTML(title, list, add_temp);
          response.send(html);
         });
       });
    });
}

exports.update_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body += data;
        if(body.length > 1e6) {
          body = '';
          request.connection.destroy();
        }
    });
    request.on('end', function(){
        var post = qs.parse(body);
        console.log(post);
        // post 받음: before_id, music_title, artist, releaseYear, releaseDate, music_url, music_lyric
        var this_id = post.before_id;
        // db 업데이트
        db.query(`UPDATE m_data SET m_title=?, m_artist=?, m_release=?, m_monthday=?, m_url=?, m_lyric=? WHERE m_id=${this_id}`, 
        [post.music_title, post.artist, post.releaseYear, post.releaseDate, post.music_url, post.music_lyric], function(error, result){
          if(error){
            throw error;
          }
          console.log(result);
           response.writeHead(302, {Location: `/music/${this_id}`});
           response.end();
        })
    });
}

exports.delete_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var m_id = post.music_id;
        db.query(`DELETE FROM m_data WHERE m_id=?`, [m_id],function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/`});
          response.end();
        })
    });
}

exports.search_page = function(request, response){
    db.query(`SELECT * FROM listbase`, function(error, filelist){
        if(error){
          throw error;
        }
        var search = request.query.q;
        // 검색어가 부분 들어가는곳 조회를 위해
        var search_fix = '%'+search+'%';
        //검색 조건 정하기
          db.query(`SELECT * FROM m_data WHERE m_title LIKE ? OR m_artist LIKE ?`, [search_fix, search_fix], function(error2, musiclist){
            if(error2){
              throw error2;
            }
            var title = "'"+search+"'" + ' 로 검색한 결과..';
            var description = template.musicList(musiclist);
            var list = template.list(filelist);
            var html = template.HTML(title, list,
            `<h2>${title}</h2><p>${description}</p>`
            );
            response.send(html);  
          }); 
      });
}

exports.login_page = function(request, response){
  db.query(`SELECT * FROM listbase`, function(error, filelist){
    if(error){
      throw error;
    }
    var title = 'Login';
    var list = template.list(filelist);
    var html = template.HTML(title, list,
      `<h2>${title}<h2><p>
      <form action="login_process" method="post">
        <label for="ID">ID : </label>
        <input type="text" name="ID">
        &nbsp &nbsp
        <label for="pwd">pwd : </label>
        <input type="password" name="pwd" >
        <p>
        <input type="submit" id="login" value="Login">
      </form>`
      );
      response.send(html);
  });
}