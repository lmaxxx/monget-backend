class DataService {
  getUserFromDoc(userDoc) {
    return {
      email: userDoc.email,
      password: userDoc.password,
      name: userDoc.name,
      isActivated: userDoc.isActivated,
      currency: userDoc.currency,
      activationLink: userDoc.activationLink,
      id: userDoc._id
    }
  }

  getAccountFormDoc(accountDoc) {
    return {
      currency: accountDoc.currency,
      createdAt: accountDoc.createdAt,
      ownerId: accountDoc.ownerId,
      accountName: accountDoc.accountName,
      iconName: accountDoc.iconName,
      iconBackgroundColor: accountDoc.iconBackgroundColor,
      amount: accountDoc.amount,
      id: accountDoc._id
    }
  }

  getAccountsFromDocs(accountsDocs) {
    return accountsDocs.map(accountDoc => this.getAccountFormDoc(accountDoc))
  }

  getTransferFromDoc(transferDoc) {
    return {
      userId: transferDoc.userId,
      from: transferDoc.from,
      to: transferDoc.to,
      amount: transferDoc.amount,
      createdAt: transferDoc.createdAt,
      id: transferDoc._id
    }
  }

  getTransfersFromDocs(transfersDocs) {
    return transfersDocs.map(transfersDoc => this.getTransferFromDoc(transfersDoc))
  }

  getCategoryFromDoc(categoryDoc) {
    return {
      name: categoryDoc.name,
      iconName: categoryDoc.iconName,
      iconBackgroundColor: categoryDoc.iconBackgroundColor,
      ownerId: categoryDoc.ownerId,
      createdAt: categoryDoc.createdAt,
      transactionType: categoryDoc.transactionType,
      order: categoryDoc.order,
      id: categoryDoc._id
    }
  }

  getCategoriesFromDocs(categoriesFocs) {
    return categoriesFocs.map(categoryDoc => this.getCategoryFromDoc(categoryDoc))
  }

  getTransactionFromDoc(transaction) {
    const clearTransaction = {
      title: transaction.title,
      description: transaction.description,
      ownerId: transaction.ownerId,
      createdAt: transaction.createdAt,
      accountId: transaction.accountId,
      transactionType: transaction.transactionType,
      categoryId: transaction.categoryId,
      amount: transaction.amount,
      currency: transaction.currency,
      date: transaction.date,
      id: transaction._id
    }

    if (transaction.convertedAmount && transaction.convertingCurrency) {
      clearTransaction.convertedAmount = transaction.convertedAmount
      clearTransaction.convertingCurrency = transaction.convertingCurrency
    }

    return clearTransaction
  }

  getTransactionsFromDocs(transactions) {
    return transactions.map(transaction => this.getTransactionFromDoc(transaction))
  }

  validatePageTransactionQuery({page}) {
    page = +page

    if (page) {
      return {
        skip: (page - 1) * 10,
        limit: 10
      }
    }
  }
}

module.exports = new DataService()
