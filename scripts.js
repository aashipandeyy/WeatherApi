// your weather 
const userTab = document.querySelector('#yw');
// search weather
const searchTab = document.querySelector('#sw');
// entire ui container
const userContainer = document.querySelector('#weather-container');
// grant container
const grantAccessContainer = document.querySelector('#grant-container');
// search container
const searchForm = document.querySelector('#form-container');
// loading container
const loadingScreen = document.querySelector('#loading-screen');
// common user container
const userInfoContainer = document.querySelector('#user-info-container');


// api key available online
const API_key = "c0dfcf2ecae2621a41598113643d624f";
// if the coords are already stored in the session then display them
getFromSessionStorage();

let currentTab = userTab;
currentTab.classList.add("current-tab");

// if user switches, call the function switchTab
userTab.addEventListener('click',()=>{ switchTab(userTab); });
searchTab.addEventListener('click',()=>{ switchTab(searchTab); });

function switchTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        // if search container isnt active, make it
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        // else check whether the access to location is granted
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

// yw part

// check if coords are already present in the session storage
function getFromSessionStorage() {
    let localCoords = sessionStorage.getItem("user-coords");
    // coords are not present, so add the grant container
    if(!localCoords) {
        grantAccessContainer.classList.add("active");
        // user has to manually click on the grant access button
    }
    // coords are present, parse it and show it
    else {
        const coords = JSON.parse(localCoords);
        // function to display it
        fetchUserWeatherInfo(coords);
    }
}

// pop up to allow access to geolocation
const grantAccessButton = document.querySelector('#grant-access-button');
grantAccessButton.addEventListener('click',getLocation);

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            const userCoords = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            }
            // save the location
            sessionStorage.setItem("user-coords", JSON.stringify(userCoords));
            fetchUserWeatherInfo(userCoords);
        },
        (error)=>{
            if(error.code === error.PERMISSION_DENIED){
                allowAccess.innerText = "You denied the request for Geolocation.";
            }
        });
    }
    else {
        allowAccess.innerText = "Geolocation is not supported by this browser.";
    }
}

// allow-access change when the user denies access
const allowAccess = document.querySelector('#allow-access');
async function fetchUserWeatherInfo(coords) {
    const {lat,lon} = coords;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    //api call
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await res.json();
        // remove the loading screen
        loadingScreen.classList.remove("active");
        // add the user container
        userInfoContainer.classList.add("active");
        // fetches values from data and renders it into the ui
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        grantAccessContainer.classList.add("active");
        allowAccess.innerText = "Unable to fetch weather for your location.";
    }
}


// sw part

// search weather tab - api call then fetch
const searchInput = document.querySelector('#search-input');
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(searchInput.value === "") return;
    fetchSearchWeatherInfo(searchInput.value);
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    // api call
    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        let data = await res.json();
        loadingScreen.classList.remove("active");
        if (data.cod !== 200){
            userInfoContainer.classList.remove("active");
            return;
        }
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        alert("City not found!");
    }
}

//common shyt

// fetch all the elements to display the info on ui
const cityName = document.querySelector('#city-name');
const countryIcon = document.querySelector('#country-icon');
const weatherDesc = document.querySelector('#weather-desc');
const weatherIcon = document.querySelector('#weather-icon');
const temp = document.querySelector('#temp');
const windspeedVal = document.querySelector('#windspeed-val');
const humidityVal = document.querySelector('#humidity-val');
const cloudVal = document.querySelector('#cloud-val');

// rendering function to render info
function renderWeatherInfo(data){
    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country?.toLowerCase()}.png`;
    weatherDesc.innerText = data?.weather?.[0]?.main;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp.toFixed(2)} °C`;
    windspeedVal.innerText = `${data?.wind?.speed}m/s`; 
    humidityVal.innerText = `${data?.main?.humidity}%`;
    cloudVal.innerText = `${data?.clouds?.all}%`;
}