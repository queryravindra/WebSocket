const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8082 });

// 'wss' is actual server where as 'ws' is refers to single connection to the server side
wss.on("connection", ws => {
    console.log("New client connected!");

    // data refers to the actual data which the client side has sent to the serevr
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`);

        ws.send(data.toUpperCase());
    });

    // we are closing single websocket(ws) connection and ofcourse not on websocket server(wss)
    ws.on("close", () => {
        console.log("Client has disconnected!");
    })
});