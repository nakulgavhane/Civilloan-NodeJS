const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Service = require('./models/service');
const Request = require('./models/request');
const Member = require('./models/member');

const app = express();
app.use(cors());
app.use(express.json()); // Use express.json() instead of body-parser

// Connect to MongoDB
mongoose.connect('mongodb+srv://nakulgavhane:nakul123@cluster0.68ada.mongodb.net/civilloan', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Civil-Finloan Finance Management Application API');
});

// Get all services
app.get('/allservices', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching services', error: err });
    }
});

// Get specific service
app.get('/service/:type', async (req, res) => {
    try {
        const service = await Service.findOne({ type: req.params.type });
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching service', error: err });
    }
});

// Submit a request form
app.post('/service/:type/form', async (req, res) => {
    try {
        const request = new Request(req.body);
        await request.save();
        res.json({ message: 'Request submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting request', error: err });
    }
});

// Register a member
app.post('/member', async (req, res) => {
    try {
        const member = new Member(req.body);
        await member.save();
        res.json({ message: 'Member registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering member', error: err });
    }
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
    try {
        const { mobile, ...updateData } = req.body;
        await Request.updateOne({ mobile }, updateData);
        res.json({ message: 'Request updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating request', error: err });
    }
});

// Update password
app.put('/updatepassword', async (req, res) => {
    try {
        const { mobile, password } = req.body;
        await Member.updateOne({ mobile }, { createpassword: password });
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating password', error: err });
    }
});

// Delete a request
app.delete('/deleterequest', async (req, res) => {
    try {
        const { mobile } = req.body;
        await Request.deleteOne({ mobile });
        res.json({ message: 'Request deleted successfully' });
 } catch (err) {
        res.status(500).json({ message: 'Error deleting request', error: err });
    }
});

// Cancel membership
app.delete('/cancelmember', async (req, res) => {
    try {
        const { mobile } = req.body;
        await Member.deleteOne({ mobile });
        res.json({ message: 'Membership cancelled successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error cancelling membership', error: err });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
