// Temporary calculations - WILL BE REPLACED WITH AI MODEL
const calculateMetrics = async (data) => {
  // Simple calculations for demo - AI will replace this
  
  const circularityScore = calculateCircularityScore(data);
  const co2Emissions = calculateCO2Emissions(data);
  const energyConsumption = calculateEnergyConsumption(data);
  const costSavings = calculateCostSavings(data);
  const recommendations = generateRecommendations(data);
  
  // Chart data for frontend visualization
  const chartData = generateChartData(data, circularityScore);
  const materialFlow = generateMaterialFlowData(data);
  
  return {
    circularity_score: circularityScore,
    co2_emissions: co2Emissions,
    energy_consumption: energyConsumption,
    water_usage: data.water_usage || calculateWaterUsage(data),
    cost_savings: costSavings,
    ai_recommendations: recommendations,
    improvement_areas: identifyImprovementAreas(data),
    chart_data: chartData,
    material_flow: materialFlow
  };
};

const calculateCircularityScore = (data) => {
  // Simple calculation - AI will replace this
  let score = 0;
  
  // Recycled content (max 40 points)
  score += Math.min((data.recycled_content || 0) * 0.4, 40);
  
  // Energy efficiency (max 20 points)
  const energyEff = Math.max(0, (20000 - (data.electricity_consumption || 0)) / 20000 * 20);
  score += energyEff;
  
  // Recycling rate (max 20 points)
  score += Math.min((data.recycling_rate || 0) * 0.2, 20);
  
  // Reuse potential (max 20 points)
  score += Math.min((data.reuse_potential || 0) * 0.2, 20);
  
  return Math.min(Math.round(score), 100);
};

const calculateCO2Emissions = (data) => {
  // Simple CO2 calculation
  const electricityCO2 = (data.electricity_consumption || 0) * 0.5; // kg CO2/kWh
  const fuelCO2 = (data.fuel_consumption || 0) * 2.5; // kg CO2 per unit
  const transportCO2 = (data.transport_distance || 0) * 0.15; // kg CO2/km
  
  return electricityCO2 + fuelCO2 + transportCO2;
};

const generateRecommendations = (data) => {
  const recommendations = [];
  
  if (data.recycled_content < 30) {
    recommendations.push("Increase recycled content to at least 30% for better circularity");
  }
  
  if (data.electricity_consumption > 15000) {
    recommendations.push("Consider renewable energy sources to reduce electricity consumption");
  }
  
  if (data.recycling_rate < 50) {
    recommendations.push("Improve end-of-life recycling rate through better collection systems");
  }
  
  if ((data.reuse_potential || 0) < 20) {
    recommendations.push("Explore design improvements to increase product reuse potential");
  }
  
  return recommendations;
};

const generateChartData = (data, circularityScore) => {
  return {
    circularity_breakdown: {
      labels: ['Recycled Content', 'Energy Efficiency', 'Recycling Rate', 'Reuse Potential'],
      data: [
        (data.recycled_content || 0),
        Math.max(0, (20000 - (data.electricity_consumption || 0)) / 20000 * 100),
        (data.recycling_rate || 0),
        (data.reuse_potential || 0)
      ]
    },
    comparison_data: {
      your_score: circularityScore,
      industry_average: 65,
      best_practice: 85
    },
    environmental_impact: {
      co2: calculateCO2Emissions(data),
      energy: data.electricity_consumption || 0,
      water: data.water_usage || 0,
      waste: (data.landfill_rate || 0) * (data.production_volume || 0) / 100
    }
  };
};

const generateMaterialFlowData = (data) => {
  return {
    nodes: [
      { name: 'Virgin Material', value: data.virgin_material || 0 },
      { name: 'Recycled Material', value: data.recycled_content || 0 },
      { name: 'Production Process', value: (data.virgin_material || 0) + (data.recycled_content || 0) },
      { name: 'Final Product', value: (data.production_volume || 0) * ((data.product_yield || 100) / 100) },
      { name: 'Recycling', value: (data.recycling_rate || 0) },
      { name: 'Landfill', value: (data.landfill_rate || 0) }
    ],
    links: [
      { source: 0, target: 2, value: data.virgin_material || 0 },
      { source: 1, target: 2, value: data.recycled_content || 0 },
      { source: 2, target: 3, value: (data.production_volume || 0) * ((data.product_yield || 100) / 100) },
      { source: 3, target: 4, value: (data.recycling_rate || 0) },
      { source: 3, target: 5, value: (data.landfill_rate || 0) }
    ]
  };
};

module.exports = { calculateMetrics };