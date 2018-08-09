const {MongoClient, ObjectID, Admin} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Unable to connect');
  }
  console.log('Successefuly connected');
  // debugger;
  // const x = Admin.buildInfo().then(x => console.log(x))

  const db = client.db('TodoApp');
  // db.collection('Todos').find().count().then((arr) => {
  //   console.log('Todos', arr);
  // }, err => console.log('Unable to find', err))
  db.collection('Users').find({
    name: "Ivan"
  }).toArray().then((arr) => {
    console.log('Todos');
    console.log(JSON.stringify(arr, undefined, 2));
  }, err => console.log('Unable to find', err))
  // client.close();
})
