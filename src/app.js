const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const itinRoutes = require('./routes/itinerary.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use(rateLimit({ windowMs: 60*1000, max: 200 }));

app.use('/api/auth', authRoutes);
app.use('/api/itineraries', itinRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

module.exports = app;
