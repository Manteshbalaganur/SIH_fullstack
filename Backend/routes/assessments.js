const express = require('express');
const router = express.Router();
// const Assessment = require('../models/Assessment');
// Comment out the real model, use mock for testing
// const Assessment = require('../models/Assessment');
const Assessment = require('../models/MockAssessment');

// Add these calculation functions directly since utils might not be working
const calculateMetrics = async (data) => {
  // Simple calculations for demo
  const circularityScore = Math.min(100, 
    (data.recycled_content || 0) + 
    (data.recycling_rate || 0) * 0.5 + 
    (data.reuse_potential || 0) * 0.3
  );
  
  const co2Emissions = (data.electricity_consumption || 0) * 0.5 + 
                      (data.fuel_consumption || 0) * 2.5 + 
                      (data.transport_distance || 0) * 0.15;
  
  return {
    circularity_score: Math.round(circularityScore),
    co2_emissions: co2Emissions,
    energy_consumption: data.electricity_consumption || 0,
    water_usage: data.water_usage || 0,
    cost_savings: (data.recycled_content || 0) * 500,
    ai_recommendations: [
      "Increase recycled content to at least 30%",
      "Consider renewable energy sources",
      "Improve end-of-life recycling rate"
    ],
    chart_data: {
      circularity_breakdown: {
        labels: ['Recycled Content', 'Energy Efficiency', 'Recycling Rate'],
        data: [data.recycled_content || 0, 75, data.recycling_rate || 0]
      }
    },
    material_flow: {
      nodes: [
        { name: 'Virgin Material', value: data.virgin_material || 0 },
        { name: 'Recycled Material', value: data.recycled_content || 0 }
      ],
      links: [
        { source: 0, target: 1, value: data.virgin_material || 0 }
      ]
    }
  };
};

// Create new assessment
router.post('/', async (req, res) => {
  try {
    console.log('📥 Received assessment data:', req.body);
    
    const assessmentData = req.body;
    
    // Calculate metrics
    const metrics = await calculateMetrics(assessmentData);
    
    // Create assessment with calculated data
    const assessment = new Assessment({
      ...assessmentData,
      ...metrics
    });
    
    await assessment.save();
    
    console.log('✅ Assessment saved:', assessment._id);
    
    res.status(201).json({
      success: true,
      data: assessment,
      message: 'Assessment created successfully'
    });
    
  } catch (error) {
    console.error('❌ Error creating assessment:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all assessments for user
router.get('/user/:userId', async (req, res) => {
  try {
    const assessments = await Assessment.find({ user_id: req.params.userId })
      .sort({ timestamp: -1 });
    
    res.json({
      success: true,
      data: assessments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single assessment
router.get('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      });
    }
    
    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate PDF report (simplified for now)
router.get('/:id/pdf', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      });
    }
    
    // Simple PDF response for now
    res.json({
      success: true,
      message: 'PDF generation will be implemented soon',
      assessment: assessment
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;