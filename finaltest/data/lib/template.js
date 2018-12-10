module.exports = {
  HTML:function(title, list, body){
    return `
    <!doctype html>
    <html>
    <head>
      <title>Lyric Library - ${title}</title>
      <meta charset="utf-8">
      <link rel="stylesheet" type="text/css" href="/static/style.css">
    </head>
    <body>
      <div id="wrapper">
        <div id="inner">
          <div id="header">
            <h1 id="title"><a href="/">Lyric Library</a></h1>
            <form action="/search" method="get">
              <input type="submit" class="search_button" id="search" value="">
              <input type="text" name="q" class="search_text" id="search" autocomplete="off">
            </form>
          </div>
            <div id="blanck">
            <p>
              <a href="/login" id="user">Login</a>
            </div>
            <div class="container">
              <nav id="menu">
                <ul>
                  ${list}
                </ul>
              </nav>
              <div id="add">
                <a href="/add">Add Lyric</a>
              </div>
              <div id="article">
                ${body}
              </div>
            </div>
          </div>
      </div>
    </body>
    </html>
    `;
  // 좌측 메뉴 만들기 함수
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/year/${filelist[i].listname}">${filelist[i].listname}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },
  // 음악목록 만들기 함수
  musicList:function(musiclist){
    var mlist = `<table border="1" id=mtable><colgroup><col style="width:30px"><col style="width:100%"></colgroup>
    <thead>
      <tr>
        <th>No</th>
        <th>곡이름 (아티스트)</th>
      <tr>
    </thead>
    <tbody>`
    var i = 0;
    while(i < musiclist.length){
      mlist = mlist + `
      <tr>
        <th>${i+1}</th>
        <th><a href="/music/${musiclist[i].m_id}" id="m_listlink">${musiclist[i].m_title} (${musiclist[i].m_artist})</a></th>
      </tr>`;
      i = i + 1;
    } 
    mlist = mlist+'</tbody></table>';
    return mlist;
  },

  // db정보를 html 형식으로 변환
  music_format:function(data){
    // 입력 url 은 youtube url만 가능.. 
    // 실제 주소 watch?v= 부분은 공유용 embed/ 바꾸어 줘야함
    // mtitle, artist, date, url, lyric
    var music_body = '';
    lyric_array = String(data.m_lyric).split(/\n/gi);
    var mtitle = data.m_title;
    var artist = data.m_artist;
    if(data.m_monthday === '00-00'){
      var date = `${data.m_release}년`;
    }else{var date = `${data.m_release}-${data.m_monthday}`;}
    var url = data.m_url;
    music_body = music_body + '<div id="music_info"><h2>' + mtitle + '</h2><h3>' + artist + '</h3><br> 발매일 :' + date + '<br>' + `</div><br><br><div id="lyric_body"><p><iframe width="560" height="315" src="${String(url).replace("watch?v=", "embed/")}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p><br><br>`;
      // 가사 줄바꿈 처리
      var i = 0;
      while(i < lyric_array.length){
        music_body = music_body + `${lyric_array[i]}<br>`;
        i = i + 1;
      }
      music_body = music_body + '</div>';
      return music_body;
  }
}
