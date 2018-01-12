;
let https = require('https');
let http  = require('http'); 
let querystring = require('querystring');

let contents = querystring.stringify({
    'returnUrl': '' , 
    'act': 'Validate',
    'username': 'zjq@sccas.cn',
    'password': '1993608acz',
    '_csrf': 'd4de64ea-7982-44d8-9705-0d6af9bc13eb'
});

let optIndex = {//signIn request header
    hostname : 'passport.escience.cn',
    path : '/index.jsp',
    method: 'post',
    // headers: {
    //     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    //     'Accept-Encoding': 'gzip, deflate, br',
    //     'Accept-Language': 'zh-CN,zh;q=0.9',
    //     'Cache-Control': 'max-age=0',
    //     'Connection': 'keep-alive',
    //     'Content-Length': contents.length,
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Cookie': 'AUTO_FILL="zjq@sccas.cn"; JSESSIONID='+JSESSIONID,
    //     'Host': 'passport.escience.cn',
    //     'Origin': 'https://passport.escience.cn',
    //     'Referer': 'https://passport.escience.cn/login',
    //     'Upgrade-Insecure-Requests': 1,
    //     'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3315.4 Safari/537.36'
    // }
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

//the key params
let JSESSIONID;
let location;
let CODE;
let token;
let testPath;
let tokenPth;


//sign in
let reqIndex =  https.request(optIndex,res=>{
    console.log(res.statusCode);
    res.setEncoding('utf8');
    let headers = res.headers;
    let cookies = headers['set-cookie'];
    JSESSIONID = cookies[0].split(';')[0];//get the session ID
    console.log(JSESSIONID); 
    });
reqIndex.write(contents);
reqIndex.end();

//authorization
let tock = setTimeout(function(){
  let reqAuth = http.request(optAuth,function(res){
      console.log(res.statusCode);
      res.setEncoding('utf8');
      let headers = res.headers;
      location = headers.location;
      console.log(location);
      testPath = location.split('cn')[1];
      console.log(testPath);
});
reqAuth.end();
},2000);

let optTest = {
    hostname: 'passport.escience.cn',
    path: testPath ,
    method: 'get',
    headers: {
       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
       'Accept-Encoding': 'gzip, deflate, br',
       'Accept-Language': 'zh-CN,zh;q=0.9',
       'Connection': 'keep-alive',
       'Cookie': `AUTO_FILL="zjq@sccas.cn";JSESSIONID=${JSESSIONID}`,
       'Host': 'passport.escience.cn',
       'Upgrade-Insecure-Requests': 1,
       'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3315.4 Safari/537.36'
    }
};
//return CODE
let tick = setTimeout(function(){
    let reqTest = https.request(optTest,function(res){
        console.log(res.statusCode);
        res.setEncoding('utf8');
        let headers = res.headers;
        console.log(headers);
       // CODE = headers.location.split('?')[1].split('=')[1];//get the CODE
        console.log(CODE);
    });
    reqTest.end();   
},4000);

let optToken = {
    hostname: '159.226.29.10',
    path: '/CnicCheck/testtoken?code=' + CODE,
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
}
//return token
// let reqToken = http.request(optToken,function(res){
//     console.log(res.statusCode);
//     res.setEncoding('utf8');
//     let headers = res.headers;
//     console.log(headers);
// });

// let optOut = {
//     hostname: '159.226.29.10 ',
//     path: '/CnicCheck/CheckServlet?weidu=39.97943495591847&jingdu=116.32850166009715&type=checkout&token=' + TOKEN,
//     methods: 'get',
//     headers: {

//     }
// }
// let reqOut = http.request(optOut,(res)=>{
//     console.log(res.header);
// });
