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
                <input type="text" name="releaseYear" id="releaseYear" placeholder="0000" required="required" size="4" maxlength="4" autocomplete=off>
                <input type="text" name="releaseDate" id="releaseDate" placeholder="00-00" required="required" size="5" maxlength="5" autocomplete=off>
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
    update_text:function(datas){
        var texts = `<form action="/update_process" method="post">
        <p><h2>Update Lyric</h2></p>
        <p>
          <input type="hidden" name="before_id" value="${datas[0].m_id}">
          <label for="music_title">Music Title : </label>
          <input type="text" id="music_title" name="music_title" placeholder="Music_Title" required="required" size="50" autocomplete=off value="${datas[0].m_title}">
        </p>
        <p>
          <label for="artist">Artist : </label>
          <input type="text" id="artist" name="artist" placeholder="Artist" required="required" autocomplete=off value="${datas[0].m_artist}">
        </p>
        <p>
          <label for="releaseDate">발매일 : </label>
          <input type="text" name="releaseYear" id="releaseYear" placeholder="0000" required="required" size="4" maxlength="4" autocomplete=off value="${datas[0].m_release}">
          <input type="text" name="releaseDate" id="releaseDate" placeholder="00-00" required="required" size="5" maxlength="5" autocomplete=off value="${datas[0].m_monthday}">
        </p>
        <p>
          <label for="music_url">Youtube URL : </label>
          <input type="text" name="music_url" id="music_url" placeholder="URL" size="96" autocomplete=off value="${datas[0].m_url}">
        </p>
        <p>
          <label for="music_lyric">노래 가사 (Lyric)</label><p>
          <textarea name="music_lyric" id="music_lyric" class="noresize" rows="40" cols="96" required="required">${datas[0].m_lyric}</textarea>
        </p>
        <p>
          <input type="submit" id="add_submit" name="" value="< Update Lyric >">
        </form>`;
        return texts;
    }
}