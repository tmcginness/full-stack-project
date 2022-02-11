const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
    coin: {
        type: String,
        required: true,
        uppercase: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    transactionType: {
        type: String,
        enum: ['BUY', 'SELL'],
        uppercase: true,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
})

const coinCollection = mongoose.model('Coin', coinSchema);

module.exports = coinCollection;