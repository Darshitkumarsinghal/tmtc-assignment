const Itinerary = require('../models/Itinerary');
const { createShare, getShare } = require('../utils/shareLink');
const { getClient } = require('../config/redis');
const sendMail = require("../config/mailer");
const User = require('../models/User');

const CACHE_TTL = 300; // 5 minutes

exports.createItinerary = async (req, res, next) => {
  try {
    const payload = { ...req.body, userId: req.user._id };
    const it = await Itinerary.create(payload);
    // 📧 Send email notification
    const user = await User.findById(req.user._id);
    if (user && user.email) {
      await sendMail(
        user.email,
        "New Itinerary Created",
        `Hi ${user.name}, you created a new itinerary: ${it.title}`,
        `<h3>Hi ${user.name},</h3><p>You created a new itinerary: <b>${it.title}</b> to ${it.destination}.</p>`
      );
    }
    res.status(201).json(it);
  } catch (err) { next(err); }
};

exports.getItineraries = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt', destination } = req.query;
    const q = {};
    if (destination) q.destination = destination;
    const skip = (parseInt(page)-1)*parseInt(limit);
    const items = await Itinerary.find(q).sort(sort).skip(skip).limit(parseInt(limit));
    const total = await Itinerary.countDocuments(q);
    res.json({ items, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { next(err); }
};

exports.getItineraryById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const redis = getClient();
    const cacheKey = `itinerary:${id}`;
    if (redis){
      const cached = await redis.get(cacheKey);
      if (cached) return res.json(JSON.parse(cached));
    }
    const it = await Itinerary.findById(id);
    if (!it) return res.status(404).json({ message: 'Not found' });
    if (redis) await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(it));
    res.json(it);
  } catch (err) { next(err); }
};

exports.updateItinerary = async (req, res, next) => {
  try {
    const it = await Itinerary.findById(req.params.id);
    if (!it) return res.status(404).json({ message: 'Not found' });
    if (it.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(it, req.body);
    await it.save();
    // invalidate cache
    const redis = getClient();
    if (redis) await redis.del(`itinerary:${req.params.id}`);
    res.json(it);
  } catch (err) { next(err); }
};

exports.deleteItinerary = async (req, res, next) => {
  try {
    console.log('Deleting itinerary', req.params.id);
    const it = await Itinerary.findById(req.params.id);
    if (!it) return res.status(404).json({ message: 'Not found' });
    if (it.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    await it.deleteOne();
    const redis = getClient();
    if (redis) await redis.del(`itinerary:${req.params.id}`);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

exports.createShareable = async (req, res, next) => {
  try {
    const it = await Itinerary.findById(req.params.id);
    if (!it) return res.status(404).json({ message: 'Not found' });
    if (it.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    const shareId = createShare(it);
    res.json({ shareId, url: `/api/itineraries/share/${shareId}` });
  } catch (err) { next(err); }
};

exports.getShared = async (req, res, next) => {
  try {
    const payload = getShare(req.params.shareId);
    if (!payload) return res.status(404).json({ message: 'Not found' });
    return res.json(payload);
  } catch (err) { next(err); }
};
