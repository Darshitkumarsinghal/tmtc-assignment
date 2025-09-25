const express = require('express');
const router = express.Router();
const itineraryCtrl = require('../controllers/itinerary.controller');
const { protect } = require('../middleware/auth');

router.post('/', protect, itineraryCtrl.createItinerary);
router.get('/', protect, itineraryCtrl.getItineraries);
router.get('/:id', protect, itineraryCtrl.getItineraryById);
router.put('/:id', protect, itineraryCtrl.updateItinerary);
router.delete('/:id', protect, itineraryCtrl.deleteItinerary);

// share endpoints (public)
router.post('/:id/share', protect, itineraryCtrl.createShareable);
router.get('/share/:shareId', itineraryCtrl.getShared);

module.exports = router;
