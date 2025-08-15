const nodeFetch = require("node-fetch");
const { Request: FetchRequest, Response: FetchResponse } = nodeFetch;

jest.mock("next/server", () => ({
  NextResponse: {
    json: (data: any, init?: any) =>
      new FetchResponse(JSON.stringify(data), {
        status: 200,
        headers: { "content-type": "application/json" },
        ...init,
      }),
  },
}));

const { POST } = require("../src/app/api/subscribe/route");
const { prisma } = require("../src/lib/prisma");

jest.mock("../src/lib/prisma", () => ({
  prisma: {
    subscriber: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma as unknown as {
  subscriber: {
    findUnique: jest.Mock;
    create: jest.Mock;
  };
};

describe("POST /api/subscribe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates new subscriber", async () => {
    mockedPrisma.subscriber.findUnique.mockResolvedValue(null);
    mockedPrisma.subscriber.create.mockResolvedValue({ id: "1" });
    const req = new FetchRequest("http://localhost/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockedPrisma.subscriber.create).toHaveBeenCalledWith({
      data: { email: "test@example.com", source: undefined },
    });
  });

  it("returns success for duplicate", async () => {
    mockedPrisma.subscriber.findUnique.mockResolvedValue({ id: "1" });
    const req = new FetchRequest("http://localhost/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockedPrisma.subscriber.create).not.toHaveBeenCalled();
  });

  it("rejects invalid email", async () => {
    const req = new FetchRequest("http://localhost/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "bad" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects honeypot", async () => {
    const req = new FetchRequest("http://localhost/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", hp: "bot" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
