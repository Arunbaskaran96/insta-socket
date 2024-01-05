const express = require("express")
const app =express()
const http=require("http")
const {Server} = require("socket.io")
const cors=require("cors")

app.use(cors())


const  server=http.createServer(app)



const io=new Server(server,{
    cors:{
        origin:"*"
    }
})

let users=[]

const pushUser=(userId,socketId)=>{
    !users.some((user)=>user.userId === userId)&& users.push({userId,socketId})
}

const findUser= (msg)=>{
    console.log(users)
    return users.find((item)=>item.userId === msg.receiverId)
}

const filterUser= (socketId)=>{
    users = users.filter((item)=>item.socketId!=socketId)
}
io.on("connection",(socket)=>{

    socket.on("addUser",(userId)=>{
        pushUser(userId,socket.id)
    })

    io.emit("getOnlineUsers",users)
    socket.on("sendMsg",(msg)=>{
        const user=findUser(msg)
        io.to(user.socketId).emit("getMsg",msg)
    })
    socket.on("disconnect",(socket)=>{
       filterUser(socket.id)
       io.emit("getOnlineUsers",users)
    })

    // console.log(socket.id)
    // socket.on("addmsg",(args)=>{console.log(args)})
    // io.emit("test","it's working")
})

server.listen(3000,()=>{
    console.log("connected")
})