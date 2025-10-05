import { AssessmentInputs, AssessmentResults, Recommendation, MaterialFlow, BenchmarkData } from '../types';

export const calculateCircularityScore = (inputs: AssessmentInputs): number => {
  const recycledContentScore = inputs.recycledContent * 0.3;
  const yieldScore = inputs.productYield * 0.2;
  const recyclingRateScore = inputs.recyclingRate * 0.25;
  const energyScore = (inputs.energySource === 'renewable' ? 100 : inputs.energySource === 'mixed' ? 50 : 30) * 0.15;
  const collectionScore = inputs.collectionEfficiency * 0.1;

  return Math.round(recycledContentScore + yieldScore + recyclingRateScore + energyScore + collectionScore);
};

export const calculateEnvironmentalImpact = (inputs: AssessmentInputs): AssessmentResults => {
  const circularityScore = calculateCircularityScore(inputs);

  const baselineCO2 = inputs.productionVolume * (inputs.metalType === 'aluminum' ? 12 : inputs.metalType === 'copper' ? 4 : 2);
  const co2Savings = Math.round(baselineCO2 * (inputs.recycledContent / 100) * 0.95);

  const baselineEnergy = inputs.productionVolume * inputs.electricityConsumption;
  const energySavings = Math.round(baselineEnergy * (inputs.recycledContent / 100) * 0.65);

  const costImpact = Math.round((co2Savings * 50 + energySavings * 0.12) * -1);

  const resourceEfficiency = Math.round((inputs.productYield + inputs.recyclingRate) / 2);

  const recommendations = generateRecommendations(inputs, circularityScore);
  const materialFlows = generateMaterialFlows(inputs);
  const benchmarkComparison = generateBenchmark(circularityScore, inputs.metalType);

  return {
    circularityScore,
    co2Savings,
    energySavings,
    costImpact,
    resourceEfficiency,
    recommendations,
    materialFlows,
    benchmarkComparison,
  };
};

const generateRecommendations = (inputs: AssessmentInputs, score: number): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  if (inputs.recycledContent < 50) {
    recommendations.push({
      id: '1',
      priority: 'high',
      title: 'Increase Recycled Content',
      description: `Current recycled content is ${inputs.recycledContent}%. Increasing to 70% could improve circularity score by ${Math.round((70 - inputs.recycledContent) * 0.3)} points.`,
      expectedImpact: 15,
      implementationTimeline: '3-6 months',
      confidence: 0.85,
    });
  }

  if (inputs.energySource !== 'renewable') {
    recommendations.push({
      id: '2',
      priority: 'high',
      title: 'Switch to Renewable Energy',
      description: 'Transitioning to renewable energy sources could reduce CO2 emissions by up to 40% and improve circularity score.',
      expectedImpact: 12,
      implementationTimeline: '6-12 months',
      confidence: 0.78,
    });
  }

  if (inputs.recyclingRate < 80) {
    recommendations.push({
      id: '3',
      priority: 'medium',
      title: 'Optimize End-of-Life Collection',
      description: `Improving collection efficiency from ${inputs.collectionEfficiency}% to 90% would increase material recovery and reduce waste.`,
      expectedImpact: 8,
      implementationTimeline: '6-9 months',
      confidence: 0.82,
    });
  }

  if (inputs.productYield < 90) {
    recommendations.push({
      id: '4',
      priority: 'medium',
      title: 'Improve Production Yield',
      description: 'Optimizing production processes to reduce scrap generation could save costs and improve resource efficiency.',
      expectedImpact: 6,
      implementationTimeline: '3-6 months',
      confidence: 0.75,
    });
  }

  if (inputs.transportDistance > 500) {
    recommendations.push({
      id: '5',
      priority: 'low',
      title: 'Optimize Supply Chain Logistics',
      description: 'Consider local sourcing or more efficient transport modes to reduce carbon footprint.',
      expectedImpact: 4,
      implementationTimeline: '9-12 months',
      confidence: 0.68,
    });
  }

  return recommendations;
};

const generateMaterialFlows = (inputs: AssessmentInputs): MaterialFlow[] => {
  const virginAmount = (inputs.virginMaterial / 100) * inputs.productionVolume;
  const recycledAmount = (inputs.recycledContent / 100) * inputs.productionVolume;
  const scrapAmount = inputs.productionVolume * ((100 - inputs.productYield) / 100);
  const productAmount = inputs.productionVolume * (inputs.productYield / 100);
  const recycledEOL = productAmount * (inputs.recyclingRate / 100);
  const wasteAmount = productAmount * (inputs.landfillPercentage / 100);

  return [
    { source: 'Virgin Material', target: 'Production', value: virginAmount },
    { source: 'Recycled Material', target: 'Production', value: recycledAmount },
    { source: 'Production', target: 'Product', value: productAmount },
    { source: 'Production', target: 'Process Scrap', value: scrapAmount },
    { source: 'Process Scrap', target: 'Recycling', value: scrapAmount },
    { source: 'Product', target: 'End of Life', value: productAmount },
    { source: 'End of Life', target: 'Recycling', value: recycledEOL },
    { source: 'End of Life', target: 'Waste', value: wasteAmount },
    { source: 'Recycling', target: 'Recycled Material', value: recycledEOL + scrapAmount },
  ];
};

const generateBenchmark = (score: number, metalType: string): BenchmarkData => {
  const industryAverages: Record<string, number> = {
    aluminum: 62,
    copper: 58,
    steel: 65,
    other: 60,
  };

  const topPerformersScore = industryAverages[metalType] + 25;
  const improvementPotential = Math.max(0, topPerformersScore - score);

  return {
    industryAverage: industryAverages[metalType],
    topPerformers: topPerformersScore,
    yourScore: score,
    improvementPotential,
  };
};
