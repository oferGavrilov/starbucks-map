import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import iso from "iso-3166-1";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.post("/validate-location", async (req, res) => {
    const { latitude, longitude, countryCode } = req.body;

    if (!latitude || !longitude || !countryCode) {
        return res.status(400).send("Missing required fields");
    }

    if (countryCode.length !== 3) {
        return res.status(400).send("Country code should be 3 letters");
    }

    try {
        const isValid = await isLocationInsideCountry(latitude, longitude, countryCode);
        res.send({ isValid });
    } catch (error) {
        console.error("Error validating location:", error);
        res.status(500).send("Error validating location");
    }
});

async function isLocationInsideCountry(latitude, longitude, countryCode) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3&addressdetails=1`;

    try {
        const response = await axios.get(url);
        const address = response.data.address;

        if (!address) return false; // no address found means geolocation are not inside any country

        const resultCountryCode = address.country_code;
        const convertedCountryCode = getAlpha3Code(resultCountryCode);

        return convertedCountryCode && convertedCountryCode.toUpperCase() === countryCode.toUpperCase();
    } catch (error) {
        console.error("Error fetching location data:", error);
        return false;
    }
}

// helper function to convert 2-letter country code to 3-letter because the API returns only 2-letter country code
function getAlpha3Code(countryCode) {
  const country = iso.whereAlpha2(countryCode);
  return country ? country.alpha3 : null;
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
