var Enemy = function(radius) {
  this.radius = radius;
  this.personalXVector = Math.random()*2 - 1;
  this.personalYVector = Math.random()*2 - 1;
  this.colorCode = "orange";
};

Enemy.prototype = Object.create(Critter.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.move = function() {
  //if out of boundaries, turn around
  if (this.x < -0.1*gameSettings.boardWidth) {
    this.personalXVector *= -1;
  }
  if (this.y < -0.1*gameSettings.boardHeight) {
    this.personalYVector *= -1;
  }
  if (this.x > gameSettings.boardWidth*1.1) {
    this.personalXVector *= -1;
  }
  if (this.y > gameSettings.boardWidth*1.1) {
    this.personalYVector *= -1;
  }
  //move, accelerating with game difficulty level
  this.x += this.personalXVector * gameSettings.difficultyLevel;
  this.y += this.personalYVector * gameSettings.difficultyLevel;
};

Enemy.prototype.getHit = function() {
  this.personalXVector *= -1;
  this.personalYVector *= -1;
};