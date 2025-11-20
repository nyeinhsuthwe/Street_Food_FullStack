const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const schema = mongoose.Schema;

const UserSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role : {
    type : String,
    enum : ["user", "admin"],
    default : "user",
  }
});

UserSchema.statics.register = async function (name, email, password) {
  const userExist = await this.findOne({ email });
  if (userExist) {
    throw new Error("User is already existed.");
  }

  const salt = await bcrypt.genSalt();
  const hashValue = await bcrypt.hash(password, salt);

  const UserInfo = await this.create({
    name,
    email,
    password: hashValue,
  });

  return UserInfo;
};

UserSchema.statics.login = async function (email, password) {
  const userExist = await this.findOne({ email });
  if (!userExist) {
    throw new Error("User is not existed.");
  }
  const isMatchPassword = await bcrypt.compare(password, userExist.password);
  if (!isMatchPassword) {
    throw new Error("Password is not matched. Please try again!");
  }

  return userExist;
};

module.exports = mongoose.model("User", UserSchema);
