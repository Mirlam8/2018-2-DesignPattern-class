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
            <!--
            <input type="button" class="search_button" id="search" onclick="">
            <input type="text" class="search_text" id="search">
            -->
          </div>
            <div id="blanck">

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
      list = list + `<li><a href="/year/${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },
  // 음악목록 만들기 함수
  musicList:function(musiclist, yearId){
    var mlist = `<table border="1" id=mtable><colgroup><col style="width:30px"><col style="width:100%"></colgroup>
    <thead>
      <tr>
        <th>No</th>
        <th>곡이름</th>
      <tr>
    </thead>
    <tbody>`
    var i = 0;
    while(i < musiclist.length){
      mlist = mlist + `
      <tr>
        <th>${i+1}</th>
        <th><a href="/year/${yearId}/${musiclist[i]}" id="m_listlink">${musiclist[i]}</a></th>
      </tr>`;
      i = i + 1;
    } 
    mlist = mlist+'</tbody></table>';
    return mlist;
  },
  music_format:function(data){
    // 입력 url 은 youtube url만 가능.. 
    // 실제 주소 watch?v= 부분은 공유용 embed/ 바꾸어 줘야함
    // mtitle, artist, date, url, lyric
    var music_body = '';
    lyric_array = String(data).split(/\n/gi);
    var mtitle = lyric_array[0];
    var artist = lyric_array[1];
    var date = lyric_array[2];
    var url = lyric_array[3];
    music_body = music_body + '<div id="music_info"><h2>' + mtitle + '</h2><h3>' + artist + '</h3><br> 발매일 :' + date + '<br>' + `</div><br><br><div id="lyric_body"><p><iframe width="560" height="315" src="${String(url).replace("watch?v=", "embed/")}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p><br><br>`;
      // 가사 줄바꿈 처리
      var i = 4;
      while(i < lyric_array.length){
        music_body = music_body + `${lyric_array[i]}<br>`;
        i = i + 1;
      }
      music_body = music_body + '</div>';
      return music_body;
  }
}
