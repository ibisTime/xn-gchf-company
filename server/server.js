const axios = require('axios')
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use('/api', function (req, res) {
  // var url = 'http://121.43.101.148:3701/forward-service/api';
  // var url = 'http://121.43.101.148:4001/forward-service/api';
  // var url = 'http://121.43.101.148:4101/forward-service/api';
  // var url = 'http://47.96.161.183:4001/forward-service/api';
  // var url = 'http://47.96.161.183:4401/forward-service/api';
  // var url = 'http://47.96.161.183:2501/forward-service/api';
  var url = 'http://120.26.6.213:2501/forward-service/api';
  // var url = 'http://47.98.248.153:2501/forward-service/api';
  // var url = 'http://47.98.248.153:2501/forward-service/api';
  var _body = req.body;
  var param = 'code=' + _body.code + '&json=' + encodeURIComponent(_body.json);
  axios.post(url, param).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    res.json({ errorInfo: 'error', errorCode: 1 });
  });
  var now = new Date();
  let time = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() +
    ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  console.log(time + ': ' + 'code=' + _body.code + '&json=' + _body.json);
});

app.use('/getIdInfo', function (req, res) {
  var url = 'http://192.168.3.79:8090/getIdInfo';
  var _body = req.body;
  var param = 'code=' + _body.code + '&json=' + encodeURIComponent(_body.json);
  axios.post(url, param).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    res.json({ errorInfo: 'error', errorCode: 1 });
  });
  var now = new Date();
  let time = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() +
    ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  console.log(time + ': ' + 'code=' + _body.code + '&json=' + _body.json);
});
app.use('/getfeature', function (req, res) {
  var url = 'http://118.31.17.181/getfeature';
  var _body = req.body;
  console.log(_body)
  for (var key in _body) {}
  console.log(key)
  axios.post(url, key).then((response) => {
    res.send(response.data)
  }).catch((e) => {
    res.json({ errorInfo: 'error', errorCode: 1 });
  });
  // var now = new Date();
  // let time = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() +
  //   ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  // console.log(time + ': ' + key);
});

app.listen(9091, function () {
  console.log('Node app start at port 9091')
});
