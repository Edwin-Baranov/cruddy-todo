const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const Promise = require('bluebird');
const counter = require('./counter');

var readDirPromise = Promise.promisify(fs.readdir);

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, () => {
      callback(null, { id, text });
    });
  });
};

exports.readAll = (callback) => {                           //
  readDirPromise(exports.dataDir)                           // Invoke readDirPromise to start chain
    .then(files => {                                        // Then with array of files
      return files.map((fileName) => {                      // return map result of array
        return readOnePromise(path.parse(fileName).name);   // with an invoked promise of read one
      });
    }).then(Promise.all)                          // Wait for all running promises to finish
    .then((todos) => { callback(null, todos); }); // Call callback with collection of todo's
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    callback(0, { id, text: String(data) });
  });
};

var readOnePromise = Promise.promisify(exports.readOne); //Promisify !!!MUST!!! be after the declaration of error first callback

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
