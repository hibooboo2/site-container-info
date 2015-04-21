Node server you run on a docker host. Assuming you have a https://github.com/jwilder/nginx-proxy container setup.

this server will tell you what servers the proxy is exposing and their urls. 

So if you run `docker run -d -e VIRTUAL_HOST=x.example.com ghost` You can go to x.example.com and a ghost install will be there.
