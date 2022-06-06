//fontend에서 backend로 연결하는 방법
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");
const frontsocket = new WebSocket(`ws://${window.location.host}`);

frontsocket.addEventListener("open", () => {
  //socket이 connection에 open했을때 발생

  console.log("Connected to Server ❤");
});

//server에서 메세지가 올 경우 응답
frontsocket.addEventListener("message", (message) => {
  console.log("New Message", message.data, "from the server");
});

frontsocket.addEventListener("close", () => {
  console.log("Disconneted");
});

// setTimeout(() => {
//   //frontend에서 backend로 메세지 보내기
//   frontsocket.send("hello from the browser!");
// }, 10000);

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  frontsocket.send(input.value);
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
