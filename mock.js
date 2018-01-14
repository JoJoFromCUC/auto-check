;
let https = require('https');
let http  = require('http'); 
let querystring = require('querystring');
let cheerio = require('cheerio');
let superagent = require('superagent');

//the key params
let JSESSIONID;
let location;
let CODE;
let token;
let testPath;
let tokenPth;
let _csrf;
let page;
let contents1;
let contents2;

//抓取页面_csrf字段
function getCSRF(){
    superagent.get('https://passport.escience.cn').end(function(err, res){
        let $ = cheerio.load(res.text);
        let inputs = $('input');
        _csrf = inputs[6].attribs.value;
        console.log("获得_csrf:"+_csrf);
        initUser();
    });
}
function initUser(){
    contents1 = querystring.stringify({
        'returnUrl': ' ' , 
        'act': 'Validate',
        'username': 'zjq@sccas.cn',
        'password': '1993608acz',
        '_csrf': _csrf
    });
    contents2 = {
        returnUrl: ' ' , 
        act: 'Validate',
        username: 'zjq@sccas.cn',
        password: '1993608acz',
        _csrf: _csrf
    };
    console.log(_csrf);
}

getCSRF();

let optIndex = {   //pre-signIn request header
    hostname : 'passport.escience.cn',
    path : '/index.jsp',
    method: 'post',
}
let optAuth = {//auth request header
    hostname : '159.226.29.10',
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
let optLogin = {};
//to index.jsp get JESESSION
let tick_Index = setTimeout(function(){
    let reqIndex =  https.request(optIndex,res=>{
        console.log(contents1);
        console.log(res.statusCode);
        res.setEncoding('utf8');
        let headers = res.headers;
        let cookies = headers['set-cookie'];
        JSESSIONID = cookies[0].split(';')[0];//get the session ID
        console.log('获取会话session:',JSESSIONID);
        optLogin = {  //signIn request header
            hostname : 'passport.escience.cn',
            path : '/login',
            method: 'post',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Content-Length': contents2.length,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': 'AUTO_FILL="zjq@sccas.cn; '+JSESSIONID,
                'Host': 'passport.escience.cn',
                'Origin': 'https://passport.escience.cn',
                'Referer': 'https://passport.escience.cn/login',
                'Upgrade-Insecure-Requests': 1,
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3315.4 Safari/537.36'
            }
        }
    });
    reqIndex.write(contents1);
    reqIndex.end();
},1000);

//sign in
let tick_SignIn = setTimeout(function(){
    console.log('会话ID:'+JSESSIONID);
        //  let optLogin = {  //signIn request header
        //     hostname : 'passport.escience.cn',
        //     path : '/login',
        //     method: 'post',
        //     headers: {
        //         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        //         'Accept-Encoding': 'gzip, deflate, br',
        //         'Accept-Language': 'zh-CN,zh;q=0.9',
        //         'Cache-Control': 'max-age=0',
        //         'Connection': 'keep-alive',
        //         'Content-Length': contents2.length,
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Cookie': 'AUTO_FILL="zjq@sccas.cn; '+JSESSIONID,
        //         'Host': 'passport.escience.cn',
        //         'Origin': 'https://passport.escience.cn',
        //         'Referer': 'https://passport.escience.cn/login',
        //         'Upgrade-Insecure-Requests': 1,
        //         'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3315.4 Safari/537.36'
        //     }
        // }
        // let reqLogin = https.request(optLogin,function(res){
        //     console.log(res.statusCode);
        //     res.setEncoding('utf8');
        //     let headers = res.headers;
        //     console.log('登录：');
        //     let cookies = headers['set-cookie'];
        //     JSESSIONID = cookies[0].split(';')[0];//get the session ID
        //     console.log(JSESSIONID);
        // });
        // reqLogin.write(contents1);
        // reqLogin.end();
        superagent.post('https://passport.escience.cn/login').set(optLogin).send(contents2).redirects(0).end(function(err,res){
            if(err){
                console.log(err);
            }else{
                cookie = res.headers['set-cookie'];
                console.log(res.headers);
            }
        });
},4000);


//authorization
let tock = setTimeout(function(){
    
  let reqAuth = http.request(optAuth,function(res){
      console.log(res.statusCode);
      res.setEncoding('utf8');
      let headers = res.headers;
      location = headers.location;
      console.log('认证路径：');
      console.log(location);
      testPath = location.split('cn')[1];
      console.log(testPath);
    });
   reqAuth.end();
},5000);


//return CODE
// let tick = setTimeout(function(){
//     let optTest = {
//         hostname: 'passport.escience.cn',
//         path: testPath ,
//         method: 'get',
//         headers: {
//            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//            'Accept-Encoding': 'gzip, deflate, br',
//            'Accept-Language': 'zh-CN,zh;q=0.9',
//            'Connection': 'keep-alive',
//            'Cookie': `AUTO_FILL="zjq@sccas.cn" ;${JSESSIONID}`,
//            'Host': 'passport.escience.cn',
//            'Upgrade-Insecure-Requests': 1,
//            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3315.4 Safari/537.36'
//         }
//     };
//     let reqTest = https.request(optTest,function(res){
//         console.log(res.statusCode);
//         res.setEncoding('utf8');
//         let headers = res.headers;
//         console.log('获取code:');
//         console.log(headers);
//         //CODE = headers.location.split('?')[1].split('=')[1];//get the CODE
//         console.log('code:'+CODE);
//     });
//     reqTest.end();   
// },4000);

// let optToken = {
//     hostname: '159.226.29.10',
//     path: '/CnicCheck/testtoken?code=' + CODE,
//     method: 'get',
//     headers: {
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//         'Accept-Encoding': 'gzip, deflate',
//         'Accept-Language': 'zh-CN,zh;q=0.9',
//         'Connection': 'keep-alive',
//         'Host': '159.226.29.10',
//         'Upgrade-Insecure-Requests': 1,
//         'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3315.4 Safari/537.36'
//     }
// }
// //return token
// // let reqToken = http.request(optToken,function(res){
// //     console.log(res.statusCode);
// //     res.setEncoding('utf8');
// //     let headers = res.headers;
// //     console.log(headers);
// // });

// // let optOut = {
// //     hostname: '159.226.29.10 ',
// //     path: '/CnicCheck/CheckServlet?weidu=39.97943495591847&jingdu=116.32850166009715&type=checkout&token=' + TOKEN,
// //     methods: 'get',
// //     headers: {

// //     }
// // }
// // let reqOut = http.request(optOut,(res)=>{
// //     console.log(res.header);
// // });
