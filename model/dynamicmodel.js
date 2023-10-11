const { DataTypes } = require('sequelize')
const sequelize = require('../util/database')

let dynamicmodel = (TableName, dynamicFields) => {
  let schema = {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
  }

  let fieldNames = Object.keys(dynamicFields)
  let fieldValues = Object.values(dynamicFields)

  for (let i = 0; i < fieldNames.length; i++) {
    let fieldName = fieldNames[i]
    let fieldType = fieldValues[i]
    schema[fieldName] = {
      type: DataTypes[fieldType]
    }
  }

  const model = sequelize.define(TableName, schema)

   model.sync().then(() => {
    console.log('model successfully synchronized')
  })
  
}

module.exports = dynamicmodel
