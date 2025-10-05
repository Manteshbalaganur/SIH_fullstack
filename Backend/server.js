const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const pdfRoutes = require('./routes/pdf');

require('dotenv').config();

const app = express();



// Middleware
app.use(cors());
app.use(express.json());

// Import routes properly
const assessmentRoutes = require('./routes/assessments');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/assessments', assessmentRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CircularMetals API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/pdf', pdfRoutes);


// MongoDB connection (using local MongoDB for now)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/circularmetals';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.log('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('❌ Unhandled Rejection at:', promise, 'reason:', err);
});