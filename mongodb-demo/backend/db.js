const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const mongoDbURL = 'mongodb://dev:dev@localhost/shop?retryWrites=true';
let _client;

const initDB = (callback) => {
  if (_client) {
    console.log('Database is already initialized!');
    return callback(null, _client);
  }
  MongoClient.connect(mongoDbURL)
    .then((client) => {
      _client = client;
      callback(null, _client);
    })
    .catch((err) => {
      callback(err);
    });
};

const getClient = () => {
  if (!_client) {
    throw Error('Database not initialized');
  }
  return _client;
};

module.exports = {
  initDB,
  getClient,
};
