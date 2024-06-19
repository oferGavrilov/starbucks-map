# Starbucks Location Map

This project displays a map with all Starbucks locations and provides a filtering feature to display stores based on selected countries. Additionally, it includes a service to check if a set of coordinates falls within a specified country.

## Features

1. **Map Display**:
   - Utilizes OpenLayers to display a map.
   - Shows all Starbucks store locations retrieved from an external source.

2. **Country Filtering**:
   - Dropdown to select a country.
   - Filters Starbucks locations on the map based on the selected country.

3. **Coordinates Validation Service**:
   - A service that checks if a given set of coordinates falls within a specified country.
   - Deployed using Docker.

## Libraries and APIs Used

- **OpenLayers**: For map rendering and handling map-related functionalities.
- **Axios**: For making HTTP requests.
- **@turf/turf**: For geographic operations, such as checking if a point is within a polygon.
- **iso-3166-1**: For ISO country code conversions.
- **Express**: Node.js web application framework.
- **cors**: For handling Cross-Origin Resource Sharing in the Express app.

## Setup and Deployment

### Prerequisites

- Node.js and npm
- Docker (for deploying the validation service)

### Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/oferGavrilov/starbucks-location-map.git
   cd starbucks-location-map
    ```
2. **Install dependencies**:
    ```sh
    npm install
    ```
3. **Start the development server - Client side**:
    Open 'client/index.html' in a browser
    ```sh
    http://127.0.0.1:5500/client/index.html
    ```
4. **Start the development server - Server side**:
    ```sh
    npm run dev
    ```