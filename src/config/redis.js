const Redis = require('ioredis');

let client;

function createClient(redisUrl){
  client = new Redis(redisUrl);
  client.on('connect', () => console.log('Redis connected'));
  client.on('error', (err) => console.error('Redis error', err));
  return client;
}

module.exports = { createClient, getClient: () => client };
