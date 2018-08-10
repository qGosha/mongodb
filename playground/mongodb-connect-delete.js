const {MongoClient, ObjectID, Admin} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Unable to connect');
  }
  console.log('Successefuly connected');

  const db = client.db('TodoApp');

  db.collection('Users').findOneAndDelete({_id: "123"}).then((res) => console.log(res));
})
