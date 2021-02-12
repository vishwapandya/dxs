var bgImage, bg;
var ground, groundImage;
var car, car1, car2, car3, car4, car5, car6, car7, car8, car9, car10, car11, car12;
var obstacle1, obstacle2;
var coinImage, fuelImage;
var obstacleGroup, coinGroup, fuelGroup;
var invisibleground;
var play = 1;
var end = 0;
var gameState = play;
var battery, batteryImage;
var l1, l2, l3;
var gameOver, gameOverImage, restartButton, restartButtonImage;
var batteryFullSound, gameOverSound, carSound;
var score, coin;


function preload(){
  bgImage = loadImage("sky.jpg");
  groundImage = loadImage("ground2.png");
  car1 = loadImage("car1-removebg-preview.png");
  car2 = loadImage("car2-removebg-preview.png");
  car3 = loadImage("car3-removebg-preview.png");
  car4 = loadImage("car4-removebg-preview.png");
  car5 = loadImage("car5-removebg-preview.png");
  car6 = loadImage("car6-removebg-preview.png");
  car7 = loadImage("car7-removebg-preview.png");
  car8 = loadImage("car8-removebg-preview.png");
  car9 = loadImage("car9-removebg-preview.png");
  car10 = loadImage("car10-removebg-preview.png");
  car11 = loadImage("car11-removebg-preview.png");
  car12 = loadImage("car12-removebg-preview.png");
  obstacle1 = loadImage("obstacle1-removebg-preview.png");
  obstacle2 = loadImage("obstacle2-removebg-preview.png");
  coinImage = loadImage("coin-removebg-preview.png");
  fuelImage = loadImage("fuel_tank-removebg-preview.png");
  batteryImage = loadImage("battery_-removebg-preview.png");
  gameOverImage = loadImage("game_over-removebg-preview.png");
  restartButtonImage = loadImage("restart_button-removebg-preview.png");
  batteryFullSound = loadSound("carstartgarage.mp3");
  gameOverSound = loadSound("gameOver.wav");
  carSound = loadSound("formula+1.mp3");
}
function setup() {
  createCanvas(1500,720);
  bg = createSprite(700,450);
  bg.addImage(bgImage);

  ground = createSprite(1000,700,4000,200);
  ground.addImage(groundImage);
  ground.scale = 3.6;
  ground.velocityX = -7;

  invisibleground = createSprite(90,650,500,20);
  invisibleground.visible = false;

  battery = createSprite(150,150,50,50);
  battery.addImage(batteryImage);
  battery.scale = 0.4;

  l1 = createSprite(150,100,80,40);
  l1.shapeColor = "green";
  l2 = createSprite(150,155,80,40);
  l2.shapeColor = "green";
  l3 = createSprite(150,210,80,40);
  l3.shapeColor = "green";

  gameOver = createSprite(750,325,20,20);
  gameOver.addImage(gameOverImage);

  restartButton = createSprite(750,425,20,20);
  restartButton.addImage(restartButtonImage);
  restartButton.scale = 0.15;

  spawnCar();

  obstacleGroup = createGroup();
  coinGroup = createGroup();
  fuelGroup = createGroup();

  score = 0;
  coin = 0;
}

function draw() {
  background("black");
  
  if(gameState === play){

    gameOver.visible = false;
    restartButton.visible = false;

    score = score + Math.round(getFrameRate()/60);

    if(ground.x < 0){
      ground.x = ground.width/2;
    }
  
    spawnObstacles();
    spawnCoins();
    spawnFuel();
  
    
    car.velocityY = car.velocityY + 0.8;
    car.collide(invisibleground);
    // text for score, car touching the coins and fuel, car touching obstacles, the fuel bar
    for(var i = 0; i<coinGroup.length; i++){
    if(coinGroup.get(i).isTouching(car)){
      coinGroup.get(i).destroy();
      coin = coin + 1;
    }
  }
    for(var i = 0; i<fuelGroup.length; i++){
    if(fuelGroup.get(i).isTouching(car) && l1.visible === false && l2.visible === false){
      fuelGroup.get(i).destroy();
      l1.visible = true;
      l2.visible = true;
      l2.shapeColor = "green";
      l3.shapeColor = "green";
    }
  }

    if(frameCount% 300 === 0){
      l1.visible = false;
      // l2.shapeColor = "yellow";
      // l3.shapeColor = "yellow";
    }

    if(frameCount % 400 === 0){
      l2.visible = false;
      l3.shapeColor = "red";
    }

    if(frameCount % 500 === 0){
      if(Touching(car,fuelGroup)){
        l3.visible = false;
        gameState = end;
      }
    }

    if(obstacleGroup.isTouching(car)) {
      gameState = end;
    }
  }
  else if (gameState === end){
     // ground stopping, coins fuels obstacles stopping
     gameOver.visible = true;
     restartButton.visible = true;
     bg.visible = false;
     ground.visible = false;
     coinGroup.destroyEach();
     fuelGroup.destroyEach();
     obstacleGroup.destroyEach();
     car.visible = false;
     battery.visible = false;
     l1.visible = false;
     l2.visible = false;
     l3.visible = false;
    
     obstacleGroup.setLifetimeEach(-1);
     coinGroup.setLifetimeEach(-1);
     fuelGroup.setLifetimeEach(-1);
     
     obstacleGroup.setVelocityXEach(0);
     coinGroup.setVelocityXEach(0);
     fuelGroup.setVelocityXEach(0);   
  }

  if(mousePressedOver(restartButton)&& gameState === end) {
    reset();
  }

  drawSprites();

  if(keyDown("space") && car.y>= 420){
    car.velocityY = -16;
  }

  textSize(50);
  text(mouseX + "," + mouseY, mouseX, mouseY);
  
  fill(rgb(92,17,37));
  text("Coins: "+ coin, 1150,100);
  
  fill(rgb(92,17,37));
  text("Distance travelled: "+ score + "m", 500,100);
}
// make score according to framecount, find images to display gameover, find sounds for the game, 
//after ending the game when it restarts, score should be 0, game over image should be invisible, you can add restart button