import { useEffect, useState } from "react";

const Sender = () => {
    const[newPc, setPc] = useState<RTCPeerConnection | null>(null);
    const[socket, setSocket] = useState<WebSocket | null>(null);
    
    // get the websocket connection from the backend, using useEffect hook to reduce infinte fetching
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        setSocket(socket);
        // when socket is open
        socket.onopen = () => {
            socket.send(JSON.stringify({type: 'sender'}));
        }
    },[])

    // initate the webRTC connection

    
    const initiateConnection = async () => {
        if(!socket) return;
        
        const pc = new RTCPeerConnection();
        setPc(pc);

        // repeating the offer creation process, as sdp changes frequently
        pc.onnegotiationneeded = async () => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket?.send(JSON.stringify({
                type: 'createOffer',
                sdp: pc.localDescription
            }));
        }
        
        pc.onicecandidate = async(event) => {
            console.log('sender ice-candidate')
            console.log(event);
            if(event.candidate){
                socket?.send(JSON.stringify({type:'iceCandidate', candidate: event.candidate}))
            }
        }
        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if( data.type === "createAnswer" ){
                pc.setRemoteDescription(data.sdp);
            }else if(data.type === 'iceCandidate'){
                pc.addIceCandidate(data.candidate);
            }
        }

        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        pc.addTrack(stream.getVideoTracks()[0]);
        const video = document.createElement('video');
        document.body.appendChild(video);
        video.srcObject = stream;
        video.play();
    }

    return (
        <>
            <button onClick={initiateConnection}>
                Send Video
            </button>
        </>
    )
}

export default Sender;