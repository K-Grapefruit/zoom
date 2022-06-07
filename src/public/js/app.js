//fontend에서 backend로 연결하는 방법
const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const frontsocket = new WebSocket(`ws://${window.location.host}`);

frontsocket.addEventListener("open", () => {
  //socket이 connection에 open했을때 발생

  console.log("Connected to Server ❤");
});

//server에서 메세지가 올 경우 응답
frontsocket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

frontsocket.addEventListener("close", () => {
  console.log("Disconneted");
});

//socket.send는 String 타입으로 전송이 되기때문에 OBJECT형태로 만들어준 후 STRING으로 변환
function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

// setTimeout(() => {
//   //frontend에서 backend로 메세지 보내기
//   frontsocket.send("hello from the browser!");
// }, 10000);

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  frontsocket.send(makeMessage("new_message", input.value));
  input.value = "";
}

function handlenickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  frontsocket.send(makeMessage("nick", input.value));
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handlenickSubmit);
