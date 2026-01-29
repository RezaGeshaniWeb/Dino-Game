const gameArea = document.getElementById('game')
const dino = document.getElementById('dino')
const gameOverText = document.getElementById('game_over')
const restartBtn = document.getElementById('restartBtn')

let isGameOver = false

const dinoSize = 100
const catuSize = 50

dino.style.width = dinoSize + 'px'
dino.style.height = dinoSize + 'px'

const ground = window.innerHeight / 2 - dinoSize / 2

let dinoY = 0
let veloCity = 0
const gravity = 0.6
const jumbVelocity = 15

let lastTime = null

function gameLoop(timestamp) {
    if (isGameOver) return

    if (!lastTime) {
        lastTime = timestamp
    }

    const deltaTime = (timestamp - lastTime) / 16.67

    lastTime = timestamp

    veloCity -= gravity * deltaTime

    dinoY += veloCity * deltaTime

    if (dinoY < 0) {
        dinoY = 0
        veloCity = 0
    }

    dino.style.bottom = (ground + dinoY) + 'px'
    requestAnimationFrame(gameLoop)
}
requestAnimationFrame(gameLoop)

let jumpKeyPressed = false

document.addEventListener('keydown', (e) => {
    if (isGameOver) return

    if (e.code === 'Space' && !jumpKeyPressed) {
        veloCity = jumbVelocity
        jumpKeyPressed = true
    }
})

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        jumpKeyPressed = false
    }
})

function createObstacle() {
    if (isGameOver) return
    const obstacle = document.createElement('img')
    obstacle.src = 'img/cactus.png'
    obstacle.classList.add('obstacle')

    obstacle.style.width = catuSize + 'px'
    obstacle.style.height = catuSize + 'px'
    obstacle.style.bottom = (window.innerHeight / 2 - catuSize / 2) + 'px'

    gameArea.appendChild(obstacle)

    let obstacleX = window.innerWidth

    obstacle.style.left = obstacleX + 'px'

    const obstacleInerval = setInterval(() => {
        if (isGameOver) {
            clearInterval(obstacleInerval)
            return
        }
        obstacleX -= 5
        obstacle.style.left = obstacleX + 'px'

        const dinoRect = dino.getBoundingClientRect()
        const obstacleRect = obstacle.getBoundingClientRect()

        if (
            dinoRect.right > obstacleRect.left &&
            dinoRect.left < obstacleRect.right &&
            dinoRect.bottom > obstacleRect.top &&
            dinoRect.top < obstacleRect.bottom
        ) {
            gameOver()
            clearInterval(obstacleInerval)
        }

        if (obstacleX < -catuSize) {
            clearInterval(obstacleInerval)
            if (obstacle.parentNode) {
                obstacle.parentNode.removeChild(obstacle)
            }
        }
    }, 20)

    const randomTime = Math.random() * 800 + 200
    setTimeout(createObstacle, randomTime)
}

createObstacle()

function gameOver() {
    isGameOver = true
    gameOverText.style.display = 'block'
    restartBtn.style.display = 'block'
}


restartBtn.addEventListener('click', restartGame)

function restartGame() {
    isGameOver = false
    dinoY = 0
    veloCity = 0
    lastTime = null

    gameOverText.style.display = 'none'
    restartBtn.style.display = 'none'

    const obstacles = document.querySelectorAll('.obstacle')
    obstacles.forEach(ob => ob.remove())

    requestAnimationFrame(gameLoop)
    createObstacle()
}
