"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let receiverSocket = null;
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        const message = JSON.parse(data);
        if (message.type === "sender") {
            // identify-as-sender
            senderSocket = ws;
            console.log('sender-set');
        }
        else if (message.type === "reciever") {
            // indentify-as-receiver
            receiverSocket = ws;
            console.log('reciever-set');
        }
        else if (message.type === "createOffer") {
            // create-an-offer
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
            console.log('offer-recieved');
        }
        else if (message.type === "createAnswer") {
            // create-an-answer
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));
            console.log('answer-recieved');
        }
        else if (message.type === 'iceCandidate') {
            // add-ice-candidates
            if (ws === senderSocket) {
                // @ts-ignore
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
            else if (ws === receiverSocket) {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
        }
    });
    ws.send('something');
});
