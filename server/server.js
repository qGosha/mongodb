require('./config/config.js')

const bcrypt = require('bcryptjs');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {auth} = require('./middleware/auth')
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

//USERS
app.post('/users', (req, res) => {
  const userData = _.pick(req.body, ['email', 'password']);
  const user = new User(userData);
  user.save().then(() => {
    return user.generateAuthToken();
   }).then( token => {
     res.header('x-auth', token).send(user);
   }).catch( e => {
    res.status(400).send(e);
   });
});


app.get('/users/me', auth, (req,res) => {
 res.send(req.user);
})

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', auth, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
})

// TODOS
app.post('/todos', auth, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then((doc) => {
   res.send(doc);
  }, e => {
   res.status(400).send(e);
  });
});

app.get('/todos', auth, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos})
  });
}, e => {
  res.status(400).send(e);
});

app.get('/todos/:id', auth, (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(400).send();
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send({message: 'ID NOT FOUND'});
    }
    res.status(200).send({todo});
  }).catch( e => {
    res.status(400).send(e);
  })
})


app.delete('/todos/:id', auth, (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send({message: 'ID NOT FOUND'});
    }
    res.status(200).send({todo});
  }).catch( e => {
    res.status(404).send();
  })
})

app.patch('/todos/:id', auth, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);
  if(!ObjectID.isValid(id)) {
    return res.status(400).send();
  }
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send({message: 'ID NOT FOUND'});
    }
    res.status(200).send({todo});
  }).catch( e => {
    res.status(400).send();
  })
})



app.listen(port, () => {
  console.log('started on port ' + port)
});

module.exports = {app};
