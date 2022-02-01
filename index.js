var db = require('./db')
var WebSockets = require('ws')

const wss = new WebSockets.WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    data = JSON.parse(data)
    switch (data.type) {
        case "write":
            db.writeTable(data.table, data.object).then(e=>ws.send(JSON.stringify(e)))
            break;
        
        case "search":
            db.searchTable(data.table, data.object).then(e=>ws.send(JSON.stringify(e)))
            break;
        
        case "delete":
            db.removeFromTable(data.table, data.object).then(e=>ws.send(JSON.stringify(e)))
            break;

        case "update":
            db.updateTable(data.table, data.object).then(e=>ws.send(JSON.stringify(e)))
            break;

        case "read":
            db.readTable(data.table).then(e=>ws.send(JSON.stringify(e)))
            break;
    }
  });
});