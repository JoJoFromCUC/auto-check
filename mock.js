let http = require('http');
let querystring = require('querystring');

let contents = querystring.stringify({
    'returnUrl': '' , 
    'act': 'Validate',
    'username': 'zjq@sccas.cn',
    'password': '1993608acz',
    '_csrf': 'c5132196-cb63-40f3-b761-ec6a729ace24'
});
let headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Content-Length': contents.length,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': 'AUTO_FILL="zjq@sccas.cn"; JSESSIONID=7294D3EAD22AFAEC3D4B1B4616854CD6-n1',
    'Host': 'passport.escience.cn',
    'Origin': 'https://passport.escience.cn',
    'Referer': 'https://passport.escience.cn/login',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3315.4 Safari/537.36'
};

let optLogin = {
    hostname : 'passport.escience.cn',
    path : '/login',
    method: 'post',
    headers: headers
};
let optAuth = {
    hostname : 'passport.escience.cn/oauth2/authorize?response_type=code&redirect_uri=http%3A%2F%2F159.226.29.10%2FCnicCheck%2Ftesttoken&client_id=58861&theme=simple',
    path: '/CnicCheck/authorization',
    method: 'get',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Connection': 'keep-alive',
        'Host': '159.226.29.10',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3315.4 Safari/537.36'
    }
};
//  let reqLogin =  http.request(optLogin, async function(res){
//     console.log(res.statusCode);
//     //if(err) console.log("请求错误:"+ err);
//     res.setEncoding('utf8');
//     let headers = res.headers;
//     let cookies = headers['set-cookie'];
//     await console.log(headers); 
// });
// reqLogin.write(contents);
// reqLogin.end();
// let reqAuth = http.request(optAuth,function(res){
//     console.log(res.statusCode+'\n');
//     console.log(res.body);
// });
// reqAuth.end();
