let gameE1 = document.querySelector('.game'),
    doodleE1 = document.querySelector('.doodler'),
    scoreE1 = document.querySelector('.score'),
    startScreenE1 = document.querySelector('.start-screen'),
    startButtonE1 = document.getElementById('start-button'),
    startPoint, doodleBottom, doodleLeft,
    platformCount = 5,
    isGameOver = false,
    isJumping = true,
    isGoingLeft = false,
    isGoingRight = false,
    platforms = [],
    score = 0,
    upTime, downTime, leftTime, rightTime,
    movePlatformInterval;

class Platform {
    constructor(newPlatformBottom) {
        this.bottom = newPlatformBottom;
        this.left = Math.random() * 280;
        this.visual = document.createElement('div');
        let visual = this.visual;
        visual.classList.add('platform');
        visual.style.bottom = this.bottom + 'px';
        visual.style.left = this.left + 'px';
        gameE1.appendChild(visual);
    }
}

function createPlatforms() {
    platforms.forEach(platform => gameE1.removeChild(platform.visual));
    platforms = [];  
    for (let i = 0; i < platformCount; i++) {
        let platformGap = 600 / platformCount;
        let platformBottom = platformGap * i + 60;
        let newPlatform = new Platform(platformBottom);
        platforms.push(newPlatform);
    }
}

function movePlatforms() {
    if (doodleBottom > 200) {
        platforms.forEach(platform => {
            platform.bottom -= 2; 
            let visual = platform.visual;
            if (platform.bottom < -20) {
                platform.bottom = 620;
                platform.left = Math.random() * 280;
                score++;
                updateScore();  
            }
            visual.style.bottom = platform.bottom + 'px';
            visual.style.left = platform.left + 'px';
        });
    }
}

function updateScore() {
    scoreE1.innerText = `Score: ${score}`;
}

function jump() {
    isJumping = true;
    upTime = setInterval(() => {
        doodleBottom += 20;
        doodleE1.style.bottom = doodleBottom + 'px';
        if (doodleBottom > startPoint + 200) {
            fall();
        }
    }, 30);
}

function fall() {
    clearInterval(upTime);
    isJumping = false;
    downTime = setInterval(() => {
        doodleBottom -= 5;
        doodleE1.style.bottom = doodleBottom + 'px';
        if (doodleBottom < 0) gameOver();
        platforms.forEach(platform => {
            if (
                (doodleBottom >= platform.bottom) &&
                (doodleBottom <= (platform.bottom + 20)) &&
                ((doodleLeft + 60) >= platform.left) &&
                (doodleLeft <= (platform.left + 120)) &&
                !isJumping
            ) {
                clearInterval(upTime);
                clearInterval(downTime);
                startPoint = doodleBottom;
                jump();
            }
        });
    }, 30);
}

function moveDoodle(e) {
    if (e.key === 'ArrowLeft') moveLeft();
    if (e.key === 'ArrowRight') moveRight();
}

function moveLeft() {
    doodleE1.classList.add('flip');
    if (isGoingRight) {
        clearInterval(rightTime);
        isGoingRight = false;
    }
    isGoingLeft = true;
    leftTime = setInterval(() => {
        if (doodleLeft >= 0) {
            doodleLeft -= 10; 
            doodleE1.style.left = doodleLeft + 'px';
        } else clearInterval(leftTime);
    }, 20);
}

function moveRight() {
    doodleE1.classList.remove('flip');
    if (isGoingLeft) {
        clearInterval(leftTime);
        isGoingLeft = false;
    }
    isGoingRight = true;
    rightTime = setInterval(() => {
        if (doodleLeft <= 330) {
            doodleLeft += 10;  
            doodleE1.style.left = doodleLeft + 'px';
        } else clearInterval(rightTime);
    }, 20);
}

function gameOver() {
    clearInterval(upTime);
    clearInterval(downTime);
    clearInterval(movePlatformInterval);
    isGameOver = true;
    setTimeout(() => {
        alert(`Game over! Your score is ${score}`);
        resetGame();
    }, 100);
}

function resetGame() {
    platforms.forEach(platform => gameE1.removeChild(platform.visual));
    platforms = [];
    score = 0;
    updateScore(); 
    isGameOver = false;
    startGame(); 
}

function startGame() {
    startScreenE1.style.display = 'none';  
    gameE1.style.display = 'block';        
    scoreE1.style.display = 'block';       
    startPoint = 150;  
    doodleBottom = startPoint;
    doodleLeft = 165;  
    doodleE1.style.bottom = doodleBottom + 'px';
    doodleE1.style.left = doodleLeft + 'px';
    gameE1.appendChild(doodleE1);  
    createPlatforms();  
    movePlatformInterval = setInterval(movePlatforms, 20);
    jump();
}


startButtonE1.addEventListener('click', startGame);

window.addEventListener('keydown', moveDoodle);
window.addEventListener('keyup', () => {
    clearInterval(leftTime);
    clearInterval(rightTime);
});
