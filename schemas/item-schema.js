const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const itemSchema = mongoose.Schema({
  id: reqString,
  examine: reqString,
  members: reqString,
  lowalch: reqString,
  limit: reqString,
  value: reqString,
  highalch: reqString,
  icon: reqString,
  name: reqString,
})

module.exports = mongoose.model('items', itemSchema)