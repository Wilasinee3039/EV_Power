import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import Activity from './Activity.js';

export const Lead = {
  // Find all leads with filters and search
  findAll: (filters = {}) => {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM leads WHERE 1=1';
      const params = [];

      // Search filter
      if (filters.search) {
        query += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Status filter
      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      // Product interest filter
      if (filters.product) {
        query += ' AND product_interest = ?';
        params.push(filters.product);
      }

      // Pagination
      const limit = Math.min(filters.limit || 25, 100);
      const offset = ((filters.page || 1) - 1) * limit;
      
      // Count total
      let countQuery = 'SELECT COUNT(*) as total FROM leads WHERE 1=1';
      if (filters.search) {
        countQuery += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ?)';
      }
      if (filters.status) {
        countQuery += ' AND status = ?';
      }
      if (filters.product) {
        countQuery += ' AND product_interest = ?';
      }

      db.get(countQuery, params, (err, countResult) => {
        if (err) return reject(err);

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        db.all(query, params, (err, rows) => {
          if (err) reject(err);
          resolve({
            leads: rows || [],
            total: countResult.total,
            page: filters.page || 1,
            limit,
            totalPages: Math.ceil(countResult.total / limit)
          });
        });
      });
    });
  },

  // Find lead by ID
  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM leads WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  },

  // Create new lead
  create: async (leadData, userId) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    return new Promise((resolve, reject) => {
      const { name, email, phone, company, product_interest, budget, status, notes } = leadData;

      db.run(
        `INSERT INTO leads (id, name, email, phone, company, product_interest, budget, status, notes, created_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, email, phone, company, product_interest || 'Solar', budget, status || 'New', notes, userId, now, now],
        async function(err) {
          if (err) {
            reject(err);
          } else {
            // Log activity
            await Activity.create(id, userId, 'created', `Lead created: ${name}`, null, JSON.stringify(leadData));
            const lead = await Lead.findById(id);
            resolve(lead);
          }
        }
      );
    });
  },

  // Update lead
  update: async (id, leadData, userId) => {
    const lead = await Lead.findById(id);
    if (!lead) throw new Error('Lead not found');

    const now = new Date().toISOString();
    const updates = [];
    const params = [];
    let statusChanged = false;

    // Build dynamic update query
    for (const [key, value] of Object.entries(leadData)) {
      if (key !== 'id' && key !== 'created_by' && key !== 'created_at') {
        if (key === 'status' && lead[key] !== value) {
          statusChanged = true;
        }
        updates.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      return lead; // No updates
    }

    updates.push('updated_at = ?');
    params.push(now);
    params.push(id);

    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`,
        params,
        async (err) => {
          if (err) {
            reject(err);
          } else {
            // Log activity
            const actionType = statusChanged ? 'status_changed' : 'info_updated';
            const description = statusChanged 
              ? `Status changed from ${lead.status} to ${leadData.status}`
              : 'Lead information updated';
            
            await Activity.create(
              id,
              userId,
              actionType,
              description,
              statusChanged ? lead.status : null,
              statusChanged ? leadData.status : null
            );

            const updatedLead = await Lead.findById(id);
            resolve(updatedLead);
          }
        }
      );
    });
  },

  // Delete lead
  delete: async (id, userId) => {
    const lead = await Lead.findById(id);
    if (!lead) throw new Error('Lead not found');

    // Log deletion before removing the lead to satisfy FK constraint on activity_logs.lead_id
    await Activity.create(id, userId, 'deleted', `Lead deleted: ${lead.name}`, JSON.stringify(lead), null);

    return new Promise((resolve, reject) => {
      db.run('DELETE FROM leads WHERE id = ?', [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Lead deleted', id });
        }
      });
    });
  },

  // Count leads by status
  countByStatus: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT status, COUNT(*) as count FROM leads GROUP BY status`,
        (err, rows) => {
          if (err) reject(err);
          const result = {
            'New': 0,
            'Contacted': 0,
            'Quotation': 0,
            'Won': 0,
            'Lost': 0
          };
          if (rows) {
            rows.forEach(row => {
              result[row.status] = row.count;
            });
          }
          resolve(result);
        }
      );
    });
  },

  // Count leads by product interest
  countByProductInterest: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT product_interest, COUNT(*) as count FROM leads GROUP BY product_interest`,
        (err, rows) => {
          if (err) reject(err);
          const result = {
            'Solar': 0,
            'EV': 0,
            'Battery': 0
          };
          if (rows) {
            rows.forEach((row) => {
              result[row.product_interest] = row.count;
            });
          }
          resolve(result);
        }
      );
    });
  },

  // Get total lead count
  getTotalCount: () => {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as total FROM leads', (err, row) => {
        if (err) reject(err);
        resolve(row.total);
      });
    });
  }
};

export default Lead;
