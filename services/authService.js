const User = require("../models/User");
const bcrypt = require("bcrypt");
const uuid = require("uuid")
const TokenService = require("./tokenService")
const MailService = require("./mailService")
const DataService = require("./dataService")
const ApiError = require("../exceptions/apiError");
const AccountService = require("./accountService")
const CategoryService = require("./categoryService")

class AuthService {
  async registration(email, password, name) {
    const candidate = await User.findOne({email})

    if (candidate) throw new ApiError(400, "Email is already in use")

    const hashPassword = await bcrypt.hash(password, 4)
    const activationLink = uuid.v4()

    const user = await User.create({
      email,
      password: hashPassword,
      name,
      activationLink
    })

    const userData = DataService.getUserFromDoc(user)
    const tokens = TokenService.generateTokens(userData)

    await TokenService.saveToken(userData.id, tokens.refreshToken)
    await MailService.sendActivationMail(userData.email, `${process.env.API_URL}/api/auth/activate/${activationLink}`, userData.name)
    await CategoryService.createBaseCategories(userData.id)

    return {...tokens, user: userData}
  }

  async login(email, password) {
    const user = await User.findOne({email})

    if (!user) throw new ApiError(400, "User with this email was not found")

    const isPasswordEquals = await bcrypt.compare(password, user.password)

    if (!isPasswordEquals) throw new ApiError(400, "Password is incorrect")

    const userData = DataService.getUserFromDoc(user)
    const tokens = TokenService.generateTokens(userData)

    await TokenService.saveToken(userData.id, tokens.refreshToken)
    return {...tokens, user: userData}
  }

  async activate(activationLink) {
    const user = await User.findOne({activationLink})

    if (!user) throw new ApiError(400, "Activation link is incorrect")

    user.isActivated = true
    await user.save()
  }

  async logout(refreshToken) {
    await TokenService.removeToken(refreshToken)
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new ApiError(401, "User is unauthorized")

    const userData = TokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await TokenService.findToken(refreshToken)

    if (!userData || !tokenFromDb) throw new ApiError(401, "User is unauthorized")

    const user = await User.findById(userData.id)
    const newUserData = DataService.getUserFromDoc(user)
    const tokens = TokenService.generateTokens(newUserData)

    await TokenService.saveToken(newUserData.id, tokens.refreshToken)
    return {...tokens, user: newUserData}
  }

  async updateCurrency(userId, currency) {
    const user = await User.findById(userId)

    if (!user.currency) {
      user.currency = currency
      await AccountService.createAccount(DataService.getUserFromDoc(user))
    }

    user.currency = currency
    await user.save()

    const userData = DataService.getUserFromDoc(user)
    return {user: userData}
  }

  async updateEmail(userId, email) {
    const userDoc = await User.findById(userId)
    const candidate = await User.findOne({email})

    if (candidate) throw new ApiError(400, "Email is already in use")

    userDoc.email = email
    await userDoc.save()
    await MailService.sendActivationMail(userDoc.email, `${process.env.API_URL}/api/auth/activate/${userDoc.activationLink}`, userDoc.name)

    const userData = DataService.getUserFromDoc(userDoc)
    return {user: userData}
  }
}

module.exports = new AuthService()
