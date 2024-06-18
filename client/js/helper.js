function getCountryNameByCode(code) {
    let region = new Intl.DisplayNames(['en'], { type: 'region' });
    return region.of(code);
}
