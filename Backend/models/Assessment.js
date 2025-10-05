const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  project_name: {
    type: String,
    required: true,
    default: "New Assessment"
  },
  
  // Basic Information
  metal_type: {
    type: String,
    required: true,
    enum: ['aluminum', 'copper', 'steel', 'other']
  },
  production_volume: {
    type: Number,
    required: true
  },
  production_method: {
    type: String,
    enum: ['primary', 'secondary', 'mixed'],
    required: true
  },
  
  // Energy Data
  electricity_source: {
    type: String,
    enum: ['grid', 'renewable', 'mixed'],
    default: 'grid'
  },
  electricity_consumption: Number,
  fuel_type: {
    type: String,
    enum: ['natural_gas', 'coal', 'oil', 'biomass', 'other']
  },
  fuel_consumption: Number,
  
  // Material Flows
  recycled_content: Number,
  scrap_input: Number,
  virgin_material: Number,
  product_yield: Number,
  
  // Transportation
  transport_distance: Number,
  transport_mode: {
    type: String,
    enum: ['truck', 'ship', 'rail', 'air']
  },
  
  // End of Life
  recycling_rate: Number,
  landfill_rate: Number,
  reuse_potential: Number,
  
  // Calculated Results
  circularity_score: Number,
  co2_emissions: Number,
  energy_consumption: Number,
  water_usage: Number,
  cost_savings: Number,
  
  // AI Recommendations
  ai_recommendations: [String],
  improvement_areas: [String],
  
  // Visualization Data
  chart_data: Object,
  material_flow: Object,
  
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);