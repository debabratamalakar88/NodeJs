import express from 'express';
const router = express.Router();

import { 
    home,
    manageContact,
    addContact,
    addContactSubmit,
    editContact,
    editContactSubmit,
    viewContact,
    deleteContact,
    
 } from '../controllers/contacts.controller.js';

import { uploadFields,ContactErrorHandler } from '../middleware/contactUpload.js';
import { formValidator } from '../middleware/contactValidate.js';

router.get('/', home)
router.get('/manageContact', manageContact);
router.get('/addContact', addContact);
router.post('/addContact', uploadFields,formValidator, addContactSubmit);
router.get('/editContact/:id', editContact);
router.post('/editContact', editContactSubmit);
router.get('/viewContact/:id', viewContact);
router.get('/deleteContact/:id', deleteContact);

router.use(ContactErrorHandler);



export default router;