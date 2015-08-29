var Player = function(radius) {
  this.radius = radius;
  this.colorCode = "green";
  this.collisions = 0;
  this.ghostMode = false;
  this.timeUntilRevival = 0;
  this.currentScore = 0;
  this.highScore = 0;
};

Player.prototype = Object.create(Critter.prototype);
Player.prototype.constructor = Player;

Player.prototype.move = function() {
  if (this.timeUntilRevival > 0) {
    this.timeUntilRevival--;
  }
  else {
    this.ghostMode = false;
  }
  this.x = this.px;
  this.y = this.py;
};

Player.prototype.getHit = function() {
  this.collisions++;
  if (this.currentScore > this.highScore) {
    this.highScore = this.currentScore;
  }
  this.currentScore = 0;
  gameSettings.difficultyLevel = 1;
  this.ghostMode = true;
  this.timeUntilRevival = 50;


};