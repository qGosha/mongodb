const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const pass = '123abc!';
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(pass, salt, (err, hash) => {
    console.log(hash);
  })
});

const hashedPass = '$2a$10$XT36AwgH.Img3uAZ8g5hp.3C.xwRwtk4EDYFg84FKW9fJ3FSSo9aG';

bcrypt.compare(pass, hashedPass, (err, res) => {
  console.log(res);
})

// const data = {
//   id: 4
// };
// const token = jwt.sign(data, '123abc');
// console.log(token);
// const decoded = jwt.verify(token, '123abc');
// console.log('sdfsdf', decoded);
//
// const message = 'I am a user';
// const hash = SHA256(message).toString();
// console.log(message +'        '+ hash);
//
// const data = {
//   id: 4
// };
//
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data !!! changed');
// }
