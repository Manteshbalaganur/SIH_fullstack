const PDFDocument = require('pdfkit');

const generatePDF = (assessment) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      // PDF Content
      doc.fontSize(20).text('Circularity Assessment Report', 100, 100);
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 100, 130);
      
      // Assessment Details
      doc.fontSize(16).text('Assessment Details', 100, 170);
      doc.fontSize(10);
      doc.text(`Metal Type: ${assessment.metal_type}`, 100, 200);
      doc.text(`Production Volume: ${assessment.production_volume} tons`, 100, 215);
      doc.text(`Circularity Score: ${assessment.circularity_score}%`, 100, 230);
      
      // Recommendations
      doc.fontSize(16).text('AI Recommendations', 100, 270);
      doc.fontSize(10);
      assessment.ai_recommendations.forEach((rec, index) => {
        doc.text(`• ${rec}`, 100, 300 + (index * 15));
      });
      
      // Environmental Impact
      doc.fontSize(16).text('Environmental Impact', 100, 400);
      doc.fontSize(10);
      doc.text(`CO2 Emissions: ${assessment.co2_emissions} kg`, 100, 430);
      doc.text(`Energy Consumption: ${assessment.energy_consumption} kWh`, 100, 445);
      
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };