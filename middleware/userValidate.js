import { body,validationResult } from 'express-validator';
 
export const  userRegistrationValidator = [
  body('firstName')
  .notEmpty().withMessage('First name is required.')
  .isLength({ max: 50 }).withMessage('First name must be less than 50 characters.')
  .isAlpha().withMessage('First name must contain only letters.')
  .trim() // Trim whitespace from the beginning and end
  .escape(), // Escape to prevent XSS attacks
  body('lastName')
  .notEmpty().withMessage('Last name is required.')
  .isLength({ max: 50 }).withMessage('Last name must be less than 50 characters.')
  .isAlpha().withMessage('Last name must contain only letters.')
  .trim() // Trim whitespace from the beginning and end
  .escape(), // Escape to prevent XSS attacks
  body('email')
  .notEmpty().withMessage('Email is required.')
  .isEmail().withMessage('Please enter a valid email address.')
  .isLength({ max: 100 }).withMessage('Email must be less than 100 characters.')
  .normalizeEmail()// Normalize email to lowercase  
  .trim()
  .escape(), 
  body('password').notEmpty().withMessage('Password is required.')
  .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
  .trim()
  .escape(), // Trim and escape to prevent XSS attacks
  body('phoneNumber').notEmpty().withMessage('Phone number is required.')
  .isMobilePhone('any').withMessage('Please enter a valid phone number.')
  .isLength({ max: 15 }).withMessage('Phone number must be less than 15 characters.')
  .trim()
  .escape(), // Trim and escape to prevent XSS attacks
   (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.render('userRegistration', {
         title: 'User Registration',
         message: 'Validation errors occurred.',
         errors: errors.array()
       });
     }
     next();
   }
];

export const userLoginValidator = [
  body('email')
  .notEmpty().withMessage('Email is required.')
  .isEmail().withMessage('Please enter a valid email address.')
  .normalizeEmail() // Normalize email to lowercase
  .trim()
  .escape(),
  body('password')
  .notEmpty().withMessage('Password is required.')
  .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
  .trim()
  .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('userLogin', {
        title: 'User Login',
        message: 'Validation errors occurred.',
        errors: errors.array()
      });
    }
    next();
  }
];
//

