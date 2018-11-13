module.exports = {
    text:function(){
        return `<form action="/add_process" method="post">
                <p><h2>Add Lyric</h2></p>
                <p>
                <label for="music_title">Music Title : </label>
                <input type="text" id="music_title" name="music_title" placeholder="Music_Title" required="required" size="50" autocomplete=off>
                </p>
                <p>
                <label for="artist">Artist : </label>
                <input type="text" id="artist" name="artist" placeholder="Artist" required="required" autocomplete=off>
                </p>
                <p>
                <label for="releaseDate">발매일 : </label>
                <input type="text" name="releaseDate" id="releaseDate" placeholder="0000/00/00" required="required" size="10" maxlength="10" autocomplete=off>
                </p>
                <p>
                <label for="music_url">Youtube URL : </label>
                <input type="text" name="music_url" id="music_url" placeholder="URL" size="96" autocomplete=off>
                </p>
                <p>
                <label for="music_lyric">노래 가사 (Lyric)</label><p>
                <textarea name="music_lyric" id="music_lyric" class="noresize" rows="40" cols="96" required="required"></textarea>
                </p>
                <p>
                <input type="submit" id="add_submit" name="" value="< Add Lyric >">
                </form>`
    },
    update_text:function(lyric_array, beforeDate, beforeTitle){
        var lyric_body = '';
        var i = 4;
        while(i < lyric_array.length){
            lyric_body = lyric_body + `${lyric_array[i]}\n`;
            i = i + 1;
        }
        var texts = `<form action="/update_process" method="post">
        <p><h2>Update Lyric</h2></p>
        <p>
          <input type="hidden" name="before_title" value="${beforeTitle}">
          <label for="music_title">Music Title : </label>
          <input type="text" id="music_title" name="music_title" placeholder="Music_Title" required="required" size="50" autocomplete=off value="${lyric_array[0]}">
        </p>
        <p>
          <label for="artist">Artist : </label>
          <input type="text" id="artist" name="artist" placeholder="Artist" required="required" autocomplete=off value="${lyric_array[1]}">
        </p>
        <p>
          <label for="releaseDate">발매일 : </label>
          <input type="hidden" name="before_date" value="${beforeDate}">
          <input type="text" name="releaseDate" id="releaseDate" placeholder="0000/00/00" required="required" size="10" maxlength="10" autocomplete=off value="${lyric_array[2]}">
        </p>
        <p>
          <label for="music_url">Youtube URL : </label>
          <input type="text" name="music_url" id="music_url" placeholder="URL" size="96" autocomplete=off value="${lyric_array[3]}">
        </p>
        <p>
          <label for="music_lyric">노래 가사 (Lyric)</label><p>
          <textarea name="music_lyric" id="music_lyric" class="noresize" rows="40" cols="96" required="required"> ${lyric_body} </textarea>
        </p>
        <p>
          <input type="submit" id="add_submit" name="" value="< Update Lyric >">
        </form>`;
        return texts;
    }
}