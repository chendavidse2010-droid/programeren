const canvas = document.getElementById("snakeCanvas");
const scoreDisplay = document.getElementById("snake-score");

if (canvas) {
    const ctx = canvas.getContext("2d");
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameInterval;

    // Luister naar pijltjestoetsen om de slang te besturen
    document.addEventListener("keydown", changeDirection);

    function startGame() {
        gameInterval = setInterval(gameLoop, 150); // Eventueel hier je snelheid aangepast (bijv. 150)
    }

    function gameLoop() {
        moveSnake();
        if (isGameOver()) {
            alert("Game Over! Je score was: " + score);
            resetGame();
            return;
        }
        clearCanvas();
        drawGrid(); // <--- HIER wordt het grid getekend!
        drawFood();
        drawSnake();
    }

    function clearCanvas() {
        ctx.fillStyle = "#121212";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // HIER kun je de drawGrid functie neerzetten:
    function drawGrid() {
        ctx.strokeStyle = "rgba(200, 200, 200, 0.1)"; // Heel lichtgrijs en subtiel doorzichtig
        ctx.lineWidth = 0.5;

        for (let i = 0; i < tileCount; i++) {
            // Verticale lijnen
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();

            // Horizontale lijnen
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
    }

    function drawSnake() {
        snake.forEach((part, index) => {
            if (index === 0) {
                // De kop van de slang krijgt een afwijkende, heldere kleur
                ctx.fillStyle = "#3a85ff";
            } else {
                // De staart wordt geleidelijk donkerder naarmate hij langer is
                let shade = Math.max(0.2, 1 - (index / snake.length) * 0.7);
                ctx.fillStyle = `rgba(77, 166, 255, ${shade})`;
            }
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
        });

        // Richtingaanwijzer (oogjes op de kop die meekijken met de besturing)
        const head = snake[0];
        ctx.fillStyle = "#000000"; // Zwarte oogjes
        let hx = head.x * gridSize;
        let hy = head.y * gridSize;

        let eye1X = hx + 4,
            eye1Y = hy + 4;
        let eye2X = hx + 12,
            eye2Y = hy + 4;

        // Pas de positie van de oogjes aan op basis van de beweegrichting
        if (dx === 1) {
            // Naar rechts
            eye1X = hx + 11;
            eye1Y = hy + 4;
            eye2X = hx + 11;
            eye2Y = hy + 12;
        } else if (dx === -1) {
            // Naar links
            eye1X = hx + 4;
            eye1Y = hy + 4;
            eye2X = hx + 4;
            eye2Y = hy + 12;
        } else if (dy === -1) {
            // Omhoog
            eye1X = hx + 4;
            eye1Y = hy + 4;
            eye2X = hx + 12;
            eye1Y = hy + 4;
        } else if (dy === 1) {
            // Omlaag
            eye1X = hx + 4;
            eye1Y = hy + 11;
            eye2X = hx + 12;
            eye2Y = hy + 11;
        }

        ctx.fillRect(eye1X, eye1Y, 3, 3);
        ctx.fillRect(eye2X, eye2Y, 3, 3);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // 1. Voeg hier de screen wrap toe (voordat de kop wordt toegevoegd)
        if (head.x < 0) {
            head.x = tileCount - 1;
        } else if (head.x >= tileCount) {
            head.x = 0;
        }

        if (head.y < 0) {
            head.y = tileCount - 1;
        } else if (head.y >= tileCount) {
            head.y = 0;
        }

        // 2. Pas daarna pas toevoegen aan de slang
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = score;
            generateFood();
        } else {
            snake.pop();
        }
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);

        snake.forEach((part) => {
            if (part.x === food.x && part.y === food.y) {
                generateFood();
            }
        });
    }

    function drawFood() {
        ctx.fillStyle = "#ff4d4d";
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    function changeDirection(event) {
        if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", " "].includes(event.key)) {
            event.preventDefault();
        }

        const keyPressed = event.keyCode;
        const LEFT = 37,
            UP = 38,
            RIGHT = 39,
            DOWN = 40;

        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingRight = dx === 1;
        const goingLeft = dx === -1;

        if (keyPressed === LEFT && !goingRight) {
            dx = -1;
            dy = 0;
        }
        if (keyPressed === UP && !goingDown) {
            dx = 0;
            dy = -1;
        }
        if (keyPressed === RIGHT && !goingLeft) {
            dx = 1;
            dy = 0;
        }
        if (keyPressed === DOWN && !goingUp) {
            dx = 0;
            dy = 1;
        }
    }

    function isGameOver() {
        const head = snake[0];

        let hitSelf = false;
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                hitSelf = true;
            }
        }
        return hitSelf; // Alleen game over als je in je eigen staart bijt
    }

    function resetGame() {
        clearInterval(gameInterval);
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
        scoreDisplay.textContent = score;
        generateFood();
        startGame();
    }

    generateFood();
    startGame();
}