//import 하지 않는 이유 -> io function은 알아서 socket.io를 실행하고 있는 서버를 찾기 때문
const frontsocket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleFrontend(msg) {
  console.log(`DM by backend : ${msg}`);
}

function handleroomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  frontsocket.emit("enter_room", { payload: input.value }, handleFrontend);
  input.value = "";
}

form.addEventListener("submit", handleroomSubmit);
