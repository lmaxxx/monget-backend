const {Schema, model} = require("mongoose")

const userScheme = new Schema({
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  isActivated: {type: Boolean, default: false},
  name: {type: String, required: true},
  currency: {type: String, default: ""},
  activationLink: {type: String}
})

const User = model("User", userScheme)

module.exports = User
