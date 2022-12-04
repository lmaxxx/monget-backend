const {Schema, model} = require("mongoose")

const transactionSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, default: ""},
  amount: {type: Number, required: true},
  currency: {type: String, required: true},
  ownerId: {type: Schema.Types.ObjectId, ref: "User", required: true},
  createdAt: {type: Date, default: new Date().getTime()},
  date: {type: Date, required: true},
  accountId: {type: Schema.Types.ObjectId, ref: "Account", required: true},
  transactionType: {type: String, required: true},
  categoryId: {type: Schema.Types.ObjectId, ref: "Category"},
  convertedAmount: Number,
  convertingCurrency: String
})

const Transaction = model("Transaction", transactionSchema)

module.exports = Transaction
