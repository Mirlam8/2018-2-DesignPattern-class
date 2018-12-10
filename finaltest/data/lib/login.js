module.exports = {
    user_is_login:function(request, response){
        if(request.session.is_login){
            return true;
        }
        else{
            return false;
        }
    },
    user_status_UI:function(request, response){
        var user_status_UI = '<div id="status"><a href="/Login" id="login_UI">Login</a></div>';
        if(this.user_is_login(request, response)){
            user_status_UI = `<div id="status">사용자: ${request.session.nickname}  ||  <a href="/logout" id="logout_UI">Logout</a></div>`;
        }
        return user_status_UI;
    }
}
/*
login_UI = require('./login.js');
login_UI.user_status_UI();
*/