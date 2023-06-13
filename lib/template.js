module.exports = {
    HTML:function(title,list,body,control,authStatusUI ){
        return`
        <!doctype html>
        <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${authStatusUI}
            ${list}
            ${control}
            ${body}
        </body>
        </html>
        `;
    },List:function(topics){
        var list = '<ul>';
        var i = 0;
        while(i < topics.length){
            list = list + `<li><a href="/page/${topics[i].id}">${topics[i].title}</a></li>`;
            i = i + 1;
        }
        list = list+'</ul>';
        return list;
    }
}