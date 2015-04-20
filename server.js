var Docker = require('dockerode');
var docker = Docker();
var allServers = function (err, containers){
	var servers = [];
	containers.forEach(function (containerInfo){
		docker.getContainer(containerInfo.Id).inspect(function(err, data){
//			console.log(data);
			data.Config.Env.forEach(function(env){
				env = env.split('=');
				if ("VIRTUAL_HOST" === env[0]){
					servers.push(env[1]);
				}
			});
			console.log(servers);
		});
	});
	console.log(servers);
	return servers;
}

var http = require('http');

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	respond = function (err, containers){
		allServers(res, containers);
	}
	docker.listContainers(respond);
}).listen(9001, '0.0.0.0');
