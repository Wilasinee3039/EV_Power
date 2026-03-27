import Lead from '../models/Lead.js';

// Get all leads with filters
export const getAllLeads = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      status: req.query.status,
      product: req.query.product,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 25
    };

    const result = await Lead.findAll(filters);
    return res.json(result);
  } catch (error) {
    console.error('Get leads error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get lead by ID
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    return res.json(lead);
  } catch (error) {
    console.error('Get lead error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Create new lead
export const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, product_interest, budget, status, notes } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ error: 'Lead name is required' });
    }

    if (!['Solar', 'EV', 'Battery'].includes(product_interest)) {
      return res.status(400).json({ error: 'Invalid product interest' });
    }

    if (!['New', 'Contacted', 'Quotation', 'Won', 'Lost'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const lead = await Lead.create(
      { name, email, phone, company, product_interest, budget, status, notes },
      req.user.id
    );

    return res.status(201).json(lead);
  } catch (error) {
    console.error('Create lead error:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Update lead
export const updateLead = async (req, res) => {
  try {
    const { name, email, phone, company, product_interest, budget, status, notes } = req.body;

    // Validate product interest if provided
    if (product_interest && !['Solar', 'EV', 'Battery'].includes(product_interest)) {
      return res.status(400).json({ error: 'Invalid product interest' });
    }

    // Validate status if provided
    if (status && !['New', 'Contacted', 'Quotation', 'Won', 'Lost'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (product_interest !== undefined) updateData.product_interest = product_interest;
    if (budget !== undefined) updateData.budget = budget;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const lead = await Lead.update(req.params.id, updateData, req.user.id);
    return res.json(lead);
  } catch (error) {
    console.error('Update lead error:', error);
    const status = error.message.includes('not found') ? 404 : 400;
    return res.status(status).json({ error: error.message });
  }
};

// Delete lead
export const deleteLead = async (req, res) => {
  try {
    const result = await Lead.delete(req.params.id, req.user.id);
    return res.json(result);
  } catch (error) {
    console.error('Delete lead error:', error);
    const status = error.message.includes('not found') ? 404 : 400;
    return res.status(status).json({ error: error.message });
  }
};
