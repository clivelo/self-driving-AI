class Car {
  constructor(x, y, model) {
    this.x = x;
    this.y = y;
    this.w = 12;
    this.h = 18;
    this.acc = 0;
    this.vel = 0;
    this.steer = 0;
    this.angle = 0;
    this.maxSpeed = 5;

    // Boolean attributes
    this.isForward = true;
    this.collided = false;
    this.best = false;

    // Car vertices & walls
    this.verts = Array(4);
    this.initVerts();
    this.walls = Array(4);
    this.initWalls();

    // Car sensors
    this.sensors = Array(20);
    this.ds = Array(20);
    this.initSensors();
    
    // Aesthetics stuff
    this.glassW = 6;
    this.glassH = 5;
    this.tireW = 3;
    this.tireH = 7;
    
    // Race-related attributes
    this.lap = 0;
    this.lapC = 0;
    this.score = 50;
    this.timeScore = -0.5;
    this.checkpointScore = 100;
    this.checkpointTargets = [];
    for (var c = 0; c < checkpoints.length; c++) {
      this.checkpointTargets.push(-1)
    }
    this.checkpointTargets[0] = 0;
    this.checkpointTargets[1] = 1;
    
    this.model = getModel();
    if (model) {
      this.model.setWeights(model.getWeights());
    }
  }

  // Initialize vertices of car
  initVerts() {
    this.verts[0] = createVector(
      // Back-left
      this.x - (this.w / 2) * cos(this.angle) - (this.h / 2) * sin(this.angle),
      this.y - (this.w / 2) * sin(this.angle) + (this.h / 2) * cos(this.angle)
    );
    this.verts[1] = createVector(
      // Back-right
      this.x + (this.w / 2) * cos(this.angle) - (this.h / 2) * sin(this.angle),
      this.y + (this.w / 2) * sin(this.angle) + (this.h / 2) * cos(this.angle)
    );
    this.verts[2] = createVector(
      // Front-right
      this.x + (this.w / 2) * cos(this.angle) + (this.h / 2) * sin(this.angle),
      this.y + (this.w / 2) * sin(this.angle) - (this.h / 2) * cos(this.angle)
    );
    this.verts[3] = createVector(
      // Front-left
      this.x - (this.w / 2) * cos(this.angle) + (this.h / 2) * sin(this.angle),
      this.y - (this.w / 2) * sin(this.angle) - (this.h / 2) * cos(this.angle)
    );
  }

  // Initialize vertices of car walls
  initWalls() {
    this.walls[0] = new Wall(this.verts[3], this.verts[2]); // Top wall
    this.walls[1] = new Wall(this.verts[0], this.verts[1]); // Bottom wall
    this.walls[2] = new Wall(this.verts[3], this.verts[0]); // Left wall
    this.walls[3] = new Wall(this.verts[2], this.verts[1]); // Right wall
  }

  // Initialize car sensors
  initSensors() {
    // this.sensors[0] = new Sensor(this.x, this.y, this.angle, PI / 2);
    // this.sensors[1] = new Sensor(this.x, this.y, this.angle, PI / 2 - 0.25)
    // this.sensors[2] = new Sensor(this.x, this.y, this.angle, PI / 2 + 0.25)
    // this.sensors[3] = new Sensor(this.x, this.y, this.angle, PI / 2 - 0.5)
    // this.sensors[4] = new Sensor(this.x, this.y, this.angle, PI / 2 + 0.5)
    // this.sensors[5] = new Sensor(this.x, this.y, this.angle, PI / 2 - 0.75)
    // this.sensors[6] = new Sensor(this.x, this.y, this.angle, PI / 2 + 0.75)
    // this.sensors[7] = new Sensor(this.x, this.y, this.angle, PI)
    // this.sensors[8] = new Sensor(this.x, this.y, this.angle, PI + 0.25)
    // this.sensors[9] = new Sensor(this.x, this.y, this.angle, PI + 0.5)
    // this.sensors[10] = new Sensor(this.x, this.y, this.angle, PI + 0.75)
    // this.sensors[11] = new Sensor(this.x, this.y, this.angle, 0)
    // this.sensors[12] = new Sensor(this.x, this.y, this.angle, 0 - 0.25)
    // this.sensors[13] = new Sensor(this.x, this.y, this.angle, 0 - 0.5)
    // this.sensors[14] = new Sensor(this.x, this.y, this.angle, 0 - 0.75)
    // this.sensors[15] = new Sensor(this.x, this.y, this.angle, -PI / 2)
    
    for (var s = 0; s < this.sensors.length; s++) {
      this.sensors[s] = new Sensor(this.x, this.y, this.angle, TWO_PI / this.sensors.length * s)
      this.ds[s] = this.sensors[s].d;
    }
  }
  
  show() {
    fill(255);
    noStroke();
    rectMode(CENTER);

    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Car body
    if (this.best) {
      fill(255, 215, 0);
    } else {
      fill(200, 0, 0);
    }
    rect(0, 0, this.w, this.h);

    // Car window
    fill(0, 150, 200);
    rect(0, -this.h / 3, this.glassW, this.glassH);

    // Car tires
    fill(100);
    rect(-this.w / 2, -this.h / 3 - 2, this.tireW, this.tireH);
    rect(this.w / 2, -this.h / 3 - 2, this.tireW, this.tireH);
    rect(-this.w / 2, this.h / 3 + 2, this.tireW, this.tireH);
    rect(this.w / 2, this.h / 3 + 2, this.tireW, this.tireH);
    pop();
    
    // Sensors
    push();
    for (var s = 0; s < this.sensors.length; s++) {
      this.sensors[s].show(this.best);
    }
    pop();
  }

  move() {
    if (!this.collided) {
      this.vel += this.acc;
      this.angle += this.steer;
      this.y += this.vel * cos(this.angle);
      this.x -= this.vel * sin(this.angle);

      this.updateVerts();
      this.updateWalls();
      this.updateSensors();
      this.checkCheckpoint();
      this.updateScore(this.timeScore);
      this.checkDeath();
    }
  }

  updateVerts() {
    this.verts[0].x =
      this.x - (this.w / 2) * cos(this.angle) - (this.h / 2) * sin(this.angle);
    this.verts[1].x =
      this.x + (this.w / 2) * cos(this.angle) - (this.h / 2) * sin(this.angle);
    this.verts[2].x =
      this.x + (this.w / 2) * cos(this.angle) + (this.h / 2) * sin(this.angle);
    this.verts[3].x =
      this.x - (this.w / 2) * cos(this.angle) + (this.h / 2) * sin(this.angle);

    this.verts[0].y =
      this.y - (this.w / 2) * sin(this.angle) + (this.h / 2) * cos(this.angle);
    this.verts[1].y =
      this.y + (this.w / 2) * sin(this.angle) + (this.h / 2) * cos(this.angle);
    this.verts[2].y =
      this.y + (this.w / 2) * sin(this.angle) - (this.h / 2) * cos(this.angle);
    this.verts[3].y =
      this.y - (this.w / 2) * sin(this.angle) - (this.h / 2) * cos(this.angle);
  }

  updateWalls() {
    this.walls[0].p1 = this.verts[3];
    this.walls[0].p2 = this.verts[2]; // Top wall
    this.walls[1].p1 = this.verts[0];
    this.walls[1].p2 = this.verts[1]; // Bottom wall
    this.walls[2].p1 = this.verts[3];
    this.walls[2].p2 = this.verts[0]; // Left wall
    this.walls[3].p1 = this.verts[2];
    this.walls[3].p2 = this.verts[1]; // Right wall
  }

  updateSensors() {
    for (var s = 0; s < this.sensors.length; s++) {
      this.sensors[s].x = this.x;
      this.sensors[s].y = this.y;
      this.sensors[s].angle = this.angle - this.sensors[s].offset;
      this.sensors[s].initV();
      this.sensors[s].intersect();
      
      this.ds[s] = this.sensors[s].d;
    }
  }
  
  // Set top speed of the car
  checkLimit() {
    if (abs(this.vel) > this.maxSpeed) {
      this.vel = (this.vel / abs(this.vel)) * this.maxSpeed;
    }
  }

  checkCollision(walls) {
    for (var i = 0; i < walls.length; i++) {
      var w = walls[i];
      var x1 = w.p1.x;
      var y1 = w.p1.y;
      var x2 = w.p2.x;
      var y2 = w.p2.y;
      for (var cw = 0; cw < this.walls.length; cw++) {
        var carWall = this.walls[cw];
        var x3 = carWall.p1.x;
        var y3 = carWall.p1.y;
        var x4 = carWall.p2.x;
        var y4 = carWall.p2.y;

        var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / 
            ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / 
            ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
          this.collided = true;
          
          // Add score based on distance from previous checkpoint
          var idx = this.checkpointTargets.indexOf(0);
          var d = dist(checkpoints[idx].midPt.x, checkpoints[idx].midPt.y, 
                       this.x, this.y) / 4;
          this.score += d;
          
          // Add score based on distance from next checkpoint
          var idx = this.checkpointTargets.indexOf(1);
          var d = dist(checkpoints[idx].midPt.x, checkpoints[idx].midPt.y, 
                       this.x, this.y) / 4;
          this.score -= d;
          return;
        }
      }
    }
  }
  
  checkCheckpoint() {
    for (var c = 0; c < checkpoints.length; c++) {
      var ch = checkpoints[c];
      var x1 = ch.p1.x;
      var y1 = ch.p1.y;
      var x2 = ch.p2.x;
      var y2 = ch.p2.y;
      for (var cw = 0; cw < this.walls.length; cw++) {
        var carWall = this.walls[cw];
        var x3 = carWall.p1.x;
        var y3 = carWall.p1.y;
        var x4 = carWall.p2.x;
        var y4 = carWall.p2.y;
        
        var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / 
            ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / 
            ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
          if (this.checkpointTargets[c] == -1) {
            this.collided = true;
            return;
          } else if (this.checkpointTargets[c] == 1) {
            this.updateScore(this.checkpointScore);
            var shift = this.checkpointTargets.pop();
            this.checkpointTargets.unshift(shift);
            this.lapC += 1;
            if (this.lapC == this.checkpointTargets.length) {
              this.lap++;
              this.lapC = 0;
            }
            return;
          }
        }
      }
    }
  }
  
  updateScore(change) {
    this.score += change;
  }
  
  checkDeath() {
    if (this.score <= 0) {
      this.collided = true;
    }
  }
  
}
