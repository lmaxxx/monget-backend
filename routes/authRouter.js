const Router = require("express").Router
const AuthController = require("../controllers/authController")
const router = new Router()
const isAuthorized = require("../middlewares/isAuthorized")
const {body} = require("express-validator")

router.post("/registration",
  body("name").isLength({min: 3}).withMessage("Name must be least 3 chars long"),
  body("email").isEmail().withMessage("Not an email"),
  body("password").isLength({min: 8}).withMessage("Password must be at least 8 chars long"),
  AuthController.registration)

router.post("/login",
  body("email").isEmail().withMessage("Not an email"),
  body("password").isLength({min: 8}).withMessage("Password must be at least 8 chars long"),
  AuthController.login)

router.put("/currency",
  body("currency").isLength({min: 3}).withMessage("Currency didn't choose"),
  isAuthorized, AuthController.updateCurrency)

router.post("/logout", AuthController.logout)
router.get("/activate/:link", AuthController.activate)
router.get("/refresh", AuthController.refresh)
router.put("/email", isAuthorized, AuthController.updateEmail)

module.exports = router
