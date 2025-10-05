import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, TrendingUp, DollarSign, Zap, Recycle, Target, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CircularityGauge from '../components/CircularityGauge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { assessmentAPI } from '../service/api';


import {  Loader } from 'lucide-react';
import { pdfService } from '../service/pdfService';

// Add this component inside your Results page
const PDFDownloadButton: React.FC<{ assessmentId: string; assessmentData: any }> = ({ 
  assessmentId, 
  assessmentData 
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await pdfService.downloadAssessmentPDF(assessmentId, assessmentData);
      // Optional: Show success message
      console.log('PDF downloaded successfully');
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {downloading ? (
        <Loader className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      {downloading ? 'Generating PDF...' : 'Download PDF Report'}
    </button>
  );
};

// Usage in your Results component:
// <PDFDownloadButton assessmentId={project.id} assessmentData={project} />
// Interface for backend data
interface BackendAssessment {
  _id: string;
  user_id: string;
  project_name: string;
  metal_type: string;
  production_volume: number;
  circularity_score: number;
  co2_emissions: number;
  energy_consumption: number;
  cost_savings: number;
  ai_recommendations: string[];
  chart_data?: any;
  material_flow?: any;
  timestamp: string;
  recycled_content?: number;
  product_yield?: number;
  recycling_rate?: number;
  electricity_source?: string;
  collection_efficiency?: number;
}

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject } = useApp();
  
  const [backendData, setBackendData] = useState<BackendAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [localProject, setLocalProject] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Try to get from backend first
        console.log('📥 Fetching from backend:', id);
        const backendResult = await assessmentAPI.getAssessment(id);
        
        if (backendResult.success) {
          console.log('✅ Backend data received:', backendResult.data);
          setBackendData(backendResult.data);
        } else {
          console.log('ℹ️ No backend data, using local context');
          // Fallback to local context
          const localProjectData = getProject(id);
          setLocalProject(localProjectData);
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        // Fallback to local context
        const localProjectData = getProject(id);
        setLocalProject(localProjectData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, getProject]);

  // Use backend data if available, otherwise use local project
  const project = backendData ? transformBackendData(backendData) : localProject;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading assessment results...</p>
        </div>
      </div>
    );
  }

  if (!project || !project.results) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Project not found</p>
          <Link to="/dashboard" className="text-teal-700 hover:text-teal-800 font-medium">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { results, inputs } = project;

  const metricsData = [
    {
      label: 'Environmental Impact',
      value: Math.min(100, Math.round(results.co2Savings / 100)),
      icon: Recycle,
      color: 'from-emerald-500 to-teal-600',
      description: `${(results.co2Savings / 1000).toFixed(1)}t CO2 saved`,
    },
    {
      label: 'Economic Savings',
      value: Math.min(100, Math.round(Math.abs(results.costImpact) / 1000)),
      icon: DollarSign,
      color: 'from-amber-500 to-orange-600',
      description: `$${Math.abs(results.costImpact / 1000).toFixed(0)}k ${results.costImpact < 0 ? 'saved' : 'cost'}`,
    },
    {
      label: 'Resource Efficiency',
      value: results.resourceEfficiency,
      icon: Zap,
      color: 'from-teal-500 to-cyan-600',
      description: `${results.resourceEfficiency}% efficiency`,
    },
    {
      label: 'Circular Potential',
      value: results.circularityScore,
      icon: Target,
      color: 'from-purple-500 to-pink-600',
      description: 'Overall score',
    },
  ];

  const comparisonData = [
    { category: 'Your Score', value: results.benchmarkComparison?.yourScore || results.circularityScore },
    { category: 'Industry Avg', value: results.benchmarkComparison?.industryAverage || 65 },
    { category: 'Top Performers', value: results.benchmarkComparison?.topPerformers || 85 },
  ];

  const radarData = [
    { subject: 'Recycled Content', value: inputs.recycledContent, fullMark: 100 },
    { subject: 'Product Yield', value: inputs.productYield, fullMark: 100 },
    { subject: 'Recycling Rate', value: inputs.recyclingRate, fullMark: 100 },
    { subject: 'Energy Efficiency', value: inputs.energySource === 'renewable' ? 100 : inputs.energySource === 'mixed' ? 60 : 30, fullMark: 100 },
    { subject: 'Collection', value: inputs.collectionEfficiency, fullMark: 100 },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Clock;
      case 'low': return CheckCircle2;
      default: return CheckCircle2;
    }
  };

  const handleDownloadPDF = async () => {
    if (!id) return;
    
    try {
      const result = await assessmentAPI.generatePDF(id);
      if (result.success) {
        alert('PDF download will be available soon!');
      } else {
        alert('PDF generation not available yet');
      }
    } catch (error) {
      console.error('PDF download error:', error);
      alert('PDF generation not available yet');
    }
  };

  const handleShare = async () => {
    if (!project) return;
    
    const shareData = {
      title: 'Circularity Assessment',
      text: `My ${project.metalType} production achieved ${project.circularityScore}% circularity score!`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{project.name}</h1>
              <p className="text-slate-600 mt-2">
                {project.metalType.charAt(0).toUpperCase() + project.metalType.slice(1)} • {inputs.productionVolume} tons/year
                {backendData && <span className="ml-2 text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">Backend Powered</span>}
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button 
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="inline-flex items-center px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>

          <div className="flex justify-center py-8">
            <CircularityGauge score={results.circularityScore} size="lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsData.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">{metric.label}</h3>
                  <div className="mb-3">
                    <div className="flex items-end space-x-2">
                      <span className="text-3xl font-bold text-slate-800">{metric.value}</span>
                      <span className="text-slate-500 text-sm pb-1">/100</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${metric.color}`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{metric.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Performance Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="category" stroke="#64748B" />
                <YAxis stroke="#64748B" domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#0F766E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Circularity Radar</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Performance" dataKey="value" stroke="#0F766E" fill="#0F766E" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {results.recommendations && results.recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">AI Recommendations</h2>
            <div className="space-y-4">
              {results.recommendations.map((rec: any) => {
                const PriorityIcon = getPriorityIcon(rec.priority);
                return (
                  <div key={rec.id} className={`p-4 border rounded-lg ${getPriorityColor(rec.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <PriorityIcon className="w-5 h-5 mr-2" />
                          <h3 className="font-semibold">{rec.title}</h3>
                          <span className="ml-2 text-xs px-2 py-1 rounded capitalize">
                            {rec.priority} priority
                          </span>
                        </div>
                        <p className="text-sm mb-2">{rec.description}</p>
                        <div className="flex items-center text-xs text-slate-600 space-x-4">
                          <span>Impact: {rec.expectedImpact}/10</span>
                          <span>Timeline: {rec.implementationTimeline}</span>
                          <span>Confidence: {Math.round(rec.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready for Another Assessment?</h2>
          <p className="text-teal-100 mb-6">
            Compare different scenarios or optimize your current process further.
          </p>
          <button
            onClick={() => navigate('/new-assessment')}
            className="inline-flex items-center px-6 py-3 bg-white text-teal-700 rounded-lg font-semibold hover:bg-slate-100 transition-all"
          >
            Create New Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to transform backend data to frontend format
function transformBackendData(backendData: BackendAssessment): any {
  return {
    id: backendData._id,
    name: backendData.project_name,
    metalType: backendData.metal_type,
    circularityScore: backendData.circularity_score,
    inputs: {
      metalType: backendData.metal_type,
      productionVolume: backendData.production_volume,
      recycledContent: backendData.recycled_content || 30,
      productYield: backendData.product_yield || 85,
      recyclingRate: backendData.recycling_rate || 70,
      energySource: backendData.electricity_source || 'grid',
      collectionEfficiency: backendData.collection_efficiency || 80,
    },
    results: {
      circularityScore: backendData.circularity_score,
      co2Savings: backendData.co2_emissions || 0,
      costImpact: backendData.cost_savings || 0,
      resourceEfficiency: 75,
      benchmarkComparison: {
        yourScore: backendData.circularity_score,
        industryAverage: 65,
        topPerformers: 85,
        improvementPotential: 85 - backendData.circularity_score,
      },
      recommendations: (backendData.ai_recommendations || []).map((rec: string, index: number) => ({
        id: index,
        title: rec,
        description: rec,
        priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
        expectedImpact: 10 - index * 2,
        implementationTimeline: index === 0 ? '1-3 months' : index === 1 ? '3-6 months' : '6-12 months',
        confidence: 0.8 - index * 0.1,
      })),
      materialFlows: backendData.material_flow || {
        nodes: [
          { name: 'Virgin Material', value: 70 },
          { name: 'Recycled Material', value: 30 },
          { name: 'Production', value: 100 },
          { name: 'Product', value: 85 },
          { name: 'Recycling', value: 60 },
          { name: 'Landfill', value: 25 },
        ],
        links: [
          { source: 0, target: 2, value: 70 },
          { source: 1, target: 2, value: 30 },
          { source: 2, target: 3, value: 85 },
          { source: 3, target: 4, value: 60 },
          { source: 3, target: 5, value: 25 },
        ],
      },
    },
  };
}

export default Results;
// my old code 
// import React from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { ArrowLeft, Download, Share2, TrendingUp, DollarSign, Zap, Recycle, Target, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
// import { useApp } from '../context/AppContext';
// import CircularityGauge from '../components/CircularityGauge';
// import SankeyDiagram from '../components/SankeyDiagram';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// const Results: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { getProject } = useApp();

//   const project = id ? getProject(id) : undefined;

//   if (!project || !project.results) {
//     return (
//       <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-slate-600 mb-4">Project not found</p>
//           <Link to="/dashboard" className="text-teal-700 hover:text-teal-800 font-medium">
//             Return to Dashboard
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const { results, inputs } = project;

//   const metricsData = [
//     {
//       label: 'Environmental Impact',
//       value: Math.min(100, Math.round(results.co2Savings / 100)),
//       icon: Recycle,
//       color: 'from-emerald-500 to-teal-600',
//       description: `${(results.co2Savings / 1000).toFixed(1)}t CO2 saved`,
//     },
//     {
//       label: 'Economic Savings',
//       value: Math.min(100, Math.round(Math.abs(results.costImpact) / 1000)),
//       icon: DollarSign,
//       color: 'from-amber-500 to-orange-600',
//       description: `$${Math.abs(results.costImpact / 1000).toFixed(0)}k ${results.costImpact < 0 ? 'saved' : 'cost'}`,
//     },
//     {
//       label: 'Resource Efficiency',
//       value: results.resourceEfficiency,
//       icon: Zap,
//       color: 'from-teal-500 to-cyan-600',
//       description: `${results.resourceEfficiency}% efficiency`,
//     },
//     {
//       label: 'Circular Potential',
//       value: results.circularityScore,
//       icon: Target,
//       color: 'from-purple-500 to-pink-600',
//       description: 'Overall score',
//     },
//   ];

//   const comparisonData = [
//     { category: 'Your Score', value: results.benchmarkComparison.yourScore },
//     { category: 'Industry Avg', value: results.benchmarkComparison.industryAverage },
//     { category: 'Top Performers', value: results.benchmarkComparison.topPerformers },
//   ];

//   const radarData = [
//     { subject: 'Recycled Content', value: inputs.recycledContent, fullMark: 100 },
//     { subject: 'Product Yield', value: inputs.productYield, fullMark: 100 },
//     { subject: 'Recycling Rate', value: inputs.recyclingRate, fullMark: 100 },
//     { subject: 'Energy Efficiency', value: inputs.energySource === 'renewable' ? 100 : inputs.energySource === 'mixed' ? 60 : 30, fullMark: 100 },
//     { subject: 'Collection', value: inputs.collectionEfficiency, fullMark: 100 },
//   ];

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'high': return 'text-red-700 bg-red-50 border-red-200';
//       case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200';
//       case 'low': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
//       default: return 'text-slate-700 bg-slate-50 border-slate-200';
//     }
//   };

//   const getPriorityIcon = (priority: string) => {
//     switch (priority) {
//       case 'high': return AlertCircle;
//       case 'medium': return Clock;
//       case 'low': return CheckCircle2;
//       default: return CheckCircle2;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 pt-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-6">
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5 mr-2" />
//             Back to Dashboard
//           </button>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-slate-800">{project.name}</h1>
//               <p className="text-slate-600 mt-2">
//                 {inputs.metalType.charAt(0).toUpperCase() + inputs.metalType.slice(1)} • {inputs.productionVolume} tons/year
//               </p>
//             </div>
//             <div className="flex items-center space-x-3 mt-4 md:mt-0">
//               <button className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
//                 <Share2 className="w-4 h-4 mr-2" />
//                 Share
//               </button>
//               <button className="inline-flex items-center px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors">
//                 <Download className="w-4 h-4 mr-2" />
//                 Export PDF
//               </button>
//             </div>
//           </div>

//           <div className="flex justify-center py-8">
//             <CircularityGauge score={results.circularityScore} size="large" />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {metricsData.map((metric, index) => (
//             <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//               <div className="p-6">
//                 <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center mb-4`}>
//                   <metric.icon className="w-6 h-6 text-white" />
//                 </div>
//                 <h3 className="text-sm font-semibold text-slate-700 mb-2">{metric.label}</h3>
//                 <div className="mb-3">
//                   <div className="flex items-end space-x-2">
//                     <span className="text-3xl font-bold text-slate-800">{metric.value}</span>
//                     <span className="text-slate-500 text-sm pb-1">/100</span>
//                   </div>
//                   <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
//                     <div
//                       className={`h-2 rounded-full bg-gradient-to-r ${metric.color}`}
//                       style={{ width: `${metric.value}%` }}
//                     ></div>
//                   </div>
//                 </div>
//                 <p className="text-sm text-slate-600">{metric.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//             <h2 className="text-xl font-bold text-slate-800 mb-6">Comparative Analysis</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={comparisonData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
//                 <XAxis dataKey="category" stroke="#64748B" />
//                 <YAxis stroke="#64748B" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#FFFFFF',
//                     border: '1px solid #E2E8F0',
//                     borderRadius: '8px',
//                   }}
//                 />
//                 <Bar dataKey="value" fill="#0F766E" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//             <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
//               <p className="text-sm text-teal-900">
//                 <span className="font-semibold">Improvement Potential:</span>{' '}
//                 Your score could increase by {results.benchmarkComparison.improvementPotential} points to match top performers.
//               </p>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//             <h2 className="text-xl font-bold text-slate-800 mb-6">Circularity Performance Radar</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <RadarChart data={radarData}>
//                 <PolarGrid stroke="#E2E8F0" />
//                 <PolarAngleAxis dataKey="subject" stroke="#64748B" />
//                 <PolarRadiusAxis stroke="#64748B" />
//                 <Radar name="Score" dataKey="value" stroke="#0F766E" fill="#0F766E" fillOpacity={0.6} />
//               </RadarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
//           <h2 className="text-xl font-bold text-slate-800 mb-6">Material Flow Visualization</h2>
//           <SankeyDiagram flows={results.materialFlows} />
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-slate-800">AI-Powered Recommendations</h2>
//             <span className="text-sm text-slate-600">
//               {results.recommendations.length} recommendations
//             </span>
//           </div>

//           <div className="space-y-4">
//             {results.recommendations.map((rec) => {
//               const PriorityIcon = getPriorityIcon(rec.priority);
//               return (
//                 <div key={rec.id} className={`border rounded-lg p-6 ${getPriorityColor(rec.priority)}`}>
//                   <div className="flex items-start space-x-4">
//                     <div className="flex-shrink-0">
//                       <PriorityIcon className="w-6 h-6" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-start justify-between mb-2">
//                         <h3 className="font-semibold text-lg">{rec.title}</h3>
//                         <span className="text-xs font-medium uppercase px-3 py-1 rounded-full border">
//                           {rec.priority}
//                         </span>
//                       </div>
//                       <p className="text-sm mb-4">{rec.description}</p>
//                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
//                         <div>
//                           <span className="font-medium">Expected Impact:</span>
//                           <p className="mt-1">+{rec.expectedImpact} points</p>
//                         </div>
//                         <div>
//                           <span className="font-medium">Timeline:</span>
//                           <p className="mt-1">{rec.implementationTimeline}</p>
//                         </div>
//                         <div>
//                           <span className="font-medium">Confidence:</span>
//                           <p className="mt-1">{Math.round(rec.confidence * 100)}%</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-xl shadow-lg p-8 text-white mb-8">
//           <div className="flex flex-col md:flex-row items-center justify-between">
//             <div className="mb-4 md:mb-0">
//               <h2 className="text-2xl font-bold mb-2">Create a New Scenario</h2>
//               <p className="text-teal-100">Test different parameters to optimize your circularity score</p>
//             </div>
//             <Link
//               to="/new-assessment"
//               className="inline-flex items-center px-6 py-3 bg-white text-teal-700 rounded-lg font-semibold hover:bg-slate-100 transition-all"
//             >
//               New Assessment
//               <TrendingUp className="ml-2 w-5 h-5" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Results;
