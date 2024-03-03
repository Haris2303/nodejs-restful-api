import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createTestUser, removeTestUser } from "./test-util.js";

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