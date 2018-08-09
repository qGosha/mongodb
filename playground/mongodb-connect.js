const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Unable to connect');
  }
  console.log('Successefuly connected');
  const db = client.db('TodoApp');
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to create', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })
  // db.collection('Users').insertOne({
  //   name: 'Ivan',
  //   age: 36,
  //   location: 'Moscow'
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to create', err);
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  // })
  client.close();
})
