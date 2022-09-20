
/*

simple-server-v1.0.js:d

20-09-22

*/

;
(function(){

        var port              = 3001;
        var interface         = '';

        var docroot           = process.cwd()+'/';
        

        var fs                = require('fs');
        var path              = require('path');

        var serverfile        = __filename;
        var serverurl         = `${scheme}://${interface||'localhost'}:${port}/`;


        var http              = require('http');
        var server            = http.createServer();
        
        server.on('listening',listening);
        server.on('request',request);
        
        server.listen(port,interface);

  
        function router(req,res,url){    //c

              var url   = req.url.slice(1);
              var file;
              
              switch(url){

                                          
                case 'hello'      : 
                                    res.setHeader('content-type','text/html');    
                                    res.end(html.hello);
                                    return;

                default           : 
                                    file    = resolve(url);
                                    if(!file){
                                          notfound(req,res);
                                          return false;
                                    }
              }//switch
              
              return file;
              
        }//router

        function request(req,res){

              res.setHeader('cache-control','no-store');
              
              var file    = router(req,res,url);              
              if(!file){
                    if(file===false){
                          return;
                    }
                                                                  console.log('200 (routed),',req.url);
                    return;
              }

              if(exists(file)===false){
                    notfound(req,res);
                    return;
              }
                                                                  console.log('200,',req.url);
              var stream    = fs.createReadStream(file);
              stream.pipe(res);
              
        }//request
        
        function listening(){
                        
              console.log();
              console.log(`   server ...... :  ${serverfile}`);
              console.log(`   process ..... :  ${process.pid}`);
              console.log(`   listening ... :  http ,  ${interface||'all interfaces'} ,  port ${port}`);
              console.log(`   serving ..... :  ${docroot}`);
              console.log(`   url ......... :  ${serverurl}hello`);
              console.log();

        }//listening
                            
        function notfound(req,res){
                                                                  console.log('404,',req.url);
              res.writeHead(404);
              res.end(req.url+' not found');
        
        }//notfound        
        
        function resolve(url){
        
              var file    = path.resolve(docroot,url);              
              var s       = file.substring(0,docroot.length);
              if(path.resolve(s)!==path.resolve(docroot)){
                    return false;
              }
              return file;
        
        }//resolve
        
        function exists(file,isfile){
        
              if(!fs.existsSync(file)){
                    return false;
              }
              
              if(isfile!==false){
                    if(fs.statSync(file).isFile()){
                          return true;
                    }
                    return false;
              }
              
              return true;
              
        }//exists


        var html    = {};
        
        html.hello    = `<h1>Hello</h1>`;


})()
;


