import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import leadService from '../services/leadService';
import activityService from '../services/activityService';

const STATUSES = ['New', 'Contacted', 'Quotation', 'Won', 'Lost'];
const PRODUCTS = ['Solar', 'EV', 'Battery'];

const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [error, setError] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetchLead();
  }, [id]);

  useEffect(() => {
    // Keep timestamps feeling "live" in the UI
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    // Poll latest activity records for near real-time updates
    const poll = setInterval(async () => {
      try {
        const actRes = await activityService.getLeadActivities(id);
        setActivities(actRes.data.activities || []);
      } catch (e) {
        // Ignore transient polling errors
      }
    }, 5000);

    return () => clearInterval(poll);
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const leadRes = await leadService.getLeadById(id);
      setLead(leadRes.data);

      const actRes = await activityService.getLeadActivities(id);
      setActivities(actRes.data.activities || []);
    } catch (error) {
      console.error('Error fetching lead:', error);
      setError('Lead not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await leadService.deleteLead(id);
      navigate('/leads');
    } catch (error) {
      setError('Failed to delete lead');
    }
  };

  const handleSaveField = async (fieldName, value) => {
    try {
      const updateData = { [fieldName]: value };
      const response = await leadService.updateLead(id, updateData);
      setLead(response.data);
      setEditingField(null);
      await fetchLead(); // Refresh to get updated activity log
    } catch (error) {
      setError('Failed to update field');
    }
  };

  const formatDateTime = (timestamp) =>
    new Date(timestamp).toLocaleString([], {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });

  const formatRelativeTime = (timestamp) => {
    const diffMs = Math.max(0, now - new Date(timestamp).getTime());
    const sec = Math.floor(diffMs / 1000);
    if (sec < 5) return 'just now';
    if (sec < 60) return `${sec}s ago`;

    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;

    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;

    const day = Math.floor(hr / 24);
    return `${day}d ago`;
  };

  const getStatusFromDescription = (description = '') => {
    const match = description.match(/to\s+(.+)$/i);
    return match ? match[1] : 'updated';
  };

  const formatActivityMessage = (activity) => {
    if (activity.action_type === 'status_changed') {
      const nextStatus = activity.new_value || getStatusFromDescription(activity.description);
      return `Status changed to ${nextStatus} at ${formatDateTime(activity.timestamp)}`;
    }

    if (activity.action_type === 'created') {
      return `Lead created at ${formatDateTime(activity.timestamp)}`;
    }

    if (activity.action_type === 'info_updated') {
      return `Lead details updated at ${formatDateTime(activity.timestamp)}`;
    }

    if (activity.action_type === 'deleted') {
      return `Lead deleted at ${formatDateTime(activity.timestamp)}`;
    }

    return `${activity.description || 'Activity recorded'} at ${formatDateTime(activity.timestamp)}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  if (!lead || error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">{error || 'Lead not found'}</p>
          <button
            onClick={() => navigate('/leads')}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Back to Leads
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/leads')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
            >
              Back
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Lead Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Email', field: 'email', type: 'email' },
                  { label: 'Phone', field: 'phone', type: 'text' },
                  { label: 'Company', field: 'company', type: 'text' },
                  { label: 'Budget', field: 'budget', type: 'number' },
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <label className="block text-gray-600 text-sm font-semibold mb-1">{label}</label>
                    {editingField === field ? (
                      <div className="flex gap-2">
                        <input
                          type={type}
                          value={editValues[field] || lead[field] || ''}
                          onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => handleSaveField(field, editValues[field] || lead[field])}
                          className="bg-green-600 text-white px-3 py-2 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="bg-gray-400 text-white px-3 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingField(field);
                          setEditValues({ [field]: lead[field] || '' });
                        }}
                        className="px-3 py-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                      >
                        {lead[field] || '-'}
                      </div>
                    )}
                  </div>
                ))}

                {/* Product Interest */}
                <div>
                  <label className="block text-gray-600 text-sm font-semibold mb-1">Product Interest</label>
                  {editingField === 'product_interest' ? (
                    <div className="flex gap-2">
                      <select
                        value={editValues.product_interest || lead.product_interest}
                        onChange={(e) => setEditValues({ ...editValues, product_interest: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      >
                        {PRODUCTS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleSaveField('product_interest', editValues.product_interest)}
                        className="bg-green-600 text-white px-3 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="bg-gray-400 text-white px-3 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setEditingField('product_interest');
                        setEditValues({ product_interest: lead.product_interest });
                      }}
                      className="px-3 py-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                    >
                      {lead.product_interest}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-gray-600 text-sm font-semibold mb-1">Status</label>
                  {editingField === 'status' ? (
                    <div className="flex gap-2">
                      <select
                        value={editValues.status || lead.status}
                        onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleSaveField('status', editValues.status)}
                        className="bg-green-600 text-white px-3 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="bg-gray-400 text-white px-3 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setEditingField('status');
                        setEditValues({ status: lead.status });
                      }}
                      className="px-3 py-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                    >
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                        {lead.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="mt-4">
                <label className="block text-gray-600 text-sm font-semibold mb-1">Notes</label>
                {editingField === 'notes' ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editValues.notes || lead.notes || ''}
                      onChange={(e) => setEditValues({ ...editValues, notes: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded min-h-24"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveField('notes', editValues.notes)}
                        className="bg-green-600 text-white px-3 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="bg-gray-400 text-white px-3 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setEditingField('notes');
                      setEditValues({ notes: lead.notes || '' });
                    }}
                    className="px-3 py-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 min-h-20"
                  >
                    {lead.notes || 'No notes'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Activity Log</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.length > 0 ? (
                  activities.map((activity, idx) => (
                    <div key={activity.id || idx} className="border-l-2 border-green-500 pl-3">
                      <p className="text-sm font-semibold text-gray-900">{formatActivityMessage(activity)}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Recorded time: {formatDateTime(activity.timestamp)} ({formatRelativeTime(activity.timestamp)})
                      </p>
                      {activity.previous_value && activity.new_value && (
                        <p className="text-xs text-gray-600 mt-1">
                          {activity.previous_value} → {activity.new_value}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No activities yet</p>
                )}
              </div>
            </div>
          </div>
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
          <p className="text-gray-700">
            Are you sure you want to delete this lead? This action cannot be undone.
          </p>
        </Modal>
      </div>
    </Layout>
  );
};

export default LeadDetailsPage;
