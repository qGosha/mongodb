const mongoose = require('mongoose');
// const mongoser = 'mongodb://admin:416342wQ@ds119662.mlab.com:19662/appdb';
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
// mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };
