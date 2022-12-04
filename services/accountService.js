const Account = require("../models/Account");
const DataService = require("./dataService")
const ApiError = require("../exceptions/apiError");
const Transaction = require("../models/Transaction");
const Transfer = require("../models/Transfer");

class AccountService {
  async createAccount(userData, data) {
    if (!data) {
      const accountDoc = await Account.create({
        currency: userData.currency,
        ownerId: userData.id,
        accountName: "Main",
        iconName: "IconCash",
        iconBackgroundColor: "#20c997",
        createdAt: new Date().getTime()
      })

      return DataService.getAccountFormDoc(accountDoc)
    }

    const accountDoc = await Account.create({
      ...data,
      ownerId: userData.id,
      createdAt: new Date().getTime()
    })

    return DataService.getAccountFormDoc(accountDoc)
  }

  async getAccounts(userId, populate) {
    const accountsDocs = await Account.find({ownerId: userId}).populate(populate)
    const accounts = DataService.getAccountsFromDocs(accountsDocs)

    return accounts
  }

  async editAccount(id, data) {
    const accountDoc = await Account.findById(id).catch(err => {
      throw new ApiError(400, "There is no account with current id")
    })

    if (!accountDoc) throw new ApiError(400, "Account with this id doesn't exist")

    Object.entries(data).forEach(([property, value]) => {
      accountDoc[property] = value
    })

    await accountDoc.save()
    return DataService.getAccountFormDoc(accountDoc)
  }

  async getAccount(id) {
    const accountDoc = await Account.findById(id).catch(err => {
      throw new ApiError(400, "There is no account with current id")
    })

    return DataService.getAccountFormDoc(accountDoc)
  }

  async deleteAccount(id) {
    await Account.findByIdAndDelete(id).catch(err => {
      throw new ApiError(400, "There is no account with current id")
    })

    await Transaction.deleteMany({accountId: id}).catch(err => {
      throw new ApiError(400, "There is no account with current id")
    })

    await Transfer.deleteMany({$or: [{from: id}, {to: id}]}).catch(err => {
      throw new ApiError(400, "There is no account with current id")
    })
  }
}

module.exports = new AccountService()
