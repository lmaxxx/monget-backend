const DateService = require("./dateService");
const TransactionService = require("./transactionService");
const ApiError = require("../exceptions/apiError");
const ConverterService = require("./converterService")

class StatisticService {
  async getStatistics(queryType, dateCounter, transactionType) {
    switch (queryType) {
      case "years":
        return await this.getYearStatistic(dateCounter, transactionType)
      case "weeks":
        return await this.getWeekStatistic(dateCounter, transactionType)
      case "months":
        return await this.getMonthStatistic(dateCounter, transactionType)
    }
  }

  async getYearStatistic(dateCounter, transactionType) {
    const data = []
    const currentDate = new Date()
    const startOfTheYear = DateService.getStartOfTheYear(currentDate, dateCounter)
    const endOfTheYear = DateService.getEndOfTheYear(currentDate, dateCounter)
    const query = {
      start: startOfTheYear,
      end: endOfTheYear
    }

    let transactions = await TransactionService.getTransactions(null, transactionType, query)
    transactions = await this.convertTransactionsAmount(transactions)

    for (let i = 0; i < 12; i++) {
      const startOfTheMonth = DateService.getStartOfTheMonthByIndex(startOfTheYear, i)
      const endOfTheMonth = DateService.getEndOfTheMonthByIndex(startOfTheYear, i)
      const monthName = startOfTheMonth.toLocaleString('en-US', {month: 'short'})
      const monthData = {label: monthName, expenses: 0, income: 0, profit: 0, loss: 0}
      const monthTransactions = transactions.filter(transaction => (
        transaction.date.getTime() >= startOfTheMonth.getTime() &&
        transaction.date.getTime() <= endOfTheMonth.getTime()
      ))

      const sectionData = await this.processTransactionsStatisticSection(monthTransactions, transactionType, monthData)
      data.push(sectionData)
    }

    return data
  }

  async getMonthStatistic(dateCounter, transactionType) {
    const data = []
    const currentDate = new Date()
    const monthStartDay = DateService.subtractMonths(currentDate, dateCounter)
    const monthEndDay = new Date(monthStartDay.getUTCFullYear(), monthStartDay.getUTCMonth() + 1, 0, 24, 59, 59, 999)
    monthStartDay.setUTCDate(1)

    const query = {
      start: DateService.getStartOfTheDay(monthStartDay),
      end: DateService.getEndOfTheDay(monthEndDay),
    }

    let transactions = await TransactionService.getTransactions(null, transactionType, query)
    transactions = await this.convertTransactionsAmount(transactions)
    const weeksBorders = DateService.getWeeksBordersInMonth(monthStartDay, monthEndDay)

    for (const {start, end} of weeksBorders) {
      const weekTransactions = transactions.filter(transaction => (
        transaction.date.getTime() >= start.getTime() &&
        transaction.date.getTime() <= end.getTime()
      ))
      let dayName = ""

      if (start.getUTCDate() === end.getUTCDate()) {
        dayName = start.getUTCDate() + ""
      } else {
        dayName = `${start.getUTCDate()} - ${end.getUTCDate()}`
      }

      const weekData = {label: dayName, expenses: 0, income: 0, profit: 0, loss: 0}
      const sectionData = await this.processTransactionsStatisticSection(weekTransactions, transactionType, weekData)

      data.push(sectionData)
    }

    return data
  }

  async getWeekStatistic(dateCounter, transactionType) {
    const data = []
    const currentDate = new Date()
    const weekStartDay = DateService.subtractDays(currentDate, dateCounter * 7)
    const weekEndDay = DateService.addDays(weekStartDay, 7)

    const query = {
      start: DateService.getStartOfTheDay(weekStartDay),
      end: DateService.getEndOfTheDay(weekEndDay),
    }

    let transactions = await TransactionService.getTransactions(null, transactionType, query)
    transactions = await this.convertTransactionsAmount(transactions)

    for (let i = 0; i < 7; i++) {
      const startOfTheDay = DateService.addDays(query.start, i + 1)
      const endOfTheDay = DateService.getEndOfTheDay(startOfTheDay)
      const label = startOfTheDay.toLocaleString('en-US', {weekday: 'short', day: "numeric"})
      const weekData = {label, expenses: 0, income: 0, profit: 0, loss: 0}
      const weekTransactions = transactions.filter(transaction => (
        transaction.date.getTime() >= startOfTheDay.getTime() &&
        transaction.date.getTime() <= endOfTheDay.getTime()
      ))

      const sectionData = await this.processTransactionsStatisticSection(weekTransactions, transactionType, weekData)
      data.push(sectionData)
    }

    return data
  }

  getStatisticsQuery(query) {
    const {years, weeks, months} = query

    if (years || years === 0) return {type: "years", dateCounter: years}
    if (weeks || weeks === 0) return {type: "weeks", dateCounter: weeks}
    if (months || months === 0) return {type: "months", dateCounter: months}

    throw new ApiError(400, "Bad params")
  }

  async processTransactionsStatisticSection(transactions, transactionType, data) {
    if (!transactions.length) return data

    const copyData = {...data}

    transactions.forEach(transaction => {
      const amount = transaction.convertedAmount ? transaction.convertedAmount : transaction.amount

      if (transaction.transactionType === "expenses") {
        copyData.expenses += amount
        return
      }

      copyData.income += amount
    })

    let profit = (copyData.income - copyData.expenses)

    if (profit !== parseInt(profit)) profit = Number(profit).toFixed(2)

    if (profit >= 0) {
      copyData.profit = Number(profit)
    } else {
      copyData.loss = Math.abs(Number(profit))
    }

    return copyData
  }

  async convertTransactionsAmount(allTransactions) {
    const result = []
    const accounts = await TransactionService.getAccountsFromTransactions(allTransactions)

    if (!accounts.length) return []

    for (const account of accounts) {
      const transactions = TransactionService.getTransactionsFromAccount(account.id.toString(), allTransactions)
      if (account.currency === account.ownerId.currency) {
        result.push(...transactions)
        continue
      }

      const currencyPrice = await ConverterService.convert({
        amount: 1,
        have: account.currency,
        want: account.ownerId.currency
      })

      transactions.forEach(transaction => {
        const amount = transaction.convertedAmount ? transaction.convertedAmount : transaction.amount
        transaction.convertedAmount = currencyPrice * amount

        result.push(transaction)
      })
    }

    return result
  }
}

module.exports = new StatisticService()
