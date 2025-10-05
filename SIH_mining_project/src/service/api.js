const API_BASE_URL = 'http://localhost:5000/api';

// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Backend connection successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return { success: false, error: 'Backend server is not running' };
  }
};

// Assessment API functions
export const assessmentAPI = {
  // Create new assessment
  createAssessment: async (assessmentData) => {
    try {
      console.log('🚀 Sending POST request to:', `${API_BASE_URL}/assessments`);
      console.log('📦 Request data:', assessmentData);

      const response = await fetch(`${API_BASE_URL}/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData),
      });
      
      console.log('📨 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Backend response:', result);
      return { success: true, data: result };
      
    } catch (error) {
      console.error('❌ Create assessment failed:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create assessment',
        data: null
      };
    }
  },

  // Get all assessments for user
  getUserAssessments: async (userId) => {
    try {
      console.log('🚀 Fetching assessments for user:', userId);
      const response = await fetch(`${API_BASE_URL}/assessments/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ User assessments:', result);
      return { success: true, data: result };
      
    } catch (error) {
      console.error('❌ Get user assessments failed:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to fetch assessments',
        data: null
      };
    }
  },

  // Get single assessment
  getAssessment: async (id) => {
    try {
      console.log('🚀 Fetching assessment:', id);
      const response = await fetch(`${API_BASE_URL}/assessments/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Assessment data:', result);
      return { success: true, data: result };
      
    } catch (error) {
      console.error('❌ Get assessment failed:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to fetch assessment',
        data: null
      };
    }
  },

  // Generate PDF
  generatePDF: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assessments/${id}/pdf`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      return { 
        success: false, 
        error: 'PDF generation not available yet',
        data: null
      };
    }
  },

  // Share assessment
  shareAssessment: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assessments/${id}/share`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Share assessment failed:', error);
      return { 
        success: false, 
        error: 'Share functionality not available yet',
        data: null
      };
    }
  }
};

// my old api.js
// const API_BASE_URL = 'http://localhost:5000/api';

// // Test backend connection
// export const testBackendConnection = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/health`);
//     const data = await response.json();
//     console.log('✅ Backend connection successful:', data);
//     return { success: true, data };
//   } catch (error) {
//     console.error('❌ Backend connection failed:', error);
//     return { success: false, error: 'Backend server is not running' };
//   }
// };

// // Assessment API functions
// export const assessmentAPI = {
//   // Create new assessment
//   createAssessment: async (assessmentData) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/assessments`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(assessmentData),
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('❌ Create assessment failed:', error);
//       return { 
//         success: false, 
//         error: error.message || 'Failed to create assessment' 
//       };
//     }
//   },

//   // Get all assessments for user
//   getUserAssessments: async (userId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/assessments/user/${userId}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('❌ Get user assessments failed:', error);
//       return { 
//         success: false, 
//         error: error.message || 'Failed to fetch assessments' 
//       };
//     }
//   },

//   // Get single assessment
//   getAssessment: async (id) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/assessments/${id}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('❌ Get assessment failed:', error);
//       return { 
//         success: false, 
//         error: error.message || 'Failed to fetch assessment' 
//       };
//     }
//   },

//   // Generate PDF (placeholder for now)
//   generatePDF: async (id) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/assessments/${id}/pdf`);
//       return await response.json();
//     } catch (error) {
//       console.error('❌ PDF generation failed:', error);
//       return { 
//         success: false, 
//         error: 'PDF generation not available yet' 
//       };
//     }
//   }
// };