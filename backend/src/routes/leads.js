import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead
} from '../controllers/leadsController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllLeads);
router.post('/', createLead);
router.get('/:id', getLeadById);
router.patch('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
