const Router = require("express").Router
const isAuthorized = require("../middlewares/isAuthorized")
const router = new Router()
const TransferController = require("../controllers/transferController")
const {body} = require("express-validator");

router.post("/transfer",
  body("from").isLength({min: 5}).withMessage("Set account 'from'"),
  body("to").isLength({min: 5}).withMessage("Set account 'to'"),
  body("amount").isNumeric().withMessage("Set amount"),
  isAuthorized, TransferController.createTransfer)
router.get("/transfers", isAuthorized, TransferController.getTransfers)

module.exports = router
