const ApiError = require("../exceptions/apiError");
const StatisticService = require('../services/statisticService')

class StatisticController {
  async getIncomeStatistics(req, res) {
    try {
      const query = StatisticService.getStatisticsQuery(req.query)
      const data = await StatisticService.getStatistics(query.type, query.dateCounter, "income")

      res.json(data)
    } catch (err) {
      ApiError.ErrorBoundary(res, err)
    }
  }

  async getExpensesStatistics(req, res) {
    try {
      const query = StatisticService.getStatisticsQuery(req.query)
      const data = await StatisticService.getStatistics(query.type, query.dateCounter, "expenses")

      res.json(data)
    } catch (err) {
      ApiError.ErrorBoundary(res, err)
    }
  }

  async getStatistics(req, res) {
    try {
      const query = StatisticService.getStatisticsQuery(req.query)
      const data = await StatisticService.getStatistics(query.type, query.dateCounter)

      res.json(data)
    } catch (err) {
      ApiError.ErrorBoundary(res, err)
    }
  }
}

module.exports = new StatisticController()
