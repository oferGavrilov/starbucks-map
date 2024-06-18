const request = require("supertest");
const { app, fetchCountryBoundary } = require("../index");

jest.mock("../index", () => {
  const originalModule = jest.requireActual("../index");
  return {
    ...originalModule,
    fetchCountryBoundary: jest.fn(),
  };
});

describe("POST /validate-location", () => {
  it("should return true for a valid location inside the country", async () => {
    const mockGeoJsonData = {
      type: "Polygon",
      coordinates: [
        [
          [2.224122, 48.815573],
          [2.469921, 48.815573],
          [2.469921, 48.902144],
          [2.224122, 48.902144],
          [2.224122, 48.815573],
        ],
      ],
    };

    fetchCountryBoundary.mockResolvedValue(mockGeoJsonData);

    const response = await request(app)
      .post("/validate-location")
      .send({ latitude: 48.858844, longitude: 2.294351, countryCode: "FRA" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ isInside: true });
  });

  it("should return false for a valid location outside the country", async () => {
    const mockGeoJsonData = {
      type: "Polygon",
      coordinates: [
        [
          [2.224122, 48.815573],
          [2.469921, 48.815573],
          [2.469921, 48.902144],
          [2.224122, 48.902144],
          [2.224122, 48.815573],
        ],
      ],
    };

    fetchCountryBoundary.mockResolvedValue(mockGeoJsonData);

    const response = await request(app)
      .post("/validate-location")
      .send({ latitude: 48.864716, longitude: 2.349014, countryCode: "FRA" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ isInside: false });
  });

  it("should return 400 for missing fields", async () => {
    const response = await request(app).post("/validate-location").send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe("Missing required fields");
  });

  it("should return 500 for invalid country code", async () => {
    fetchCountryBoundary.mockRejectedValue(new Error("Country boundary not found"));

    const response = await request(app)
      .post("/validate-location")
      .send({
        latitude: 48.858844,
        longitude: 2.294351,
        countryCode: "INVALID",
      });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error validating location");
  });
});
