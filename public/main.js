// get the map - set location 
let mymap = L.map('map').setView([44.478, -73.211882], 16)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap)

let path = window.location.pathname
let pathArray = path.split('/')
let id = pathArray.pop()

let listContainer = document.getElementById('idList')

async function getData(id) {
    let restList = await fetch('https://json-server.burlingtoncodeacademy.now.sh/restaurants')
        .then((response) => {
            return response.json()
        })
        .then((dataJson) => {
            return dataJson
        })

    //sidebar elements
    restList.forEach((post) => {
        let id = post.id
        let name = post.name
        let address = post.address

        listContainer.innerHTML += `<li><a href='/post/${id}'>${name}</a></li>`
        getLatLon(address, id)
    })
}

// put pins on map
async function getLatLon(address, restId) {

    let pinLocation = await fetch(`https://nominatim.openstreetmap.org/search/?q=${address}&format=json`)
        .then((data) => {
            return data.json()
        })
        .then((locationInfo) => {
            let info = locationInfo[0]
            let lat = info.lat
            let lon = info.lon

            let thisPin = L.marker([lat, lon]).addTo(mymap).bindPopup(name)

            //popup on hover
            thisPin.on('mouseover', () => {
                thisPin.openPopup()
            })
            //When moving mouse off pin, close content
            thisPin.on('mouseout', () => {
                thisPin.closePopup()
            })

            thisPin.on('click', () => {
                window.location = `/post/${restId}`;
            });



        })
}