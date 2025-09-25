const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Itinerary = require('../models/Itinerary');

let token;
let createdId;

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/tmtc_test', {});
  await User.deleteMany({});
  await Itinerary.deleteMany({});
  const res = await request(app).post('/api/auth/register').send({
    name: 'Itiner Tester', email: 'itin@test.com', password: 'password'
  });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Itinerary CRUD', () => {
  it('create itinerary', async () => {
    const res = await request(app).post('/api/itineraries')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Trip', destination: 'Paris', startDate: '2025-10-01', endDate: '2025-10-05', activities: [] });
    expect(res.statusCode).toBe(201);
    createdId = res.body._id;
  });

  it('get itinerary by id', async () => {
    const res = await request(app).get(`/api/itineraries/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Trip');
  });
});
