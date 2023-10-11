const dynamicModel = require('../model/dynamicmodel')
const sequelize = require('../util/database')

exports.createTable=(req,res,next)=>{
  const { TableName,dynamicFields } = req.body

 dynamicModel(TableName,dynamicFields)
 res.status(201).json('table created successfully');

}

  
exports.insertRecord = (req, res, next) => {
  const { modelName, details } = req.body

  const model = sequelize.models[modelName]

  if (!model) {
    return res.status(500).json({ error: 'table doesnt exists' })
  }

  model.create(details)
    .then((result) => {
      res.status(200).json({ data: result })
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
}



exports.getRecords = (req, res, next) => {
  const modelName = req.query.modelName

  const model = sequelize.models[modelName]

  if (!model) {
    return res.status(500).json({ error: 'table doesnt exists' })
  }

  model.findAll()
      .then((records) => {
          res.status(200).json(records)
      })
      .catch(error => {
        res.status(500).json({ error: err })
      })
}

exports.getModels = (req, res, next) => {
  const modelNames = Object.keys(sequelize.models)

  const definedModels = []


  for (let modelName of modelNames) {
    const model = sequelize.models[modelName]
    const fieldNames = Object.keys(model.rawAttributes)

  
    definedModels.push({ modelName: modelName, fields: fieldNames })
  }

  res.json(definedModels)
};


exports.deleteRecord=(req,res,next)=>{
  const id=req.params.id
  const modelName=req.query.modelName

  const model=sequelize.models[modelName]

  if(!modelName){
    return res.status(500).json({ error: 'table doesnt exists' })

  }
  model.destroy({where:{
    id:id
  }}).then(() => {
    res.status(200).json('record successfully deleted')
  })
  .catch((error) => {
    res.status(500).json('error in deleting the record')
  })

}