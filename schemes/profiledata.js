const mongoose = require('mongoose')

const profile = mongoose.Schema({
    id : String,
    account : String
})

module.exports = mongoose.model("Profile", profile)