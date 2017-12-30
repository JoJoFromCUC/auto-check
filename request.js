
var http = require("http");
var querystring=require("querystring");

var postdata = querystring.stringify({
	'content' : '呵呵，再水一发' ,
	'cid' : 348
})

var options = {
	hostname: 'wwww.immoc.com',
	port:80,
	path: "/course/docomment" ,
	method: 'POST',
	headers:{
		'Accept':'application/json, text/javascript, */*; q=0.01',
		'Accept-Encoding':'gzip, deflate',
		'Accept-Language':'zh-CN,zh;q=0.8',
		'Connection':'keep-alive',
		'Content-Length':postdata.length,
		'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
		'Cookie':'imooc_uuid=64868136-b478-4fbe-8d9e-e38479ddbfc6; imooc_isnew_ct=1456283335; Hm_lvt_36c1be160ddd1adab1a4c3457095b3a9=1457707317; loginstate=1; apsid=Y5Y2M3NDZjYTNiNTc0ZGYwZDZiOWI5NWRlNTkyYmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMTIyMTE2NQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4MjA4Mzk4NDRAcXEuY29tAAAAAAAAAAAAAAAAAAAAAGU5NzcxMGE4MGI0ODRhMmRmMjkwZTg1MzNkNjJlZDVl9i1AWPYtQFg%3DND; last_login_username=820839844%40qq.com; PHPSESSID=4mbke69s9smrn66ksu5flni8n2; jwplayer.qualityLabel=æ®æ¸; jwplayer.volume=100; imooc_isnew=2; cvde=5854d5be1dd70-30; IMCDNS=0; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1481034398,1481684126,1481765524,1481954753; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1481978778',
		'Host':'www.imooc.com',
		'Origin':'http://www.imooc.com',
		'Referer':'http://www.imooc.com/comment/348',
		'User-Agent':'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
		'X-Requested-With':'XMLHttpRequest'
	}
}

var req = http.request(options,function(res){
	console.log('status: '+res.statusCode);
	console.log('headers: '+JSON.stringify(res.headers));
	res.on('data',function(chunk){
		console.log(Buffer.isBuffer(chunk));
		console.log(typeof chunk);
	})
	res.on('end',function(){
		console.log("over!");
	})
})//接受response
req.write(postdata);
req.end();