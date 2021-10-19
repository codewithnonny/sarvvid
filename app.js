const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const expressValidator = require("express-validator");
const cookieParser = require("cookie-parser")
require("dotenv").config();
const {
  validateToken
} = require("./controllers/auth");

//import routes
const authRoute = require("./routes/auth");


//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(expressValidator());
app.use(express.static("public"));
app.use(cookieParser())

//routes middleware
app.use(authRoute);

app.get("/",(req,res)=>{
  res.sendFile(__dirname + "/public/index.html")
});

app.get("/chat",(req,res)=>{
  res.sendFile(__dirname + "/public/chat.html")
})
//db connection
mongoose
  .connect(process.env.DATABASE, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection established");
  });
 
let connectedPeers = [];

 //socket configuration
 io.on("connection",(socket)=>{
   connectedPeers.push(socket.id);
   console.log("user connected to socket io server")
   console.log(connectedPeers);
  
    socket.on("disconnect",()=>{
       
        console.log("user disconnected");
        const newConnectedPeers = connectedPeers.filter((peerSocketId)=>{
         return peerSocketId !== socket.id
        })
        connectedPeers = newConnectedPeers;
        console.log(connectedPeers)

    })

    socket.on("peerconnection",(data)=>{
      console.log(data);
      io.to(data.peerid).emit("answer",{peerid:data.peerid})
    })
   
 })
 

//port
const port = process.env.PORT || 8000;

//listner
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
