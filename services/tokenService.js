const jwt = require("jsonwebtoken")
const Token = require("../models/Token")

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: "2h"})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: "30d"})

    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({userId})

    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }

    const token = await Token.create({userId, refreshToken})
    return token
  }

  async removeToken(refreshToken) {
    await Token.deleteOne({refreshToken})
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (err) {
      return null
    }

  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch (err) {
      return null
    }
  }

  async findToken(refreshToken) {
    const token = await Token.findOne({refreshToken})
    return token
  }
}

module.exports = new TokenService()
