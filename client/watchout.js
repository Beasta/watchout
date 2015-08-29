// start slingin' some d3 here.

var gameSettings = {
  //time limit, etc.

  boardHeight: 600,
  boardWidth: 800,

  numberCritters: 25,
  critterSize: 20,

  tickerCount: 0,
  difficultyLevel: 1,
  timeLimit: 120

};


//create array of ENEMIES

//we need to know where enemies get x and y property

var critters = d3.range(gameSettings.numberCritters).map(function() {
  return new Enemy(gameSettings.critterSize);
});

var playerOne = new Player(gameSettings.critterSize);
critters[0] = playerOne;

//draw playspace as svg with a bunch of circles
var svg = d3.select("body").append("svg")
      .attr("width", gameSettings.boardWidth)
      .attr("height", gameSettings.boardHeight);

svg.selectAll("circle")
      .data(critters)
      .enter().append("circle")
      .attr("r", function(d) { return d.radius; })
      .style("fill", function(d) { return d.colorCode; });
      //***** note: changed color to fixed value represented as style object instead of function


//create "force" layout
var force = d3.layout.force()
      .gravity(0.1)
      .charge(function(d, i) { return i ? -1000 : 500; })
      .nodes(critters)  //critters get initialized to random x,y positions here by default
      .size([gameSettings.boardWidth, gameSettings.boardHeight]) // set the center of gravity
      .friction(0.70); 


//***** note came before svg.selectAll in example
force.start();

force.on("tick", function() {
//***** note: might need to pass an 'e'
  var crittersByLocation = d3.geom.quadtree(critters);
  
  //move all critters
  critters.forEach(function(critter){
    critter.move();
  });

  //check player collision?  (TODO)
  if (!playerOne.ghostMode) {
    playerOne.currentScore += gameSettings.difficultyLevel;
    crittersByLocation.visit(collide(playerOne));
  }

  //update scoreboard
  d3.select("#collisionCount").text(playerOne.collisions);
  d3.select("#currentScore").text(Math.floor(playerOne.currentScore));
  d3.select("#highScore").text(Math.floor(playerOne.highScore));

  //periodically increment difficulty level and refresh force.alpha to keep things moving
  gameSettings.tickerCount++;
  if (gameSettings.tickerCount > 200) {
    gameSettings.tickerCount = 0;
    gameSettings.difficultyLevel *= 1.2;
    force.alpha(0.1);
  }

  //update circle locations
  svg.selectAll('circle')
    .attr('cx',function(d){return d.x; })
    .attr('cy',function(d){return d.y; });

});

svg.on('mousemove',function(){
  var mouseLoc = d3.mouse(this);
  playerOne.x = mouseLoc[0];
  playerOne.y = mouseLoc[1];
});

function collide(player) {
  var r = player.radius,
      nx1 = player.x - r, //establish box boundary around player
      nx2 = player.x + r,
      ny1 = player.y - r,
      ny2 = player.y + r;
  return function(enemy, x1, y1, x2, y2) {
    if (enemy.point && (enemy.point !== player)) {
      var x = player.x - enemy.point.x,
          y = player.y - enemy.point.y,
          l = Math.sqrt(x * x + y * y),
          r = player.radius + enemy.point.radius;
      if (l < r) {
        console.log("Ouch!");

        player.getHit();
        enemy.point.getHit();
        // svg.style("background-color", "red");
        d3.select("svg")
          .style("background-color", "red")
          // .data(["white"])
          .transition().duration(500)
          .style("background-color", "white" );
     
        // l = (l - r) / l * .5;s
        // node.x -= x *= l;
        // node.y -= y *= l;
        // quad.point.x += x;
        // quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}
