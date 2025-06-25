import Contact from '../models/contacts.models.js';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

export const home = (req, res) => {
  res.redirect('/manageContact');
}

export const manageContact = async (req, res) => {
  try {
    //const contacts = await Contact.find({});

    const options = {
      page: req.query.page || 1, // Current page number 
      limit: 3, // Number of contacts per page
      sort: { createdAt: -1 }, // Sort by creation date, newest first
      
    };

    const contacts = await Contact.paginate({}, options);
   
    res.render('manageContact', { 
      title: 'Manage Contacts',
      description: 'Here you can manage your contacts.',   
      contacts: contacts.docs, // Use docs for the actual contact data
      currentPage: contacts.page, // Current page number
      totalPages: contacts.totalPages, // Total number of pages
      hasNextPage: contacts.hasNextPage, // Check if there is a next page
      hasPrevPage: contacts.hasPrevPage, // Check if there is a previous page
      nextPage: contacts.nextPage, // Next page number
      prevPage: contacts.prevPage, // Previous page number  
      totalContacts: contacts.totalDocs, // Total number of contacts
      pagingCounter: contacts.pagingCounter, // Current page's starting index 
      limit: contacts.limit, // Number of contacts per page
      userEmailCookie: req.cookies.userEmailCookie || null // Pass user email from cookie if available
    });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).render('500', {
      title: 'Error',
      message: 'An error occurred while fetching contacts.'
    });
  }
};

export const addContact = async (req, res) => {  
  res.render('addContact', {
    title: 'Add Contact',
    csrfToken: req.csrfToken(), // Pass CSRF token to the view
    errors: null,
    message: null,
    description: 'Fill out the form to add a new contact.'
  });
};


export const addContactSubmit = async (req, res) => {
  try {
    // Check if the contact already exists
    const existingContact = await Contact.findOne({ email: req.body.email });
    if (existingContact) {
      return res.render('400', {
        title: 'Error',
        message: 'A contact with this email already exists.'
      });
    }
    // Create a new contact
    // Validate input to avoid empty or invalid data
    if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.phone) {
      return res.render('400', {
        title: 'Error',
        message: 'Missing required contact details.'
      });
    }
   
    await Contact.create({
      firstName: req.body.first_name,
      lastName: req.body.last_name,  
      email: req.body.email,
      phoneNumber: req.body.phone,
      profilePicture: req.files['profilePicture']?.[0]?.filename || null, // Save file path if uploaded
      imageGallery: req.files['imageGallery']?.map(file => file.filename) || [], // Optional field
      docCV: req.files['docCV']?.[0]?.filename || null, // Optional field
      address: req.body.address,
    });

    res.redirect('/manageContact');

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).render('500', {
      title: 'Error',
      message: 'An error occurred while adding the contact.'
    });
  }
};

export const editContact = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {    
    return res.render('404', {
      title: 'Error',
      message: 'Invalid contact ID provided.'
    });    
  }

  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.render('404', {
        title: 'Error',
        message: 'Contact not found.'
      });
    }

    res.render('editContact', { 
      title: 'Edit Contact',
      description: 'Here you can view the contact details.',
      contact: contact
    });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).render('500', { 
      title: 'Error',
      message: 'An error occurred while fetching the contact.'
    });
  }  
};

export const editContactSubmit = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
    return res.render('404', {
      title: 'Error',
      message: 'Invalid contact ID provided.'
    });
  }

  try {
    const contact = await Contact.findByIdAndUpdate(req.body.id, {
      firstName: req.body.first_name,
      lastName: req.body.last_name,  
      email: req.body.email,
      phoneNumber: req.body.phone,
      profilePicture: req.file ? req.file.path : null, // Save file path if uploaded
      imageGallery: req.body.imageGallery ? req.body.imageGallery : null, // Optional field 
      docCV: req.body.docCV ? req.body.docCV : null, // Optional field
      // Ensure address is updated only if provided
      address: req.body.address,
    }, { new: true }); // Ensures updated contact is returned

    if (!contact) {
      return res.render('404', {
        title: 'Error',
        message: 'Contact not found.'
      });
    }

    res.redirect('/manageContact');

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).render('500', {
      title: 'Error',
      message: 'An error occurred while updating the contact.'
    });
  }
};

export const viewContact = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.render('404', { 
            title: 'Error', 
            message: 'Invalid contact ID provided.' 
        });
    }

    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.render('404', { 
                title: 'Error', 
                message: 'Contact not found.' 
            });
        }
        
        res.render('viewContact', { 
            title: 'View Contact', 
            description: 'Here you can view the contact details.', 
            contact: contact 
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).render('500', { 
            title: 'Error', 
            message: 'An unexpected error occurred while fetching the contact.' 
        });
    }
};


export const deleteContact = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {    
    return res.render('404', {
      title: 'Error',
      message: 'Invalid contact ID provided.'
    });    
  }

  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);  
    if (!contact) {
      return res.render('404', {
        title: 'Error',
        message: 'Contact not found.'
      });
    }
    // Optionally, you can delete the associated files if they exist
    if (contact.profilePicture) {
      
      const filePath = path.join(__dirname, '..', contact.profilePicture);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting profile picture:", err);
      });
    }
    if (contact.imageGallery) {
     
      const filePath = path.join(__dirname, '..', contact.imageGallery);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting image gallery:", err);
      });
    }
    if (contact.docCV) {
      
      const filePath = path.join(__dirname, '..', contact.docCV);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting CV document:", err);
      });
    } 
    res.redirect('/manageContact');

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).render('500', {
      title: 'Error',
      message: 'An error occurred while deleting the contact.'
    });
  }
};
