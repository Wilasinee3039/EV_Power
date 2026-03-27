import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import leadService from '../services/leadService';

const STATUSES = ['New', 'Contacted', 'Quotation', 'Won', 'Lost'];
const PRODUCTS = ['Solar', 'EV', 'Battery'];

const LeadListPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLeadId, setDeleteLeadId] = useState(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await leadService.getAllLeads({
        search,
        status: statusFilter,
        product: productFilter,
        page,
        limit: 25,
      });
      setLeads(response.data.leads);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, productFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, productFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDelete = async () => {
    try {
      await leadService.deleteLead(deleteLeadId);
      setShowDeleteModal(false);
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setProductFilter('');
    setPage(1);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-green-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <button
            onClick={() => navigate('/leads/new')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition font-semibold"
          >
            + New Lead
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name, email, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Products</option>
              {PRODUCTS.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
            <button
              onClick={clearFilters}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No leads found. Try adjusting your filters or create a new lead.
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td
                        className="px-6 py-4 text-gray-900 font-semibold cursor-pointer hover:text-blue-600"
                        onClick={() => navigate(`/leads/${lead.id}`)}
                      >
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{lead.email}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{lead.company || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                          {lead.product_interest}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            lead.status === 'New'
                              ? 'bg-blue-100 text-blue-800'
                              : lead.status === 'Contacted'
                              ? 'bg-yellow-100 text-yellow-800'
                              : lead.status === 'Quotation'
                              ? 'bg-orange-100 text-orange-800'
                              : lead.status === 'Won'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setDeleteLeadId(lead.id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* Delete Modal */}
        <Modal
          isOpen={showDeleteModal}
          title="Delete Lead"
          isDanger
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          confirmText="Delete"
          cancelText="Cancel"
        >
          <p className="text-gray-700">Are you sure you want to delete this lead?</p>
        </Modal>
        </div>
      </div>
    </Layout>
  );
};

export default LeadListPage;
