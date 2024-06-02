import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: any) {
    const message = JSON.parse(data);
    
    if(message.type === "sender"){
        // identify-as-sender
        senderSocket = ws;
        console.log('sender-set')
    }else if(message.type === "reciever"){
      // indentify-as-receiver
        receiverSocket = ws;
        console.log('reciever-set')
    }else if(message.type === "createOffer"){
        // create-an-offer
        if(typeof message == 'object'){
          receiverSocket?.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
        }

        console.log('offer-recieved');
    }else if(message.type === "createAnswer"){
      // create-an-answer
      if(typeof message == 'object')
       senderSocket?.send(JSON.stringify({type: 'createAnswer', sdp: message.sdp}));
      console.log('answer-recieved');
    }else if(message.type === 'iceCandidate'){
      // add-ice-candidates
      if(ws === senderSocket){
        // @ts-ignore
        receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate}))
      }else if( ws === receiverSocket){
        senderSocket?.send(JSON.stringify({type: 'iceCandidate', candidate: message.candidate }))
      }
    }
  });

  ws.send('something');
});