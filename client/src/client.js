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

const createBoard = (canvas) => {
  const ctx = canvas.getContext("2d");

  const fillRect = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x - 10, y - 10, 20, 20);
  };

  return { fillRect };
};

const getCoordinates = (el, e) => {
  const { top, left } = el.getBoundingClientRect();
  const { clientX, clientY } = e;

  return { x: clientX - left, y: clientY - top };
};

(function () {
  const canvas = document.querySelector("canvas");

  const { fillRect } = createBoard(canvas);
  const sock = io();

  const onClick = (e) => {
    const { x, y } = getCoordinates(canvas, e);
    sock.emit("turn", { x, y });
  };

  sock.on("message", (text) => {
    show(text);
  });

  sock.on("turn", ({ x, y }) => {
    fillRect(x, y);
  });

  document
    .querySelector("#chat-form")
    .addEventListener("submit", onChatSubmitted(sock));
  canvas.addEventListener("click", onClick);
})();
