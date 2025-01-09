const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const Service = require('./models/service');
const Request = require('./models/request');
const Member = require('./models/member');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// API Routes
app.get('/allservices', async (req, res) => {
    const services = await Service.find();
    res.json(services);
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Civil-Finloan Finance Management Application API');
});

// API Routes
// Get all services
app.get('/allservices', async (req, res) => {
    const services = await Service.find();
    res.json(services);
});

// Get specific service
app.get('/service/:type', async (req, res) => {
    const service = await Service.findOne({ type: req.params.type });
    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
});

// Submit a request form
app.post('/service/:type/form', async (req, res) => {
    const request = new Request(req.body);
    await request.save();
    res.json({ message: 'Request submitted successfully' });
});

// Register a member
app.post('/member', async (req, res) => {
    const member = new Member(req.body);
    await member.save();
    res.json({ message: 'Member registered successfully' });
});

// Calculate EMI
app.post('/service/:type/calculate', (req, res) => {
    const { amt, tenure } = req.body;
    const interestRate = 0.1; // Example interest rate
    const emi = (amt * interestRate * Math.pow(1 + interestRate, tenure)) / (Math.pow(1 + interestRate, tenure) - 1);
    res.json({ emi });
});

// Update a request
app.put('/updaterequest', async (req, res) => {
    const { mobile, ...updateData } = req.body;
    await Request.updateOne({ mobile }, updateData);
    res.json({ message: 'Request updated successfully' });
});

// Update password
app.put('/updatepassword', async (req, res) => {
    const { mobile, password } = req.body;
    await Member.updateOne({ mobile }, { createpassword: password });
    res.json({ message: 'Password updated successfully' });
});

// Delete a request
app.delete('/deleterequest', async (req, res) => {
    const { mobile } = req.body;
    await Request.deleteOne({ mobile });
    res.json({ message: 'Request deleted successfully' });
});

// Cancel membership
app.delete('/cancelmember', async (req, res) => {
    const { mobile } = req.body;
    await Member.deleteOne({ mobile });
    res.json({ message: 'Membership cancelled successfully' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
