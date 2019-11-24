const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// UserSchema.pre('findOneAndUpdate', async function (next) {
//   // Hash the password before saving the user model
//   const user = this._update;
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

UserSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token
};

UserSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' })
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    throw new Error({ error: 'Invalid login credentials' })
  }

  return user
};

module.exports = model('User', UserSchema);
