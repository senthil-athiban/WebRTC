import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let recieverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: any) {
    const message = JSON.parse(data);
    // identify-as-sender
    if(message.type === "identify-as-sender"){
        senderSocket = ws;
    }else if(message.type === "identify-as-reciever"){
        senderSocket = ws;
    }else if(message.type === "create-offer"){
        // reciever will recieve the offer
        recieverSocket.send(JSON.stringify({type: "offer", offer:message.offer}));
    }
    // indentify-as-receiver
    // create-an-offer
    // create-an-answer
    // add-ice-candidates
  });

  ws.send('something');
});