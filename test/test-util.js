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

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "otong123",
        },
    });
};

export const removeAllTestContact = async () => {
    await prismaClient.contact.deleteMany({
        where: {
            username: "otong123",
        },
    });
};

export const createTestContact = async () => {
    await prismaClient.contact.create({
        data: {
            username: "otong123",
            first_name: "test",
            last_name: "test",
            email: "test@yahoo.com",
            phone: "081299998888",
        },
    });
};

export const getTestContact = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username: "otong123",
        },
    });
};

export const createManyTestContact = async () => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.contact.create({
            data: {
                username: `otong123`,
                first_name: `test ${i}`,
                last_name: `test ${i}`,
                email: `test${i}@gmail.com`,
                phone: `0812223344${i}`,
            },
        });
    }
};

export const removeAllTestAddresses = async () => {
    await prismaClient.address.deleteMany({
        where: {
            contact: {
                username: "otong123",
            },
        },
    });
};

export const createTestAddress = async () => {
    const contact = await getTestContact();

    await prismaClient.address.create({
        data: {
            contact_id: contact.id,
            street: "Jalan Otong",
            city: "Kota Otong",
            province: "Province Otong",
            country: "Indo",
            postal_code: "12345",
        },
    });
};

export const getTestAddress = async () => {
    return prismaClient.address.findFirst({
        where: {
            contact: {
                username: "otong123",
            },
        },
    });
};
