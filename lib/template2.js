module.exports = {
    HTML:function(title, style, list, body){
      return `
      <!doctype html>
      <html>
      <head>
        <title>Lyric Library - ${title}</title>
        <meta charset="utf-8">
        <style>${style}</style>
        
      </head>
      <body>
        <div id="wrapper">
          <div id="inner">
            <div id="header">
              <h1 id="title"><a href="/">Lyric Library</a></h1>
              <input type="button" class="search_button" id="search" onclick="">
              <input type="text" class="search_text" id="search">
            </div>
              <div id="blanck">
  
              </div>
              <div class="container">
                <nav id="menu">
                  <ul>
                    ${list}
                  </ul>
                </nav>
                <div id="article">
  
                </div>
              </div>
            </div>
        </div>
      </body>
      </html>
  
      `;
    },list:function(filelist){
      var list = '<ul>';
      var i = 0;
      while(i < filelist.length){
        list = list + `<li><a href="/?year=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
      }
      list = list+'</ul>';
      return list;
    }
  }