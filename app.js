const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const score = document.querySelector('.score');


player = {speed:5}
keys = {ArrowUp:false, ArrowDown:false, ArrowRight:false, ArrowLeft:false}

document.addEventListener("keydown", (e)=>{
    e.preventDefault();
    keys[e.key] = true;
})
document.addEventListener("keyup", (e)=>{
    e.preventDefault();
    keys[e.key] = false;
})

const animLines = () =>{
    let lines = document.querySelectorAll(".lines");
    lines.forEach(item=>{
        if(item.y >= 110){
            item.y -= 120
        }
        item.y += player.speed*0.1730103806228374;
        item.style.top = item.y + "vh";
    })
}

const carCollide = (a, b) =>{
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !((aRect.bottom < bRect.top) || (aRect.top > bRect.bottom) || (aRect.left > bRect.right) || (aRect.right < bRect.left))
}

const endGame = () =>{
    let highscores = localStorage.getItem("highscores");
    if(highscores==null){
        highscores = [0];
    }else{
        highscores = JSON.parse(highscores);
    }
    player.start = false;
    player.speed = 5;
    startScreen.innerHTML = `Game Over <br> Your Final Score is ${player.score} <br> press here to restart the game.`
    startScreen.classList.remove('hide');
    if(player.score>highscores){
        highscores[0]=player.score
    }
    localStorage.setItem("highscores", JSON.stringify(highscores));
}

const enemyCar = (car) =>{
    let enemy = document.querySelectorAll(".enemy");
    enemy.forEach(item=>{
        if (carCollide(item, car)){
            endGame();
        }
        if(item.y >= 110){
            item.y -= 120
            item.style.left = Math.floor(Math.random()*26) + "vw";
        }
        item.y += player.speed*0.1730103806228374;
        item.style.top = item.y + "vh";
    })
}



const gamePlay = () =>{
    let highscores = localStorage.getItem("highscores");
    if(highscores==null){
        highscores = [0];
    }else{
        highscores = JSON.parse(highscores);
    }
    let dimensions = gameArea.getBoundingClientRect();
    let car = document.querySelector('.car');
    let cardem = car.getBoundingClientRect();
    if (player.start){
        animLines();
        enemyCar(car);
        if((keys.ArrowUp || keys.w) && player.y > cardem.height){player.y -= player.speed;}
        if((keys.ArrowDown || keys.s) && player.y < (dimensions.bottom-cardem.height)){player.y += player.speed;}
        if((keys.ArrowLeft || keys.a) && player.x > 5){player.x -= player.speed;}
        if((keys.ArrowRight || keys.d) && player.x < (dimensions.width-cardem.width-20)){player.x += player.speed;}
        car.style.top = player.y + "px";
        car.style.left = player.x + "px";
        console.log(dimensions, cardem);
        window.requestAnimationFrame(gamePlay);
        player.score++;
        player.speed += 0.001;
        if(highscores[0]==0){
            score.innerHTML = `Score: ${player.score-1}`
        }else{
            score.innerHTML = `Score: ${player.score-1}<br>Highest Score: ${highscores[0]}`
        }
    }else{
        if(highscores[0]==0){
            score.innerHTML = `Game Over!<br>Your Score was ${player.score-1}`;
        }else{
            score.innerHTML = `Game Over!<br>Your Score was ${player.score-1}<br>Highest Score: ${highscores[0]}`;
        }
    }
}

const start = () =>{
    startScreen.classList.add('hide');
    gameArea.innerHTML = "";
    player.start = true;
    player.score = 0;
    window.requestAnimationFrame(gamePlay);
    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    gameArea.appendChild(car);
    player.y = car.offsetTop;
    player.x = car.offsetLeft;
    for(x=0; x<5; x++){
        let roadLine = document.createElement("div");
        roadLine.setAttribute("class", "lines");
        roadLine.y = (x*24)
        roadLine.style.top = roadLine.y + "vh";
        gameArea.appendChild(roadLine);
    }
    for(x=0; x<3; x++){
        let enemy = document.createElement("div");
        enemy.setAttribute("class", "enemy");
        enemy.y = -(x*40)
        enemy.style.top = enemy.y + "vh";
        enemy.style.background = "blue";
        enemy.style.left = Math.floor(Math.random()*26) + "vw";
        gameArea.appendChild(enemy);
    }
}

startScreen.addEventListener("click", start);
