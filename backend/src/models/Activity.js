import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const Activity = {
  // Create activity log entry
  create: (leadId, userId, actionType, description, previousValue, newValue) => {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const timestamp = new Date().toISOString();
      db.run(
        `INSERT INTO activity_logs (id, lead_id, user_id, action_type, previous_value, new_value, timestamp, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, leadId, userId, actionType, previousValue, newValue, timestamp, description],
        function(err) {
          if (err) reject(err);
          else resolve({ id });
        }
      );
    });
  },

  // Get all activities for a lead
  findByLeadId: (leadId) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT a.*, u.full_name FROM activity_logs a
         LEFT JOIN users u ON a.user_id = u.id
         WHERE a.lead_id = ?
         ORDER BY a.timestamp DESC`,
        [leadId],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows || []);
        }
      );
    });
  },

  // Get all activities (with pagination)
  findAll: (filters = {}) => {
    return new Promise((resolve, reject) => {
      const limit = Math.min(filters.limit || 50, 100);
      const offset = ((filters.page || 1) - 1) * limit;

      db.all(
        `SELECT a.*, u.full_name, l.name as lead_name FROM activity_logs a
         LEFT JOIN users u ON a.user_id = u.id
         LEFT JOIN leads l ON a.lead_id = l.id
         ORDER BY a.timestamp DESC
         LIMIT ? OFFSET ?`,
        [limit, offset],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }
};

export default Activity;
