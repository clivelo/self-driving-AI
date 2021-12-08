class Sensor {
  
  constructor(x, y, angle, offset) {
    this.x = x;
    this.y = y;
    this.offset = offset;
    this.angle = angle - this.offset;
    this.poi = null;
    this.V = null;
    this.d = 1000;
    this.initV();
    this.intersect();
  }
  
  show(best) {
    push();
    translate(this.x, this.y);
    if (best) {
      stroke(0, 0, 200, 150);
    } else {
      stroke(0, 0, 200, 10);
    }
    line(0, 0, this.v.x, this.v.y);
    
    if (best) {
      if (this.poi != null) {
        stroke(255, 0, 0, 150);
        strokeWeight(5);
        point(this.poi[0] - this.x, this.poi[1] - this.y);
      }
    }
    pop();
  }
  
  intersect() {
    var pois = new Array(walls.length);
    for (var i = 0; i < walls.length; i++) {
      var w = walls[i];
      var x1 = w.p1.x;
      var y1 = w.p1.y;
      var x2 = w.p2.x;
      var y2 = w.p2.y;

      var x3 = this.x;
      var y3 = this.y;
      var x4 = this.x + this.v.x;
      var y4 = this.y + this.v.y;

      var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / 
          ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
      var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / 
          ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
      
      if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        pois[i] = [x1 + uA * (x2 - x1), y1 + uA * (y2 - y1)];
      } else {
        pois[i] = null;
      }
    }
    this.findClosestPoi(pois);
  }
  
  findClosestPoi(pois) {
    var idx = 0;
    var minDist = Infinity;
    if (pois.every(ele => ele === null)) {
      this.poi = null;
    } else {
      for (var i = 0; i < pois.length; i++) {
        if (pois[i] != null) {
          var d = dist(this.x, this.y, pois[i][0], pois[i][1]);
          if (d < minDist) {
            minDist = d;
            idx = i;
          }
        }
      }
      this.poi = pois[idx];
    }
    this.setV();
  }
  
  initV() {
    this.v = p5.Vector.fromAngle(this.angle, 1000);
  }
  
  setV() {
    if (this.poi == null) {
      this.v = p5.Vector.fromAngle(this.angle, 1000);
    } else {
      this.d = dist(this.poi[0], this.poi[1], this.x, this.y);
      this.v = p5.Vector.fromAngle(this.angle, this.d);
    }
  }
  
}