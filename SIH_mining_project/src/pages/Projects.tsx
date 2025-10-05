import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Trash2, Eye, Calendar, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CircularityGauge from '../components/CircularityGauge';

const Projects: React.FC = () => {
  const { projects, deleteProject } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMetal, setFilterMetal] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterMetal === 'all' || project.metalType === filterMetal;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const getMetalColor = (metal: string) => {
    switch (metal) {
      case 'aluminum': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'copper': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'steel': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'completed'
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : 'bg-amber-100 text-amber-700 border-amber-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">My Projects</h1>
            <p className="text-slate-600 mt-2">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} in total
            </p>
          </div>
          <Link
            to="/new-assessment"
            className="inline-flex items-center px-6 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-all shadow-lg mt-4 md:mt-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={filterMetal}
                  onChange={e => setFilterMetal(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all appearance-none bg-white"
                >
                  <option value="all">All Metals</option>
                  <option value="aluminum">Aluminum</option>
                  <option value="copper">Copper</option>
                  <option value="steel">Steel</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex border border-slate-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  } rounded-l-lg`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  } rounded-r-lg border-l border-slate-300`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No projects found</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery || filterMetal !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first assessment'}
            </p>
            <Link
              to="/new-assessment"
              className="inline-flex items-center px-6 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Project
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">
                        {project.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getMetalColor(project.metalType)}`}>
                          {project.metalType.charAt(0).toUpperCase() + project.metalType.slice(1)}
                        </span>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(project.status)}`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center py-6">
                    <CircularityGauge score={project.circularityScore} size="small" showLabel={false} />
                  </div>

                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-teal-700">{project.circularityScore}</p>
                    <p className="text-sm text-slate-600">Circularity Score</p>
                  </div>

                  <div className="flex items-center justify-center text-xs text-slate-500 mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/results/${project.id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Metal Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredProjects.map(project => (
                    <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{project.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getMetalColor(project.metalType)}`}>
                          {project.metalType.charAt(0).toUpperCase() + project.metalType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-teal-700">{project.circularityScore}</span>
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(project.status)}`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/results/${project.id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="px-3 py-1.5 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
