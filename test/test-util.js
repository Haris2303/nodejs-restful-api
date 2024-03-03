import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "otong123",
        },
    });
};

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "otong123",
            password: await bcrypt.hash("rahasia123", 10),
            name: "Otong Surotong",
            token: "token123",
        },
    });
};
