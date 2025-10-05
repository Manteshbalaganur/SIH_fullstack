import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Plus, FolderOpen, FileText, Settings, TrendingUp, TrendingDown, Zap, DollarSign, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CircularityGauge from '../components/CircularityGauge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard: React.FC = () => {
  const { projects } = useApp();

  const completedProjects = projects.filter(p => p.status === 'completed');
  const avgCircularityScore = completedProjects.length > 0
    ? Math.round(completedProjects.reduce((sum, p) => sum + p.circularityScore, 0) / completedProjects.length)
    : 0;

  const totalCO2Saved = completedProjects.reduce((sum, p) => sum + (p.results?.co2Savings || 0), 0);
  const totalEnergySaved = completedProjects.reduce((sum, p) => sum + (p.results?.energySavings || 0), 0);
  const totalCostImpact = completedProjects.reduce((sum, p) => sum + (p.results?.costImpact || 0), 0);

  const trendData = [
    { month: 'Jan', score: 58 },
    { month: 'Feb', score: 62 },
    { month: 'Mar', score: 65 },
    { month: 'Apr', score: 68 },
    { month: 'May', score: 72 },
    { month: 'Jun', score: avgCircularityScore || 75 },
  ];

  const metalTypeData = [
    { metal: 'Aluminum', score: 68 },
    { metal: 'Copper', score: 72 },
    { metal: 'Steel', score: 65 },
  ];

  const stats = [
    {
      label: 'Avg Circularity Score',
      value: avgCircularityScore,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Total CO2 Saved',
      value: `${(totalCO2Saved / 1000).toFixed(1)}t`,
      icon: Zap,
      color: 'from-teal-500 to-cyan-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Energy Efficiency',
      value: `${(totalEnergySaved / 1000).toFixed(0)}k kWh`,
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      trend: '+5%',
      trendUp: true,
    },
    {
      label: 'Cost Impact',
      value: `$${Math.abs(totalCostImpact / 1000).toFixed(0)}k`,
      icon: DollarSign,
      color: 'from-emerald-500 to-green-600',
      trend: totalCostImpact < 0 ? 'Savings' : 'Cost',
      trendUp: totalCostImpact < 0,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200 pt-16">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-8 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-3 text-sm font-medium bg-teal-50 text-teal-700 rounded-lg"
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="/new-assessment"
              className="flex items-center px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Plus className="mr-3 h-5 w-5" />
              New Assessment
            </Link>
            <Link
              to="/projects"
              className="flex items-center px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <FolderOpen className="mr-3 h-5 w-5" />
              My Projects
            </Link>
            <Link
              to="/reports"
              className="flex items-center px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <FileText className="mr-3 h-5 w-5" />
              Reports
            </Link>
            <Link
              to="/settings"
              className="flex items-center px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 lg:pl-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-600 mt-2">Welcome back! Here's your circularity overview.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center text-sm font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stat.trendUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {stat.trend}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Circularity Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#0F766E" strokeWidth={3} dot={{ fill: '#0F766E', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
              <CircularityGauge score={avgCircularityScore} size="medium" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Performance by Metal Type</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={metalTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="metal" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="score" fill="#0F766E" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Projects</h2>
              <div className="space-y-3">
                {projects.slice(0, 5).map(project => (
                  <Link
                    key={project.id}
                    to={`/results/${project.id}`}
                    className="block p-4 border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-teal-50/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{project.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {project.metalType.charAt(0).toUpperCase() + project.metalType.slice(1)} • {project.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-teal-700">{project.circularityScore}</div>
                        <div className="text-xs text-slate-500">Score</div>
                      </div>
                    </div>
                  </Link>
                ))}
                {projects.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <p>No projects yet</p>
                    <Link to="/new-assessment" className="text-teal-700 hover:text-teal-800 font-medium mt-2 inline-block">
                      Create your first assessment
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-xl shadow-lg p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Ready for a New Assessment?</h2>
                <p className="text-teal-100">Start evaluating your next metal production project</p>
              </div>
              <Link
                to="/new-assessment"
                className="inline-flex items-center px-6 py-3 bg-white text-teal-700 rounded-lg font-semibold hover:bg-slate-100 transition-all"
              >
                Create Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
