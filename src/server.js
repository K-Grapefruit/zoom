import http from "http";
import SocketIO from "socket.io";
import express from "express";
import WebSocket from "ws";

const app = express();

app.set(`view engine`, "pug");
app.set("views", __dirname + "/views");
//user가 /public으로 가게되면 __dirname + "/public" 폴더를 보여주게 함
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log("Listening on http://localhost:3000");

//express와 ws는 서로 다른 protocol 이므로 function을 구현해서 합쳐야함

//http 서버
const server = http.createServer(app);

//socket IO 서버 만들기
const io = SocketIO(server);

io.on("connection", (backsocket) => {
  backsocket.onAny((event) => {
    console.log(`got ${event}`);
  });

  backsocket.on("enter_room", (room_name, done) => {
    backsocket.join(room_name);
    done();
    //이 방에 들어온 모든 인원들에게 메세지를 보냄 ( 나를 제외한 )
    backsocket.to(room_name).emit("welcome");
  });

  //연결이 끊어졌을때
  backsocket.on("disconnecting", () => {
    backsocket.rooms.forEach((room) => backsocket.to(room).emit("bye"));
  });

  backsocket.on("new_message", (msg, roomname, sendmsg) => {
    backsocket.to(roomname).emit("new_message", msg);
    sendmsg();
  });
});
/* WebSocket서버
서버를 전달(pass) 이러면 http , websocket서버 둘 다 돌릴 수 있음
필수는 아님 하나만 써도됨
http서버 위에 websocket 서버를 올림
const wss = new WebSocket.Server({ server });

각기 다른 브라우저에서 연결될 때 / fakeDatabase
const sockets = [];

socket은 어떤 사람 / 나(서버)와 브라우저 사이의 연결
connection이 생기면 socket을 얻음
이 메서드는 socket으로 직접적인 연결을 제공해줌
매번 새로운 브라우저가 backend로 연결할 때 backend와 연결된 각 브라우저에 대해 작동
wss.on("connection", (backsocket) => {
  console.log("Connected to Browser❤");

  각자 해당하는 브라우저 연결시 array에 넣어줌
  각 브라우저 연결이 될때마다 저장이 됨 , 연결된 브라우저마다 뿌려줌
  sockets.push(backsocket);

  브라우저 창을 닫을 시 발생하는 이벤트
  backsocket.on("close", () => {
    console.log("disconnected from browser");
  });
  console.log(sockets);

  브라우저마다 각 최초접속시 Anon이라는 닉네임 부여
  socket안에 정보를 저장할 수 있음
  backsocket["nick"] = "Anon";

  frontedn로 메세지 보내기
  backsocket.send("hello");
    backsocket.on("message", (msg) => {
      const message = JSON.parse(msg);

      console.log(message);
      switch (message.type) {
        case "new_message":
          sockets.forEach((asocket) =>
            asocket.send(`${backsocket.nick} : ${message.payload}`)
          );
          break;
        case "nick":
          console.log(message.payload);
          backsocket["nick"] = message.payload;
          console.log(backsocket.nick);
          break;
      }
      모든 socket을 거쳐서 해당하는 브라우저가 보낸 메세지를 다시 보냄
    });
}); */

//서버는 http , ws2개의 protocol을 이해할 수 있게 됨
server.listen(3000, handleListen);

//app.listen(3000, handleListen);
