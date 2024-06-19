function getCountryNameByCode(code) {
    let region = new Intl.DisplayNames(['en'], { type: 'region' });
    return region.of(code);
}

function showLoadingSpinner() {
    document.getElementById('loading-spinner').classList.add('show');
    document.getElementById('map').classList.add('loading');
}

function hideLoadingSpinner() {
    document.getElementById('loading-spinner').classList.remove('show');
    document.getElementById('map').classList.remove('loading');
}

// simple function to get API URL based on environment
function getAPI_URL() {
    const hostname = window.location.hostname;
    const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
    return isDevelopment ? 'http://localhost:3000' : 'https://geo-location-service-latest.onrender.com';
}