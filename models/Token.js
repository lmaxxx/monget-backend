const {Schema, model} = require("mongoose")

const tokenScheme = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: "User"},
  refreshToken: {type: String, required: true}
})

const Token = model("Token", tokenScheme)

module.exports = Token
