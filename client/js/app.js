"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const map = initMap();
  fetchDataAndInitialize(map);
});

function initMap() {
  return new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([37.41, 8.82]),
      zoom: 2,
    }),
  });
}

function fetchDataAndInitialize(map) {
  Promise.all([fetchStarbucksLocations(), fetchCountryList()])
    .then(([locations, countries]) => {
      const locationsData = locations.data;
      const countrySelect = document.getElementById("country-select");

      populateCountrySelect(countries, countrySelect);
      displayLocations(locationsData, map);

      countrySelect.addEventListener("change", function () {
        const selectedCountry = this.value;

        if (selectedCountry === "") {
          displayLocations(locationsData, map); // default to show all locations
        } else {
          showLoadingSpinner();
          fetchCountryBoundary(selectedCountry)
            .then((boundary) => {
              filterLocationsByCountryBoundary(boundary, locationsData, map);
          }).catch((error) => {
            console.error("Error fetching country boundary:", error);
          }).finally(() => {
            hideLoadingSpinner();
          })
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function fetchStarbucksLocations() {
  return axios.get(
    "https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json"
  );
}

function fetchCountryList() {
  return axios
    .get(
      "https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json"
    )
    .then((response) => {
      const locations = response.data;
      const countrySet = new Set(locations.map((location) => location.country));
      return Array.from(countrySet).map((code) => {
        return { code: code, name: getCountryNameByCode(code) };
      });
    });
}

function populateCountrySelect(countries, select) {
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerText = "Select a country";
  select.appendChild(defaultOption);

  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.code;
    option.innerText = country.name;
    select.appendChild(option);
  });

  select.value = ""; // default to show all locations
}

function displayLocations(locations, map) {
  const layersToRemove = [];
  map.getLayers().forEach((layer) => {
    if (layer.get("name") === "starbucksLayer") {
      layersToRemove.push(layer);
    }
  });
  layersToRemove.forEach((layer) => map.removeLayer(layer));

  const features = locations.map((location) => {
    return new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([location.longitude, location.latitude])
      ),
      name: location.name,
    });
  });

  const vectorSource = new ol.source.Vector({
    features: features,
  });

  const iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      src: 'imgs/marker.png',
      scale: 0.7
    }),
  });

  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: iconStyle,
    name: "starbucksLayer",
  });

  map.addLayer(vectorLayer);
}

function fetchCountryBoundary(countryCode) {
  const url =
    "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

  return axios.get(url).then((response) => {
    const countries = response.data;

    const countryBoundary = countries.features.find(
      (feature) => feature.properties.ISO_A2 === countryCode
    );
    return countryBoundary;
  });
}

function filterLocationsByCountryBoundary(boundary, locations, map) {
  const filteredLocations = locations.filter((location) => {
    const point = turf.point([location.longitude, location.latitude]);
    return turf.booleanPointInPolygon(point, boundary);
  });
  displayLocations(filteredLocations, map);
}
