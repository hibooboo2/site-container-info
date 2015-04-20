var Docker = require('dockerode');
var docker = Docker();
var moment = require('moment');

var jsonToRow =  function(server){
	row = "<tr>";
		row += "<td><a href=\"https://" + server.name + "\">" + server.name + "</a></td>";
		row += "<td>" + server.id + "</td>";
	row += "</tr>";
	return row;
}

var rowsToTable = function(rows){
	table = "<style>table, th, td {    border: 1px solid black;    border-collapse: collapse;}th, td {    padding: 5px;    text-align: left;}table#t01 {    width: 100%;        background-color: #f1f1c1;}</style>";
	table += "<table style=\"width:40em;border:1px\">";
	table += "<tr><th>Site </th><th>Container Id on Server</th></tr>";
	rows.forEach(function(row){
		table += row;
	})
	table += "</table>"
	return table;
}

var serverIdJson = function(container, servers, res, checked, stop){
	checked.val += 1;
	container.Config.Env.forEach(function(env){
		env = env.split('=');
		if ("VIRTUAL_HOST" === env[0]){
			server = {"name": env[1], "id": container.Id};
			servers.push(jsonToRow(server));
		}
	});
	if (checked.val == stop){
		res.end(rowsToTable(servers));
		console.log(moment().toLocaleString() + '  ' + servers);
	}
}

var allServers = function (res, containers){
	var servers = [];
	var checked = { "val": 0 };
	containers.forEach(function (containerInfo){
		docker.getContainer(containerInfo.Id).inspect(function(err, container){
			serverIdJson(container, servers, res, checked, containers.length);
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
