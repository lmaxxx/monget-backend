const Router = require("express").Router
const router = new Router()
const isAuthorized = require("../middlewares/isAuthorized");
const CategoryController = require("../controllers/categoryController")
const {body} = require("express-validator");

router.get("/categories/expenses", isAuthorized, CategoryController.getCategories)
router.get("/categories", isAuthorized, CategoryController.getAllCategories)
router.get("/categories/income", isAuthorized, CategoryController.getCategories)
router.get("/category/:id", isAuthorized, CategoryController.getCategory)
router.patch("/categories/order",
  body("newOrder").isArray().withMessage("Invalid order"),
  isAuthorized, CategoryController.updateCategoriesOrder)

router.post("/category",
  body("name").isLength({min: 1}).withMessage("Name must be at least 1 char long"),
  body("iconName").isLength({min: 4}).withMessage("Choose icon"),
  body("transactionType").isLength({min: 1}).withMessage("Choose transaction type"),
  body("iconBackgroundColor").isLength({min: 4}).withMessage("Choose icon background color"),
  isAuthorized, CategoryController.createCategory)

router.patch("/category/:id", isAuthorized, CategoryController.editCategory)
router.delete("/category/:id", isAuthorized, CategoryController.deleteCategory)

module.exports = router
