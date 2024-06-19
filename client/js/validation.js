document.addEventListener("DOMContentLoaded", () => {
  const validateButton = document.getElementById("validate-button");
  const validationResult = document.getElementById("validation-result");

  validateButton.addEventListener("click", () => {
    const latitude = parseFloat(document.getElementById("latitude").value);
    const longitude = parseFloat(document.getElementById("longitude").value);
    const countryCode = document
      .getElementById("country-code")
      .value.toUpperCase();

    if (isNaN(latitude) || isNaN(longitude) || countryCode.length !== 3) {
        validationResult.style.color = "red";
        validationResult.innerHTML = "Please enter valid values for latitude, longitude and country code.";
      return;
    }

    validateButton.disabled = true;
    validationResult.style.color = "black";
    validateButton.innerHTML = '<div class="spinner-button"></div> Validating...';

    axios
      .post("http://localhost:3000/validate-location", {
        latitude,
        longitude,
        countryCode,
      })
      .then((response) => {
        if (response.data.isValid) {
            validationResult.textContent = "The location is within the specified country.";
            validationResult.style.color = "green";
        } else {
            validationResult.textContent = "The location is not within the specified country.";
            validationResult.style.color = "red";
        }
      })
      .catch((error) => {
        validationResult.style.color = "red";
        validationResult.innerHTML = error.response ? error.response.data : "Error validating location. Please try again.";
      })
      .finally(() => {
        validateButton.disabled = false;
        validateButton.innerHTML = "Validate";
      });
  });
});
