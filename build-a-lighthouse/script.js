const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let blocks = [];
let currentBlock = {
  x: 100,
  y: 0,
  width: 100,
  height: 20,
  speed: 3
};

let isBuilding = true;

function drawBlock(block, color = '#00bfff') {
  ctx.fillStyle = color;
  ctx.fillRect(block.x, block.y, block.width, block.height);
}

function drawLighthouse() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  blocks.forEach(b => drawBlock(b, '#0074D9'));
  if (isBuilding) drawBlock(currentBlock);
}

function update() {
  if (isBuilding) {
    currentBlock.x += currentBlock.speed;
    if (currentBlock.x + currentBlock.width > canvas.width || currentBlock.x < 0) {
      currentBlock.speed *= -1;
    }
  }
}

function placeBlock() {
  if (!isBuilding) return;
  isBuilding = false;

  let lastBlock = blocks[blocks.length - 1];
  if (lastBlock) {
    let overlap = Math.min(currentBlock.x + currentBlock.width, lastBlock.x + lastBlock.width) - Math.max(currentBlock.x, lastBlock.x);
    if (overlap <= 0) {
      document.getElementById("message").textContent = "Oops! Block missed. Game Over!";
      return;
    } else {
      currentBlock.width = overlap;
      currentBlock.x = Math.max(currentBlock.x, lastBlock.x);
    }
  }

  blocks.push({ ...currentBlock });

  currentBlock = {
    x: 100,
    y: canvas.height - (blocks.length + 1) * 25,
    width: currentBlock.width,
    height: 20,
    speed: 3 + blocks.length * 0.2
  };

  if (currentBlock.y < 0) {
    document.getElementById("message").textContent = "Wow! You built a tall lighthouse!";
    isBuilding = false;
  } else {
    isBuilding = true;
  }
}

function loop() {
  update();
  drawLighthouse();
  requestAnimationFrame(loop);
}

document.addEventListener("keydown", e => {
  if (e.key === " " || e.key === "Enter") {
    placeBlock();
  }
});

loop();
