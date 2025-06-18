import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// User schema definition
// This schema defines the structure of user documents in the MongoDB database
const userSchema = new Schema({
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
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: true
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;