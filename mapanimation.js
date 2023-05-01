mapboxgl.accessToken = 'pk.eyJ1IjoidXNlcm5hbWVzYXJlc3VwZXJoYXJkIiwiYSI6ImNsZ2N0aGRhODByaGczdG56aW1pd3RodnQifQ.3VjF1B4rc92sGD4PCpHJcQ'
let busStopData = []

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.091542, 42.358862],
    zoom: 14
});

// gets location data from API
async function getBusLocations() {
    const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
    const response = await fetch(url);
    const json = await response.json();
    // console.log('base data:', json.data)
    return json.data;
}


map.marker = [];

// converts location data into array that is usable by MapBox
async function makeArray(locationData) {
    let markArray = []
    await locationData.forEach((location) => {
        let longlat = [location.attributes.longitude, location.attributes.latitude]
        markArray.push(longlat)
    })
    busStopData = markArray
    return markArray
}

let markerArray;

// creates markers on map
async function updateMarkers(markerArray) {
    removeMarkers(map.marker);
    map.marker = markerArray.map((longlat) => {
        return new mapboxgl.Marker().setLngLat(longlat).addTo(map);
    });
}

// removes markers from the map to avoid having to check for existing buses and remove if no longer in service or update positions.
function removeMarkers(markers) {
    markers.forEach(marker => marker.remove());
}

let delay = 0
//cycles through functions to get postions, clear exiting markers and create new markers each time.
// optimized with ChapGPT, should be simplified further to avoid the excessive nesting
function keepMoving() {
    getBusLocations()
        .then((result) => {
            setTimeout(() => {
                makeArray(result)
                    .then((locationArray) => {
                        updateMarkers(locationArray);
                    })
                    .catch((error) => {
                        console.error('Error making array:', error);
                    });
                delay = 15000
                keepMoving();
            }, delay);
        })
        .catch((error) => {
            console.error('Error getting bus locations:', error);
        });
}

keepMoving()
