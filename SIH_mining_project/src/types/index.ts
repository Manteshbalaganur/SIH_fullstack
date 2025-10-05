export type MetalType = 'aluminum' | 'copper' | 'steel' | 'other';
export type ProcessRoute = 'primary' | 'secondary' | 'mixed';
export type EnergySource = 'grid' | 'renewable' | 'mixed';
export type TransportMode = 'truck' | 'rail' | 'ship' | 'air';
export type FuelType = 'natural-gas' | 'coal' | 'oil' | 'biomass';

export interface AssessmentInputs {
  metalType: MetalType;
  productionVolume: number;
  projectName: string;
  description: string;
  processRoute: ProcessRoute;
  recycledContent: number;
  virginMaterial: number;
  scrapInput: number;
  productYield: number;
  energySource: EnergySource;
  electricityConsumption: number;
  fuelType: FuelType;
  fuelConsumption: number;
  transportMode: TransportMode;
  transportDistance: number;
  recyclingRate: number;
  landfillPercentage: number;
  reusePotential: number;
  collectionEfficiency: number;
}

export interface AssessmentResults {
  circularityScore: number;
  co2Savings: number;
  energySavings: number;
  costImpact: number;
  resourceEfficiency: number;
  recommendations: Recommendation[];
  materialFlows: MaterialFlow[];
  benchmarkComparison: BenchmarkData;
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: number;
  implementationTimeline: string;
  confidence: number;
}

export interface MaterialFlow {
  source: string;
  target: string;
  value: number;
}

export interface BenchmarkData {
  industryAverage: number;
  topPerformers: number;
  yourScore: number;
  improvementPotential: number;
}

export interface Project {
  id: string;
  name: string;
  metalType: MetalType;
  circularityScore: number;
  createdAt: Date;
  updatedAt: Date;
  inputs: AssessmentInputs;
  results?: AssessmentResults;
  status: 'draft' | 'completed';
}
