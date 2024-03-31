const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Your routes go here

let db;


app.listen(8080, function() {
    console.log('listening on 3000');
    const MongoClient = require('mongodb').MongoClient;
    console.log('connecting to DB');
    const uri = 'mongodb+srv://test:test@cluster0.3y4wxfh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const client = new MongoClient(uri);
    db = client.db('test');
    console.log('connected to DB');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // serve your HTML file here
});

app.get('/getUsers', (req, res) => {
    db.collection('users').find().toArray()
        .then(results => {
          res.render('users.ejs', { users: results });
        })
    .catch(error => console.error(error));
});

app.post('/submit_form', (req, res) => {
    db.collection('users').insertOne(req.body, (err,result) => {
        console.log(result)
        if (err) {
            return console.error(err);
        }
        else {
            res.redirect('/getUsers');
        }
    }).then(()=>{
        res.redirect('/getUsers');
    })
});