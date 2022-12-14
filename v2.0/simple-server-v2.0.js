

/*

simple-server-v1.0.js:d

03-09-22
17-09-22

*/

;
(function(){

        var scheme            = 'https';
        var port              = 3001;
        var interface         = '';

        var docroot           = process.cwd()+'/';
        

        var fs                = require('fs');
        var path              = require('path');
        var querystring       = require('querystring');
        
        
        var serverfile        = __filename;
        var serverurl         = `${scheme}://${interface||'localhost'}:${port}/`;


        setTimeout(start,50);
  
  //:
  
        
  
        function router(req,res,url){    //c


              var file;
              
              switch(url){


                case 'test-multipartformdata'     : 
                                                    test.multipartformdata(req,res);
                                                    return;
                                                  
                case 'test-applicationjson'       :
                                                    test.applicationjson(req,res);
                                                    return;
                
                case 'test-urlencoded'            :
                                                    test.urlencoded(req,res);
                                                    return;

                                          
                case 'hello'                      : 
                                                    res.setHeader('content-type','text/html');    
                                                    res.end(html.hello);
                                                    return;

                default                           : 
                                                    file    = fn.resolve(url);
                                                    if(!file){              
                                                          send.notfound(req,res);
                                                          return false;
                                                    }
              }//switch
              
              return file;
              
        }//router

  //request:

        function request(req,res){
        
              if(req.method==='OPTIONS'){
                    send.cors();
                    return;
              }
    
              res.setHeader('cache-control','no-store');

              var url     = req.url.slice(1);
              
              var file    = router(req,res,url);
              if(!file){
                    if(file===false)return;
                                                                  console.log('200 (routed),',req.url);
                    return;
              }

              if(fn.notfound(file)){
                    send.notfound(req,res);
                    return;
              }
                                                                  console.log('200,',req.url);                                                                  
              var stream    = fs.createReadStream(file);
              stream.pipe(res);
              
        }//request
        
        
  //server:

        function start(){
              
              var server;
              
              if(scheme==='http'){
                    var http    = require('http');
                    server      = http.createServer();
              }
              
              if(scheme==='https'){
                    var https   = require('https');
                    server      = https.createServer({key,cert});
              }
                            
              server.on('listening',listening);
              server.on('request',request);
              
              server.listen(port,interface);

        }//start

        function listening(){
                        
              console.log(`   server ...... :  ${serverfile}`);
              console.log(`   process ..... :  ${process.pid}`);
              console.log(`   listening ... :  ${scheme} ,  ${interface||'all interfaces'}, port ${port}`);
              console.log(`   serving ..... :  ${docroot}`);
              console.log(`   url ......... :  ${serverurl}hello`);
              console.log();

        }//listening
                            
  //send:
  
        var send    = {};
        
        send.notfound=function(req,res){
                                                                  console.log('404,',req.url);
              res.writeHead(404);
              res.end(req.url+' not found');
        
        }//notfound
        
        send.cors=function(req,res){
                                                                  console.log('204 (cors), ',req.url);
              var headers   = {
                    'Access-Control-Allow-Origin'     : '*',
                    'Access-Control-Allow-Methods'    : 'OPTIONS, POST, GET',
                    'Access-Control-Max-Age'          : 2592000,                            // 30 days
              };
              res.writeHead(204, headers);
              res.end();
              
        }//cors
        
        
  //parse:

        var parse   = {};
        
        parse.request=function(req,callback){

              if(!callback){
                    var promise   = new Promise((resolve,reject)=>callback=resolve);
              }
                    
              var type   = req.headers['content-type'];
              
              if(type){
                    if(type.startsWith('multipart/form-data')){
                          req.setEncoding('latin1');
                          type   = 'multipart/form-data';
                    }
              }
              
              var result  = {json:{},files:{}};              
              var body    = '';                          
              
              req.on('data',data=>{
              
                    body   += data;
                    
                    if(type==='multipart/form-data'){
                          ({result,body}    = parse.body(req,body,result));
                    }
                    
              });

              req.on('end',()=>{
              
                    switch(type){
                    
                      case 'multipart/form-data'                  :                                         break;
                      case 'application/x-www-form-urlencoded'    : result    = querystring.parse(body);    break;
                      case 'application/json'                     : result    = JSON.parse(body);           break;
                      
                      default                                     : result    = body; 
                      
                    }//switch
                    
                    callback(result);
                    
              });

              return promise;
        
        }//request

        parse.boundary=function(request){
        
              var type        = request.headers['content-type'];
              
              var arr         = type.split(';').map(item=>item.trim());
              
              var prefix      = 'boundary=';
              var boundary    = arr.find(item=>item.startsWith(prefix));
              
              if(!boundary){
                    return null;
              }
              
              boundary        = boundary.slice(prefix.length).trim();
              boundary        = '--'+boundary;
              
              return boundary
              
        }//boundary

        parse.body=function(request,body,result){

              var boundary    = parse.boundary(request);
              var offset      = boundary.length+2;
              
              if(body.startsWith(boundary)){
                    body    = body.slice(offset);
              }
              
              var ec    = true;
              
              while(ec===true){
              
                    index   = body.indexOf(boundary);
                    
                    if(index===-1){
                          ec    = false;
                    }else{
                          var block   = body.substring(0,index);
                          parse.block(block,result);
                          body        = body.slice(index+offset);
                    }
                    
              }//while

              return {result,body};

        }//body
        
        parse.block=function(block,result){
        
              var name;
              var filename;
              var contenttype;
              var value;
              var i1;
              var i2;
              
              i1      = block.indexOf('name="');
              if(i1===-1){
                    return;
              }
              
              i1     += 6;
              i2      = block.indexOf('"',i1);
              name    = block.substring(i1,i2);
              
              i1      = block.indexOf('filename="');
              if(i1!==-1){
                    i1           += 10;
                    i2            = block.indexOf('"',i1);
                    filename      = block.substring(i1,i2);
                    
                    i1            = block.indexOf('Content-Type');
                    i2            = block.indexOf('\r\n',i1);
                    contenttype   = block.substring(i1,i2);
                    contenttype   = contenttype.split(':')[1].trim();
              }
              
              var i1    = block.indexOf('\r\n\r\n');
              value     = block.slice(i1+4,-2);
              
              
              if(filename){              
                    if(!result.files[name]){
                          result.files[name]   = [];
                    }              
                    result.files[name].push({name:filename,data:value,contenttype});                    
              }else{
                    result.json[name]   = value;
              }
        
        }//block
        
  //fn:
  
        var fn   = {};
        
        fn.resolve=function(url){
        
              var file    = path.resolve(docroot,url);
              var s       = file.substring(0,docroot.length);
              if(path.resolve(s)!==path.resolve(docroot)){
                    return false;
              }
              return file;
        
        }//resolve
        
        fn.notfound=function(file,isfile){
        
              if(!fs.existsSync(file)){
                    return true;
              }
              
              if(isfile!==false){
                    if(fs.statSync(file).isFile()){
                          return false;
                    }
              }
              
              return true;
              
        }//notfound
        
        fn.write=function(file,data){
        
              var stream    = fs.createWriteStream(file)
              stream.write(data,'binary')
              stream.close();
        
        }//write

  //test:
  
        var test    = {};
        
        test.multipartformdata=async function(req,res){
        
              var result    = await parse.request(req);
              
              var json      = result.json;
              var files     = {};
              
              for(var name in result.files){
              
                    files[name]    = [];                    
                    for(file of result.files[name]){
              
                          fn.write(file.name,file.data);                          
                          files[name].push({name:file.name,size:file.data.length});
                          
                    }//for
                    
              }//for
              
              var html      = `
                    <h3></h3>
                    <h4>json</h4>
                    <pre>${JSON.stringify(json,null,4)}</pre>
                    <h4>files</h4>
                    <pre>${JSON.stringify(files,null,4)}</pre>
              `;

              res.setHeader('content-type','text/html');
              res.end(html);

        }//multipartformdata
        
        test.applicationjson=async function(req,res){
        
              var json    = await parse.request(req);
              var str     = JSON.stringify(json,null,4);
              res.end(str);
              
        }//applicationjson
        
        test.urlencoded=async function(req,res){
        
              var json    = await parse.request(req);
              
              var html    = `
                    <h3>application/x-www-form-urlencoded</h3>
                    <pre>${JSON.stringify(json,null,4)}</pre>
              `;
              
              res.setHeader('content-type','text/html');
              res.end(html);
              
        }//urlencoded


  //cert:

var key     = `
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAp1/aEck7k7OGlQe373+zEYiznlk0ORrg0UeyDGsULaGyIpG+
DW/1m6hga/y5LCObKNYhU2O2CYLOunzEXgFEhLq73zQ1rWNKdF/dE1P97lAeNmJ7
qapVHgmvqRR+M5JxGHHAr3cRS06WW2H4jJD4HWVuYhuww6igP6WhVWYoPn6sgDcW
E+HLI1DVwTxkA9J/poPSSdT/VEgvH2aOwA0h1KVa9l6DrC3E/tPo8D8NPyeViSRb
/HjyI3gXr74jQvq8+4fTcftNAtyhUXUhXvlryBGKZmARB1gXAiNCuXYK08I8PmhR
PwqVq15YYto9E4QYkfCZoJaNrztbFCfDl8yiVQIDAQABAoIBABhTaQlOuvbzj6rX
TVdksuzodlqcUme+TVB9YBZH9c3QA2jcz8d6LzMpXKI1P+B3aFSeEofhJRLqzQrz
mUKkYoX78dQ17Vs+5BJX4HSvr2dUg5+Z3qlBFU/hToN/c/wg24kW909JOd09FcNA
UPR1GWqEVG+z4JP/TRMTCoiz6UNzv4CRyWCF+iMkMQuWYXS3j+fd586eDElJGJEV
XujujNrAM/Qpj/ddLBy0vpHmiNNBJKJTWLVaCrk5zozss2uTxi3BWkwQ9w3lZyRp
ferWo0CNIDXwvA4ZX2ykKo9dKXwT1E3d/qo2LE8QGpzC5Gs50ZUUlnCGtp2qavd1
NR6WLmECgYEA1fTYqvC+BzX2/xaqAwZqfjBxvto29TjE8syrpB3S3vaS6lz/cw99
sb9l5b/KYAIsUVV3HbDIGCkHiCfochFD9ORLkuwSgijXrgEIKNyZHtL3pCq//hFq
H2k5hCmnXt3YhWF3ue3zSHyiDv/ps5n6YhI6HJyzD4XOM3z67EPnHA0CgYEAyEOu
Wd/G/w11rX9J+NcbSHUwUibrgCQFsuXohsCBVCr9zngqMfDqW5pbdc0CZ5RinC7y
bENI/4SLY7qZE3l/C8de3iSwgmw+K3blXoYtgFcp83s3hiiNvBeRGY1C8bL0bYZc
s5XfaTVjymXh6UlsIHnnJeDInMOd5FJW4zZ1ZWkCgYEAuGbCpvG+ljBopQo/lUPe
XMwb/MXOQCOhezHzbQtXR1t03BEzCVP8nUm85PsbzQuSbrceZrSKgGg8WZkrucQv
sc1hZUuZ2ByjZxD0m2MlhW+GiDNgLfWMZW4naEUOP7EsgCi1K8Ztu7fPZOYj4et/
5S6YbziPC33jbnT1PtR3R7ECgYBN2SF5hmfQ1eac3xJeTSAp9oQmK0L4uQgOFxlg
6Ixdr6iiDkw4xbIUkdhj3qHEqgX7OLS8KRvDWD7nMa43x87/QS07pX+H85PnSXy4
VehyL2/7WjanTDRsnaymBiez1SD3Qnfex6/lMf/sudYr3YLOzRRxwQO7DL/f9bIY
+R6BoQKBgFJN52moK6gfRCuTfqhihMy0O9CJCYIQm8tSMCrLD53DtoiMTuP1LDFu
5r3/rrCl5dRcb33nWz76hggtxpJo4H5DqLjoZlbajWxee5fSwqiBgWN2WNfFeui4
2DLyPhNkj/odVDub9Jxc8RoKK+D89b4/2jM955IiExkWb8MItV0E
-----END RSA PRIVATE KEY-----
`;

var cert    = `
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 4096 (0x1000)
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN=tst-root-ca
        Validity
            Not Before: Aug 14 09:30:07 2022 GMT
            Not After : Dec 30 09:30:07 2049 GMT
        Subject: CN=tst-server
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:a7:5f:da:11:c9:3b:93:b3:86:95:07:b7:ef:7f:
                    b3:11:88:b3:9e:59:34:39:1a:e0:d1:47:b2:0c:6b:
                    14:2d:a1:b2:22:91:be:0d:6f:f5:9b:a8:60:6b:fc:
                    b9:2c:23:9b:28:d6:21:53:63:b6:09:82:ce:ba:7c:
                    c4:5e:01:44:84:ba:bb:df:34:35:ad:63:4a:74:5f:
                    dd:13:53:fd:ee:50:1e:36:62:7b:a9:aa:55:1e:09:
                    af:a9:14:7e:33:92:71:18:71:c0:af:77:11:4b:4e:
                    96:5b:61:f8:8c:90:f8:1d:65:6e:62:1b:b0:c3:a8:
                    a0:3f:a5:a1:55:66:28:3e:7e:ac:80:37:16:13:e1:
                    cb:23:50:d5:c1:3c:64:03:d2:7f:a6:83:d2:49:d4:
                    ff:54:48:2f:1f:66:8e:c0:0d:21:d4:a5:5a:f6:5e:
                    83:ac:2d:c4:fe:d3:e8:f0:3f:0d:3f:27:95:89:24:
                    5b:fc:78:f2:23:78:17:af:be:23:42:fa:bc:fb:87:
                    d3:71:fb:4d:02:dc:a1:51:75:21:5e:f9:6b:c8:11:
                    8a:66:60:11:07:58:17:02:23:42:b9:76:0a:d3:c2:
                    3c:3e:68:51:3f:0a:95:ab:5e:58:62:da:3d:13:84:
                    18:91:f0:99:a0:96:8d:af:3b:5b:14:27:c3:97:cc:
                    a2:55
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Basic Constraints: critical
                CA:FALSE
            X509v3 Key Usage: critical
                Digital Signature, Non Repudiation, Key Encipherment, Key Agreement
            X509v3 Extended Key Usage: critical
                TLS Web Server Authentication
            X509v3 Subject Key Identifier: 
                3E:94:90:A9:2D:D7:71:A3:19:79:81:19:08:EE:CB:4A:AB:16:20:07
            X509v3 Authority Key Identifier: 
                keyid:4B:0D:7A:26:6B:7A:A1:9E:EB:98:19:27:77:42:D0:BB:D0:A1:57:16
                DirName:/CN=tst-root-ca
                serial:EA:41:A9:B3:0F:FF:81:95

            X509v3 Subject Alternative Name: 
                DNS:localhost, IP Address:127.0.0.1, IP Address:127.0.0.2, DNS:tst-server
    Signature Algorithm: sha256WithRSAEncryption
         93:ea:dc:4a:9c:3d:cb:df:bf:8a:9b:b9:22:40:21:c0:b1:77:
         20:31:d9:fc:ae:b1:41:bf:ca:58:52:aa:be:55:37:d4:f1:f4:
         4e:7b:2d:38:47:7c:63:2a:9f:36:d0:73:9c:7e:10:3b:8d:81:
         21:7e:10:d1:99:c0:4c:15:b4:79:66:4f:94:41:7f:15:72:3e:
         19:52:04:59:14:1d:a7:e2:04:36:60:7a:cc:ee:82:2a:46:82:
         7f:cc:90:ba:b0:d2:a4:eb:93:0b:0c:f6:ab:82:d0:90:36:3c:
         6c:04:74:6d:43:e9:ed:a6:3b:dd:e9:34:b7:a4:65:11:95:ba:
         ca:ef:67:7a:16:89:39:49:a8:9c:64:44:14:ba:26:8f:a6:37:
         e1:37:f4:0d:36:f8:39:cc:4e:a9:49:f6:21:33:e3:f5:b1:12:
         de:7e:66:eb:09:7c:41:b7:09:4c:d5:6a:04:65:29:13:07:d3:
         bb:13:4e:56:b2:28:f2:ba:c6:a7:ac:ba:92:68:06:40:49:dd:
         4a:43:85:f5:6b:87:85:7a:cf:3f:38:78:85:58:e7:80:fd:72:
         d0:0c:f8:92:f2:16:1f:33:32:ed:44:ca:3c:f3:94:be:a2:b4:
         a0:92:7a:2d:a5:59:5a:1d:be:f3:be:06:69:04:a8:ba:a9:19:
         7a:eb:8b:9b
-----BEGIN CERTIFICATE-----
MIIDdjCCAl6gAwIBAgICEAAwDQYJKoZIhvcNAQELBQAwFjEUMBIGA1UEAwwLdHN0
LXJvb3QtY2EwHhcNMjIwODE0MDkzMDA3WhcNNDkxMjMwMDkzMDA3WjAVMRMwEQYD
VQQDDAp0c3Qtc2VydmVyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
p1/aEck7k7OGlQe373+zEYiznlk0ORrg0UeyDGsULaGyIpG+DW/1m6hga/y5LCOb
KNYhU2O2CYLOunzEXgFEhLq73zQ1rWNKdF/dE1P97lAeNmJ7qapVHgmvqRR+M5Jx
GHHAr3cRS06WW2H4jJD4HWVuYhuww6igP6WhVWYoPn6sgDcWE+HLI1DVwTxkA9J/
poPSSdT/VEgvH2aOwA0h1KVa9l6DrC3E/tPo8D8NPyeViSRb/HjyI3gXr74jQvq8
+4fTcftNAtyhUXUhXvlryBGKZmARB1gXAiNCuXYK08I8PmhRPwqVq15YYto9E4QY
kfCZoJaNrztbFCfDl8yiVQIDAQABo4HOMIHLMAwGA1UdEwEB/wQCMAAwDgYDVR0P
AQH/BAQDAgPoMBYGA1UdJQEB/wQMMAoGCCsGAQUFBwMBMB0GA1UdDgQWBBQ+lJCp
Lddxoxl5gRkI7stKqxYgBzBGBgNVHSMEPzA9gBRLDXoma3qhnuuYGSd3QtC70KFX
FqEapBgwFjEUMBIGA1UEAwwLdHN0LXJvb3QtY2GCCQDqQamzD/+BlTAsBgNVHREE
JTAjgglsb2NhbGhvc3SHBH8AAAGHBH8AAAKCCnRzdC1zZXJ2ZXIwDQYJKoZIhvcN
AQELBQADggEBAJPq3EqcPcvfv4qbuSJAIcCxdyAx2fyusUG/ylhSqr5VN9Tx9E57
LThHfGMqnzbQc5x+EDuNgSF+ENGZwEwVtHlmT5RBfxVyPhlSBFkUHafiBDZgeszu
gipGgn/MkLqw0qTrkwsM9quC0JA2PGwEdG1D6e2mO93pNLekZRGVusrvZ3oWiTlJ
qJxkRBS6Jo+mN+E39A02+DnMTqlJ9iEz4/WxEt5+ZusJfEG3CUzVagRlKRMH07sT
TlayKPK6xqesupJoBkBJ3UpDhfVrh4V6zz84eIVY54D9ctAM+JLyFh8zMu1Eyjzz
lL6itKCSei2lWVodvvO+BmkEqLqpGXrri5s=
-----END CERTIFICATE-----
`;

  //html:
  
  var html    = {};
  
html.hello    = `

  <h1>Hello</h1>
  <br>
  <br>
  
  
  <h3>application/x-www-form-urlencoded</h3>
  
  <form action=/test-urlencoded method=post>
        <input name=test1-username value=username1 />
        <br>
        <input name=test1-password type=password value=password1 />
        <br>
        <input type="submit">
  </form>
  
  <br>

  
  <h3>application/json</h3>
  
  <form onsubmit=submitform(event,this)>
        <input name=test2-username value=username2 />
        <br>
        <input name=test2-password type=password value=password2 />
        <br>
        <input type=submit />
  </form>
  <pre id='result'></pre>  
  <br>

  
  <h3>multipart/form-data</h3>
  
  <form action=/test-multipartformdata method=post enctype=multipart/form-data>
        <input name=test3-username value=username3 />
        <br>
        <input name=test3-password type=password value=password3 />
        <br>
        <input name=test3-files type=file  multiple />
        <br>
        <input type="submit">
  </form>  
  
  <script>
  
        async function submitform(e,form){
        
              e.preventDefault();
        
              var username        = form.elements['test2-username'].value;
              var password        = form.elements['test2-password'].value;
              
              var url             = '/test-applicationjson';
              var body            = JSON.stringify({username,password});
              var opts            = {
                    headers   : {'content-type':'application/json'},
                    method    : 'POST',
                    body      : body
              };
              var text;
              
              result.innerHTML    = '';
                    
              try{
              
                    var response    = await fetch(url,opts);
                    text            = await response.text();
                    
              }//try
              
              catch(err){
    
                    text    = err.toString();                
                
              }//catch
              
              result.innerHTML    = text;
              
        }//submitform
    
  </script>
  
</body>
`;


  
})()
;


