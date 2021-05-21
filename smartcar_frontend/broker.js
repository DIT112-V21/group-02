const aedes = require("aedes")();
const httpServer = require("http").createServer();
const ws = require("websocket-stream");
const mqttServer = require("net").createServer(aedes.handle);
const mqttPort = 1883;
const httpPort = 8888;

ws.createServer({ server: httpServer }, aedes.handle);
httpServer.listen(httpPort, function () {
  console.log("websocket server listening on port ", httpPort);
});

mqttServer.listen(mqttPort, function () {
  console.log("server started and listening on port ", mqttPort);
});
