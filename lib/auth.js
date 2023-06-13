module.exports = {
    IsOwner:function(request,response){
        if(request.user){
            return true;
        }
        else{
            return false;
        }
    },
    StatusUI:function(request,response){
        var authStatusUI = '<a href="/login">login</a> | <a href="/register">Register</a>';
        if(this.IsOwner(request,response)){
            authStatusUI = `${request.user.displayName} | <a href="/logout_process">logout</a> | <a href="/register">Register</a>`
        }
        return authStatusUI;
    }
}


