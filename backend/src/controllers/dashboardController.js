import Lead from '../models/Lead.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.getTotalCount();
    const leadsByStatus = await Lead.countByStatus();
    const leadsByProductInterest = await Lead.countByProductInterest();

    return res.json({
      total_leads: totalLeads,
      leads_by_status: leadsByStatus,
      leads_by_product_interest: leadsByProductInterest
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ error: error.message });
  }
};
