import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Activity from '../models/Activity.js';

const router = express.Router();

router.use(authMiddleware);

// Get activities for a specific lead
router.get('/lead/:leadId', async (req, res) => {
  try {
    const activities = await Activity.findByLeadId(req.params.leadId);
    return res.json({ activities });
  } catch (error) {
    console.error('Get activities error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Get all activities (paginated)
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.findAll({
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    });
    return res.json({ activities });
  } catch (error) {
    console.error('Get all activities error:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
