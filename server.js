var Docker = require('dockerode');
var docker = Docker();
var moment = require('moment');

var containerToRow = function(container){
	
}

var allServers = function (res, containers){
	var servers = [];
	var checked = 0;
	containers.forEach(function (containerInfo){
		docker.getContainer(containerInfo.Id).inspect(function(err, data){
			checked += 1;
			data.Config.Env.forEach(function(env){
				env = env.split('=');
				if ("VIRTUAL_HOST" === env[0]){
					server = {"name": env[1], "id": data.Id}
					servers.push(server)"<a href=\"https://" + env[1] + "\">" + env[1] + "</a> Container name= " + data.Id + "<hr/>");
				}
			});
			console.log(servers);
			if (checked == containers.length){
				responseText = "";
				res.end(servers.toString());
				console.log(moment().toLocaleString() + '  ' + servers);
			}
		});
	});
	return servers;
}

var http = require('http');

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	respond = function (err, containers){
		allServers(res, containers);
	}
	docker.listContainers(respond);
}).listen(9001, '0.0.0.0');
