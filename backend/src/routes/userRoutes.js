import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  updateUserPreferences,
  deleteUserAccount,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

router.put('/password', updateUserPassword);
router.put('/preferences', updateUserPreferences);
router.delete('/account', deleteUserAccount);

export default router;
