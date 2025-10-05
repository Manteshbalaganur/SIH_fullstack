import jsPDF from 'jspdf';

export const simplePdfService = {
  generatePDF(assessment: any) {
    const doc = new jsPDF();
    
    // Add content
    doc.setFontSize(20);
    doc.setTextColor(15, 118, 110); // Teal color
    doc.text('CircularMetals AI', 20, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Circularity Assessment Report', 20, 40);
    
    doc.setFontSize(12);
    doc.text(`Project: ${assessment.name || 'Untitled'}`, 20, 60);
    doc.text(`Metal Type: ${assessment.metalType || 'N/A'}`, 20, 70);
    doc.text(`Circularity Score: ${assessment.circularityScore || 0}%`, 20, 80);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 90);
    
    // Save PDF
    doc.save(`circularity-assessment-${Date.now()}.pdf`);
  }
};