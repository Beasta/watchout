var Critter = function(radius) {
  this.radius = radius;
  this.x;
  this.y;
};

Critter.prototype.constructor = Critter;

Critter.prototype.move = function() {
  console.log("Ah got no legs, man!");
};

Critter.prototype.getHit = function() {
  console.log("That ain't cool, man!");
};