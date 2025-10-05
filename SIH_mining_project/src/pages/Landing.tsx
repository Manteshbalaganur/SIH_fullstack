import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, TrendingUp, Zap, BarChart3, FileCheck, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import Footer from '../components/Footer';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Insights',
      description: 'Advanced machine learning algorithms analyze your data and provide intelligent recommendations for circularity improvements.',
    },
    {
      icon: TrendingUp,
      title: 'Circularity Scoring',
      description: 'Comprehensive scoring system evaluates material flows, energy use, and end-of-life strategies to quantify your circular economy performance.',
    },
    {
      icon: Zap,
      title: 'Real-time Calculations',
      description: 'Instant LCA results with dynamic updates as you input data, enabling rapid scenario analysis and decision-making.',
    },
    {
      icon: BarChart3,
      title: 'Comparative Analysis',
      description: 'Benchmark your performance against industry standards and top performers to identify improvement opportunities.',
    },
    {
      icon: FileCheck,
      title: 'Actionable Reports',
      description: 'Generate professional, detailed reports with prioritized recommendations and implementation timelines.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Access your assessments anywhere with a fully responsive design optimized for all devices.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3djdjNyAwIDctNyAxNC03IDctNyAwLTE0LTdoLTd2N3oiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium">Powered by AI • Industry Validated</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                AI-Powered Circularity Assessment for Metals
              </h1>

              <p className="text-xl text-teal-100 leading-relaxed">
                Transform your metal production with intelligent LCA and circular economy insights.
                Make data-driven decisions for a sustainable future.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/new-assessment"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-700 rounded-lg font-semibold hover:bg-slate-100 transition-all hover:scale-105 shadow-xl"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </button>
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-teal-100">No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-teal-100">Free trial included</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-emerald-400/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                  <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                    <Play className="w-20 h-20 text-white/60" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-white/80 text-sm">Platform Demo Video</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Comprehensive Features for Complete Assessment
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to evaluate, optimize, and improve your metal production circularity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              See Our Solution in Action
            </h2>
            <p className="text-xl text-slate-600">
              Watch how CircularMetals AI transforms metal production assessment
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <iframe width="6200" height="500" src="https://www.youtube.com/embed/--P3CQY8lYI?si=5YFSiPHJgrTfAIlt" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="inline-flex items-center px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium">
                Download Submission Video
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              <button className="inline-flex items-center px-6 py-3 bg-white text-teal-700 rounded-lg hover:bg-slate-50 transition-colors font-medium border border-slate-200">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-teal-700 to-emerald-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-8 py-16 md:px-16 md:py-20 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Production?
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Start your first circularity assessment today and discover optimization opportunities
            </p>
            <Link
              to="/new-assessment"
              className="inline-flex items-center px-8 py-4 bg-white text-teal-700 rounded-lg font-semibold hover:bg-slate-100 transition-all hover:scale-105 shadow-xl"
            >
              Start Free Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
