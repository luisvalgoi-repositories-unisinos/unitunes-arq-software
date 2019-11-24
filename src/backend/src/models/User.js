const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

mongoose.set('useCreateIndex', true);
mongoose.pluralize(null);

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true, max: 255 },
    lastName: { type: String, required: true, max: 255 },
    login: { type: String, required: true, max: 255, unique: true },
    lastLoginDate: Date,
    email: {
      type: String,
      required: true,
      max: 255,
      lowercase: true,
      validate: value => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: 'Invalid Email address' })
        }
      }
    },
    password: {
      type: String,
      required: true,
      minLength: 7
    },
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }],
    university: { type: Schema.Types.ObjectId, ref: 'University' },
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    library: { type: Schema.Types.ObjectId, ref: 'Library' },
    role: { type: String, default: 'academic' }
  },
  {
    timestamps: true,
    collection: 'User'
  },
);

UserSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

module.exports = model('User', UserSchema);
