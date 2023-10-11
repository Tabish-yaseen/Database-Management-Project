const express=require('express')
const router=express.Router()
const dynamicController=require('../controller/dynamiccontroller')

router.post('/create-table',dynamicController.createTable)
router.post('/insert-record',dynamicController.insertRecord)
router.get('/get-models',dynamicController.getModels)
router.get('/get-records',dynamicController.getRecords)
router.delete('/delete-record/:id',dynamicController.deleteRecord)


module.exports=router