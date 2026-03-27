import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import leadService from '../services/leadService';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const getProductStats = () => {
    const productCounts = stats?.leads_by_product_interest || {};
    const solar = productCounts.Solar || 0;
    const ev = productCounts.EV || 0;
    const battery = productCounts.Battery || 0;
    const total = solar + ev + battery;

    const solarPct = total > 0 ? (solar * 100) / total : 0;
    const evPct = total > 0 ? (ev * 100) / total : 0;
    const batteryPct = total > 0 ? (battery * 100) / total : 0;

    return { solar, ev, battery, total, solarPct, evPct, batteryPct };
  };

  // Status colors mapping - Muted green with beige undertones
  const statusColors = {
    New: { bg: 'from-green-50 to-amber-50', border: 'border-green-300', text: 'text-green-900', badge: 'bg-green-100 text-green-800', icon: '🆕' },
    Contacted: { bg: 'from-emerald-50 to-yellow-50', border: 'border-emerald-300', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-800', icon: '📞' },
    Quotation: { bg: 'from-teal-50 to-amber-50', border: 'border-teal-300', text: 'text-teal-900', badge: 'bg-teal-100 text-teal-800', icon: '✓' },
    Won: { bg: 'from-lime-50 to-orange-50', border: 'border-lime-300', text: 'text-lime-900', badge: 'bg-lime-100 text-lime-800', icon: '🏆' },
    Lost: { bg: 'from-red-50 to-orange-50', border: 'border-red-300', text: 'text-red-900', badge: 'bg-red-100 text-red-800', icon: '✖' },
  };

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const response = await leadService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    setLoading(false);

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-emerald-700"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-green-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600 text-lg">Welcome back! Here's your leads overview.</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={fetchStats}
                disabled={refreshing}
                className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all font-semibold disabled:opacity-50"
              >
                <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={() => navigate('/leads')}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                <span>📋</span>
                View All Leads
              </button>
            </div>
          </div>

          {stats ? (
            <>
              {(() => {
                const { solar, ev, battery, total, solarPct, evPct, batteryPct } = getProductStats();

                return (
                  <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Product Interest</h2>
                      <p className="text-gray-600 mb-5">Quick view of interest in Solar, EV, and Battery solutions.</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 p-4">
                          <p className="text-amber-900 text-sm font-semibold">Solar</p>
                          <p className="text-3xl font-bold text-amber-900">{solar}</p>
                          <p className="text-xs text-amber-700">{solarPct.toFixed(1)}%</p>
                        </div>
                        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 p-4">
                          <p className="text-emerald-900 text-sm font-semibold">EV</p>
                          <p className="text-3xl font-bold text-emerald-900">{ev}</p>
                          <p className="text-xs text-emerald-700">{evPct.toFixed(1)}%</p>
                        </div>
                        <div className="rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 p-4">
                          <p className="text-teal-900 text-sm font-semibold">Battery</p>
                          <p className="text-3xl font-bold text-teal-900">{battery}</p>
                          <p className="text-xs text-teal-700">{batteryPct.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 flex flex-col items-center justify-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Interest Mix</h3>
                      <div
                        className="h-40 w-40 rounded-full relative"
                        style={{
                          background: `conic-gradient(#d97706 0% ${solarPct}%, #059669 ${solarPct}% ${solarPct + evPct}%, #0f766e ${solarPct + evPct}% 100%)`
                        }}
                      >
                        <div className="absolute inset-5 rounded-full bg-white flex items-center justify-center text-center">
                          <div>
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{total}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 w-full space-y-2 text-sm">
                        <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-600"></span>Solar</span><span className="font-semibold text-gray-700">{solar}</span></div>
                        <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-600"></span>EV</span><span className="font-semibold text-gray-700">{ev}</span></div>
                        <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-teal-700"></span>Battery</span><span className="font-semibold text-gray-700">{battery}</span></div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Main KPI Card */}
              <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 shadow-2xl p-8 text-white">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-40 -translate-y-40"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <p className="text-blue-100 text-lg mb-2">TOTAL LEADS</p>
                      <p className="text-6xl font-bold">{stats.total_leads}</p>
                      <p className="text-blue-100 mt-2">Active leads in pipeline</p>
                    </div>
                    <div className="mt-6 md:mt-0">
                      <button
                        onClick={() => navigate('/leads/new')}
                        className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105"
                      >
                        + Add New Lead
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Cards Grid */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pipeline Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                  {['New', 'Contacted', 'Quotation', 'Won', 'Lost'].map((status) => {
                    const count = stats.leads_by_status?.[status] || 0;
                    const percentage = stats.total_leads > 0 ? (count * 100) / stats.total_leads : 0;
                    const colors = statusColors[status];
                    
                    return (
                      <div
                        key={status}
                        className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-xl p-6 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer`}
                        onClick={() => navigate(`/leads?status=${status}`)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl">{colors.icon}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.badge}`}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                        <p className={`${colors.text} font-semibold text-sm mb-2`}>{status}</p>
                        <p className={`${colors.text} text-3xl font-bold`}>{count}</p>
                        <div className="mt-4 w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r transition-all duration-500`}
                            style={{
                              background: status === 'New' ? 'linear-gradient(to right, #4a7c59, #6b9d7e)' :
                                         status === 'Contacted' ? 'linear-gradient(to right, #5a9d70, #7bb88d)' :
                                         status === 'Quotation' ? 'linear-gradient(to right, #6ba887, #8bbfa0)' :
                                         status === 'Won' ? 'linear-gradient(to right, #7cb399, #9cccb5)' :
                                         'linear-gradient(to right, #c77a7a, #dea2a2)',
                              width: `${percentage}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pipeline Funnel Visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Detailed Pipeline */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Sales Funnel</h3>
                    <div className="space-y-6">
                      {['New', 'Contacted', 'Quotation', 'Won', 'Lost'].map((status, idx) => {
                        const count = stats.leads_by_status?.[status] || 0;
                        const percentage = stats.total_leads > 0 ? (count * 100) / stats.total_leads : 0;
                        const funnelWidth = 100 - (idx * 15);
                        const colors = statusColors[status];
                        
                        return (
                          <div key={status} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-700">{status}</span>
                              <span className="text-lg font-bold text-gray-900">{count} leads</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-lg h-8 overflow-hidden">
                              <div
                                className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                                style={{
                                  background: status === 'New' ? 'linear-gradient(to right, #4a7c59, #6b9d7e)' :
                                             status === 'Contacted' ? 'linear-gradient(to right, #5a9d70, #7bb88d)' :
                                             status === 'Quotation' ? 'linear-gradient(to right, #6ba887, #8bbfa0)' :
                                             status === 'Won' ? 'linear-gradient(to right, #7cb399, #9cccb5)' :
                                             'linear-gradient(to right, #c77a7a, #dea2a2)',
                                  width: `${percentage}%`
                                }}
                              >
                                <span className="text-white font-bold text-sm">{percentage.toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-5">
                  <div className="bg-gradient-to-br from-green-50 to-amber-50 border-2 border-green-200 rounded-2xl p-6">
                    <p className="text-green-900 text-sm font-semibold mb-2">CONVERSION RATE</p>
                    <p className="text-4xl font-bold text-green-900">{stats.total_leads > 0 ? ((stats.leads_by_status?.Won || 0) * 100 / stats.total_leads).toFixed(1) : 0}%</p>
                    <p className="text-green-700 text-xs mt-2">Won deals</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-yellow-50 border-2 border-emerald-200 rounded-2xl p-6">
                    <p className="text-emerald-900 text-sm font-semibold mb-2">ACTIVE PROSPECTS</p>
                    <p className="text-4xl font-bold text-emerald-900">{(stats.leads_by_status?.New || 0) + (stats.leads_by_status?.Contacted || 0)}</p>
                    <p className="text-emerald-700 text-xs mt-2">New & Contacted</p>
                  </div>

                  <div className="bg-gradient-to-br from-teal-50 to-amber-50 border-2 border-teal-200 rounded-2xl p-6">
                    <p className="text-teal-900 text-sm font-semibold mb-2">IN PROGRESS</p>
                    <p className="text-4xl font-bold text-teal-900">{(stats.leads_by_status?.Quotation || 0) + (stats.leads_by_status?.Won || 0)}</p>
                    <p className="text-teal-700 text-xs mt-2">Quotation & Won</p>
                  </div>
                </div>
              </div>

              {/* Last Updated Info */}
              <div className="text-center py-4 text-sm text-gray-500 border-t border-gray-200">
                Last updated: {new Date().toLocaleTimeString()} | Auto-refreshing every 30 seconds
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">Unable to load statistics</p>
              <button
                onClick={fetchStats}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
