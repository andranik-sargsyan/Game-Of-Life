const board = document.getElementById("board");
const btnStart = document.getElementById("btn-start");

const sizes = {
    boardWidth: 35,
    boardHeight: 20,
    blockSize: 28
};

const game = {
    isStarted: false,
    speed: 50
};

board.style.width = `${(sizes.blockSize + 2) * sizes.boardWidth}px`;
board.style.height = `${(sizes.blockSize + 2) * sizes.boardHeight}px`;

for (let i = 0; i < sizes.boardHeight; i++) {
    for (let j = 0; j < sizes.boardWidth; j++) {
        const block = document.createElement("div");

        block.className = "block";
        block.dataset["i"] = i;
        block.dataset["j"] = j;
        block.addEventListener("click", e => {
            e.target.classList.toggle("live");
        });

        board.appendChild(block);
    }
}

btnStart.addEventListener("click", e => {
    game.isStarted = !game.isStarted;
    e.target.value = game.isStarted ? "Stop" : "Start";
});

function loop() {
    if (!game.isStarted) {
        return;
    }

    for (let block of board.children) {
        const i = +block.dataset["i"];
        const j = +block.dataset["j"];

        const query = `
            [data-i='${i - 1}'][data-j='${j - 1}'],
            [data-i='${i - 1}'][data-j='${j}'],
            [data-i='${i - 1}'][data-j='${j + 1}'],
            [data-i='${i}'][data-j='${j - 1}'],
            [data-i='${i}'][data-j='${j + 1}'],
            [data-i='${i + 1}'][data-j='${j - 1}'],
            [data-i='${i + 1}'][data-j='${j}'],
            [data-i='${i + 1}'][data-j='${j + 1}']
        `;

        const neighbors = Array.from(document.querySelectorAll(query));
        const liveNeighborCount = neighbors.filter(n => n.classList.contains("live")).length;

        if (block.classList.contains("live")) {
            if (liveNeighborCount < 2 || liveNeighborCount > 3) {
                block.classList.add("toggle");
            }
        }
        else {
            if (liveNeighborCount == 3) {
                block.classList.add("toggle");
            }
        }
    }

    for (let block of board.children) {
        if (!block.classList.contains("toggle")) {
            continue;
        }

        if (block.classList.contains("live")) {
            block.classList.remove("live");
        }
        else {
            block.classList.add("live");
        }

        block.classList.remove("toggle");
    }
}

setInterval(loop, 10000 / game.speed);
