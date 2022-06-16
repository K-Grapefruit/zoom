//import 하지 않는 이유 -> io function은 알아서 socket.io를 실행하고 있는 서버를 찾기 때문
const frontsocket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;
let roomName;

function addMessage(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

function HandleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  frontsocket.emit("new_message", input.value, roomName, () => {
    addMessage(`YOU : ${input.value}`);
  });
}

function ShowRoom() {
  form.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `room ${roomName}`;
  const form1 = room.querySelector("form");
  form1.addEventListener("submit", HandleMessageSubmit);
}

function handleroomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  frontsocket.emit("enter_room", input.value, ShowRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleroomSubmit);

frontsocket.on("welcome", () => {
  addMessage("Someone Joined");
});

frontsocket.on("bye", () => {
  addMessage("Someone disconnectiong");
});

frontsocket.on("new_message", (msg) => {
  addMessage(msg);
});
