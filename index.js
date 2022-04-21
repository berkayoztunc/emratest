// run `node index.js` in the terminal
const express = require("express");
const fs = require("fs");
const Redis = require("ioredis");

const {redisConnection, appPort,searchKeyword,logFilePath} = require("./config");

const redis = new Redis(redisConnection);
const app = express();
const port = appPort;
app.use(express.json());

redis.on("connect", data => {
  errorHandle(data);
});
app.get("/", async function (req, res) {
  redis
    .get(searchKeyword)
    .then(result => {
      res.send({data: result});
    })
    .catch(error => {
      errorHandle(error);
    });
});
app.get("/count", async function (req, res) {
  redis
    .get(searchKeyword)
    .then(result => {
      res.send({data: result});
    })
    .catch(error => {
      errorHandle(error);
    });
});
app.post("/track", (req, res) => {
  if (req.body.data != undefined) {
    fs.readFile(logFilePath, (err, fileStreamd) => {
      if (err) {
        res.send({message: err.message});
      }
      let file = JSON.parse(fileStreamd);
      file.push(req.body.data);
      let sumCount = searcCountKey(req.body.data, searchKeyword);
      let margedFile = JSON.stringify(file);
      fs.writeFile(logFilePath, margedFile, (err, data) => {
        redis.get(searchKeyword).then(result => {
          redis.set(searchKeyword, result + sumCount);
        });
        res.send({message: "success"});
      });
    });
  } else {
    res.send({message: "no data founded"});
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
    if (typeof data[keys[i]] === "object" || typeof data[keys[i]] === "array") {
      findedValue = findedValue + searcCountKey(data[keys[i]], searchKey);
    } else if (handleKey >= 0) {
      findedValue = findedValue + data[keys[i]];
    }
  }
  return findedValue;
}

function errorHandle(error) {
  console.log(error.message);
}

module.exports = app;
