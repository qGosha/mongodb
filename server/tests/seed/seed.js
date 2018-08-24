const {ObjectID} = require('mongodb');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const dummuUsers = [{
  _id: userOneId,
  email: '123@123.com',
  password: '123456',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }],
},
{
  _id: userTwoId,
  email: 'abc@abc.com',
  password: '123456',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];


const dummuTodos = [{
  _id: new ObjectID(),
  text: 'first test todos',
  _creator:userOneId
},
{
  _id: new ObjectID(),
  text: 'SEcond text todos',
  completed: true,
  comletedAt:'333',
  _creator:userTwoId
}];



const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(dummuTodos);
  }).then(() => done())
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(dummuUsers[0]).save();
    var userTwo = new User(dummuUsers[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};


module.exports = {dummuTodos, populateTodos, populateUsers, dummuUsers};
