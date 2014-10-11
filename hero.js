/* 

  The only function that is required in this file is the "move" function

  You MUST export the move function, in order for your code to run
  So, at the bottom of this code, keep the line that says:

  module.exports = move;

  The "move" function must return "North", "South", "East", "West", or "Stay"
  (Anything else will be interpreted by the game as "Stay")
  
  The "move" function should accept two arguments that the website will be passing in: 
    - a "gameData" object which holds all information about the current state
      of the battle

    - a "helpers" object, which contains useful helper functions
      - check out the helpers.js file to see what is available to you

    (the details of these objects can be found on javascriptbattle.com/#rules)

  This file contains four example heroes that you can use as is, adapt, or
  take ideas from and implement your own version. Simply uncomment your desired
  hero and see what happens in tomorrow's battle!

  Such is the power of Javascript!!!

*/

//TL;DR: If you are new, just uncomment the 'move' function that you think sounds like fun!
//       (and comment out all the other move functions)


// // The "Northerner"
// // This hero will walk North.  Always.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   return 'North';
// };

// // The "Blind Man"
// // This hero will walk in a random direction each turn.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   var choices = ['North', 'South', 'East', 'West'];
//   return choices[Math.floor(Math.random()*4)];
// };

// // The "Priest"
// // This hero will heal nearby friendly champions.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 60) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestTeamMember(gameData);
//   }
// };

// // The "Unwise Assassin"
// // This hero will attempt to kill the closest enemy hero. No matter what.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 30) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestEnemy(gameData);
//   }
// };

// The "Careful Assassin"
// This hero will attempt to kill the closest weaker enemy hero.
/*
var move = function(gameData, helpers) {
  var myHero = gameData.activeHero;
  if (myHero.health < 50) {
    return helpers.findNearestHealthWell(gameData);
  } else {
    return helpers.findNearestWeakerEnemy(gameData);
  }
};
*/

