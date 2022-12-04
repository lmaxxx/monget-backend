const axios = require("axios");

class ConverterService {
  getConvertOptions(params) {
    return {
      method: 'GET',
      url: 'https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency',
      params,
      headers: {
        'X-RapidAPI-Key': `${process.env.X_RapidAPI_Key}`,
        'X-RapidAPI-Host': `${process.env.X_RapidAPI_Host}`
      }
    }
  }

  async convert(params) {
    const {data} = await axios(this.getConvertOptions(params))

    return data.new_amount
  }
}

module.exports = new ConverterService()
