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
docker.listContainers(allServers);

