var express = require('express');
var app = express()
var db = require('./db');
var template = require('./template');
var url = require('url');
var session = require('express-session');
var bodyParser = require('body-parser');
var auth = require('./auth');


app.use(bodyParser.urlencoded({ extended: false }));




exports.home = function(request,response){
    db.query('SELECT * FROM topic',function(error,topics){
        
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.List(topics);
        var html = template.HTML(title,list,`<h2>${title}</h2><p>${description}</p>`,`<a href="/create">create</a>`,auth.StatusUI(request,response));
        response.writeHead(200);
        response.end(html);
    });
}

exports.page = function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM topic',function(error,topics){
        if(error){
            throw error;
        }
        db.query(`SELECT * FROM topic LEFT JOIN user ON topic.user_id=user.id WHERE topic.id=?`,[request.params.pageId],function(error2,topic){
            if(error2){
                throw error2;
            }
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.List(topics);
            var html = template.HTML(title,list,`<h2>${title}</h2><p>${description}</p><p> by ${topic[0].displayName}`,
            `<a href="/create">create</a> 
            <a href="/update/${request.params.pageId}">update</a>
            <form action='/delete_process' method='post'>
                <input type='hidden' name='id' value='${request.params.pageId}'>
                <input type='submit' value='delete'> 
            </form>`,auth.StatusUI(request,response));
            response.send(html);
        })
    })
}

exports.create = function(request,response){
    if(!auth.IsOwner(request,response)){
        response.redirect('/');
        return false;
    }
    db.query('SELECT * FROM topic',function(error,topics){
        db.query("SELECT * FROM user", function(error2,authors){

            var title = 'WEB-create';
            var list = template.List(topics);
            var html = template.HTML(title,list,
            `
            <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <input type='hidden' name='id' value=${request.user.id}>
                <p>
                    <input type="submit">
                </p>
            </form>
            `,`<a href="/create">create</a>`,auth.StatusUI(request,response));
            response.send(html);
        });
    })
}

exports.create_process = function(request,response){
    if(!auth.IsOwner(request,response)){
        response.redirect('/');
        return false;
    }
    var post = request.body;
    db.query(`
        INSERT INTO topic (title, description, created, user_id) 
        VALUES(?, ?, NOW(), ?)`,
        [post.title, post.description, post.id], 
        function(error, result){
            if(error){
                throw error;
            }
            response.redirect(`/?id=${result.insertId}`);
        }
    )
}

exports.update = function(request,response){
    if(!auth.IsOwner(request,response)){
        response.redirect('/');
        return false;
    }
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM topic',function(error,topics){
        if(error){
            throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`,[request.params.pageId],function(error2,topic){
            if(error2){
                throw error2;
            }
            db.query("SELECT * FROM user", function(error2,authors){
                var list = template.List(topics);
                var html = template.HTML(topic[0].title,list,
                `
                <form action="/update_process" method="post">
                <input type='hidden' name='id' value='${topic[0].id}'>
                <p><input type="text" name="title" placeholder="title" value='${topic[0].title}'></p>
                <p>
                    <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>
                `,`<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`,auth.StatusUI(request,response));
                response.send(html);
            })
        })
    })
}

exports.update_process = function(request,response){
    if(!auth.IsOwner(request,response)){
        response.redirect('/');
        return false;
    }
    var post = request.body;
    db.query('UPDATE topic SET title=?, description=? WHERE id=?', [post.title, post.description, post.id], function(error, result){
        response.redirect(`/?id=${post.id}`);
    })

}

exports.delete_process = function(request,response){
    if(!auth.IsOwner(request,response)){
        response.redirect('/');
        return false;
    }
    var post = request.body;
    db.query('DELETE FROM topic WHERE id=?',[post.id],function(error,result){
        if(error){
            throw error;
        }
        response.redirect('/');
    })
}

exports.login = function(request,response){
    db.query('SELECT * FROM topic', function (error, topics) {
        var fmsg = request.flash();
        var feedback = '';
        if(fmsg.error){
            feedback = fmsg.error[0];
        }

        var title = 'Login';
        var list = template.List(topics);
        var html = template.HTML(title, list,
            `
            <div style="color:red;">${feedback}</div>
            <form action="/login_process" method="post">
                <p><input type="text" name="email" placeholder="email"></p>
                <p><input type="password" name="password" placeholder="password"></p>
                <p><input type="submit" value='login'></p>
            </form>
            `, `<a href="/create">create</a>`, "");
        response.writeHead(200);
        response.end(html);
    });
}



exports.logout_process = function(request,response){
    request.logout(function (err) {
        if (err) {
            return next(err);
        }
        response.redirect("/");
    });
}

exports.register = function(request,response){
    db.query('SELECT * FROM topic', function (error, topics) {
        var fmsg = request.flash();
        var feedback = '';
        if(fmsg.error){
            feedback = fmsg.error[0];
        }

        var title = 'Login';
        var list = template.List(topics);
        var html = template.HTML(title, list,
            `
            <div style="color:red;">${feedback}</div>
            <form action="/register_process" method="post">
                <p><input type="text" name="email" placeholder="email"></p>
                <p><input type="password" name="password" placeholder="password"></p>
                <p><input type="password" name="password2" placeholder="password check"></p>
                <p><input type="text" name="displayName" placeholder="display name"></p>
                <p><input type="submit" value='register'></p>
            </form>
            `, `<a href="/create">create</a>`, "");
        response.writeHead(200);
        response.end(html);
    });
}

exports.register_process = function(request,response){
    var post = request.body;
    var email = post.email;
    var password = post.password;
    var password2 = post.password2;
    var displayName = post.displayName;
    
    if (email && password && password2) {
        db.query('SELECT * FROM user WHERE email = ?', [email], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0 && password == password2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
                db.query('INSERT INTO user (email, password, displayName, created) VALUES(?,?,?,NOW())', [email, password,displayName], function (error, data) {
                    if (error) throw error;
                    response.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
                    document.location.href="/";</script>`);
                });
            } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
                response.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); 
                document.location.href="/register";</script>`);    
            }
            else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
                response.send(`<script type="text/javascript">alert("이미 존재하는 이메일 입니다."); 
                document.location.href="/register";</script>`);    
            }            
        });

    } else {        // 입력되지 않은 정보가 있는 경우
        response.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/register";</script>`);
    }
}