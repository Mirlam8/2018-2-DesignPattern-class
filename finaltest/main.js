const express = require('express')
const app = express()
// 파일 절대 경로 지정- /static 은 /data 를 가리킴
app.use('/static', express.static(__dirname + '/data'));
// 모듈 
var helmet = require('helmet');
var mlyric = require('./data/lib/mlyric.js');
app.use(helmet());

app.get('/', function(request, response) {mlyric.home(request, response);});

// 메뉴 페이지
app.get('/year/:yearId', function(request, response){mlyric.menu_page(request, response);});

// 음악가사 정보 페이지
app.get('/music/:musicId', function(request, response){mlyric.music_page(request, response);});

// 가사추가 페이지
app.get('/add', function(request, response){mlyric.add_page(request, response);});

// 가사추가 처리
app.post('/add_process', function(request, response){mlyric.add_process(request, response);});

// 파일 수정 페이지
app.post('/update', function(request, response){mlyric.update_page(request, response);});

// 파일 수정 처리 
app.post('/update_process', function(request, response){mlyric.update_process(request, response);});

// 파일 삭제 처리 
app.post('/delete_process', function(request, response){mlyric.delete_process(request, response);});

// 검색 결과 페이지
app.get('/search', function(request, response){mlyric.search_page(request, response);});

// 로그인 페이지
app.get('/login', function(request, response){mlyric.login_page(request, response);});

app.listen(4000, function() { 
  console.log('Example app listening on port 4000!')
});