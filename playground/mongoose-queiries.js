const mongoose = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

const id = '5b6cecbf93c82d05f0c3dac8';
// if(!ObjectID.isValid(id)) {
//   console.log('ID is not valid');
// }

// Todo.find({
//   _id: id
// }).then( (todos) => {
//   console.log(todos);
// })
//
// Todo.findOne({
//   _id: id
// }).then( (todo) => {
//   console.log('Just one', todo);
// })
//
User.findById(id).then( (todo) => {
  if(!todo) {
    console.log('Id is not found');
  }
  console.log('Just id', todo);
}).catch( e=> {
  console.log(e);
})