var move = function(gameData, helpers) {
  var myHero = gameData.activeHero;
  var directions = ['North', 'East', 'South', 'West'];
  // TODO RANDOM POSSIBLE DIRECTION
  var random_direction = directions[Math.floor(Math.random()*4)];

  var adjacent_cells = new Array();
  adjacent_cells['North'] = helpers.getTileNearby(gameData.board, myHero.distanceFromTop, myHero.distanceFromLeft, 'North');
  adjacent_cells['East']  = helpers.getTileNearby(gameData.board, myHero.distanceFromTop, myHero.distanceFromLeft, 'East');
  adjacent_cells['South'] = helpers.getTileNearby(gameData.board, myHero.distanceFromTop, myHero.distanceFromLeft, 'South');
  adjacent_cells['West']  = helpers.getTileNearby(gameData.board, myHero.distanceFromTop, myHero.distanceFromLeft, 'West');
  
  var is_nonTeamDiamondMine = function (direction) {
    return (
      adjacent_cells[direction].type == 'DiamondMine' 
      && (
        typeof adjacent_cells[direction].owner === 'undefined' 
        || adjacent_cells[direction].owner.team !== myHero.team
      )
    );
  }
  
  var is_adjacent = function (cellType) {
    if (cellType == 'NonTeamDiamondMine') {
      cellType = 'DiamondMine';
      return (
           is_nonTeamDiamondMine('North')
        || is_nonTeamDiamondMine('East')
        || is_nonTeamDiamondMine('South')
        || is_nonTeamDiamondMine('West')
      );
    }
    return (
         (adjacent_cells['North'].type == cellType)
      || (adjacent_cells['East'].type == cellType)
      || (adjacent_cells['South'].type == cellType)
      || (adjacent_cells['West'].type == cellType)
    );
  }
  var adjacent_direction_for_type = function (cellType) {
    if (cellType == 'NonTeamDiamondMine') {
      cellType = 'DiamondMine';
      if        (is_nonTeamDiamondMine('North')) {
        return 'North';
      } else if (is_nonTeamDiamondMine('East')) {
        return 'East';
      } else if (is_nonTeamDiamondMine('South')) {
        return 'South';
      } else if (is_nonTeamDiamondMine('West')) {
        return 'West';
      } else {
        return undefined;
      }
    }

    if (adjacent_cells['North'].type == cellType) {
      return 'North';
    } else if (adjacent_cells['East'].type == cellType) {
      return 'East';
    } else if (adjacent_cells['South'].type == cellType) {
      return 'South';
    } else if (adjacent_cells['West'].type == cellType) {
      return 'West';
    } else {
      return undefined;
    }
  }
  //console.log('Adjacent HealthWell: ' + (is_adjacent('HealthWell') ? 'yes': 'no') );
  //console.log('Adjacent Hero: '       + (is_adjacent('Hero')       ? 'yes': 'no') );
  //console.log(adjacent_cells['North'].type);

  var direction = undefined;

  if (myHero.health < 70) {
    direction = helpers.findNearestHealthWell(gameData)
    //console.log("findNearestHealthWell: "+direction);
    
    // TODO STAY HUNGRY: IF NEAREST WEAKER ENEMY IS ADJACENT AND CAN BE SAFELY KILLED, DO IT
    // TODO STAY SAFE: IF THERE'S A STRONGER ENEMY BETWEEN ME AND THE WELL, LOOK FOR ANOTHER WELL
    
  } else {
    direction = helpers.findNearestWeakerEnemy(gameData);
    //console.log("findNearestWeakerEnemy: "+direction);
    
    // IF NO WEAKER ENEMY IS PRESENT, LOOK FOR EVERY ENEMY
    direction = helpers.findNearestEnemy(gameData); 
    console.log("IF NO WEAKER ENEMY IS PRESENT, LOOK FOR EVERY ENEMY!! " + direction);
    
    // TODO IF NO ACCESSIBLE ENEMY DO SOMETHING

    
    // TAKE ADJACENT NONTEAM DIAMONDMINE IF HEALTHY AND NOBODY AROUND
    if (myHero.health > 80 && is_adjacent('NonTeamDiamondMine') && !is_adjacent('Hero')) {
      direction = adjacent_direction_for_type('NonTeamDiamondMine');
      console.log("TAKE ADJACENT NONTEAM DIAMONDMINE IF HEALTHY AND NOBODY AROUND!! " + direction);
    } 
    // USE ADJACENT WELL IF NOT FULLY HEALTHY
    if (myHero.health < 80 && is_adjacent('HealthWell')) {
      direction = adjacent_direction_for_type('HealthWell');
      console.log("USE ADJACENT WELL IF NOT FULLY HEALTHY!! " + direction);
    } 
  }
  if (typeof direction === "undefined") {
    direction = random_direction;
    console.log("INVALID DIRECTION, GO RANDOM!! " + direction);
  }
  return direction;
};

/*
// // The "Safe Diamond Miner"
var move = function(gameData, helpers) {
  var myHero = gameData.activeHero;

  //Get stats on the nearest health well
  var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
    if (boardTile.type === 'HealthWell') {
      return true;
    }
  });
  var distanceToHealthWell = healthWellStats.distance;
  var directionToHealthWell = healthWellStats.direction;
  

  if (myHero.health < 40) {
    //Heal no matter what if low health
    return directionToHealthWell;
  } else if (myHero.health < 100 && distanceToHealthWell === 1) {
    //Heal if you aren't full health and are close to a health well already
    return directionToHealthWell;
  } else {
    //If healthy, go capture a diamond mine!
    return helpers.findNearestNonTeamDiamondMine(gameData);
  }
};
*/

// // The "Selfish Diamond Miner"
// // This hero will attempt to capture diamond mines (even those owned by teammates).
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;

//   //Get stats on the nearest health well
//   var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
//     if (boardTile.type === 'HealthWell') {
//       return true;
//     }
//   });

//   var distanceToHealthWell = healthWellStats.distance;
//   var directionToHealthWell = healthWellStats.direction;

//   if (myHero.health < 40) {
//     //Heal no matter what if low health
//     return directionToHealthWell;
//   } else if (myHero.health < 100 && distanceToHealthWell === 1) {
//     //Heal if you aren't full health and are close to a health well already
//     return directionToHealthWell;
//   } else {
//     //If healthy, go capture a diamond mine!
//     return helpers.findNearestUnownedDiamondMine(gameData);
//   }
// };

// // The "Coward"
// // This hero will try really hard not to die.
// var move = function(gameData, helpers) {
//   return helpers.findNearestHealthWell(gameData);
// }


// Export the move function here
module.exports = move;
