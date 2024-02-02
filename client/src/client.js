const show = (text) => {
  const parent = document.querySelector("#events");
  if (!parent) {
    console.error("Parent element with id 'events' not found.");
    return;
  }

  const el = document.createElement("li");
  el.textContent = text;

  parent.appendChild(el);
  parent.scrollTop = parent.scrollHeight;
};

const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();

  const input = document.querySelector("#chat");
  if (!input) {
    console.error("Input element with id 'chat' not found.");
    return;
  }

  const text = input.value.trim();
  if (!text) {
    return;
  }

  input.value = "";
  sock.emit("message", text);
};

(function () {
  const sock = io();

  sock.on("message", (text) => {
    show(text);
  });
  document
    .querySelector("#chat-form")
    .addEventListener("submit", onChatSubmitted(sock));
})();
