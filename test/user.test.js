import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {
    afterEach(async () => {
        await removeTestUser();
    });

    it("should can register new user", async () => {
        const result = await supertest(web).post("/api/users").send({
            username: "otong123",
            password: "rahasia123",
            name: "Otong Surotong",
        });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("otong123");
        expect(result.body.data.name).toBe("Otong Surotong");
        expect(result.body.data.password).toBeUndefined();
    });

    it("should reject if request is invalid", async () => {
        const result = await supertest(web).post("/api/users").send({
            username: "",
            password: "",
            name: "",
        });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject if request username already registered", async () => {
        let result = await supertest(web).post("/api/users").send({
            username: "otong123",
            password: "rahasia123",
            name: "Otong Surotong",
        });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("otong123");
        expect(result.body.data.name).toBe("Otong Surotong");
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web).post("/api/users").send({
            username: "otong123",
            password: "rahasia123",
            name: "Otong Surotong",
        });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe("POST /api/users/login", () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it("should can login", async () => {
        const result = await supertest(web).post("/api/users/login").send({
            username: "otong123",
            password: "rahasia123",
        });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe("token123");
    });

    it("should reject login if request is invalid", async () => {
        const result = await supertest(web).post("/api/users/login").send({
            username: "",
            password: "",
        });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject login if password is wrong", async () => {
        const result = await supertest(web).post("/api/users/login").send({
            username: "otong123",
            password: "salah woy",
        });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe("GET /api/users/current", () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it("should can get current user", async () => {
        const result = await supertest(web)
            .get("/api/users/current")
            .set("Authorization", "token123");

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("otong123");
        expect(result.body.data.name).toBe("Otong Surotong");
    });

    it("should reject if token is invalid", async () => {
        const result = await supertest(web)
            .get("/api/users/current")
            .set("Authorization", "salah");

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe("PATCH /api/users/current", () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it("should can update user", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "token123")
            .send({
                name: "Otong Surotong Marotong",
                password: "passwordbaru",
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("otong123");
        expect(result.body.data.name).toBe("Otong Surotong Marotong");

        const user = await getTestUser();
        expect(await bcrypt.compare("passwordbaru", user.password)).toBe(true);
    });

    it("should can update user name", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "token123")
            .send({
                name: "Otong Surotong Marotong",
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("otong123");
        expect(result.body.data.name).toBe("Otong Surotong Marotong");
    });

    it("should can update user", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "token123")
            .send({
                password: "passwordbaru",
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("otong123");

        const user = await getTestUser();
        expect(await bcrypt.compare("passwordbaru", user.password)).toBe(true);
    });

    it("should reject if request in not valid", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "salah")
            .send({});

        logger.info(result.body);

        expect(result.status).toBe(401);
    });
});

describe("DELETE /api/users/logout", () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it("should can user logout", async () => {
        const result = await supertest(web)
            .delete("/api/users/logout")
            .set("Authorization", "token123");

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        const user = await getTestUser();
        expect(user.token).toBeNull();
    });

    it("should reject logout if token is invalid", async () => {
        const result = await supertest(web)
            .delete("/api/users/logout")
            .set("Authorization", "salah");

        expect(result.status).toBe(401);
    });
});
