import supertest from "supertest";
import {
    createTestUser,
    removeAllTestContact,
    removeTestUser,
} from "./test-util.js";
import { web } from "../src/application/web.js";

describe("POST /api/contacts", () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can create new contact", async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "token123")
            .send({
                first_name: "test",
                last_name: "test",
                email: "test@yahoo.com",
                phone: "081234123",
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe("test");
        expect(result.body.data.last_name).toBe("test");
        expect(result.body.data.email).toBe("test@yahoo.com");
        expect(result.body.data.phone).toBe("081234123");
    });

    it("should reject if request is not valid", async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "token123")
            .send({
                first_name: "test",
                last_name: "test",
                email: "test",
                phone: "081234123",
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});
