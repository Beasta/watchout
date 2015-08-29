// start slingin' some d3 here.

var gameSettings = {
  //time limit, etc.

  boardHeight: 600,
  boardWidth: 800,

  numberEnemies: 25,
  enemySize: 20,

  tickerCount: 0,
  difficultyLevel: 1,
  timeLimit: 120

};


//create array of ENEMIES

//we need to know where enemies get x and y property

var enemies = d3.range(gameSettings.numberEnemies).map(function() {
  return {
    radius: gameSettings.enemySize,
    personalXVector: Math.random()*2 - 1,
    personalYVector: Math.random()*2 - 1 
  };
});

//draw playspace as svg with a bunch of circles
var svg = d3.select("body").append("svg")
      .attr("width", gameSettings.boardWidth)
      .attr("height", gameSettings.boardHeight);

svg.selectAll("circle")
      .data(enemies)
      .enter().append("circle")
      .attr("r", function(d) { return d.radius; })
      .style({"fill": "orange"});
      //***** note: changed color to fixed value represented as style object instead of function


//create "force" layout
var force = d3.layout.force()
      .gravity(0.1)
      .charge(function(d, i) { return -1000; })
      .nodes(enemies)  //enemies get initialized to random x,y positions here by default
      .size([gameSettings.boardWidth, gameSettings.boardHeight]) // set the center of gravity
      .friction(0.70); 


//***** note came before svg.selectAll in example
force.start();

force.on("tick", function() {
//***** note: might need to pass an 'e'
  // var enemiesByLocation = d3.geom.quadtree(enemies);
  
  //serious coding goes here
  gameSettings.tickerCount++;

  enemies.forEach(function(enemy){
    // enemy.x += Math.random()*2 - 1;
    // enemy.y += Math.random()*2 - 1;
    if (enemy.x < -0.1*gameSettings.boardWidth) {
      enemy.personalXVector *= -1;
    }
    if (enemy.y < -0.1*gameSettings.boardHeight) {
      enemy.personalYVector *= -1;
    }
    if (enemy.x > gameSettings.boardWidth*1.1) {
      enemy.personalXVector *= -1;
    }
    if (enemy.y > gameSettings.boardWidth*1.1) {
      enemy.personalYVector *= -1;
    }
    enemy.x += enemy.personalXVector * gameSettings.difficultyLevel;
    enemy.y += enemy.personalYVector * gameSettings.difficultyLevel;
  });

  console.log("ticker", gameSettings.tickerCount);
  console.log("alpha", force.alpha());

  if (gameSettings.tickerCount > 200) {
    gameSettings.tickerCount = 0;
    gameSettings.difficultyLevel *= 1.2;
    // force.gravity(force.gravity()*-1);
    force.alpha(0.1);
  }

  svg.selectAll('circle')
    .attr('cx',function(d){return d.x; })
    .attr('cy',function(d){return d.y; });

});

