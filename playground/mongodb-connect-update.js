const {MongoClient, ObjectID, Admin} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Unable to connect');
  }
  console.log('Successefuly connected');

  const db = client.db('TodoApp');

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b6badbbbdea091780192b96')
  }, {
    $inc: {
      age: 5
    },
    $set: {
      name: 'Igor'
    }
  }, {
    returnOriginal: false
  }).then((res) => console.log(res));
})
