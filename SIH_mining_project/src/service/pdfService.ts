import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const pdfService = {
  // Method for generating PDF from assessment data (no backend needed)
  async generateAssessmentPDF(assessmentData: any): Promise<void> {
    try {
      // Create a temporary div to render the PDF content
      const element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '0';
      element.style.width = '800px';
      element.style.padding = '20px';
      element.style.backgroundColor = 'white';
      element.style.fontFamily = 'Arial, sans-serif';
      
      // Generate HTML content for PDF
      element.innerHTML = this.generatePDFContent(assessmentData);
      document.body.appendChild(element);

      // Convert to canvas then to PDF
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      // Remove temporary element
      document.body.removeChild(element);

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      pdf.save(`circularity-assessment-${Date.now()}.pdf`);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF');
    }
  },

  // Generate HTML content for PDF
  generatePDFContent(assessment: any): string {
    const date = new Date().toLocaleDateString();
    
    return `
      <div style="color: #333; line-height: 1.6;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0F766E; padding-bottom: 20px;">
          <h1 style="color: #0F766E; margin: 0; font-size: 28px;">CircularMetals AI</h1>
          <h2 style="color: #333; margin: 10px 0 0 0; font-size: 20px;">Circularity Assessment Report</h2>
          <p style="color: #666; margin: 5px 0;">Generated on: ${date}</p>
        </div>

        <!-- Project Info -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #0F766E; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Project Information</h3>
          <p><strong>Project Name:</strong> ${assessment.project_name || assessment.name || 'Untitled Project'}</p>
          <p><strong>Metal Type:</strong> ${assessment.metal_type || assessment.metalType || 'N/A'}</p>
          <p><strong>Production Volume:</strong> ${assessment.production_volume || assessment.inputs?.productionVolume || 0} tons</p>
          <p><strong>Production Method:</strong> ${assessment.production_method || 'N/A'}</p>
        </div>

        <!-- Circularity Score -->
        <div style="margin-bottom: 25px; text-align: center; background: #f8fafc; padding: 20px; border-radius: 10px;">
          <h3 style="color: #0F766E; margin: 0 0 10px 0;">Circularity Score</h3>
          <div style="font-size: 48px; font-weight: bold; color: #0F766E;">
            ${assessment.circularity_score || assessment.circularityScore || 0}%
          </div>
        </div>

        <!-- Assessment Details -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #0F766E; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Assessment Details</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <p><strong>Recycled Content:</strong> ${assessment.recycled_content || assessment.inputs?.recycledContent || 0}%</p>
              <p><strong>Product Yield:</strong> ${assessment.product_yield || assessment.inputs?.productYield || 0}%</p>
              <p><strong>Recycling Rate:</strong> ${assessment.recycling_rate || assessment.inputs?.recyclingRate || 0}%</p>
            </div>
            <div>
              <p><strong>Energy Source:</strong> ${assessment.electricity_source || assessment.inputs?.energySource || 'N/A'}</p>
              <p><strong>Fuel Type:</strong> ${assessment.fuel_type || 'N/A'}</p>
              <p><strong>Transport Mode:</strong> ${assessment.transport_mode || 'N/A'}</p>
            </div>
          </div>
        </div>

        <!-- Environmental Impact -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #0F766E; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Environmental Impact</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <p><strong>CO2 Emissions:</strong> ${assessment.co2_emissions || assessment.results?.co2Savings || 0} kg</p>
              <p><strong>Energy Consumption:</strong> ${assessment.energy_consumption || assessment.results?.energySavings || 0} kWh</p>
            </div>
            <div>
              <p><strong>Cost Impact:</strong> $${assessment.cost_savings || assessment.results?.costImpact || 0}</p>
              <p><strong>Collection Efficiency:</strong> ${assessment.collection_efficiency || 0}%</p>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #0F766E; border-bottom: 1px solid #ddd; padding-bottom: 5px;">AI Recommendations</h3>
          <ul style="padding-left: 20px;">
            ${this.generateRecommendations(assessment).map(rec => 
              `<li style="margin-bottom: 8px;">${rec}</li>`
            ).join('')}
          </ul>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
          <p>Generated by CircularMetals AI • www.circularmetals.com</p>
        </div>
      </div>
    `;
  },

  // Generate recommendations based on assessment data
  generateRecommendations(assessment: any): string[] {
    const recommendations = [];
    
    const recycledContent = assessment.recycled_content || assessment.inputs?.recycledContent || 0;
    if (recycledContent < 50) {
      recommendations.push('Increase recycled content to at least 50% to improve circularity score');
    }
    
    const circularityScore = assessment.circularity_score || assessment.circularityScore || 0;
    if (circularityScore < 70) {
      recommendations.push('Optimize production process to improve material efficiency');
    }
    
    recommendations.push('Consider implementing closed-loop recycling systems');
    recommendations.push('Explore alternative energy sources to reduce carbon footprint');
    recommendations.push('Improve collection and sorting efficiency for better recycling rates');
    
    return recommendations;
  },

  // Fallback method that works with your current backend structure
  async downloadAssessmentPDF(assessmentId: string, assessmentData?: any): Promise<void> {
    try {
      // Try backend first
      if (assessmentId && assessmentId !== 'undefined') {
        const response = await fetch(`http://localhost:2008/api/pdf/${assessmentId}`);
        if (response.ok) {
          const blob = await response.blob();
          this.downloadBlob(blob, `circularity-assessment-${assessmentId}.pdf`);
          return;
        }
      }
      
      // Fallback to client-side generation
      if (assessmentData) {
        await this.generateAssessmentPDF(assessmentData);
      } else {
        throw new Error('No assessment data available for PDF generation');
      }
      
    } catch (error) {
      console.error('PDF download failed, using client-side fallback:', error);
      if (assessmentData) {
        await this.generateAssessmentPDF(assessmentData);
      } else {
        throw new Error('Failed to generate PDF');
      }
    }
  },

  downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
//old code wokring but showing pdf not readable 
// import { assessmentAPI } from './api';

// export const pdfService = {
//   async downloadAssessmentPDF(assessmentId: string): Promise<void> {
//     try {
//       const response = await fetch(`${assessmentAPI.baseURL}/pdf/${assessmentId}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to download PDF: ${response.statusText}`);
//       }

//       // Create blob from response
//       const blob = await response.blob();
      
//       // Create download link
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `circularity-assessment-${assessmentId}.pdf`;
      
//       // Trigger download
//       document.body.appendChild(link);
//       link.click();
      
//       // Cleanup
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
      
//     } catch (error) {
//       console.error('PDF download error:', error);
//       throw new Error('Failed to download PDF. Please try again.');
//     }
//   },

//   // Alternative method for generating PDF in browser (client-side)
//   async generateClientSidePDF(assessmentData: any): Promise<void> {
//     // You can implement client-side PDF generation here if needed
//     // Using libraries like jspdf, pdf-lib, etc.
//     console.log('Client-side PDF generation for:', assessmentData);
    
//     // For now, we'll use the server-side generation
//     if (assessmentData._id) {
//       return this.downloadAssessmentPDF(assessmentData._id);
//     } else {
//       throw new Error('Assessment ID not found');
//     }
//   }
// };