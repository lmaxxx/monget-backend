const {connect} = require("mongoose")

module.exports = () => {
  connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}
