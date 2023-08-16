const Joi = require('joi');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const config = require("config")

const centreSchema = new mongoose.Schema({
    label: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
})

centreSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { 
            _id: this._id, 
            label: this.label,
            phoneNumber: this.phoneNumber
        }, 
        config.get("secret"),
        {
            expiresIn: config.get("tokenExpiresIn")
        }
    )
}

const CentreDeSante = mongoose.model("CentreDeSante", centreSchema)

function validateRegisterBody(bodyObject) {
    const bodySchema = Joi.object({
        label: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        phoneNumber: Joi.date()
    })
    const validationResult = bodySchema.validate(bodyObject)
    return validationResult;
}

function validateUpdateBody(bodyObject) {
    const bodySchema = Joi.object({
        id: Joi.string().required()
    })
    const validationResult = bodySchema.validate(bodyObject)
    return validationResult;
}

module.exports.validateRegisterBody = validateRegisterBody
module.exports.validateUpdateBody = validateUpdateBody
module.exports.CmsModel = CentreDeSante