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

// ==========================================
// SPIDERHECK WEBSITE MODE (WASD + Web Slingeren)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("grapple-mode-btn");
    if (!toggleBtn) return;

    let active = false;
    let canvas, ctx;
    let player = { x: 100, y: 100, vx: 0, vy: 0, hooked: false, hookX: 0, hookY: 0, grounded: false };
    let targets = [];
    let mouse = { x: 0, y: 0 };
    let keys = { w: false, a: false, s: false, d: false };

    toggleBtn.addEventListener("click", () => {
        active = !active;
        if (active) {
            toggleBtn.textContent = "🕷️ Sluit SpiderHeck Mode";
            startSpiderHeck();
        } else {
            toggleBtn.textContent = "🎮 Activeer Grappling Mode";
            stopSpiderHeck();
        }
    });

    function startSpiderHeck() {
        canvas = document.createElement("canvas");
        canvas.id = "grappler-canvas";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");

        player.x = window.innerWidth / 2;
        player.y = window.scrollY + 100;
        player.vx = 0;
        player.vy = 0;
        player.hooked = false;

        updateTargets();

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        requestAnimationFrame(gameLoop);
    }

    function stopSpiderHeck() {
        if (canvas) canvas.remove();
        window.removeEventListener("resize", resizeCanvas);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
    }

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        updateTargets();
    }

    function updateTargets() {
        targets = [];
        const elements = document.querySelectorAll("h1, h2, h3, p, .intro, .tekst-kolom");
        elements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                targets.push({
                    left: rect.left,
                    right: rect.right,
                    top: rect.top + window.scrollY,
                    bottom: rect.bottom + window.scrollY,
                    x: rect.left + rect.width / 2,
                    y: rect.top + window.scrollY + rect.height / 2,
                });
            }
        });
    }

    function onMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY + window.scrollY;
    }

    function onMouseDown() {
        if (!active) return;
        let closest = null;
        let minDist = 400;

        targets.forEach((t) => {
            let dist = Math.hypot(t.x - mouse.x, t.y - mouse.y);
            if (dist < minDist) {
                minDist = dist;
                closest = t;
            }
        });

        if (closest) {
            player.hooked = true;
            player.hookX = closest.x;
            player.hookY = closest.top;
            player.grounded = false;
        }
    }

    function onMouseUp() {
        player.hooked = false;
    }

    function onKeyDown(e) {
        if (!active) return;
        if (["KeyW", "KeyA", "KeyS", "KeyD", "Space"].includes(e.code)) e.preventDefault();
        if (e.code === "KeyA" || e.code === "ArrowLeft") keys.a = true;
        if (e.code === "KeyD" || e.code === "ArrowRight") keys.d = true;
        if ((e.code === "KeyW" || e.code === "ArrowUp" || e.code === "Space") && player.grounded) {
            player.vy = -8;
            player.grounded = false;
        }
    }

    function onKeyUp(e) {
        if (!active) return;
        if (e.code === "KeyA" || e.code === "ArrowLeft") keys.a = false;
        if (e.code === "KeyD" || e.code === "ArrowRight") keys.d = false;
    }

    function gameLoop() {
        if (!active) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Besturing links/rechts
        if (keys.a) player.vx -= 0.7;
        if (keys.d) player.vx += 0.7;

        // Fysica / Zwaartekracht
        if (!player.grounded) {
            player.vy += 0.45;
            player.vx *= 0.99;
            player.vy *= 0.99;
        } else {
            player.vx *= 0.75;
        }

        // Web sling-kracht (gebalanceerd zodat het beheersbaar blijft)
        if (player.hooked) {
            let dx = player.hookX - player.x;
            let dy = player.hookY - player.y;
            let dist = Math.hypot(dx, dy);

            if (dist > 10) {
                let pullStrength = 0.00002 * dist;
                player.vx += dx * pullStrength;
                player.vy += dy * pullStrength;
                player.grounded = false;
            }

            // Web-draad blijft zichtbaar zolang de muis ingedrukt is
            ctx.strokeStyle = "#00ffff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(player.x, player.y - window.scrollY);
            ctx.lineTo(player.hookX, player.hookY - window.scrollY);
            ctx.stroke();
        }

        player.x += player.vx;
        player.y += player.vy;

        // Botsing met tekstblokken (web blijft intact tot muis losgelaten wordt)
        player.grounded = false;
        targets.forEach((t) => {
            if (player.x >= t.left - 5 && player.x <= t.right + 5) {
                let prevY = player.y - player.vy;
                if (prevY <= t.top && player.y >= t.top && player.vy >= 0) {
                    player.y = t.top;
                    player.vy = 0;
                    player.grounded = true;
                }
            }
        });

        // Schermgrenzen
        if (player.x < 15) {
            player.x = 15;
            player.vx *= -0.5;
        }
        if (player.x > window.innerWidth - 15) {
            player.x = window.innerWidth - 15;
            player.vx *= -0.5;
        }

        let maxDocHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        if (player.y > maxDocHeight - 20) {
            player.y = maxDocHeight - 20;
            player.vy = 0;
            player.grounded = true;
        }

        // Rustig meescrollen met het poppetje
        let screenY = player.y - window.scrollY;
        if (screenY > window.innerHeight - 150) {
            window.scrollBy(0, 10);
        } else if (screenY < 150 && window.scrollY > 0) {
            window.scrollBy(0, -10);
        }

        // --- RENDER SPIDERHECK SPIDER ---
        let renderY = player.y - window.scrollY;

        ctx.fillStyle = "#ff3366";
        ctx.beginPath();
        ctx.arc(player.x, renderY - 12, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffff00";
        ctx.fillRect(player.x - 4, renderY - 16, 2, 3);
        ctx.fillRect(player.x + 2, renderY - 16, 2, 3);

        ctx.strokeStyle = "#ff3366";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(player.x, renderY - 12);
        ctx.lineTo(player.x - 14, renderY - 4 + Math.sin(Date.now() * 0.02) * 6);
        ctx.moveTo(player.x, renderY - 12);
        ctx.lineTo(player.x + 14, renderY - 4 - Math.sin(Date.now() * 0.02) * 6);
        ctx.stroke();

        requestAnimationFrame(gameLoop);
    }
});
