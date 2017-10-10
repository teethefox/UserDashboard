// Require the Express Module
var express = require('express');
var path = require('path');

// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');
var FoxSchema = new mongoose.Schema({
    name: String,
    age: String,
    funfact: String,
   })
   // We are setting this Schema in our Models as 'User'
   var Fox = mongoose.model('foxes', FoxSchema) // We are retrieving this Schema from our Models, named 'User'
   

app.use(bodyParser.urlencoded({ extended: true }));
// Require path
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
    Fox.find({}, function(err, results){
        if(err) { console.log(err); }    
        res.render('index', {foxes: results})
})
})
app.get('/foxes/:id', function(req, res){
    Fox.find({ _id: req.params.id }, function(err, results) {
      if (err) { console.log(err); }
      res.render('show', { foxes: results });
    })
  })
  
app.get('/new', function(req, res){
    Fox.find({}, function(err, results){
        if(err) {console.log(err)}
    
      
  res.render('new')
    })  
})
// Add User Request 
app.post('/foxes', function(req, res) {
    console.log("POST DATA", req.body);
    Fox.create(req.body, function(err, results){
        if(err) { console.log(err); }

    // This is where we would add the user from req.body to the database.
    res.redirect('/');
})
})
app.get('/foxes/edit/:id', function(req,res){
Fox.find({_id:req.params.id}, function(err, results){
if(err){console.log(err)}
res.render('edit',{ foxes:results[0]})
})
})
app.post('/foxes/update/:id', function(req,res){
    Fox.update({ _id: req.params.id }, req.body, function(err, result){
        if (err) { console.log(err); }
        res.redirect('/');
    })
    })

app.post('/foxes/destroy/:id', function(req, res){
    console.log('die');
    Fox.remove({_id:req.params.id}, function(req, err){
        if(err){console.log(err);}
        res.redirect('/')
    })
})
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});
// GET '/' Displays all of the mongooses.
// GET '/mongooses/:id' Displays information about one mongoose.
// GET '/mongooses/new' Displays a form for making a new mongoose.
// POST '/mongooses' Should be the action attribute for the form in the above route (GET '/mongooses/new').
// GET '/mongooses/edit/:id' Should show a form to edit an existing mongoose.
// POST '/mongooses/:id' Should be the action attribute for the form in the above route (GET '/mongooses/edit/:id').
//POST '/mongooses/destroy/:id' Should delete the mongoose from the database by ID