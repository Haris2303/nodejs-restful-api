import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(100).min(6).required(),
    password: Joi.string().max(100).min(8).required(),
    name: Joi.string().max(100).required(),
});

const loginUserValidation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).optional(),
    name: Joi.string().max(100).optional(),
});

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation,
};
