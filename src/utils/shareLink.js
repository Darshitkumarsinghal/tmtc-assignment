const { v4: uuidv4 } = require('uuid');

/**
 * Simple in-memory share map.
 * For production use, persist to DB and add TTL.
 */
const shareMap = new Map();

function createShare(itinerary){
  const id = uuidv4();
  const payload = {
    ...itinerary.toObject ? itinerary.toObject() : itinerary,
    userId: undefined // ensure not exposing userId
  };
  shareMap.set(id, payload);
  return id;
}

function getShare(id){
  return shareMap.get(id);
}

module.exports = { createShare, getShare };
