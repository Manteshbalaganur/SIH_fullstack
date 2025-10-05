import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, TrendingUp, DollarSign, Zap, Recycle, Target, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CircularityGauge from '../components/CircularityGauge';
import SankeyDiagram from '../components/SankeyDiagram';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject } = useApp();

  const project = id ? getProject(id) : undefined;

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
    { category: 'Your Score', value: results.benchmarkComparison.yourScore },
    { category: 'Industry Avg', value: results.benchmarkComparison.industryAverage },
    { category: 'Top Performers', value: results.benchmarkComparison.topPerformers },
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
                {inputs.metalType.charAt(0).toUpperCase() + inputs.metalType.slice(1)} • {inputs.productionVolume} tons/year
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>

          <div className="flex justify-center py-8">
            <CircularityGauge score={results.circularityScore} size="large" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsData.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center mb-4`}>
                  <metric.icon className="w-6 h-6 text-white" />
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
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Comparative Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="category" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#0F766E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-sm text-teal-900">
                <span className="font-semibold">Improvement Potential:</span>{' '}
                Your score could increase by {results.benchmarkComparison.improvementPotential} points to match top performers.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Circularity Performance Radar</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748B" />
                <PolarRadiusAxis stroke="#64748B" />
                <Radar name="Score" dataKey="value" stroke="#0F766E" fill="#0F766E" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Material Flow Visualization</h2>
          <SankeyDiagram flows={results.materialFlows} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">AI-Powered Recommendations</h2>
            <span className="text-sm text-slate-600">
              {results.recommendations.length} recommendations
            </span>
          </div>

          <div className="space-y-4">
            {results.recommendations.map((rec) => {
              const PriorityIcon = getPriorityIcon(rec.priority);
              return (
                <div key={rec.id} className={`border rounded-lg p-6 ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <PriorityIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{rec.title}</h3>
                        <span className="text-xs font-medium uppercase px-3 py-1 rounded-full border">
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm mb-4">{rec.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Expected Impact:</span>
                          <p className="mt-1">+{rec.expectedImpact} points</p>
                        </div>
                        <div>
                          <span className="font-medium">Timeline:</span>
                          <p className="mt-1">{rec.implementationTimeline}</p>
                        </div>
                        <div>
                          <span className="font-medium">Confidence:</span>
                          <p className="mt-1">{Math.round(rec.confidence * 100)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Create a New Scenario</h2>
              <p className="text-teal-100">Test different parameters to optimize your circularity score</p>
            </div>
            <Link
              to="/new-assessment"
              className="inline-flex items-center px-6 py-3 bg-white text-teal-700 rounded-lg font-semibold hover:bg-slate-100 transition-all"
            >
              New Assessment
              <TrendingUp className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
