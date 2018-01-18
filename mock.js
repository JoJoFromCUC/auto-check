;
let https = require('https');
let http  = require('http'); 
let querystring = require('querystring');
let cheerio = require('cheerio');
let superagent = require('superagent');
let schedule = require('node-schedule');

const users = [
    {
        userName:'XXX@sccas.cn',
        password:'xxxxx'
    },
    {
        userName:'XX@sccas.cn',
        password:'xxxxxx'
    }
];
const signInHead = querystring.stringify({
    'response_type': 'code',
    'redirect_uri': 'http://159.226.29.10/CnicCheck/testtoken',
    'client_id': '58861',
    'theme': 'simple',
    'pageinfo': 'userinfo',
    'tm': 0
});

function initUser(user){
    return querystring.stringify(user)+'&'+signInHead;
}

//抓取页面_csrf字段
// function getCSRF(){
//     superagent.get('https://passport.escience.cn').end(function(err, res){
//         let $ = cheerio.load(res.text);
//         let inputs = $('input');
//         _csrf = inputs[6].attribs.value;
//         console.log("获得_csrf:"+_csrf);
//         initUser();
//     });
// }
// function initUser(){
//     user = querystring.stringify({
//         'returnUrl': ' ' , 
//         'act': 'Validate',
//         'username': 'zjq@sccas.cn',
//         'password': '1993608acz',
//         '_csrf': _csrf
//     });
// }

//sign in
let optLogin = {  //signIn request header
    'hostname' : 'passport.escience.cn',
    'path' : '/oauth2/authorize',
    'method': 'post',
    'headers': {
        // 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        // 'Accept-Encoding': 'gzip, deflate, br',
        // 'Accept-Language': 'zh-CN,zh;q=0.9',
        // 'Cache-Control': 'max-age=0',
        // 'Connection': 'keep-alive',
        // 'Content-Length': user.length,
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Cookie': 'AUTO_FILL="zjq@sccas.cn; '+JSESSIONID,
        // 'Host': 'passport.escience.cn',
        // 'Origin': 'https://passport.escience.cn',
        // 'Referer': 'https://passport.escience.cn/login',
        // 'Upgrade-Insecure-Requests': 1,
        // 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3315.4 Safari/537.36'
    }
}
//mock in and out
function mock(user,checktype){
    //the key params
    let location;
    let CODE;
    let token;
    let reqLogin = https.request(optLogin,function(res){
        console.log(res.statusCode);
        res.setEncoding('utf8');
        let headers = res.headers;
        console.log('登录：');
        //let cookies = headers['set-cookie'];
        location = headers['location'];
        console.log('location:',location);
    });
    reqLogin.write(user);
    reqLogin.end();
    
    //get token
    let tick = setTimeout(function(){
        superagent.get(location).end(function(err, res){
            console.log(res.text); 
            let temp =JSON.parse(res.text);  
            token = temp['token'];
            console.log(token);     
        });
    },2000); 
    
    let mainUrl = '159.226.29.10',
        posUrl = '/CnicCheck/CheckServlet?weidu=39.97943495591847&jingdu=116.32850166009715';
    //check-in-out
    let tock = setTimeout(function(){
        let checkUrl =  mainUrl + posUrl + '&type='+ checktype +'&token='+token;
        superagent.get(checkUrl).end(function(err,res){
            console.log(res.text);
            let temp = JSON.parse(res.text);
            if(temp.success == 'true'){
                if(checktype == 'checkout'){
                    console.log('打卡收工！');
                }else{
                    console.log('打卡上班！');
                }
            }
        });
    },9000);
}
//entrance
function main(){
    let today = new Date(),
        year = today.getFullYear(),
        month = today.getMonth()+1,
        day = today.getDate(),
        hour = today.getHours(),
		sec = Math.floor(Math.random()*180);
    let checkType = 'checkin';
	if(month<10) month = '0'+ month;
	if(day<10)   day   ='0'+ day;
    if(hour>=18 && hour<24){
        checkType = 'checkout';
    }
    date = `${year}${month}${day}`;
    console.log(date);
    const holidayAPI = 'http://api.goseek.cn/Tools/holiday?date=';
    let isHoliday = holidayAPI + date;

    setTimeout(function(){
		superagent.get(isHoliday).end(function(err,res){
			if(err){//失败则强行打卡
				users.forEach(function(user){
					let userForm = initUser(user);
					mock(userForm,checkType);
				});
			}
			else{
				let temp = JSON.parse(res.text);
				console.log(temp.data);
				if(temp.data == 0){//0工作日打卡，1,2节假日不打卡
					users.forEach(function(user){
						let userForm = initUser(user);
						mock(userForm,checkType);
					})
				}
			}
		});
	},sec *1000);
}
let rule = new schedule.RecurrenceRule();
let times = [8,19,23];
    rule.hour = times;
    rule.minute = 1;

schedule.scheduleJob(rule,function(){
    main();
});

