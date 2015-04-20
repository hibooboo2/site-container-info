var Docker = require('dockerode');
var docker = Docker();
var moment = require('moment');

var jsonToRow =  function(server){
	row = "<tr>";
		row += "<td><a href=\"https://" + server.name + "\">" + server.name + "</a></td>";
		row += "<td>Container name= " + server.id+ "</td>";
	row += "</tr>";
	return row;
}

var rowsToTable = function(rows){
	table = "<table style=\"width:40em\">";
	table += "<tr><th>Site </th><th>Container Id on Server</th></tr>";
	rows.forEach(function(row){
		table += row;
	})
	table += "</table>"
	return table;
}

var serverIdJson = function(container, res, checked, stop){
	checked += 1;
		container.Config.Env.forEach(function(env){
			env = env.split('=');
			if ("VIRTUAL_HOST" === env[0]){
				server = {"name": env[1], "id": data.Id};
				servers.push(jsonToRow(server));
			}
		});
		if (checked == stop){
			res.end(rowsToTable(servers));
			console.log(moment().toLocaleString() + '  ' + servers);
		}
}

var allServers = function (res, containers){
	var servers = [];
	var checked = 0;
	containers.forEach(function (containerInfo){
		docker.getContainer(containerInfo.Id).inspect(function(err, container){
			serverIdJson(container, res, checked, stop);
		});
	});
}

var http = require('http');

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	respond = function (err, containers){
		allServers(res, containers);
	}
	docker.listContainers(respond);
}).listen(9001, '0.0.0.0');
