const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {dummuTodos, populateTodos, dummuUsers, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);
//USERS
describe('GET /users/me', () => {
  it('should return user if authecate', done => {
    request(app)
     .get('/users/me')
     .set('x-auth', dummuUsers[0].tokens[0].token)
     .expect(200)
     .expect( res => {
       expect(res.body._id).toBe(dummuUsers[0]._id.toHexString())
       expect(res.body.email).toBe(dummuUsers[0].email);
     })
     .end(done);
  })
});

describe('GET /users/me', () => {
  it('should return 401 if not authecate', done => {
    request(app)
     .get('/users/me')
     .expect(401)
     .expect( res => {
       expect(res.body).toEqual({});
     })
     .end(done);
  })
});


describe('POST /users/', () => {

  it('should create a user', done => {
    var email = 'qwerty@qwer.yu';
    var password = '123456';
    request(app)
     .post('/users')
     .send({email, password})
     .expect(200)
     .expect( res => {
       expect(res.headers['x-auth']).toBeTruthy();
       expect(res.body._id).toBeTruthy();
       expect(res.body.email).toBe(email);
     })
     .end( err => {
       if(err) return done();
       User.findOne({email}).then(user => {
         expect(user).toBeTruthy();
         expect(user.password === password).toBeFalsy();
         done();
       }).catch( e => done(e));
     });
  })
  it('should return a validation eerror if dtata is invalid', done => {
    var email = '23@';
    var password = '1234';
    request(app)
     .post('/users')
     .send({email, password})
     .expect(400)
     .end(done);
  })
  it('should not create a user if email in use', done => {
    var email = dummuUsers[0].email;
    var password = '123456';
    request(app)
     .post('/users')
     .send({email, password})
     .expect(400)
     .end(done);
  })
});


describe('POST /users/login', () => {

  it('should login user and return auth token', done => {
    var email = dummuUsers[0].email;
    var password = dummuUsers[0].password;
    request(app)
     .post('/users/login')
     .send({email, password})
     .expect(200)
     .expect( res => {
       expect(res.headers['x-auth']).toBeTruthy();
     })
     .end( (err, res) => {
       if(err) return done();
       User.findById(dummuUsers[0]._id).then(user => {
         expect(user.toObject().tokens[1]).toMatchObject({
           access: 'auth',
           token: res.header['x-auth']
         })
         done();
       }).catch( e => done(e));
     });
  })
  it('should reject invalid credentials', done => {
    var email = dummuUsers[0].email;
    var password = '1234567676';
    request(app)
     .post('/users/login')
     .send({email, password})
     .expect(400)
     .expect( res => {
       expect(res.headers['x-auth']).toBeFalsy();
     })
     .end( (err, res) => {
       if(err) return done();
       User.findById(dummuUsers[0]._id).then(user => {
         expect(user.tokens.length).toBe(1);
         done();
       }).catch( e => done(e));
     });
     })
});


describe('DELETE /users/me/token', () => {

  it('should remove token', done => {
    var id = dummuUsers[0]._id;
    var email = dummuUsers[0].email;
    var token = dummuUsers[0].tokens[0].token;
    request(app)
     .delete('/users/me/token')
     .set('x-auth', token)
     .expect(200)
     .end( err => {
       if(err) return done();
       User.findById(id).then(user => {
         expect(user.tokens.length).toBe(0);
         done();
       }).catch( e => done(e));
     });
  })
});

//TODOS
describe('POST /todos', () => {
  it('should create a new todo', done => {
    const text = 'Test todo';

    request(app)
     .post('/todos')
     .set('x-auth', dummuUsers[0].tokens[0].token)
     .send({text})
     .expect(200)
     .expect((res) => {
       expect(res.body.text).toBe(text);
     })
     .end((err,res) => {
       if(err) {
         return done(err);
       }
       Todo.find({text}).then(todos => {
         expect(todos.length).toBe(1);
         expect(todos[0].text).toBe(text);
         done();
       }).catch(e => done(e))
     })
  });

  it('should not create todo with invalid data', done => {
    request(app)
     .post('/todos')
     .set('x-auth', dummuUsers[0].tokens[0].token)
     .send({})
     .expect(400)
     .end((err, res) => {
       if(err) {
         return done(err);
       }
       Todo.find().then((todos) => {
         expect(todos.length).toBe(2);
         done();
       }).catch(e => done(e))
     })
  })
})

