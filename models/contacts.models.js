import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;


const contactSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: {
    type: String,
    required: false
  },
  imageGallery: {
    type: [String],
    required: false
  },
  docCV: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  }
}, { timestamps: true });
// Adding pagination plugin to the contact schema
// This allows us to paginate the results when querying contacts
contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact