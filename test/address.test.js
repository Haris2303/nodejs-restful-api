import supertest from "supertest";
import {
    createTestAddress,
    createTestContact,
    createTestUser,
    getTestAddress,
    getTestContact,
    removeAllTestAddresses,
    removeAllTestContact,
    removeTestUser,
} from "./test-util.js";
import { web } from "../src/application/web.js";

describe("POST /api/contacts/:contactId/addresses", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can create new address", async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .post("/api/contacts/" + testContact.id + "/addresses")
            .set("Authorization", "token123")
            .send({
                street: "Jalan Otong",
                city: "Kota Otong",
                province: "Province Otong",
                country: "Indo",
                postal_code: "21433",
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe("Jalan Otong");
        expect(result.body.data.city).toBe("Kota Otong");
        expect(result.body.data.province).toBe("Province Otong");
        expect(result.body.data.country).toBe("Indo");
        expect(result.body.data.postal_code).toBe("21433");
    });

    it("should reject if address request is invalid", async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .post("/api/contacts/" + testContact.id + "/addresses")
            .set("Authorization", "token123")
            .send({
                street: "Jalan Otong",
                city: "Kota Otong",
                province: "Province Otong",
                country: "",
                postal_code: "",
            });

        expect(result.status).toBe(400);
    });

    it("should reject if contact is not found", async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .post("/api/contacts/" + (testContact.id + 6) + "/addresses")
            .set("Authorization", "token123")
            .send({
                street: "Jalan Otong",
                city: "Kota Otong",
                province: "Province Otong",
                country: "Indo",
                postal_code: "13423",
            });

        expect(result.status).toBe(404);
    });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can get contact", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get(
                "/api/contacts/" +
                    testContact.id +
                    "/addresses/" +
                    testAddress.id
            )
            .set("Authorization", "token123");

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe("Jalan Otong");
        expect(result.body.data.city).toBe("Kota Otong");
        expect(result.body.data.province).toBe("Province Otong");
        expect(result.body.data.country).toBe("Indo");
        expect(result.body.data.postal_code).toBe("12345");
    });

    it("should reject if contact is not found", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get(
                "/api/contacts/" +
                    (testContact.id + 1) +
                    "/addresses/" +
                    testAddress.id
            )
            .set("Authorization", "token123");

        expect(result.status).toBe(404);
    });

    it("should reject if address is not found", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get(
                "/api/contacts/" +
                    testContact.id +
                    "/addresses/" +
                    (testAddress.id + 1)
            )
            .set("Authorization", "token123");

        expect(result.status).toBe(404);
    });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can update address", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put(
                "/api/contacts/" +
                    testContact.id +
                    "/addresses/" +
                    testAddress.id
            )
            .set("Authorization", "token123")
            .send({
                street: "Jalan Durian",
                city: "Kota Durian",
                province: "Province Durian",
                country: "Indo",
                postal_code: "12345",
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe("Jalan Durian");
        expect(result.body.data.city).toBe("Kota Durian");
        expect(result.body.data.province).toBe("Province Durian");
        expect(result.body.data.country).toBe("Indo");
        expect(result.body.data.postal_code).toBe("12345");
    });

    it("should reject if request is not valid", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put(
                "/api/contacts/" +
                    testContact.id +
                    "/addresses/" +
                    testAddress.id
            )
            .set("Authorization", "token123")
            .send({
                street: "Jalan Durian",
                city: "Kota Durian",
                province: "Province Durian",
                country: "",
                postal_code: "",
            });

        expect(result.status).toBe(400);
    });

    it("should reject if request address is not found", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put(
                "/api/contacts/" +
                    testContact.id +
                    "/addresses/" +
                    (testAddress.id + 1)
            )
            .set("Authorization", "token123")
            .send({
                street: "Jalan Durian",
                city: "Kota Durian",
                province: "Province Durian",
                country: "asd",
                postal_code: "ads",
            });

        expect(result.status).toBe(404);
    });

    it("should reject if request contact is not found", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put(
                "/api/contacts/" +
                    (testContact.id + 1) +
                    "/addresses/" +
                    testAddress.id
            )
            .set("Authorization", "token123")
            .send({
                street: "Jalan Durian",
                city: "Kota Durian",
                province: "Province Durian",
                country: "asd",
                postal_code: "ads",
            });

        expect(result.status).toBe(404);
    });
});

describe("DELETE /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can remove address", async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete(
                "/api/contacts/" +
                    testContact.id +
                    "/addresses/" +
                    testAddress.id
            )
            .set("Authorization", "token123");

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        testAddress = await getTestAddress();
        expect(testAddress).toBeNull();
    });

    it("should reject if address is not found", async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete(
                "/api/contacts/" +
                    testContact.id +
                    "/addresses/" +
                    (testAddress.id + 1)
            )
            .set("Authorization", "token123");

        expect(result.status).toBe(404);
    });

    it("should reject if contact is not found", async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete(
                "/api/contacts/" +
                    (testContact.id + 1) +
                    "/addresses/" +
                    testAddress.id
            )
            .set("Authorization", "token123");

        expect(result.status).toBe(404);
    });
});
