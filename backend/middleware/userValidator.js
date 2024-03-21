const Joi = require('joi')
const userValidator = (req,res,next)=>{
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?\":{}|<>]).*$/).min(8).max(30).messages({
            'string.pattern.base': `Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.`,
            'string.min': `Password must be at least 8 characters long.`,
            'string.max': `Password must not exceed 30 characters.`,
          }),
        username: Joi.string().alphanum().min(4).max(30).required(),
        phoneNumber: Joi.string().required(),
        role: Joi.string().valid('tenant', 'admin', 'landlord', 'superadmin', 'broker').required(),
        mainAddress: Joi.string().required(),
        broker: Joi.object({
            commissionRate: Joi.number(),
            rating: Joi.number()
        }),
        landlord: Joi.object({
            rating: Joi.number()
        }),
        tenant: Joi.object({
            rating: Joi.number()
        }),
    });

    const {error, value} = schema.validate(req.body);

    if(error){
        res.status(400).json({error: error.details.map((err) => err.message)})
    }

    next();

}

module.exports = {userValidator}