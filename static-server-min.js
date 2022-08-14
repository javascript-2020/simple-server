


/*

servers/simple-server/min/simple-server-min.js

simple-server-min:d

21-01-22
11-08-22    v1.1
14-08-22    min


*/

  
        var scheme            = 'https';
        var port              = 3001;
        var interface         = '';

        var docroot           = process.cwd()+'/';

        var host              = interface||'localhost';
        var serverurl         = `${scheme}://${host}:${port}/`;

        var fs                = require('fs');
        var path              = require('path');

        var fsroot            = 'c:/';
        var rootdir           = fsroot+'selfedits.dev.internetservicesltd.co.uk/www/';
        var cacert            = rootdir+'ca/root-ca/certs/root-ca.cert.pem';


        setTimeout(start,50);


  
        function router(req,res,url){
        
              var file    = docroot+url;

              switch(url){

                case 'hello'            : hello(req,res);                   return;
                
                case 'root-ca'          : file    = cacert;                 break;

              }//switch

              return file;
              
        }//router


        function hello(req,res){
                                                                          
              res.setHeader('content-type','text/html');
              res.end(hellohtml);
        
        }//hello


        function request(req,res){

              res.setHeader('cache-control','no-store');

              
              var url   = req.url.slice(1);

              if(url.startsWith('upload:')){
                    upload(req,res);
                    return;
              }
              
              if(url.startsWith('download:')){
                    url       = url.slice(9);
                    var fn    = path.basename(url);
                    res.setHeader('content-disposition',`attachment; filename="${fn}"`);
              }

              
              var file    = router(req,res,url);
              
              if(!file){
                                                              console.log('200,',req.url);
                    return;
              }

              if(!fs.existsSync(file)){
                                                              console.log('404,',req.url);
                    res.writeHead(404);
                    res.end(req.url+' not found');
                    return;
              }
                                                              console.log('200,',req.url);

              var ext   = path.extname(file);
              
              if(ext==='html'){
                    res.setHeader('content-type','text/html');
              }


              var stream    = fs.createReadStream(file);
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
        
        
        function upload(req,res){
        
              var fn        = req.url.slice(8);
              var stream    = fs.createWriteStream(fn);
              req.pipe(stream);
              req.on('end',()=>{
                                                            console.log('200,',req.url);
                    res.end('ok');
                    stream.close();
                    
              })//end              
              
        }//upload



        
  //data:

var key     = `
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAu+mCOngXPF2dwpcjFXvHwTJ/svFhw2wlXluu2on0/bmcRJfh
aHHCQe3OGL9+9nhNthkEnz75G37nt9Q4qfYyQbybe6t95DPO+tHawAuVt0I+r9UD
mBVuaRs/wNW8vkWo6fAScY+c1693fclKcHukqbXuJxepZ2mHeJdAbZ+VzEBh1Ua6
tMK9GFvD88tmR1tZiBYUYSdeoVIVACM+UWHMvC2wXxwXPj8s3UZC6RKf+jqg1iA3
Zdtk4Y/rY97z2Y3Sbd7KIiBoM0Kgp93RuXs/jILpKk5H/ryyRZBlzYHtKCQvyJ+i
PnPPfPG5Jaf9wNE8R5umaN4X4VvRmxYq0UiLFQIDAQABAoIBAAN71cU9uriMx8L2
yFi6nb5wMDviC7zywVKZgolcq2UUztfatPwZt88/GGYPDsyE+HPazOIi6b1fwe3/
ijlkbhQX6g4F5OSZLUorH9IVpOXr3XunCFUGeLCMJ8dsbv5cDkCgCcd/MRoyj5WO
aMnjEO9whwTEhIh9RVyv+SrPHZjWxJDMqjBylX6I9ZMtaFi2jVJG13Dyf17USMgS
+SxFB7egf2wy7AziBDOHIeUvP3F+QsYY7u4//gkCM6Nhph6o0dDB5rjwnVsoOZGE
PPyqFp+kvUUsoL9UMChjOI3CGAdgY523w9VBAFGrdCj86qBx9ROxCnfILJMR+h22
lQOMgzUCgYEA7dfP8TSd1ozvp5ufWNVbFHuEcuIhVlFwRBhhdr1XvyNf3JjZuyie
m+tkeqID4e2ICWoqozkS01kI9yIYuFHqD8BpsdLOW8o65kyXJmgSaPmZjWrdjJnB
rOa7eiuXUsrbuhiw/cLnJSkT5iZielZDj65p0xNsrQbwNk33rErHqzcCgYEAykHk
kGCWROm4XF5JOrhlZfRN2FKUMBC+thIownhlE/15HZVN5Up/regeldqEZCKsNtiI
AlULFufslfOLV3zoI0RgxEYwfCEPKQc/ZjqjWhteUJlTQCTxA/wk/6dCFpP6FL4t
8m/+9Fo8QOOnW/BvbyXqyUHsZA8wkk5yaQGm2hMCgYEA65QUKhR0tfsYsUoKVgHV
2f7R3LywSoAVk80WVHcMf4y5OZXIK4H7P/KyrmjlMZWFZdXbb5prVB1fLPF/zKmO
DZYG2pQzw2UWW9/G4sq4WXPIrPMJiGcPF4PedA7TLrUxWC12uZKgQgVi6VZhukzR
VHJr7R7TSLqTmSY2yFe1V5cCgYB3nDI0I7qaNHG/xk6eOFBW0/x5UpSqPCzcda6/
Gv4DrWHD2fkAAWeyi9QSoPCsW0jnAnSklHCDclKadzXPXmHWAWkMicnAjrhtdgjL
RyA1eHv1REdUZsRVq/ahbeOKgKZjP/jiJ9Np5Dc/1KGzoGP2IkFQFflbTxRVYakN
almnGwKBgGfW55Uvts2SMoxxLPRucaKdlxpdgAItmLAu84tQVIgkPI36OgQDhRyg
ZokbD4EWOYa6fG8IwYEwZTaEGv6xFUBXyCevx6fkfhClMioah1j0vTFr+yafvhbw
7HV8n2BdDwVI/tB4hn/G1TD/KPateVcglQWvhgR+Z9dEcLBisVNQ
-----END RSA PRIVATE KEY-----
`;

var cert    = `
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 4108 (0x100c)
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: 
        Validity
            Not Before: Jun  3 09:33:29 2022 GMT
            Not After : Jun 10 09:33:29 2022 GMT
        Subject: 
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:bb:e9:82:3a:78:17:3c:5d:9d:c2:97:23:15:7b:
                    c7:c1:32:7f:b2:f1:61:c3:6c:25:5e:5b:ae:da:89:
                    f4:fd:b9:9c:44:97:e1:68:71:c2:41:ed:ce:18:bf:
                    7e:f6:78:4d:b6:19:04:9f:3e:f9:1b:7e:e7:b7:d4:
                    38:a9:f6:32:41:bc:9b:7b:ab:7d:e4:33:ce:fa:d1:
                    da:c0:0b:95:b7:42:3e:af:d5:03:98:15:6e:69:1b:
                    3f:c0:d5:bc:be:45:a8:e9:f0:12:71:8f:9c:d7:af:
                    77:7d:c9:4a:70:7b:a4:a9:b5:ee:27:17:a9:67:69:
                    87:78:97:40:6d:9f:95:cc:40:61:d5:46:ba:b4:c2:
                    bd:18:5b:c3:f3:cb:66:47:5b:59:88:16:14:61:27:
                    5e:a1:52:15:00:23:3e:51:61:cc:bc:2d:b0:5f:1c:
                    17:3e:3f:2c:dd:46:42:e9:12:9f:fa:3a:a0:d6:20:
                    37:65:db:64:e1:8f:eb:63:de:f3:d9:8d:d2:6d:de:
                    ca:22:20:68:33:42:a0:a7:dd:d1:b9:7b:3f:8c:82:
                    e9:2a:4e:47:fe:bc:b2:45:90:65:cd:81:ed:28:24:
                    2f:c8:9f:a2:3e:73:cf:7c:f1:b9:25:a7:fd:c0:d1:
                    3c:47:9b:a6:68:de:17:e1:5b:d1:9b:16:2a:d1:48:
                    8b:15
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Basic Constraints: critical
                CA:FALSE
            X509v3 Key Usage: critical
                Digital Signature, Non Repudiation, Key Encipherment, Key Agreement
            X509v3 Extended Key Usage: critical
                TLS Web Server Authentication
            X509v3 Subject Key Identifier: 
                E9:B6:79:90:08:96:9C:67:AD:35:8E:35:FE:01:BF:D1:A4:9E:55:E3
            X509v3 Authority Key Identifier: 
                keyid:EE:70:C1:5D:D3:F3:4C:7B:32:71:69:C5:5D:46:0A:94:82:AD:C1:C1
                DirName:
                serial:D7:8E:6B:B2:0C:E6:82:05

            X509v3 Subject Alternative Name: 
                IP Address:127.0.0.1, DNS:localhost
    Signature Algorithm: sha256WithRSAEncryption
         ad:b1:e4:fd:16:2e:99:87:81:6e:41:80:d9:18:e5:4a:f2:29:
         ed:ff:c5:2d:8b:f8:bc:a9:f1:5b:ad:5b:ca:2f:c1:38:ab:eb:
         af:fc:e1:77:d8:7a:3e:4b:71:f4:2f:f4:0c:e4:ff:2e:c8:08:
         0b:5a:b1:35:bd:1a:2f:57:8d:aa:79:59:fc:47:ba:d3:bc:61:
         ed:d1:2c:75:6e:3a:df:68:8a:ce:8d:2e:86:97:b1:ad:e3:67:
         b9:a7:aa:2f:3c:c5:7c:db:bb:5e:0f:f8:0c:6b:36:60:f6:2f:
         b8:5a:63:86:bd:fe:26:aa:6e:af:63:65:dd:92:df:b1:9a:ff:
         f5:1c:9e:da:7d:cf:95:ac:97:8f:2e:b8:f8:39:a9:b1:2b:19:
         27:e7:43:57:ab:8c:bc:b6:54:3b:7d:0e:2a:71:39:9c:40:4f:
         a8:48:1e:4a:77:e2:37:ec:eb:d6:34:fd:2d:e6:1a:73:94:21:
         18:86:97:8f:c9:13:d4:99:f5:8d:20:e2:d3:4f:40:b5:00:e2:
         78:0d:e2:24:d3:f1:4c:80:3f:e3:3f:75:d8:de:de:86:bb:3a:
         ae:49:5d:fd:9a:d4:c3:bb:1a:0f:f5:f4:92:02:fd:e1:a7:cc:
         b1:cb:69:06:ec:38:9d:c0:5c:3b:86:be:bc:a4:1f:5e:58:ac:
         04:f7:4b:21
-----BEGIN CERTIFICATE-----
MIIEmTCCA4GgAwIBAgICEAwwDQYJKoZIhvcNAQELBQAwgZ8xKTAnBgNVBAoMIENv
bW11bmljb24gSW50ZXJuZXQgU2VydmljZXMgTFREMS4wLAYDVQQLDCVDb21tdW5p
Y29uIEludGVybmV0IFNlcnZpY2VzIExURCAtIGNhMQ8wDQYDVQQHDAZMb25kb24x
EDAOBgNVBAgMB0VuZ2xhbmQxCzAJBgNVBAYTAkdCMRIwEAYDVQQDDAlpc2wuY28u
dWswHhcNMjIwNjAzMDkzMzI5WhcNMjIwNjEwMDkzMzI5WjAvMRkwFwYDVQQKDBBs
b2NhbGhvc3Qgc2VydmVyMRIwEAYDVQQDDAlsb2NhbGhvc3QwggEiMA0GCSqGSIb3
DQEBAQUAA4IBDwAwggEKAoIBAQC76YI6eBc8XZ3ClyMVe8fBMn+y8WHDbCVeW67a
ifT9uZxEl+FoccJB7c4Yv372eE22GQSfPvkbfue31Dip9jJBvJt7q33kM8760drA
C5W3Qj6v1QOYFW5pGz/A1by+Rajp8BJxj5zXr3d9yUpwe6Spte4nF6lnaYd4l0Bt
n5XMQGHVRrq0wr0YW8Pzy2ZHW1mIFhRhJ16hUhUAIz5RYcy8LbBfHBc+PyzdRkLp
Ep/6OqDWIDdl22Thj+tj3vPZjdJt3soiIGgzQqCn3dG5ez+MgukqTkf+vLJFkGXN
ge0oJC/In6I+c8988bklp/3A0TxHm6Zo3hfhW9GbFirRSIsVAgMBAAGjggFMMIIB
SDAMBgNVHRMBAf8EAjAAMA4GA1UdDwEB/wQEAwID6DAWBgNVHSUBAf8EDDAKBggr
BgEFBQcDATAdBgNVHQ4EFgQU6bZ5kAiWnGetNY41/gG/0aSeVeMwgdQGA1UdIwSB
zDCByYAU7nDBXdPzTHsycWnFXUYKlIKtwcGhgaWkgaIwgZ8xKTAnBgNVBAoMIENv
bW11bmljb24gSW50ZXJuZXQgU2VydmljZXMgTFREMS4wLAYDVQQLDCVDb21tdW5p
Y29uIEludGVybmV0IFNlcnZpY2VzIExURCAtIGNhMQ8wDQYDVQQHDAZMb25kb24x
EDAOBgNVBAgMB0VuZ2xhbmQxCzAJBgNVBAYTAkdCMRIwEAYDVQQDDAlpc2wuY28u
dWuCCQDXjmuyDOaCBTAaBgNVHREEEzARhwR/AAABgglsb2NhbGhvc3QwDQYJKoZI
hvcNAQELBQADggEBAK2x5P0WLpmHgW5BgNkY5UryKe3/xS2L+Lyp8VutW8ovwTir
66/84XfYej5LcfQv9Azk/y7ICAtasTW9Gi9Xjap5WfxHutO8Ye3RLHVuOt9ois6N
LoaXsa3jZ7mnqi88xXzbu14P+AxrNmD2L7haY4a9/iaqbq9jZd2S37Ga//Ucntp9
z5Wsl48uuPg5qbErGSfnQ1erjLy2VDt9DipxOZxAT6hIHkp34jfs69Y0/S3mGnOU
IRiGl4/JE9SZ9Y0g4tNPQLUA4ngN4iTT8UyAP+M/ddje3oa7Oq5JXf2a1MO7Gg/1
9JIC/eGnzLHLaQbsOJ3AXDuGvrykH15YrAT3SyE=
-----END CERTIFICATE-----
`;


var hellohtml    = `
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




        
        
        
        
        
        
              
              
