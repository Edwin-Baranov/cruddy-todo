const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, () => {
      callback(null, { id, text });
    });
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   //return { id, text };
  // });
  fs.readdir(exports.dataDir, (err, files) => {
    callback(null, files);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    if (err) {
      callback(err, '');
    } else {
      callback(null, { id, text: String(data)});
    }
  });
};

exports.update = (id, text, callback) => {
  var fileDir = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(fileDir, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(fileDir, text, () => {
        callback(null, { id, text });
      });
    }
  });
};

exports.delete = (id, callback) => {
  var fileDir = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(fileDir, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
