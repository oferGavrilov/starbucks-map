import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import * as turf from "@turf/turf";

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.post("/validate-location", async (req, res) => {
  const { latitude, longitude, countryCode } = req.body;

  if (!latitude || !longitude || !countryCode) {
    return res.status(400).send("Missing required fields");
  }

  // country code should be 3 letters
  if (countryCode.length !== 3) {
    return res.status(400).send("Invalid country code");
  }

  try {
    const boundary = await fetchCountryBoundary(countryCode);
    if (!boundary) {
      return res.status(500).send("Unable to fetch country boundary");
    }

    const point = turf.point([longitude, latitude]);
    const isInside = turf.booleanPointInPolygon(point, boundary);

    res.send({ isInside });
  } catch (error) {
    console.error("Error validating location:", error);
    res.status(500).send("Error validating location");
  }
});

async function fetchCountryBoundary(countryCode) {
  try {
    const url =
      "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
    const response = await axios.get(url);
    const geoJsonData = response.data;
    const countryBoundary = geoJsonData.features.find(
      (feature) => feature.properties.ISO_A3 === countryCode
    );
    if (countryBoundary) {
      return countryBoundary.geometry;
    }
    console.error("Country boundary not found for code:", countryCode);
    return null;
  } catch (error) {
    console.error("Error fetching country boundary:", error);
    throw error;
  }
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
