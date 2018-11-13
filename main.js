const express = require('express')
const app = express()
// 파일 절대 경로 지정- /static 은 /data 를 가리킴
app.use('/static', express.static(__dirname + '/data'));

// express 에선 http 와 url 지원
var fs = require('fs');
var qs = require('querystring');
//var path = require('path');
var template = require('./data/lib/template.js');
var addform = require('./data/lib/add_form.js');
 
app.get('/', function(request, response) {
  fs.readdir('data/music', function(error, filelist){
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
});

// 좌측메뉴를 통한 페이지 이동
app.get('/year/:yearId', function(request, response){
  fs.readdir('./data/music', function(error, filelist){
    var yearId = request.params.yearId;
    fs.readdir(`./data/music/${yearId}`, function(error, musiclist){
      var title = yearId;
      var description = template.musicList(musiclist, yearId);
      var list = template.list(filelist);
      var html = template.HTML(title, list,
       `<h2>${title}</h2><p>${description}</p>`
      );
      response.send(html);  
    }); 
  });
});

// 음악가사 불러오기 + 수정 삭제 기능
app.get('/year/:yearId/:musicId', function(request, response){
  fs.readdir('./data/music', function(error, filelist){
    var yearId = request.params.yearId;
    var musicId = request.params.musicId;
    fs.readFile(`./data/music/${yearId}/${musicId}`, function(error, data){
      var title = musicId;
      var description = template.music_format(data);
      var list = template.list(filelist);
      // 삭제시 확인 경고 창 띄우기
  
      // hidden 으로 기존 파일 제목 저장
      var html = template.HTML(title, list,
       `
       <div class="modified_bar">
           <li><a href="#" class="modified_a">Modified</a>
             <ul>
               <form action="/update" method="post">
                 <input type="hidden" name="year_of_dir" value="${yearId}">
                 <input type="hidden" name="selected_music" value="${title}">
                 <li><input type="submit" id="update_button" class="modified"   value="Update"></li>
               </form>
               <form action="/delete_process" method="post">
                 <input type="hidden" name="year_of_dir" value="${yearId}">
                 <input type="hidden" name="selected_music" value="${title}">
                 <li><input type="submit" id="delete_button" class="modified"  value="Delete"></li>
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
});
// 가사추가 
app.get('/add', function(request, response){
  fs.readdir('data/music', function(error, filelist){
   var title = "Add Lyric";
   var list = template.list(filelist);
   var add_temp = addform.text();
   var html = template.HTML(title, list, add_temp);
   response.send(html);
  });
});

// 가사추가(저장) 처리 부분
// express 에서는 post를 받는것은 app.post
app.post('/add_process', function(request, response){
  //post로 받은것 저장 할 곳
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
      // 공백 문자 _ 로 치환
      var music_title = post.music_title.replace(/ /gi,"_");
      var artist = post.artist.replace(/ /gi,"_");;
      var releaseDate = post.releaseDate;
      var music_url = post.music_url;
      var music_lyric = post.music_lyric;
      // 연도 별 디렉토리 지정 함수 모듈
      var yearDir = require('./data/lib/setYear.js');
      var aboutDate = yearDir.get_yearDir(releaseDate);
      // 파일 형식화
      var lyric_file = `${music_title}\n${artist}\n${releaseDate}\n${music_url}\n${music_lyric}`;
      fs.writeFile(`data/music/${aboutDate}/${music_title}(${artist})`,`${lyric_file}`, 'utf8', function(err){
        response.writeHead(302, {Location: `/`});
        response.end();
      })
  });
});
// 파일 수정 페이지
app.post('/update', function(request, response){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var musicId = post.selected_music;
        var yearId = post.year_of_dir;
        // 기존 파일을 읽어서 정보를 가져온
        fs.readdir('data/music', function(error, filelist){
          fs.readFile(`./data/music/${yearId}/${musicId}`, function(error, datas){
            var title = "Update Lyric";
            var list = template.list(filelist);
            var lyric_array = String(datas).split(/\n/gi);
            // 이전 정보도 보내줌
            var add_temp = addform.update_text(lyric_array, yearId, musicId, );
            var html = template.HTML(title, list, add_temp);
            response.send(html);
           });
        });
    });
});
// 파일 수정 처리 부분
app.post('/update_process', function(request, response){
  //post로 받은것 저장 할 곳
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
      // 공백 문자 _ 로 치환
      var music_title = post.music_title.replace(/ /gi,"_");
      var artist = post.artist.replace(/ /gi,"_");;
      var releaseDate = post.releaseDate;
      var music_url = post.music_url; 
      var music_lyric = post.music_lyric;
      var before_Title = post.before_title;
      var before_Date = post.before_date
      // 연도 별 디렉토리 지정 함수 모듈
      var yearDir = require('./data/lib/setYear.js');
      var aboutDate = yearDir.get_yearDir(releaseDate);
      // 파일 형식화
      var lyric_file = `${music_title}\n${artist}\n${releaseDate}\n${music_url}\n${music_lyric}`;
      fs.unlink(`data/music/${before_Date}/${before_Title}`, function(error){
      })
      fs.writeFile(`data/music/${aboutDate}/${music_title}(${artist})`,`${lyric_file}`, 'utf8', function(err){
         response.writeHead(302, {Location: `/`});
         response.end();
      })
  });
});
// 파일 삭제 처리 부분
app.post('/delete_process', function(request, response){
  var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var sel_year = post.year_of_dir;
          var sel_m = post.selected_music;
          fs.unlink(`data/music/${sel_year}/${sel_m}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
});
app.listen(4000, function() { 
  console.log('Example app listening on port 4000!')
});
