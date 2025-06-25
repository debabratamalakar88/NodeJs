import express from 'express';
const router = express.Router();
import { 
    userRegistration,
    userRegistrationSubmit,
    userLogin,
    userLoginSubmit,
    dashboard,
    userLogout
} from '../controllers/users.controller.js';

import {
    isAuthenticated,
    isNotAuthenticated
} from '../middleware/authMiddleware.js'; 

import {
    userRegistrationValidator,
    userLoginValidator
} from '../middleware/userValidate.js';

// Routes for user management
router.get('/userRegistration',isNotAuthenticated, userRegistration);
router.post('/userRegistration',userRegistrationValidator, userRegistrationSubmit);
router.get('/userLogin',isNotAuthenticated, userLogin);
router.post('/userLogin',userLoginValidator, userLoginSubmit);
router.get('/dashboard',isAuthenticated, dashboard);
router.get('/userLogout',isAuthenticated, userLogout);


export default router;