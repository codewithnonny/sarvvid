const socket = io("/");

socket.on("connect",()=>{
    console.log("successfully connected to socket.io server")
    console.log(socket.id)

    document.getElementById("mypeerid").innerHTML = socket.id;
    document.getElementById("chat").addEventListener("submit",(e)=>{
        e.preventDefault();
        const peer = document.getElementById("peerid").value;
        socket.emit("peerconnection",{
            peerid:peer
        })
    })

    socket.on("answer",(data)=>{
        console.log(" user connected")
        console.log(data.peerid)
    })
})

let peerConnection;

const configuration = {
    iceServers:[
        {
            urls:"stun:stun.1.google.com:13902"
        }
    ]
}

const createPeerConnection = ()=>{
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.onicecandidate = (event)=>{
        if(event.candidate){

        }
    }
    peerConnection.onconnectionstatechange = (event)=>{
        if(peerConnection.connectionState === "connected"){
            console.log("successfully connected with other peer")
        }
    }
}