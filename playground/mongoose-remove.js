const mongoose = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

const id = '5b707373cb4ef613cccb05eb';

//
// Todo.remove({}).then( (result) => {
//   console.log(result);
// })

Todo.findByIdAndRemove(id).then( (todo) => {
  console.log(todo);
})
