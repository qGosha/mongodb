const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const dummuTodos = [{
  _id: new ObjectID(),
  text: 'first test todos'
},
{
  _id: new ObjectID(),
  text: 'SEcond text todos',
  completed: true,
  comletedAt:'333'
}];



beforeEach((done) => {
  Todo.remove({})
  .then(() => {
    return Todo.insertMany(dummuTodos);
  })
  .then(() => done())
});

describe('POST /todos', () => {
  it('should create a new todo', done => {
    const text = 'Test todo';

    request(app)
     .post('/todos')
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
     .expect(200)
     .expect( res => {
       expect(res.body.todos.length).toBe(2);
     })
     .end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should get todos by id and return it', done => {
    const id = dummuTodos[0]._id.toHexString();
    request(app)
     .get('/todos/' + id)
     .expect(200)
     .expect( res => {
       expect(res.body.todo.text).toBe(dummuTodos[0].text);
     })
     .end(done);
  })

  it('should return 400 id id not found ', done => {
    const id = new ObjectID().toHexString();
    request(app)
     .get('/todos/' + id)
     .expect(400)
     .end(done);
  })

  it('should return 400 if bad id ', done => {
    const id = '123';
    request(app)
     .get('/todos/' + id)
     .expect(400)
     .end(done);
  })
})


describe('DELETE /todos/:id', () => {
  it('should DELETE todos by id and return it', done => {
    const id = dummuTodos[0]._id.toHexString();
    request(app)
     .delete('/todos/' + id)
     .expect(200)
     .expect( res => {
       expect(res.body.todo.text).toBe(dummuTodos[0].text);
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

  it('should return 400 id id not found ', done => {
    const id = new ObjectID().toHexString();
    request(app)
     .delete('/todos/' + id)
     .expect(400)
     .end(done);
  })

  it('should return 400 if bad id ', done => {
    const id = '123';
    request(app)
     .delete('/todos/' + id)
     .expect(400)
     .end(done);
  })
});

describe('patch /todos/:id', () => {
  it('should patch todos by id and return it', done => {
    const id = dummuTodos[0]._id.toHexString();
    const text = 'Test todo 1';

    request(app)
     .patch('/todos/' + id)
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

  it('should clear completedAt when todo is not complete ', done => {
    const id = dummuTodos[1]._id.toHexString();
    request(app)
     .patch('/todos/' + id)
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
