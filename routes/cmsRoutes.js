const express = require('express')
const router = express.Router()
const { CmsModel, validateRegisterBody, validateUpdateBody } = require('../models/cms_model')

router.get('/', async (request, response) => {
    try {
        const cmsList = await CmsModel.find()
        return response.json(cmsList)
    } catch (e) {
        console.log(e)
        return response.status(500).json({message: "Erreur interne"})
    }
})

router.post('/', async (request, response) => {
    let joiValidationResult = validateRegisterBody(request.body);
    if (joiValidationResult.error) return response.status(400).json({ message: joiValidationResult.error.details[0].message, request_body_content: request.body });

    try {
        const newData = await CmsModel.create(request.body)
        return response.json(newData)
    } catch (e) {
        console.log(e)
        return response.status(500).json({message: "Erreur interne"})
    }
})

router.put('/:id', async (request, response) => {
    let joiValidationResult = validateUpdateBody(request.body);
    if (joiValidationResult.error) return response.status(400).json({ message: joiValidationResult.error.details[0].message, request_body_content: request.body });

    try {
        const existingOne = await CmsModel.findById({ _id: request.params.id })
        if(!existingOne) return response.status(400).json({ message: "Centre de santé non trouvé dans la base" })
        const result = await CmsModel.updateOne({_id: request.params.id}, {...request.body})
        return response.json({ ...result._doc, ...request.body })
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal error" })
    }

})

module.exports = router;