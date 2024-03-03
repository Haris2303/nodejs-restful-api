import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
    getUserValidation,
    loginUserValidation,
    registerUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username,
        },
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Username already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true,
        },
    });
};

const login = async (request) => {
    // validation login request
    const loginRequest = validate(loginUserValidation, request);

    // get data user by username
    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username,
        },
        select: {
            username: true,
            password: true,
        },
    });

    // if username is not found
    if (!user) {
        throw new ResponseError(401, "Username or password wrong");
    }

    // check hash password
    const isPasswordValid = await bcrypt.compare(
        loginRequest.password,
        user.password
    );

    // if password isn't valid
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password wrong");
    }

    // make token
    const token = uuid().toString();

    // return update user token
    return prismaClient.user.update({
        data: {
            token: token,
        },
        where: {
            username: user.username,
        },
        select: {
            token: true,
        },
    });
};

const get = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username,
        },
        select: {
            username: true,
            name: true,
        },
    });

    if (!user) {
        throw new ResponseError(404, "User is not found");
    }

    return user;
};

export default {
    register,
    login,
    get,
};
