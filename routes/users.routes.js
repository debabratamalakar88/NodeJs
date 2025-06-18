import express from 'express';
const router = express.Router();
import { 
    userRegistration,
    userRegistrationSubmit,
    userLogin,
    userLoginSubmit,
    getUserProfile
} from '../controllers/users.controller.js';

import {
    userRegistrationValidator,
    userLoginValidator
} from '../middleware/userValidate.js'; 

// Routes for user management
router.get('/userRegistration', userRegistration);
router.post('/userRegistration',userRegistrationValidator, userRegistrationSubmit);
router.get('/userLogin', userLogin);
router.post('/userLogin',userLoginValidator, userLoginSubmit);
router.get('/getUserProfile', getUserProfile);


export default router;