var initX = 130;
var initY = 350;
var acc = 0.5;
var steer = 0.06;
let walls = [];
let checkpoints = [];
var numCar = 70;
var cars = Array(numCar);

var lap = 0;
var generation = 1;
var mutationRate = 0.15;
var mutationAmt;

var bestOfEachGeneration = [];

function setup() {
  createCanvas(1000, 700);
  frameRate(120);
  initCheckpoints();
  initCars();
  buildWalls();
  setMutation();
}

// Create cars
function initCars() {
  for (var c = 0; c < numCar; c++) {
    cars[c] = new Car(initX, initY);
  }
}

// Build the track
function buildWalls() {
  walls.push(new Wall(createVector(70, 300), createVector(90, 100)));
  walls.push(new Wall(createVector(90, 100), createVector(250, 80)));
  walls.push(new Wall(createVector(250, 80), createVector(500, 100)));
  walls.push(new Wall(createVector(500, 100), createVector(680, 130)));
  walls.push(new Wall(createVector(680, 130), createVector(700, 200)));
  walls.push(new Wall(createVector(700, 200), createVector(670, 340)));
  walls.push(new Wall(createVector(670, 340), createVector(610, 340)));
  walls.push(new Wall(createVector(610, 340), createVector(520, 320)));
  walls.push(new Wall(createVector(520, 320), createVector(340, 300)));
  walls.push(new Wall(createVector(340, 300), createVector(320, 410)));
  walls.push(new Wall(createVector(320, 410), createVector(330, 460)));
  walls.push(new Wall(createVector(330, 460), createVector(420, 440)));
  walls.push(new Wall(createVector(420, 440), createVector(580, 450)));
  walls.push(new Wall(createVector(580, 450), createVector(800, 410)));
  walls.push(new Wall(createVector(800, 410), createVector(830, 460)));
  walls.push(new Wall(createVector(830, 460), createVector(820, 630)));
  walls.push(new Wall(createVector(820, 630), createVector(650, 650)));
  walls.push(new Wall(createVector(650, 650), createVector(400, 670)));
  walls.push(new Wall(createVector(400, 670), createVector(210, 660)));
  walls.push(new Wall(createVector(210, 660), createVector(50, 620)));
  walls.push(new Wall(createVector(50, 620), createVector(70, 300)));

  walls.push(new Wall(createVector(200, 300), createVector(210, 190)));
  walls.push(new Wall(createVector(210, 190), createVector(250, 180)));
  walls.push(new Wall(createVector(250, 180), createVector(500, 190)));
  walls.push(new Wall(createVector(500, 190), createVector(580, 200)));
  walls.push(new Wall(createVector(580, 200), createVector(570, 230)));
  walls.push(new Wall(createVector(570, 230), createVector(250, 220)));
  walls.push(new Wall(createVector(250, 220), createVector(240, 370)));
  walls.push(new Wall(createVector(240, 370), createVector(240, 540)));
  walls.push(new Wall(createVector(240, 540), createVector(330, 550)));
  walls.push(new Wall(createVector(330, 550), createVector(580, 540)));
  walls.push(new Wall(createVector(580, 540), createVector(720, 520)));
  walls.push(new Wall(createVector(720, 520), createVector(710, 540)));
  walls.push(new Wall(createVector(710, 540), createVector(450, 550)));
  walls.push(new Wall(createVector(450, 550), createVector(240, 570)));
  walls.push(new Wall(createVector(240, 570), createVector(170, 550)));
  walls.push(new Wall(createVector(170, 550), createVector(200, 300)));
}

