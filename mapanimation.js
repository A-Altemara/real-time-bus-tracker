mapboxgl.accessToken = 'pk.eyJ1IjoidXNlcm5hbWVzYXJlc3VwZXJoYXJkIiwiYSI6ImNsZ2N0aGRhODByaGczdG56aW1pd3RodnQifQ.3VjF1B4rc92sGD4PCpHJcQ'
let busStopData = []
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.091542, 42.358862],
    zoom: 14
});

let counter = 0
function move() {
    setTimeout(() => {
        if (counter >= busStops.length) return
        marker.setLngLat(busStops[counter])
        counter++
        move()
    }, 1000)
}

map.marker = [];

async function getBusLocations() {
    const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
    const response = await fetch(url);
    const json = await response.json();
    console.log(json.data)
    return json.data;
}

async function makeArray() {
    let markArray = []
    let locationData = await getBusLocations()
    map.marker = []
    await locationData.forEach((location) => {
        let longlat = {
            location: [location.attributes.longitude, location.attributes.latitude],
            id: location.id
        }
        markArray.push(longlat)
        let marker = new mapboxgl.Marker()
            .setLngLat(longlat.location)
            .addTo(map)
        map.marker.push(marker)
    })
    busStopData = markArray
    return markArray
}

makeArray()



function keepMoving() {
    setTimeout(() => {
        makeArray()
        keepMoving()
    }, 15000)
}
keepMoving()