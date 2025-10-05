const express = require('express');
const router = express.Router();
const { generatePDF } = require('../utils/pdfGenerator');
const Assessment = require('../models/Assessment');

router.get('/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    // Get assessment data
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(assessment);
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="circularity-assessment-${assessmentId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate PDF' 
    });
  }
});

module.exports = router;