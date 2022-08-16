# simple-server
a simple nodejs http/s server - no dependencies

designed for **personal use** and to be as simple as possible --- dont push it too hard

## file download
to download a file prefix download: to the file path, https://localhost:3001/download:ca-cert

## file upload
to upload a file prefix upload: to the filename, https://localhost:3001/upload:myfile.txt

or use the page, https://localhost:3001/hello

## https
the file has the server key/cert and the ca cert - valid until 2049 - embedded for convienience

## installing
if you append to the path environment variable the .bat file location, it will serve the current directory

c:\tst\www>simple-server




