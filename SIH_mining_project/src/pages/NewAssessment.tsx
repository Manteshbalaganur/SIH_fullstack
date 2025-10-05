import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Lightbulb, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AssessmentInputs, MetalType, ProcessRoute, EnergySource, TransportMode, FuelType } from '../types';
import { calculateEnvironmentalImpact, calculateCircularityScore } from '../utils/calculations';
import CircularityGauge from '../components/CircularityGauge';
import { assessmentAPI } from '../service/api';
import { useUser } from '@clerk/clerk-react';

const NewAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { addProject } = useApp();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalSteps = 6;

  const [formData, setFormData] = useState<AssessmentInputs>({
    metalType: 'aluminum',
    productionVolume: 1000,
    projectName: '',
    description: '',
    processRoute: 'mixed',
    recycledContent: 30,
    virginMaterial: 70,
    scrapInput: 100,
    productYield: 85,
    energySource: 'grid',
    electricityConsumption: 15000,
    fuelType: 'natural-gas',
    fuelConsumption: 500,
    transportMode: 'truck',
    transportDistance: 200,
    recyclingRate: 70,
    landfillPercentage: 10,
    reusePotential: 20,
    collectionEfficiency: 80,
  });

  const updateField = (field: keyof AssessmentInputs, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const circularityPreview = calculateCircularityScore(formData);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('Please sign in to create assessment');
      return;
    }

    setLoading(true);

    try {
      // Prepare data for backend - match your backend schema
      const backendData = {
        user_id: user.id,
        project_name: formData.projectName || 'Untitled Project',
        metal_type: formData.metalType,
        production_volume: formData.productionVolume,
        production_method: formData.processRoute,
        electricity_source: formData.energySource,
        electricity_consumption: formData.electricityConsumption,
        fuel_type: formData.fuelType,
        fuel_consumption: formData.fuelConsumption,
        recycled_content: formData.recycledContent,
        scrap_input: formData.scrapInput,
        virgin_material: formData.virginMaterial,
        product_yield: formData.productYield,
        transport_mode: formData.transportMode,
        transport_distance: formData.transportDistance,
        recycling_rate: formData.recyclingRate,
        landfill_rate: formData.landfillPercentage,
        reuse_potential: formData.reusePotential,
        collection_efficiency: formData.collectionEfficiency,
      };

      console.log('📤 Sending to backend:', backendData);

      // Send to backend API
      const result = await assessmentAPI.createAssessment(backendData);
      
      if (result.success) {
        console.log('✅ Backend response:', result.data);
        
        // Transform backend data to frontend format
        const backendProject = {
          id: result.data._id,
          name: result.data.project_name || formData.projectName || 'Untitled Project',
          metalType: result.data.metal_type,
          circularityScore: result.data.circularity_score,
          createdAt: new Date(result.data.timestamp || new Date()),
          updatedAt: new Date(result.data.timestamp || new Date()),
          inputs: formData,
          results: {
            circularityScore: result.data.circularity_score,
            co2Savings: result.data.co2_emissions || 0,
            costImpact: result.data.cost_savings || 0,
            energySavings: result.data.energy_consumption || 0,
            resourceEfficiency: 75, // Default or calculate
            benchmarkComparison: {
              yourScore: result.data.circularity_score,
              industryAverage: 65,
              topPerformers: 85,
              improvementPotential: 85 - result.data.circularity_score,
            },
            recommendations: (result.data.ai_recommendations || []).map((rec: string, index: number) => ({
              id: index,
              title: rec,
              description: rec,
              priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
              expectedImpact: 10 - index * 2,
              implementationTimeline: index === 0 ? '1-3 months' : index === 1 ? '3-6 months' : '6-12 months',
              confidence: 0.8 - index * 0.1,
            })),
            materialFlows: result.data.material_flow || {
              nodes: [
                { name: 'Virgin Material', value: formData.virginMaterial },
                { name: 'Recycled Material', value: formData.recycledContent },
                { name: 'Production', value: formData.virginMaterial + formData.recycledContent },
                { name: 'Product', value: formData.productionVolume * (formData.productYield / 100) },
                { name: 'Recycling', value: formData.recyclingRate },
                { name: 'Landfill', value: formData.landfillPercentage },
              ],
              links: [
                { source: 0, target: 2, value: formData.virginMaterial },
                { source: 1, target: 2, value: formData.recycledContent },
                { source: 2, target: 3, value: formData.productionVolume * (formData.productYield / 100) },
                { source: 3, target: 4, value: formData.recyclingRate },
                { source: 3, target: 5, value: formData.landfillPercentage },
              ],
            },
          },
          status: 'completed' as const,
        };
        
        // Add to local context for immediate UI update
        addProject(backendProject);
        
        // Navigate to results page with backend ID
        navigate(`/results/${result.data._id}`);
        
      } else {
        console.error('❌ Backend error:', result.error);
        
        // Fallback: Use local calculations if backend fails
        console.log('🔄 Using fallback local calculations');
        const localResults = calculateEnvironmentalImpact(formData);
        const localProject = {
          id: Date.now().toString(),
          name: formData.projectName || 'Untitled Project',
          metalType: formData.metalType,
          circularityScore: localResults.circularityScore,
          createdAt: new Date(),
          updatedAt: new Date(),
          inputs: formData,
          results: localResults,
          status: 'completed' as const,
        };
        
        addProject(localProject);
        navigate(`/results/${localProject.id}`);
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      
      // Fallback to local calculations
      const localResults = calculateEnvironmentalImpact(formData);
      const localProject = {
        id: Date.now().toString(),
        name: formData.projectName || 'Untitled Project',
        metalType: formData.metalType,
        circularityScore: localResults.circularityScore,
        createdAt: new Date(),
        updatedAt: new Date(),
        inputs: formData,
        results: localResults,
        status: 'completed' as const,
      };
      
      addProject(localProject);
      navigate(`/results/${localProject.id}`);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Material Flows' },
    { number: 3, label: 'Energy' },
    { number: 4, label: 'Transportation' },
    { number: 5, label: 'End-of-Life' },
    { number: 6, label: 'Review' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">New Circularity Assessment</h1>
          <p className="text-slate-600 mt-2">Complete the steps below to calculate your circularity score</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      step.number < currentStep
                        ? 'bg-teal-700 text-white'
                        : step.number === currentStep
                        ? 'bg-teal-700 text-white ring-4 ring-teal-100'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step.number < currentStep ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <span className="text-xs mt-2 text-slate-600 hidden sm:block">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${step.number < currentStep ? 'bg-teal-700' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            {/* STEP 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={formData.projectName}
                      onChange={(e) => updateField('projectName', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      placeholder="Enter project name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Metal Type *
                    </label>
                    <select
                      value={formData.metalType}
                      onChange={(e) => updateField('metalType', e.target.value as MetalType)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    >
                      <option value="aluminum">Aluminum</option>
                      <option value="steel">Steel</option>
                      <option value="copper">Copper</option>
                      <option value="zinc">Zinc</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Production Volume (tons/year) *
                    </label>
                    <input
                      type="number"
                      value={formData.productionVolume}
                      onChange={(e) => updateField('productionVolume', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Production Method *
                    </label>
                    <select
                      value={formData.processRoute}
                      onChange={(e) => updateField('processRoute', e.target.value as ProcessRoute)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    >
                      <option value="primary">Primary Production</option>
                      <option value="secondary">Secondary/Recycling</option>
                      <option value="mixed">Mixed Route</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="Describe your project, product, or process..."
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Material Flows */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Material Flows</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Recycled Content (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.recycledContent}
                      onChange={(e) => updateField('recycledContent', Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-slate-600 mt-1">
                      <span>0%</span>
                      <span className="font-medium">{formData.recycledContent}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Virgin Material (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.virginMaterial}
                      onChange={(e) => updateField('virginMaterial', Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-slate-600 mt-1">
                      <span>0%</span>
                      <span className="font-medium">{formData.virginMaterial}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Scrap Input (kg/ton)
                    </label>
                    <input
                      type="number"
                      value={formData.scrapInput}
                      onChange={(e) => updateField('scrapInput', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Product Yield (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.productYield}
                      onChange={(e) => updateField('productYield', Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-slate-600 mt-1">
                      <span>0%</span>
                      <span className="font-medium">{formData.productYield}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Energy */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Energy Consumption</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Electricity Source
                    </label>
                    <select
                      value={formData.energySource}
                      onChange={(e) => updateField('energySource', e.target.value as EnergySource)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    >
                      <option value="grid">Grid Electricity</option>
                      <option value="renewable">Renewable Energy</option>
                      <option value="mixed">Mixed Sources</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Electricity Consumption (kWh/ton)
                    </label>
                    <input
                      type="number"
                      value={formData.electricityConsumption}
                      onChange={(e) => updateField('electricityConsumption', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fuel Type
                    </label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => updateField('fuelType', e.target.value as FuelType)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    >
                      <option value="natural-gas">Natural Gas</option>
                      <option value="diesel">Diesel</option>
                      <option value="coal">Coal</option>
                      <option value="biomass">Biomass</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fuel Consumption (GJ/ton)
                    </label>
                    <input
                      type="number"
                      value={formData.fuelConsumption}
                      onChange={(e) => updateField('fuelConsumption', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Transportation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Transportation & Logistics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Primary Transport Mode
                    </label>
                    <select
                      value={formData.transportMode}
                      onChange={(e) => updateField('transportMode', e.target.value as TransportMode)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    >
                      <option value="truck">Truck</option>
                      <option value="rail">Rail</option>
                      <option value="ship">Ship</option>
                      <option value="air">Air Freight</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Average Transport Distance (km)
                    </label>
                    <input
                      type="number"
                      value={formData.transportDistance}
                      onChange={(e) => updateField('transportDistance', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: End-of-Life */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">End-of-Life Scenarios</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Recycling Rate (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.recyclingRate}
                      onChange={(e) => updateField('recyclingRate', Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-slate-600 mt-1">
                      <span>0%</span>
                      <span className="font-medium">{formData.recyclingRate}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Landfill Percentage (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.landfillPercentage}
                      onChange={(e) => updateField('landfillPercentage', Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-slate-600 mt-1">
                      <span>0%</span>
                      <span className="font-medium">{formData.landfillPercentage}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Reuse Potential (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.reusePotential}
                      onChange={(e) => updateField('reusePotential', Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-slate-600 mt-1">
                      <span>0%</span>
                      <span className="font-medium">{formData.reusePotential}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Collection Efficiency (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.collectionEfficiency}
                      onChange={(e) => updateField('collectionEfficiency', Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-slate-600 mt-1">
                      <span>0%</span>
                      <span className="font-medium">{formData.collectionEfficiency}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Review */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Review & Calculate</h2>
                
                <div className="bg-slate-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Circularity Preview</h3>
                    {/* // In the Review step, change this: */}
<div className="w-24 h-24">
  <CircularityGauge score={circularityPreview} size="sm" />
</div>
                  </div>
                  <p className="text-slate-600 text-sm">
                    Based on your inputs, your estimated circularity score is <strong>{circularityPreview}/100</strong>.
                    Click "Calculate Results" to get your detailed assessment with recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Project Name:</span>
                        <span className="font-medium">{formData.projectName || 'Untitled Project'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Metal Type:</span>
                        <span className="font-medium capitalize">{formData.metalType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Production Volume:</span>
                        <span className="font-medium">{formData.productionVolume} tons/year</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">Key Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Recycled Content:</span>
                        <span className="font-medium">{formData.recycledContent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Product Yield:</span>
                        <span className="font-medium">{formData.productYield}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Recycling Rate:</span>
                        <span className="font-medium">{formData.recyclingRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="inline-flex items-center px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="mr-2 w-5 h-5" />
              Back
            </button>

            <div className="text-sm text-slate-600">
              Step {currentStep} of {totalSteps}
            </div>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center px-6 py-3 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-all"
              >
                Next
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-lg font-semibold hover:from-teal-800 hover:to-emerald-800 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    Calculate Results
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAssessment;
//without backend 

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, ChevronRight, Check, Lightbulb, ArrowRight } from 'lucide-react';
// import { useApp } from '../context/AppContext';
// import { AssessmentInputs, MetalType, ProcessRoute, EnergySource, TransportMode, FuelType } from '../types';
// import { calculateEnvironmentalImpact, calculateCircularityScore } from '../utils/calculations';
// import CircularityGauge from '../components/CircularityGauge';

// const NewAssessment: React.FC = () => {
//   const navigate = useNavigate();
//   const { addProject } = useApp();
//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 6;

//   const [formData, setFormData] = useState<AssessmentInputs>({
//     metalType: 'aluminum',
//     productionVolume: 1000,
//     projectName: '',
//     description: '',
//     processRoute: 'mixed',
//     recycledContent: 30,
//     virginMaterial: 70,
//     scrapInput: 100,
//     productYield: 85,
//     energySource: 'grid',
//     electricityConsumption: 15000,
//     fuelType: 'natural-gas',
//     fuelConsumption: 500,
//     transportMode: 'truck',
//     transportDistance: 200,
//     recyclingRate: 70,
//     landfillPercentage: 10,
//     reusePotential: 20,
//     collectionEfficiency: 80,
//   });

//   const updateField = (field: keyof AssessmentInputs, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const circularityPreview = calculateCircularityScore(formData);

//   const handleNext = () => {
//     if (currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleSubmit = () => {
//     const results = calculateEnvironmentalImpact(formData);
//     const project = {
//       id: Date.now().toString(),
//       name: formData.projectName || 'Untitled Project',
//       metalType: formData.metalType,
//       circularityScore: results.circularityScore,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       inputs: formData,
//       results,
//       status: 'completed' as const,
//     };
//     addProject(project);
//     navigate(`/results/${project.id}`);
//   };

//   const steps = [
//     { number: 1, label: 'Basic Info' },
//     { number: 2, label: 'Material Flows' },
//     { number: 3, label: 'Energy' },
//     { number: 4, label: 'Transportation' },
//     { number: 5, label: 'End-of-Life' },
//     { number: 6, label: 'Review' },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 pt-16">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-slate-800">New Circularity Assessment</h1>
//           <p className="text-slate-600 mt-2">Complete the steps below to calculate your circularity score</p>
//         </div>

//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             {steps.map((step, index) => (
//               <React.Fragment key={step.number}>
//                 <div className="flex flex-col items-center">
//                   <div
//                     className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
//                       step.number < currentStep
//                         ? 'bg-teal-700 text-white'
//                         : step.number === currentStep
//                         ? 'bg-teal-700 text-white ring-4 ring-teal-100'
//                         : 'bg-slate-200 text-slate-500'
//                     }`}
//                   >
//                     {step.number < currentStep ? <Check className="w-5 h-5" /> : step.number}
//                   </div>
//                   <span className="text-xs mt-2 text-slate-600 hidden sm:block">{step.label}</span>
//                 </div>
//                 {index < steps.length - 1 && (
//                   <div className={`flex-1 h-1 mx-2 rounded ${step.number < currentStep ? 'bg-teal-700' : 'bg-slate-200'}`} />
//                 )}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//           <div className="p-8">
//             {currentStep === 1 && (
//               <div className="space-y-6">
//                 <h2 className="text-2xl font-bold text-slate-800 mb-6">Basic Information</h2>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
//                   <input
//                     type="text"
//                     value={formData.projectName}
//                     onChange={e => updateField('projectName', e.target.value)}
//                     placeholder="e.g., Q1 2025 Aluminum Production"
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
//                   <textarea
//                     value={formData.description}
//                     onChange={e => updateField('description', e.target.value)}
//                     placeholder="Brief description of this assessment..."
//                     rows={3}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Metal Type</label>
//                     <select
//                       value={formData.metalType}
//                       onChange={e => updateField('metalType', e.target.value as MetalType)}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                     >
//                       <option value="aluminum">Aluminum</option>
//                       <option value="copper">Copper</option>
//                       <option value="steel">Steel</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Process Route</label>
//                     <select
//                       value={formData.processRoute}
//                       onChange={e => updateField('processRoute', e.target.value as ProcessRoute)}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                     >
//                       <option value="primary">Primary (Virgin)</option>
//                       <option value="secondary">Secondary (Recycled)</option>
//                       <option value="mixed">Mixed</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Production Volume (tons/year)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.productionVolume}
//                     onChange={e => updateField('productionVolume', parseFloat(e.target.value))}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                   />
//                 </div>

//                 <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex items-start space-x-3">
//                   <Lightbulb className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-teal-900">AI Suggestion</p>
//                     <p className="text-sm text-teal-700 mt-1">
//                       Industry average for {formData.metalType} production is ~5,000 tons/year. Consider this benchmark for comparison.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {currentStep === 2 && (
//               <div className="space-y-6">
//                 <h2 className="text-2xl font-bold text-slate-800 mb-6">Material Flows</h2>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Recycled Content: {formData.recycledContent}%
//                   </label>
//                   <input
//                     type="range"
//                     min="0"
//                     max="100"
//                     value={formData.recycledContent}
//                     onChange={e => {
//                       const value = parseFloat(e.target.value);
//                       updateField('recycledContent', value);
//                       updateField('virginMaterial', 100 - value);
//                     }}
//                     className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
//                   />
//                   <div className="flex justify-between text-xs text-slate-600 mt-1">
//                     <span>0%</span>
//                     <span>50%</span>
//                     <span>100%</span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Virgin Material (%)</label>
//                     <input
//                       type="number"
//                       value={formData.virginMaterial}
//                       onChange={e => {
//                         const value = parseFloat(e.target.value);
//                         updateField('virginMaterial', value);
//                         updateField('recycledContent', 100 - value);
//                       }}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Scrap Input (tons)</label>
//                     <input
//                       type="number"
//                       value={formData.scrapInput}
//                       onChange={e => updateField('scrapInput', parseFloat(e.target.value))}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Product Yield: {formData.productYield}%
//                   </label>
//                   <input
//                     type="range"
//                     min="50"
//                     max="100"
//                     value={formData.productYield}
//                     onChange={e => updateField('productYield', parseFloat(e.target.value))}
//                     className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
//                   />
//                   <div className="flex justify-between text-xs text-slate-600 mt-1">
//                     <span>50%</span>
//                     <span>75%</span>
//                     <span>100%</span>
//                   </div>
//                 </div>

//                 <div className="bg-white border-2 border-teal-200 rounded-lg p-6">
//                   <h3 className="text-sm font-semibold text-slate-700 mb-4 text-center">Real-time Circularity Preview</h3>
//                   <div className="flex justify-center">
//                     <CircularityGauge score={circularityPreview} size="small" showLabel={false} />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {currentStep === 3 && (
//               <div className="space-y-6">
//                 <h2 className="text-2xl font-bold text-slate-800 mb-6">Energy Consumption</h2>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Electricity Source</label>
//                   <div className="grid grid-cols-3 gap-4">
//                     {(['grid', 'renewable', 'mixed'] as EnergySource[]).map(source => (
//                       <button
//                         key={source}
//                         onClick={() => updateField('energySource', source)}
//                         className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
//                           formData.energySource === source
//                             ? 'border-teal-700 bg-teal-50 text-teal-700'
//                             : 'border-slate-200 hover:border-slate-300'
//                         }`}
//                       >
//                         {source.charAt(0).toUpperCase() + source.slice(1)}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Electricity Consumption (kWh/ton)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.electricityConsumption}
//                     onChange={e => updateField('electricityConsumption', parseFloat(e.target.value))}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Fuel Type</label>
//                     <select
//                       value={formData.fuelType}
//                       onChange={e => updateField('fuelType', e.target.value as FuelType)}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                     >
//                       <option value="natural-gas">Natural Gas</option>
//                       <option value="coal">Coal</option>
//                       <option value="oil">Oil</option>
//                       <option value="biomass">Biomass</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Fuel Consumption (kg/ton)
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.fuelConsumption}
//                       onChange={e => updateField('fuelConsumption', parseFloat(e.target.value))}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                     />
//                   </div>
//                 </div>

//                 {formData.energySource !== 'renewable' && (
//                   <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
//                     <Lightbulb className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
//                     <div>
//                       <p className="text-sm font-medium text-amber-900">AI Recommendation</p>
//                       <p className="text-sm text-amber-700 mt-1">
//                         Switching to renewable energy could improve your circularity score by up to 15 points and reduce CO2 emissions by 40%.
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {currentStep === 4 && (
//               <div className="space-y-6">
//                 <h2 className="text-2xl font-bold text-slate-800 mb-6">Transportation & Logistics</h2>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Transport Mode</label>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {(['truck', 'rail', 'ship', 'air'] as TransportMode[]).map(mode => (
//                       <button
//                         key={mode}
//                         onClick={() => updateField('transportMode', mode)}
//                         className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
//                           formData.transportMode === mode
//                             ? 'border-teal-700 bg-teal-50 text-teal-700'
//                             : 'border-slate-200 hover:border-slate-300'
//                         }`}
//                       >
//                         {mode.charAt(0).toUpperCase() + mode.slice(1)}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Transport Distance (km)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.transportDistance}
//                     onChange={e => updateField('transportDistance', parseFloat(e.target.value))}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                   />
//                 </div>

//                 <div className="bg-slate-100 rounded-lg p-6">
//                   <h3 className="font-semibold text-slate-800 mb-4">Estimated Emission Factors</h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-slate-600">Transport Mode:</span>
//                       <span className="font-medium text-slate-800">{formData.transportMode}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-slate-600">Distance:</span>
//                       <span className="font-medium text-slate-800">{formData.transportDistance} km</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-slate-600">Est. CO2 per ton:</span>
//                       <span className="font-medium text-slate-800">
//                         {(formData.transportDistance * 0.12).toFixed(2)} kg
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {currentStep === 5 && (
//               <div className="space-y-6">
//                 <h2 className="text-2xl font-bold text-slate-800 mb-6">End-of-Life Scenarios</h2>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Recycling Rate: {formData.recyclingRate}%
//                   </label>
//                   <input
//                     type="range"
//                     min="0"
//                     max="100"
//                     value={formData.recyclingRate}
//                     onChange={e => updateField('recyclingRate', parseFloat(e.target.value))}
//                     className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
//                   />
//                   <div className="flex justify-between text-xs text-slate-600 mt-1">
//                     <span>0%</span>
//                     <span>50%</span>
//                     <span>100%</span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Landfill Percentage: {formData.landfillPercentage}%
//                   </label>
//                   <input
//                     type="range"
//                     min="0"
//                     max="100"
//                     value={formData.landfillPercentage}
//                     onChange={e => updateField('landfillPercentage', parseFloat(e.target.value))}
//                     className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
//                   />
//                   <div className="flex justify-between text-xs text-slate-600 mt-1">
//                     <span>0%</span>
//                     <span>50%</span>
//                     <span>100%</span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Reuse Potential: {formData.reusePotential}%
//                   </label>
//                   <input
//                     type="range"
//                     min="0"
//                     max="100"
//                     value={formData.reusePotential}
//                     onChange={e => updateField('reusePotential', parseFloat(e.target.value))}
//                     className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
//                   />
//                   <div className="flex justify-between text-xs text-slate-600 mt-1">
//                     <span>0%</span>
//                     <span>50%</span>
//                     <span>100%</span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Collection Efficiency: {formData.collectionEfficiency}%
//                   </label>
//                   <input
//                     type="range"
//                     min="0"
//                     max="100"
//                     value={formData.collectionEfficiency}
//                     onChange={e => updateField('collectionEfficiency', parseFloat(e.target.value))}
//                     className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
//                   />
//                   <div className="flex justify-between text-xs text-slate-600 mt-1">
//                     <span>0%</span>
//                     <span>50%</span>
//                     <span>100%</span>
//                   </div>
//                 </div>

//                 <div className="bg-slate-100 rounded-lg p-6">
//                   <h3 className="font-semibold text-slate-800 mb-4">Material Recovery Summary</h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-slate-600">Total Recycled:</span>
//                       <span className="font-medium text-emerald-700">{formData.recyclingRate}%</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-slate-600">Landfill:</span>
//                       <span className="font-medium text-red-600">{formData.landfillPercentage}%</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-slate-600">Reuse Potential:</span>
//                       <span className="font-medium text-teal-700">{formData.reusePotential}%</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {currentStep === 6 && (
//               <div className="space-y-6">
//                 <h2 className="text-2xl font-bold text-slate-800 mb-6">Review & Calculate</h2>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-slate-50 rounded-lg p-6">
//                     <h3 className="font-semibold text-slate-800 mb-4">Project Details</h3>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-slate-600">Name:</span>
//                         <span className="font-medium text-slate-800">{formData.projectName || 'Untitled'}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-slate-600">Metal Type:</span>
//                         <span className="font-medium text-slate-800 capitalize">{formData.metalType}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-slate-600">Production Volume:</span>
//                         <span className="font-medium text-slate-800">{formData.productionVolume} tons</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-slate-50 rounded-lg p-6">
//                     <h3 className="font-semibold text-slate-800 mb-4">Material Flows</h3>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-slate-600">Recycled Content:</span>
//                         <span className="font-medium text-slate-800">{formData.recycledContent}%</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-slate-600">Product Yield:</span>
//                         <span className="font-medium text-slate-800">{formData.productYield}%</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-slate-600">Recycling Rate:</span>
//                         <span className="font-medium text-slate-800">{formData.recyclingRate}%</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-slate-50 rounded-lg p-6">
//                     <h3 className="font-semibold text-slate-800 mb-4">Energy</h3>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-slate-600">Energy Source:</span>
//                         <span className="font-medium text-slate-800 capitalize">{formData.energySource}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-slate-600">Electricity:</span>
//                         <span className="font-medium text-slate-800">{formData.electricityConsumption} kWh/ton</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-slate-600">Fuel Type:</span>
//                         <span className="font-medium text-slate-800 capitalize">{formData.fuelType.replace('-', ' ')}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-slate-50 rounded-lg p-6">
//                     <h3 className="font-semibold text-slate-800 mb-4">Transportation</h3>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-slate-600">Mode:</span>
//                         <span className="font-medium text-slate-800 capitalize">{formData.transportMode}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-slate-600">Distance:</span>
//                         <span className="font-medium text-slate-800">{formData.transportDistance} km</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-lg p-8">
//                   <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">
//                     Predicted Circularity Score
//                   </h3>
//                   <div className="flex justify-center">
//                     <CircularityGauge score={circularityPreview} size="large" />
//                   </div>
//                 </div>

//                 <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
//                   <Lightbulb className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-amber-900">AI Quick Analysis</p>
//                     <p className="text-sm text-amber-700 mt-1">
//                       Based on your inputs, this project shows {circularityPreview >= 70 ? 'strong' : 'moderate'} circularity performance.
//                       Click Calculate to see detailed recommendations for improvement.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
//             <button
//               onClick={handleBack}
//               disabled={currentStep === 1}
//               className="inline-flex items-center px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft className="mr-2 w-5 h-5" />
//               Back
//             </button>

//             <div className="text-sm text-slate-600">
//               Step {currentStep} of {totalSteps}
//             </div>

//             {currentStep < totalSteps ? (
//               <button
//                 onClick={handleNext}
//                 className="inline-flex items-center px-6 py-3 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-all"
//               >
//                 Next
//                 <ChevronRight className="ml-2 w-5 h-5" />
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-lg font-semibold hover:from-teal-800 hover:to-emerald-800 transition-all shadow-lg"
//               >
//                 Calculate Results
//                 <ArrowRight className="ml-2 w-5 h-5" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewAssessment;
