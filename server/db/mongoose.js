const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI || 'mongodb://admin:416342wQ@ds119662.mlab.com:19662/appdb');

module.exports = { mongoose };
