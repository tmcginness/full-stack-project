//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();
const db = mongoose.connection;
require('dotenv').config()
const Coin = require('./models/coins.js');
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({
    extended: false
})); // extended: false - does not allow nested objects in query strings
app.use(express.json()); // returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method')); // allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
//localhost:3000
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });


app.put('/:id', (req, res) => {
    Coin.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    }, (err, updatedModel) => {
        res.redirect('/');
    });
});



app.delete('/:id', (req, res) => {
    Coin.findByIdAndRemove(req.params.id, (error, data) => {
        res.redirect('/')
    })
    // res.send('deleting.....')
})


app.get('/new', (req, res) => {
    res.render('new.ejs');
})





app.get('/:id/edit', (req, res) => {
    Coin.findById(req.params.id, (err, foundTransaction) => {
        res.render('edit.ejs', {
            coin: foundTransaction
        });
    });
});


app.get('/coin/:coin', (req, res) => {
    Coin.find({
        coin: req.params.coin
    }, (error, allCoins) => {
        res.render(
            'coin.ejs', {
                coin: allCoins
            }
        )
    })
})



app.get('/all', (req, res) => {
    Coin.find({}, (error, allCoins) => {
        res.render(
            'all.ejs', {
                transactions: allCoins
            }
        )
    }).sort({
        date: -1
    })
})


app.get('/:id', (req, res) => {
    Coin.findById(req.params.id, (err, foundCoin) => {
        if (err) {
            res.send('error')
        } else {
            res.render('show.ejs', {
                coin: foundCoin
            })
        }
    })
})


app.get('/', (req, res) => {
    Coin.find({}, (err, allCoins) => {
        Coin.distinct("coin", (error, yourCoins) => {
            res.render(
                'index.ejs', {
                    transactions: yourCoins,
                    all: allCoins
                }
            )

        })
    }).sort({
        date: -1
    })
})



app.post('/', (req, res) => {

    Coin.create(req.body), (err, createdTransaction) => {
        // res.send(createdFruit);
        res.send(req.body);
    }
    res.redirect('/');
})



//___________________
//Listener
//___________________
app.listen(PORT, () => console.log('Listening on port:', PORT));