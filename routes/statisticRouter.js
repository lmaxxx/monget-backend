const Router = require("express").Router
const router = Router()
const StatisticController = require("../controllers/statisticController")
const isAuthorized = require("../middlewares/isAuthorized");

router.get("/statistics/expenses", isAuthorized, StatisticController.getExpensesStatistics)
router.get("/statistics/income", isAuthorized, StatisticController.getIncomeStatistics)
router.get("/statistics", isAuthorized, StatisticController.getStatistics)

module.exports = router
