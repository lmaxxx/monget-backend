const Transfer = require("../models/Transfer")
const DataService = require("./dataService")
const Account = require("../models/Account")
const ConverterService = require("./converterService")

class TransferService {
  async getTransfers(userId, options) {
    const transfersDocs = await Transfer.find({userId}, null, options)
      .sort({createdAt: 'desc'})
      .populate(["from", "to"])

    return DataService.getTransfersFromDocs(transfersDocs)
  }

  async createTransfer(userId, from, to, amount) {
    const transferDoc = await Transfer.create({
      userId, from, to, amount, createdAt: new Date().getTime()
    })

    await transferDoc.populate(["from", "to"])

    const transfer = DataService.getTransferFromDoc(transferDoc)
    await this.processTransfer(transfer)

    return transfer
  }

  async processTransfer(transfer) {
    const {from, to, amount: transferAmount} = transfer
    const {currency: fromCurrency, id: fromId, amount: fromAmount} = from
    const {currency: toCurrency, id: toId, amount: toAmount} = to

    if (fromCurrency === toCurrency) {
      await Account.findByIdAndUpdate(fromId, {amount: fromAmount - transferAmount})
      await Account.findByIdAndUpdate(toId, {amount: toAmount + transferAmount})

      return
    }

    const amountWithRightCurrency = await ConverterService.convert({
      want: toCurrency,
      have: fromCurrency,
      amount: transferAmount
    })

    await Account.findByIdAndUpdate(fromId, {amount: fromAmount - transferAmount})
    await Account.findByIdAndUpdate(toId, {amount: toAmount + amountWithRightCurrency})
  }
}

module.exports = new TransferService()
