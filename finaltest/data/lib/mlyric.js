var db = require('./db.js');
var template = require('./template.js');
var addform = require('./add_form.js');
var qs = require('querystring');
var login_UI = require('./login.js');
exports.home = function(request, response){
    db.query(`SELECT * FROM listbase`, function(error, filelist){
      if(error){
        throw error;
      }

      var title = "Welcome";
      var description = '<div id="mainbg"></div>';
      var list = template.list(filelist);
      var html = template.HTML(title, list,
      `<p>${description}</p>`,
      login_UI.user_status_UI(request, response)
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
            `<h2>${title}</h2><p>${description}</p>`,
            login_UI.user_status_UI(request, response)
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
            `,
            login_UI.user_status_UI(request, response)
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
        var html = template.HTML(title, list, add_temp, login_UI.user_status_UI(request, response));
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
        var publisher = 'public';
        // 로그인 상태면 바꿈
        if(request.session.is_login){
          publisher = request.session.user_id;
        }
        // db 에 저장
        db.query(`INSERT INTO m_data (m_title, m_artist, m_update, m_release, m_monthday, m_url, m_lyric, publisher_id) VALUES (?,?,now(),?,?,?,?,?)`,
        [music_title, artist, releaseYear, releaseDate, music_url, music_lyric, publisher],
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
          var html = template.HTML(title, list, add_temp, login_UI.user_status_UI(request, response));
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
        // 작성자 이거나 작성자가 public 이면 지움
        db.query(`SELECT EXISTS (SELECT * FROM m_data WHERE m_id=? AND (publisher_id=? OR publisher_id='public')) as success`,[m_id, request.session.user_id], function(error, result){
          if(error){
            throw error;
          }
          if(result[0].success || request.session.user_id === "Admin"){
            
            db.query(`DELETE FROM m_data WHERE m_id=?`, [m_id],function(error2, result2){
              if(error2){
                throw error2;
              }
              response.writeHead(302, {Location: `/`});
              response.end();
            });
          }else{
            response.send(`<script type="text/javascript">alert("작성자가 아닙니다.");history.back();</script>`);
          }
        });
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
            `<h2>${title}</h2><p>${description}</p>`,
            login_UI.user_status_UI(request, response)
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
        <label for="id">ID : </label>
        <input type="text" name="id" autocomplete=off>
        &nbsp
        <label for="pwd">pwd : </label>
        <input type="password" name="pwd" autocomplete=off>
        &nbsp
        <input type="submit" id="login_button" value="Login">
      </form>
      <p>
      <a href="/adduser" id="adduser_button">사용자로 등록하기</a>`,
       login_UI.user_status_UI(request, response)
      );
      response.send(html);
  });
}

exports.login_process = function(request, response){
  var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var user_id = post.id;
        var user_pwd = post.pwd;
        // db 에 접속해 사용자가 있는지 확인
        db.query(`SELECT * FROM user WHERE user_id=? AND user_pwd=?`, [user_id, user_pwd], function(error, result){
          if(error){
            throw error;
          }
          // 정상 로그인
          if(result[0]){
            request.session.is_login = true;
            request.session.user_id = result[0].user_id;
            request.session.nickname = result[0].nickname;
            // 세션 저장 후에 이동
            request.session.save(function(){
              response.redirect('/');
            });
          }
          // 아이디나 비밀번호가 일치하지 않음 : 경고창 후 돌아가기
          else{
            console.log('아이디나 비밀번호 틀림');
            response.send(`<script type="text/javascript">alert("아이디나 비밀번호가 틀립니다.");history.back();</script>`);
          }
        });
    });
}

exports.logout_page = function(request, response){
  request.session.destroy(function(err){
    // 세션 저장 후에 이동
      response.redirect('/');
  });
}

exports.adduser_page = function(request, response){
  db.query(`SELECT * FROM listbase`, function(error, filelist){
    if(error){
      throw error;
    }
    var title = 'Add User';
    var list = template.list(filelist);
    var html = template.HTML(title, list,
      `<h2>${title}<h2><p>
      <form action="adduser_process" method="post">
        <label for="a_id">ID : </label>
        <input type="text" name="a_id" autocomplete=off>
        <p>
        <label for="a_nick">NickName : </label>
        <input type="text" name="a_nick" autocomplete=off>
        <p>
        <label for="a_pwd">pwd : </label>
        <input type="password" name="a_pwd" autocomplete=off>
        <p>
        <input type="submit" id="adduser_button" value="ADD user">
      </form>`, login_UI.user_status_UI(request, response)
      );
      response.send(html);
  });
}

exports.adduser_process = function(request, response){
  var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var user_id = post.a_id;
        var user_nick = post.a_nick;
        var user_pwd = post.a_pwd;
        db.query(`INSERT INTO user VALUES(?,?,?)`, [user_id, user_pwd, user_nick], function(error, result){
          if(error){
            // 중복된 아이디일 경우
            response.send(`<script type="text/javascript">alert("중복된 아이디 입니다.");history.back();</script>`);
          }
          else{
            response.redirect('/login');
          }
        });
    });
}