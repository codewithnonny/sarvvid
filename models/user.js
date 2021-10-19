const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    hashed_passwords: {
      type: String,
      required: true,
    },
    salt: {
      type:String
    }
  },
  { timestamps: true }
);

// virtual field

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashed_passwords = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

//methods

userSchema.methods = {
  authenticate: function (plaintext) {
    return this.encryptPassword(plaintext) === this.hashed_passwords;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
