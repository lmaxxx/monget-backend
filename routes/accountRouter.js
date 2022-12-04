const Router = require("express").Router
const isAuthorized = require("../middlewares/isAuthorized");
const router = new Router()
const AccountController = require("../controllers/accountController")
const {body} = require("express-validator");

router.get("/accounts", isAuthorized, AccountController.getAccounts)
router.get("/account/:id", isAuthorized, AccountController.getAccount)
router.post("/account",
  body("currency").isLength({min: 3}).withMessage("Choose currency"),
  body("accountName").isLength({min: 3}).withMessage("Account name must be at least 3 chars long"),
  body("iconName").isLength({min: 1}).withMessage("Choose icon"),
  body("iconBackgroundColor").isLength({min: 7}).withMessage("Choose icon background color"),
  body("amount").isNumeric().withMessage("Amount must be a number"),
  isAuthorized, AccountController.createAccount)

router.patch("/account/:id", isAuthorized, AccountController.editAccount)
router.delete("/account/:id", isAuthorized, AccountController.deleteAccount)

module.exports = router
