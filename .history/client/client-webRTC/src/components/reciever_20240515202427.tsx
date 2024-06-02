import { useEffect, useState } from "react";

const Reciever = () => {
    const[pc, setPc] = useState<RTCPeerConnection | null>(null);
    const[socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({type:'reciever'}));
        }
        setSocket(socket);
    }, []);

    // get the offer from the socket
    if(!socket) return;
    socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        console.log(message);
        
        let pc: RTCPeerConnection;
        if(message.type === 'createOffer'){
            // creating browser-2 RTC connection
            pc = new RTCPeerConnection();
            setPc(pc);
            await pc.setRemoteDescription(message.sdp);
            console.log('before track');
            pc.ontrack = (event) => {
                console.log('video');
                const video = document.createElement('video');
                document.body.appendChild(video);
                video.srcObject = new MediaStream([event.track]);
                video.play();
            }
            console.log('after track');
            pc.onicecandidate = async(event) => {
                if(event.candidate){
                    socket?.send(JSON.stringify({type: 'iceCandidate', candidate: event.candidate}));
                }
            }

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.send(JSON.stringify({
                type:'createAnswer',
                sdp: pc.localDescription
            })); 
        }else if(message.type === 'iceCandidate'){
            console.log('recieved ice-candidate')
            //@ts-ignore
            pc?.addIceCandidate(message.candidate);
        }
        
        
    }
    return (
        <div>reciever</div>
    )
}

export default Reciever;