const {Schema, model} = require("mongoose")

const accountSchema = new Schema({
  currency: {type: String, required: true},
  createdAt: {type: Date, default: new Date().getTime()},
  ownerId: {type: Schema.Types.ObjectId, ref: "User", required: true},
  accountName: {type: String, required: true},
  iconName: {type: String, required: true},
  iconBackgroundColor: {type: String, required: true},
  amount: {type: Number, required: true, default: 0}
})

const Account = model("Account", accountSchema)

module.exports = Account
