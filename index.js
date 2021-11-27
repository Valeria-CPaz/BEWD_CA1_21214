// imports
//express for server and routes
const express = require('express');
//bodyParser for x-www-urlencoded (html form like) variables
const bodyParser = require('body-parser');
// defining the actual app to handle the requests (e.g. push, get, etc.)
const app = express();
const port = 3000;
// require the driver to connect to the database
const mongoose = require('mongoose');
// require the class constructor from different file
const Games = require('./games.js');

//make the app use the bodyParser
app.use(bodyParser.urlencoded({extended:false}));

//API ROUTES
//show all games from the db using GET request
app.get('/games', (req, res) => {
   //find all games in the db and store it in a varible 'result'
   //use the model created in the games.js to get all game entries from the db
  Games.find((err, games) => {
    //in case there is an error with the Games model, we we will send it to the game(postman)
    if(err){
      res.send("Error occured, no games retrieved");
      return;
    }
    //if no error send the array conting games to the user/postman
    res.send(games);
    //log the result in the console as well
    console.log(games);
  })
  
});

// FIND ONE BY ID, using a GET REQUEST and A PARAMETER (id)
app.get('/games/:id', (req, res) => {
  const id = req.params.id;

  Games.findById(id, (err, games) => {
    if(err) {
      res.send("Game not found");
      return;
    }
    res.send(games);
    console.log(games);
  })
})

//insert request using POST to add a user into the database
app.post('/games', (req, res) =>{
  console.log("Inserting a game in the database");

  let isAvailable = false;
  if(req.body.isAvailable === 'true') {
    isAvailable = true;
  }

  let games = new Games({
    year: parseInt(req.body.year), //Number
    name: req.body.name, //String
    studio: req.body.studio, //String
    isAvailable: isAvailable //Boolean
  });

  //inserting a game and checking to see if any errors occured
  games.save(err => {
    if(err) {
      // if error send a message to let the user know
      res.send(`Game not inserted into the database, error is: ${err}`)
      //return to be used in order to not send to res.send and crash the program
      return;
    }
    //send a message to the user with the result
    res.send("Game inserted into the database");
    console.log("Game is in the database");
  })
  //if return runs, code will start from here
  return;
  
});

// PUT request to update or modify one game from the db
app.put('/game/:id', (req, res) => {
  console.log("Trying to edit game");
  console.log(parseInt(req.body.year));

  Games.findOneAndUpdate({id: req.params.id}, {
    year: ((parseInt(req.body.year) == NaN) ? 0 : parseInt(req.body.year)),
    name: req.body.name,
    studio: req.body.studio,
    isAvailable:(req.body.isAvailable === 'true')
  }, err => {
    if(err) {
      res.send("it didn't edit. The error is: " + err);
      return;
    }
    res.send("It did edit");
  })
});

//delete request using DELETE and a PARAMETER (id)
app.delete('/games/:id', (req, res) =>{
 
  Games.findOneAndDelete({id: req.params.id}, err => {
    if(err) {
      res.send("Game not deleted");
      return;
    }
    res.send("Game deleted");
    console.log(`Game with id ${req.params.id} is now deleted`);
    // console.log("Game with id "+req.params.id + "is now deleted");
  })
});

//start the server
app.listen(port, () => {
  mongoose.connect('mongodb+srv://21214:21214@gamesapi.rqg6r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').
  catch(error => console.log(error));

  console.log(`Example app listening at http://localhost:${port}`);
});

