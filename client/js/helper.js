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
