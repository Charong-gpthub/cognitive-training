let size = 3;
let tiles = [];
let moves = 0;
let elapsed = 0;
let timer = null;
let sessionStartedAt = null;

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("sp-panel");
const boardEl = document.getElementById("board");
const hintEl = document.getElementById("hint");
const resultModal = document.getElementById("result-modal");
const sizeSelect = document.getElementById("board-size");

function goalState(n) {
    const max = n * n;
    return Array.from({ length: max }, (_, i) => (i + 1) % max);
}

function isSolved(state) {
    const goal = goalState(size);
    return state.every((value, idx) => value === goal[idx]);
}

function getNeighbors(emptyIndex) {
    const row = Math.floor(emptyIndex / size);
    const col = emptyIndex % size;
    const neighbors = [];

    if (row > 0) {
        neighbors.push(emptyIndex - size);
    }
    if (row < size - 1) {
        neighbors.push(emptyIndex + size);
    }
    if (col > 0) {
        neighbors.push(emptyIndex - 1);
    }
    if (col < size - 1) {
        neighbors.push(emptyIndex + 1);
    }
    return neighbors;
}

function shuffle() {
    tiles = goalState(size);
    let empty = tiles.indexOf(0);
    const steps = size === 3 ? 80 : 160;

    for (let i = 0; i < steps; i += 1) {
        const neighbors = getNeighbors(empty);
        const target = neighbors[Math.floor(Math.random() * neighbors.length)];
        [tiles[empty], tiles[target]] = [tiles[target], tiles[empty]];
        empty = target;
    }
}

function updateBoard() {
    document.getElementById("size-text").textContent = `${size}x${size}`;
    document.getElementById("moves").textContent = String(moves);
    document.getElementById("time").textContent = `${elapsed}s`;

    boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    boardEl.innerHTML = "";

    tiles.forEach((value, idx) => {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = `sp-tile${value === 0 ? " empty" : ""}`;
        tile.textContent = value === 0 ? "" : String(value);
        tile.addEventListener("click", () => onTileClick(idx));
        boardEl.appendChild(tile);
    });
}

function resetGame() {
    size = Number(sizeSelect.value);
    moves = 0;
    elapsed = 0;
    sessionStartedAt = new Date();
    hintEl.textContent = "将数字恢复为升序排列。";

    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(() => {
        elapsed += 1;
        document.getElementById("time").textContent = `${elapsed}s`;
    }, 1000);

    shuffle();
    updateBoard();
}

function onTileClick(index) {
    const empty = tiles.indexOf(0);
    if (!getNeighbors(empty).includes(index)) {
        return;
    }
    [tiles[empty], tiles[index]] = [tiles[index], tiles[empty]];
    moves += 1;
    updateBoard();

    if (isSolved(tiles)) {
        finish();
    }
}

function finish() {
    if (timer) {
        clearInterval(timer);
    }
    document.getElementById("result-moves").textContent = String(moves);
    document.getElementById("result-time").textContent = `${elapsed}s`;
    document.getElementById("result-size").textContent = `${size}x${size}`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "sliding-puzzle",
            gameName: "八/十五数码问题",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            metrics: {
                size,
                moves,
                timeSec: elapsed
            }
        });
    }

    resultModal.style.display = "flex";
}

function startGame() {
    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
    resetGame();
}

sizeSelect.addEventListener("change", resetGame);
document.getElementById("shuffle-btn").addEventListener("click", resetGame);

window.startGame = startGame;