describe('GET /todos', () => {
  it('should get some todos', done => {
    request(app)
     .get('/todos')
     .set('x-auth', dummuUsers[0].tokens[0].token)
     .expect(200)
     .expect( res => {
       expect(res.body.todos.length).toBe(1);
     })
     .end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should get todos by id and return it', done => {
    const id = dummuTodos[0]._id.toHexString();
    request(app)
     .get('/todos/' + id)
     .set('x-auth', dummuUsers[0].tokens[0].token)
     .expect(200)
     .expect( res => {
       expect(res.body.todo.text).toBe(dummuTodos[0].text);
     })
     .end(done);
  })

  it('should not return todo created by other user', done => {
    const id = new ObjectID().toHexString();
    debugger;
    request(app)
     .get('/todos/' + id)
     .set('x-auth', dummuUsers[0].tokens[0].token)
     .expect(404)
     .end(done);
  })

  it('should return 404 id id not found ', done => {
    const id = new ObjectID().toHexString();
    request(app)
     .get('/todos/' + id)
     .set('x-auth', dummuUsers[0].tokens[0].token)
     .expect(404)
     .end(done);
  })

  it('should return 400 if bad id ', done => {
    const id = '123';
    request(app)
     .get('/todos/' + id)
     .set('x-auth', dummuUsers[0].tokens[0].token)
     .expect(400)
     .end(done);
  })
})


describe('DELETE /todos/:id', () => {
  it('should DELETE todos by id and return it', done => {
    const id = dummuTodos[1]._id.toHexString();
    request(app)
     .delete('/todos/' + id)
     .set('x-auth', dummuUsers[1].tokens[0].token)
     .expect(200)
     .expect( res => {
       expect(res.body.todo._id).toBe(id);
     })
     .end((err, res) => {
       if(err) {
         return done(err);
       }
       Todo.findById(id).then((todos) => {
         expect(todos).toBeFalsy();
         done();
       }).catch(e => done(e))
     })
  })

  it('should not DELETE todos that belongs to other user', done => {
    const id = dummuTodos[0]._id.toHexString();
    request(app)
     .delete('/todos/' + id)
     .set('x-auth', dummuUsers[1].tokens[0].token)
     .expect(404)
     .end((err, res) => {
       if(err) {
         return done(err);
       }
       Todo.findById(id).then((todos) => {
         expect(todos).toBeTruthy();
         done();
       }).catch(e => done(e))
     })
  })


  it('should return 404 id id not found ', done => {
    const id = new ObjectID().toHexString();
    request(app)
     .delete('/todos/' + id)
     .set('x-auth', dummuUsers[1].tokens[0].token)
     .expect(404)
     .end(done);
  })

  it('should return 404 if bad id ', done => {
    const id = '123';
    request(app)
     .delete('/todos/' + id)
     .set('x-auth', dummuUsers[1].tokens[0].token)
     .expect(404)
     .end(done);
  })
});

describe('patch /todos/:id', () => {
  it('should patch todos by id and return it', done => {
    const id = dummuTodos[0]._id.toHexString();
    const text = 'Test todo 1';

    request(app)
     .patch('/todos/' + id)
     .set('x-auth', dummuUsers[0].tokens[0].token)
     .send({
       completed: true,
       text})
     .expect(200)
     .expect( res => {
       expect(res.body.todo.text).toBe(text);
       expect(res.body.todo.completedAt).toBeTruthy();
     })
     .end((err, res) => {
       if(err) {
         return done(err);
       }
       Todo.findById(id).then((todo) => {
         expect(todo.text).toBe(text);
         done();
       }).catch(e => done(e))
     })
  })

  it('should not patch todos by id if not authenticated', done => {
    const id = dummuTodos[1]._id.toHexString();
    const text = 'Test todo 1';

    request(app)
     .patch('/todos/' + id)
     .set('x-auth', dummuUsers[0].tokens[0].token)
     .send({
       completed: true,
       text})
     .expect(404)
     .end((err, res) => {
       if(err) {
         return done(err);
       }
       Todo.findById(id).then((todo) => {
         expect(todo.text === text).toBeFalsy();
         done();
       }).catch(e => done(e))
     })
  })

  it('should clear completedAt when todo is not complete ', done => {
    const id = dummuTodos[1]._id.toHexString();
    request(app)
     .patch('/todos/' + id)
     .set('x-auth', dummuUsers[1].tokens[0].token)
     .send({
       completed: false
     })
     .expect(200)
     .end((err, res) => {
       if(err) {
         return done(err);
       }
       Todo.findById(id).then((todo) => {
         expect(todo.completed).toBeFalsy();
         expect(todo.completedAt).toBeFalsy();
         done();
       }).catch(e => done(e))
     })
  })

})
