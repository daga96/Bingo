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

const createBoard = (canvas, numCells = 20) => {
  const ctx = canvas.getContext("2d");
  const cellSize = Math.floor(canvas.width / numCells);

  const fillCell = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  };

  const drawGrid = () => {
    ctx.strokeStyle = "#333";
    ctx.beginPath();

    for (let i = 0; i < numCells + 1; i++) {
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, cellSize * numCells);
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(cellSize * numCells, i * cellSize);
    }
    ctx.stroke();
  };

  const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const reset = () => {
    clear();
    drawGrid();
  };

  const getCellCoordinates = (x, y) => {
    return {
      x: Math.floor(x / cellSize),
      y: Math.floor(y / cellSize),
    };
  };

  return { fillCell, reset, getCellCoordinates };
};

const getCoordinates = (el, e) => {
  const { top, left } = el.getBoundingClientRect();
  const { clientX, clientY } = e;

  return { x: clientX - left, y: clientY - top };
};

(function () {
  const canvas = document.querySelector("canvas");

  const { fillCell, reset, getCellCoordinates } = createBoard(canvas);
  const sock = io();

  const onClick = (e) => {
    const { x, y } = getCoordinates(canvas, e);
    sock.emit("turn", getCellCoordinates(x, y));
  };

  reset();

  sock.on("message", (text) => {
    show(text);
  });

  sock.on("turn", ({ x, y, color }) => {
    fillCell(x, y, color);
  });

  document
    .querySelector("#chat-form")
    .addEventListener("submit", onChatSubmitted(sock));
  canvas.addEventListener("click", onClick);
})();
