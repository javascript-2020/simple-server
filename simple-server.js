
  
        var scheme            = 'https';
        var port              = 3001;
        var interface         = '';

        var docroot           = process.cwd()+'/';

        var host              = interface||'localhost';
        var serverurl         = `${scheme}://${host}:${port}/`;

        var fs                = require('fs');
        var path              = require('path');

        var fsroot            = 'c:/';
        var rootdir           = fsroot+'www/';
        var cacert            = rootdir+'ca/root-ca/certs/root-ca.cert.pem';


        setTimeout(start,50);


  
        function router(req,res,url,file){
                      
              switch(url){


                case 'hello'            : hello(req,res);                   return;

                
                case 'root-ca'          : file    = cacert;                 break;
                  
                case 'tst-ca'           : res.end(tstca);                   return;


              }//switch

              return file;
              
        }//router


        function hello(req,res){
                                                                          
              res.setHeader('content-type','text/html');
              res.end(html.hello);
        
        }//hello


        function request(req,res){

              res.setHeader('cache-control','no-store');

              var url           = req.url.slice(1);
              
              var upload        = false;
              var download      = false;

              if(url.startsWith('upload:')){
                    url         = url.slice(7);
                    upload      = true;
              }
              
              if(url.startsWith('download:')){
                    url         = url.slice(9);
                    var fn      = path.basename(url);
                    res.setHeader('content-disposition',`attachment; filename="${fn}"`);
                    download    = true;
              }


              var file    = path.resolve(docroot,url);
              
              var n       = docroot.length;
              var s       = file.substring(0,n);
              
              if(path.resolve(s)!==path.resolve(docroot)){
                                                                  console.log('404,',req.url);
                    res.removeHeader('content-disposition');
                    res.writeHead(404);
                    res.end(req.url+' bad url');
                    return;
              }
                    

              file    = router(req,res,url,file);
              
              if(!file){
                                                                  console.log('200,',req.url);
                    return;
              }
              
              var stream;
              
              if(upload){
                    stream    = fs.createWriteStream(file);
                    req.pipe(stream);
                    req.on('end',()=>{
                                                                  console.log('200,',req.url);
                          res.end('ok');
                          stream.close();
                          
                    })//end              
                    return;
              }


              if(!fs.existsSync(file)){
                                                                  console.log('404,',req.url);
                    res.removeHeader('content-disposition');
                    res.writeHead(404);
                    res.end(req.url+' not found');
                    return;
              }
                                                                  console.log('200,',req.url);
              
              var ext   = path.extname(file);
              
              switch(ext){
              
                case 'html'   : res.setHeader('content-type','text/html');    break;
                
              }//switch


              stream    = fs.createReadStream(file);
              stream.pipe(res);
              
        }//request


        function start(){
      
              var server;
      
              if(scheme==='http'){
                    var http    = require('http');
                    server      = http.createServer(request);
              }
              
              if(scheme==='https'){
                    var https   = require('https');
                    server      = https.createServer({key,cert},request);
              }
                            
              server.on('listening',listening);
              
              server.listen(port,interface);


              function listening(){
                                
                    console.log(`listening ... :  ${scheme}, ${interface||'all interfaces'}, port ${port}`);
                    console.log('serving ..... :  '+docroot);
                    console.log('url ......... :  '+serverurl+'hello');
                    
              }//listening

        }//start
        
        



        
  //data:

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


var tstca    = `
-----BEGIN CERTIFICATE-----
MIIDOzCCAiOgAwIBAgIJAOpBqbMP/4GVMA0GCSqGSIb3DQEBCwUAMBYxFDASBgNV
BAMMC3RzdC1yb290LWNhMB4XDTIyMDgxNDA5MjgwNFoXDTQ5MTIzMDA5MjgwNFow
FjEUMBIGA1UEAwwLdHN0LXJvb3QtY2EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
ggEKAoIBAQCfdZdpipCK7gVxhhC4CvInK0n6Gf4MAJdkp3bqXXuMSIJsGrF9qbpY
FYAdpptr7X+EwkQ80nQcudXMsbou0Yg/iUG0FYp0iy8F4Fo6JTTLQAJ2l3OWrDsJ
Tp8w3HrKjPjzQUHc+NCv2RBIur+ViiF5Ur3qAvVygY3yyZWPzAHsZ+IckXtxvKZr
046zTekLJaXPA/iR5funJEJelDGOMbR4gGc3LOJp4BtRFuUX0dUdjPYzVvdhz4JA
H1+8bvY0qJCMlYFgRcPi6z47yU4ZgY0HTBtY0PqMX5HTskcvmavckPWFNigqS7zr
CikE8gbiC0E+u5mVk1j6k4hrvnEE1JGdAgMBAAGjgYswgYgwDwYDVR0TAQH/BAUw
AwEB/zAOBgNVHQ8BAf8EBAMCAYYwHQYDVR0OBBYEFEsNeiZreqGe65gZJ3dC0LvQ
oVcWMEYGA1UdIwQ/MD2AFEsNeiZreqGe65gZJ3dC0LvQoVcWoRqkGDAWMRQwEgYD
VQQDDAt0c3Qtcm9vdC1jYYIJAOpBqbMP/4GVMA0GCSqGSIb3DQEBCwUAA4IBAQCD
GB8xbbozjvEij6DESLKougYHjG33lT79tegixXnh+fFwr374VTx+nEcmz8ha0cFA
z0lig/8aOJm2vlB+iGY9/chztd91QL4/xiTIi4dYZFbQXXpsSwaIaEEDJ496p+Kx
nlh4AgczG7Yxs1MPm7QiYdLpRD128x8B4gkOwe54D9yUch/PHkb5jkII7a1ctb9q
ZzrfWtPiYt7x/DT1ljIYo2m4lLdns5CHkqHlDRjyaiV4kgi7EVlpIKvjZaNNpN1a
0aKw0m5zG50jX44AtKttW/EybFj0KR9hHeaGvB9MFIz2ZiPM9OGek6NPrLr7tSjJ
KcW4i/Y+AMJCHEjy+Mj/
-----END CERTIFICATE-----
`;


var html    = {};

html.hello    = `
<h3>Hello</h3>
<input value='file upload' type='button' />
<script>

      document.body.querySelector('input').onclick    = click;
      
      function click(){
      
            var input         = document.createElement('input');
            input.type        = 'file';
            input.onchange    = upload;
            input.click();
            
      }//click
      
      function upload(e){
     
            var file    = e.target.files[0];

            var url     = '${serverurl}upload:'+file.name;
            
            var opts    = {
                method    : 'POST',
                headers   : {'content-type':'multipart/form-data;'},
                body      : file 
            };
            
            fetch(url,opts);
                  
      }//upload
                                
</script>
`;




        
        
        
        
        
        
              
              
