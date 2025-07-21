import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { postJob, getJobsByRecruiter, updateJob, deleteJob , getAllJobs ,searchJobs } from '../controller/job.controller.js';

const router = express.Router();

router.post('/post', isAuthenticated, postJob);
router.get('/my-jobs', isAuthenticated, getJobsByRecruiter);
router.put('/update/:id', isAuthenticated, updateJob);
router.delete('/delete/:id', isAuthenticated, deleteJob);
router.get("/all", isAuthenticated, getAllJobs);
router.get("/search", searchJobs);
router.get("/public", getAllJobs);

export default router;
