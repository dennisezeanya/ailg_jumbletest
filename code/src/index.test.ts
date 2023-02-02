import "dotenv/config";
import mongoose from "mongoose";
import request from "supertest";
import { newApp } from "./app";
import { RequestModel } from "./models/request";

const app = newApp();

describe("API", () => {
  let apiKey: string;
  let word: string;

  afterAll(async () => {
    await RequestModel.deleteMany({});
    await mongoose.connection.close();
  });

  beforeAll(async () => {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.DATABASE_URL!);
  });

  beforeEach(() => {
    word = "testing";
    apiKey = process.env.API_KEY!;
  });

  const jumbleWord = () => {
    return request(app)
      .post("/jumble")
      .set({ "X-API-Key": apiKey })
      .send({ word });
  };

  const listRequests = () => {
    return request(app).get("/requests").set({ "X-API-Key": apiKey });
  };
  it("should jumble word successfully", async () => {
    const res = await jumbleWord();
    expect(res.statusCode).toBe(200);
    expect(res.body.word).not.toBe(word);
  });

  it("should not jumble word if not authorized", async () => {
    apiKey = "invalid";
    const res = await jumbleWord();
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should not jumble word if no input", async () => {
    word = "";
    const res = await jumbleWord();
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should return all requests", async () => {
    const res = await listRequests();
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should not return all requests if not authorized", async () => {
    apiKey = "invalid";
    const res = await listRequests();
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
function beforeAll(arg0: () => Promise<void>) {
  throw new Error("Function not implemented.");
}

function afterAll(arg0: () => Promise<void>) {
  throw new Error("Function not implemented.");
}

function beforeEach(arg0: () => void) {
  throw new Error("Function not implemented.");
}

function expect(statusCode: any) {
  throw new Error("Function not implemented.");
}

