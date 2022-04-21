// run `node index.js` in the terminal
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
app.use(express.json());

const Redis = require('ioredis');
/*
const redis = new Redis({
  host: 'redis-18290.c85.us-east-1-2.ec2.cloud.redislabs.com',
  port: 18290,
  username: 'test',
  password: 'VqnmEsUanwDUq7WfvbwDpUbd8nUYekxk',
});
*/
const redis = new Redis(
  'redis://test:asdqweQ1.@redis-18290.c85.us-east-1-2.ec2.cloud.redislabs.com:18290/0'
);

redis.on('connect', (data) => {
});
redis.on('error', (data) => {
  console.log(data);
});
// ioredis supports the node.js callback style

app.get('/', async function (req, res) {
  redis.get('count').then((result) => {
    res.send({data:result})
  });
});
app.get('/count', async function (req, res) {
    redis.get('count').then((result) => {
      res.send({data:result})
    });
  });
app.post('/track', (req, res) => {
    console.log(req.body.data)
  if (req.body.data != undefined) {
    fs.readFile('./test.json', (err, data) => {
        if(err){
            res.send({ message: err.message })
        }
      let file = JSON.parse(data);
      let countFinder = req.body.data;
      file.push(req.body.data);
      let sumCount = searcCountKey(countFinder, 'count');
      let writefile = JSON.stringify(file);
      fs.writeFile('./test.json', writefile, (err, data) => {
        redis.get('count').then((result) => {
            redis.set('count', (result + sumCount));
          });
       

        res.send({ message: 'success' });
      });
    });
  }else{
    res.send({ message: 'no data founded' })
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
function searcCountKey(data, searchKey) {
  let findedValue = 0;
  let keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    let handleKey = keys[i].search(searchKey);
    if (typeof data[keys[i]] === 'object' || typeof data[keys[i]] === 'array') {
      findedValue = findedValue + searcCountKey(data[keys[i]], searchKey);
    } else if (handleKey >= 0) {
      findedValue = findedValue + data[keys[i]];
    }
  }
  return findedValue;
}
module.exports = app;


