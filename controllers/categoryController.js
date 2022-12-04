const CategoryService = require("../services/categoryService")
const ApiError = require("../exceptions/apiError");

class CategoryController {
  async getCategories(req, res) {
    try {
      let transactionType = ""

      if(req.url.endsWith("/expenses")) {
        transactionType = "expenses"
      } else {
        transactionType = "income"
      }

      const {id} = req.user
      const categories = await CategoryService.getCategories(transactionType, id)

      res.json(categories)
    } catch (err) {
      ApiError.ErrorBoundary(res, err)
    }
  }

  async getCategory(req, res) {
    try {
      const {id} = req.params
      const category = await CategoryService.getCategory(id)

      res.json(category)
    } catch (err) {
      ApiError.ErrorBoundary(res, err)
    }
  }

  async updateCategoriesOrder(req, res) {
    try {
      ApiError.validationRequest(req)

      const {newOrder} = req.body
      await CategoryService.updateCategoriesOrder(newOrder)

      res.json({message: "Success"})
    } catch (err) {
      ApiError.ErrorBoundary(res, err)
    }
  }

  async editCategory(req, res) {
    try {
      const {id} = req.params
      const data = req.body

      if (!Object.values(data).length) throw new ApiError(400, "There aren't any new properties")

      const category = await CategoryService.editCategory(id, data)

      res.json(category)
    } catch (err) {
      ApiError.ErrorBoundary(res, err)
    }
  }

  async deleteCategory(req, res) {
    try {
      const {id} = req.params
      await CategoryService.deleteCategory(id)

      res.json({message: "Success"})
    } catch (err) {
      ApiError.ErrorBoundary(res, err)
    }
  }

  async createCategory(req, res) {
    try {
      ApiError.validationRequest(req)

      const data = req.body
      const {id} = req.user
      const category = await CategoryService.createCategory(id, data)

      res.json(category)
    } catch (err) {
      ApiError.ErrorBoundary(res, err)
    }
  }

  async getAllCategories(req, res) {
    try {
      const {id} = req.user
      const categories = await CategoryService.getCategories(null, id)

      res.json(categories)
    } catch (err) {
      ApiError.ErrorBoundary(res, err)
    }
  }
}

module.exports = new CategoryController()