function initCheckpoints() {
  checkpoints.push(new Wall(createVector(68, 330), createVector(196, 330)));
  checkpoints.push(new Wall(createVector(79, 203), createVector(210, 203)));
  checkpoints.push(new Wall(createVector(258, 80), createVector(258, 181)));
  checkpoints.push(new Wall(createVector(490, 98), createVector(490, 190)));
  checkpoints.push(new Wall(createVector(575, 215), createVector(697, 215)));
  checkpoints.push(new Wall(createVector(490, 227), createVector(490, 317)));
  checkpoints.push(new Wall(createVector(244, 320), createVector(337, 320)));
  checkpoints.push(new Wall(createVector(240, 450), createVector(327, 450)));
  checkpoints.push(new Wall(createVector(420, 438), createVector(420, 546)));
  checkpoints.push(new Wall(createVector(711, 425), createVector(711, 520)));
  checkpoints.push(new Wall(createVector(642, 542), createVector(642, 651)));
  checkpoints.push(new Wall(createVector(305, 564), createVector(305, 665)));
  checkpoints.push(new Wall(createVector(56, 513), createVector(176, 513)));
}

function setMutation() {
  mutationAmt = 0.2 / (generation / 300);
}

function draw() {
  background(200);
  noStroke();
  // console.log(mouseX, mouseY);

  // Text display
  push();
  noStroke();
  fill(0);
  textSize(14);
  text("Lap finished: " + str(lap), 820, 30);
  text("Generation: " + str(generation), 820, 50);
  text("Mutation rate: " + str(mutationRate), 820, 70);
  text("Mutate by: +/-" + str(mutationAmt), 820, 90);
  pop();

  // Paint track
  push();
  fill(255);
  beginShape();
  for (var w = 0; w < 21; w++) {
    vertex(walls[w].p1.x, walls[w].p1.y);
  }
  endShape();
  pop();

  // Unpaint track inner area
  push();
  fill(200);
  beginShape();
  for (var w = 21; w < walls.length; w++) {
    vertex(walls[w].p1.x, walls[w].p1.y);
  }
  endShape();
  pop();

  // Start and finish line and checkpoints
  push();
  strokeWeight(3);
  stroke(0, 200, 0);
  checkpoints[0].show();
  for (var c = 1; c < checkpoints.length; c++) {
    stroke(220, 220, 0);
    checkpoints[c].show();
  }
  pop();

  // Car action
  var countCollided = 0;
  for (var c = 0; c < numCar; c++) {
    if (cars[c].collided) {
      countCollided++;
    } else {
      cars[c].show();
      cars[c].move();
      cars[c].checkLimit();
      cars[c].checkCollision(walls);
      autoMove(cars[c]);
    }
  }

  // Check if all cars have collided
  if (countCollided == cars.length) {
    fits = getAllFitness();
    idx = selectParents(fits, 1);
    bestParent = cars[idx[0]];
    bestOfEachGeneration.push(bestParent);
    if (idx != 0) {
      // bestParent.model.save("downloads://model-" + generation);
    }
    nextGen(bestParent.model);
    for (var c = 1; c < cars.length; c++) {
      mutateChild(cars[c].model, mutationRate, mutateFunction);
    }
    generation++;
    setMutation();
    lap = bestParent.lap;
  }
}

function keyPressed() {
  switch (keyCode) {
    case 32:
      reset();
      generation = 1;
      break;
  }
}

function reset() {
  initCars();
}

function autoMove(car) {
  var move = predict(car.model, car.ds);
  move = move.indexOf(Math.max(...move));
  switch (move) {
    case 0:
      car.acc = -acc;
      car.maxSpeed = 5;
      car.isForward = true;
      break;
    case 1:
      car.acc = acc;
      car.maxSpeed = 3;
      car.isForward = false;
      break;
    case 2:
      if (car.isForward) {
        car.steer = -steer;
      } else {
        car.steer = steer;
      }
      break;
    case 3:
      if (car.isForward) {
        car.steer = steer;
      } else {
        car.steer = -steer;
      }
      break;
  }
}

function getAllFitness() {
  var fits = [];
  for (var c = 0; c < numCar; c++) {
    fits.push(cars[c].score);
  }
  return fits;
}

function nextGen(model) {
  for (var c = 0; c < numCar; c++) {
    cars[c] = new Car(initX, initY, model);
  }
  cars[0].best = true;
}

function mutateFunction(val) {
  return val + random(-mutationAmt, mutationAmt);
}
