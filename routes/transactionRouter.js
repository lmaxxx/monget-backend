const isAuthorized = require("../middlewares/isAuthorized");
const Router = require("express").Router
const router = Router()
const TransactionController = require("../controllers/transactionController")
const {body} = require("express-validator");

router.get("/transactions/:accountId", isAuthorized, TransactionController.getTransactions)
router.get("/transactions/expenses/:accountId", isAuthorized, TransactionController.getExpensesTransactions)
router.get("/transactions/income/:accountId", isAuthorized, TransactionController.getIncomeTransactions)
router.get("/transactions/chart/expenses/:accountId", isAuthorized, TransactionController.getExpensesChartData)
router.get("/transactions/chart/income/:accountId", isAuthorized, TransactionController.getIncomeChartData)
router.get("/transaction/:id", isAuthorized, TransactionController.getTransaction)
router.post("/transaction",
  body("title").isLength({min: 3}).withMessage("Title must be at least 3 char long"),
  body("amount").isNumeric().withMessage("Amount must be bigger than 0"),
  body("currency").isLength({min: 1}).withMessage("Choose currency"),
  body("transactionType").isLength({min: 1}).withMessage("Choose transactionType"),
  body("accountId").isLength({min: 7}).withMessage("Choose account"),
  body("categoryId").isLength({min: 1}).withMessage("Choose category"),
  body("date").isString().withMessage("Choose date"),
  isAuthorized, TransactionController.createTransaction)
router.patch("/transaction/:id", isAuthorized, TransactionController.editTransaction)
router.delete("/transaction/:id", isAuthorized, TransactionController.deleteTransaction)

module.exports = router
