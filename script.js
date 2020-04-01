window.onload = function() {

var btn = document.querySelector("#searchBtn");
var currentForecast = document.querySelector("#currentResult");
var fiveDay = document.querySelector("#forecast"); 
var apiKey = "d7b6dcaa63c06de245782075294534f9";
var cityName = ""; 
var cityArray = [];
var forecastArray = [];

var today = new Date().toLocaleDateString();
console.log(today)
console.log(localStorage.getItem("searchHistory"));

if (localStorage.getItem("searchHistory") == null){
    localStorage.setItem("searchHistory", JSON.stringify(cityArray));
}


function displaySearchHistory() {

cityArray = JSON.parse(localStorage.getItem("searchHistory"));

for (var i = 0; i < cityArray.length; i++) {
    var newBtn = document.createElement("button");
    newBtn.setAttribute("class", "search-history-btn");
    newBtn.setAttribute("value", cityArray[i]);
    newBtn.innerHTML = cityArray[i];
    searchHistory.prepend(newBtn);

    // add event listener
    document.querySelector(".search-history-btn").addEventListener("click", function(event){
        event.preventDefault();
        currentForecast.innerHTML = "";
        fiveDay.innerHTML = "";
        console.log($(this).val());
        cityName = $(this).val();
        displayCurrentForecast();
        displayFiveDay();   
    
    })

}

}


// var url = "api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

// var url = "api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
btn.addEventListener("click", function(event){
    event.preventDefault();
    currentForecast.innerHTML = "";
    fiveDay.innerHTML = "";
    searchHistory.innerHTML = "";

    cityName = document.querySelector(".cityName").value; 
    cityArray.push(cityName);

    localStorage.setItem("searchHistory", JSON.stringify(cityArray));
    // cityArray = JSON.parse(localStorage.getItem("searchHistory"));

    //calling functions
    displaySearchHistory();
    displayCurrentForecast();
    displayFiveDay();
});

displaySearchHistory();

// display current forecast function

function displayCurrentForecast() {
$.ajax({
    url: "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey,
    type: 'GET',
    headers: {
        'Access-Control-Allow-Origin':'localhost:5500'
    }   
}).then(function(response){
    console.log('this is my response ' + response)
    return response
}).then(function(data){
    console.log(data);
    //displaying name of city for current forecast
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var uvSunrise = data.sys.sunrise;
    var uvSunset = data.sys.sunset;
    var displayName = data.name;
    var newEl = document.createElement("h2");
        newEl.innerHTML = displayName + " (" + today + ") ";
        newEl.setAttribute("class", "currentForecast");
        currentForecast.appendChild(newEl);
    //displaying the weather icon next to city
    var weatherIcon = data.weather[0].icon; 
    var iconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
    var newImg = document.createElement("img");
        newImg.setAttribute("src", iconUrl);
        newImg.setAttribute("class", "currentForecast current-img"); 
        currentForecast.appendChild(newImg);
    //displaying the current temperature
    var tempConversion = ((data.main.temp) - 273.15) * 9/5 + 32;
    var temp = Math.round(tempConversion * 10)/10;
    var newPara = document.createElement("p");
        newPara.innerHTML = "Temperature: " + temp + "&#8457;";
        currentForecast.appendChild(newPara); 
    //displaying the current humidity
    var newPara2 = document.createElement("p");
        newPara2.innerHTML = "Humidity: " + data.main.humidity + "%";
        currentForecast.appendChild(newPara2);
    //displaying the current wind speed
    var windSpeed = (data.wind.speed) * 2.237;
    var wind = Math.round(windSpeed * 10)/10;
    var newPara3 = document.createElement("p");
        newPara3.innerHTML = "Wind Speed: " + wind + " MPH";
        currentForecast.appendChild(newPara3);

    displayUVIndex(lat, lon, uvSunrise, uvSunset);
}).catch(function(error){
    console.log('This is my error '+ error)
});

}

// display five day forecast function 
function displayFiveDay() {

    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey,
        type: 'GET',
        headers: {
            'Access-Control-Allow-Origin':'localhost:5500'
        }   
    }).then(function(response){
        console.log('this is my response ' + response)
        return response
    }).then(function(data){
        console.log(data);
        forecastArray.push(data.list);
        console.log(forecastArray); 
        
        
        var tempArray = [5,13,21,29,37];
        
        for (var i = 0; i < tempArray.length; i++){
    
            // console.log(tempArray[i]); 
        var msec = Date.parse(data.list[tempArray[i]].dt_txt);
        var forecastDay = new Date(msec).toLocaleDateString();
    
        
        var tempConversion = ((data.list[tempArray[i]].main.temp) - 273.15) * 9/5 + 32;
        var temp = Math.round(tempConversion * 10)/10;
    
        var weatherIcon = data.list[tempArray[i]].weather[0].icon; 
        var iconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
        // var newImg = document.createElement("img");
        //     newImg.setAttribute("src" , iconUrl);
    
        var forecastHumidity = data.list[tempArray[i]].main.humidity;
    
        var newDiv = document.createElement("div");
            newDiv.setAttribute("class", "forecastResult");
            newDiv.style.backgroundColor = "#3F85FF";
            newDiv.style.color = "white";
            newDiv.style.margin = "10px";
            newDiv.style.fontWeight = "bold";
            newDiv.style.padding = "10px";
            newDiv.style.borderRadius = "10px";
            newDiv.innerHTML = "<p>"+ forecastDay + "<p>" 
                                + "<img src=" + iconUrl + ">"
                                + "<p>Temp: " + temp + "&#8457;</p>"
                                + "<p>Humidity: " + forecastHumidity + "% </p>";
            fiveDay.appendChild(newDiv); 
        }
        
    })
    .catch(function(error){
        console.log('This is my error '+ error)
    });
    
    }

// display UV Index function

function displayUVIndex(gLat, gLon, gSunrise, gSunset) {
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + gLat + "&lon=" + gLon + "&start=" + gSunrise + "&end=" + gSunset,
        type: 'GET',
        headers: {
            'Access-Control-Allow-Origin':'localhost:5500'
        }   
    }).then(function(response){
        console.log('this is my response ' + response)
        return response
    }).then(function(data){
        console.log(data);
        var uvIndex = data[0].value;
        var newPara4 = document.createElement("p");
            newPara4.innerHTML = "UV Index: " + uvIndex;
            newPara4.style.width = "100px"; 
            newPara4.style.color = "white";
            currentForecast.appendChild(newPara4);
        if (uvIndex <= 2){
            newPara4.style.backgroundColor = "green";
        } else if (uvIndex <= 5) {
            newPara4.style.backgroundColor = "yellow";
        } else if (uvIndex <= 7) {
            newPara4.style.backgroundColor = "orange";
        } else if (uvIndex <= 10) {
            newPara4.style.backgroundColor = "red";
        } else if (uvIndex > 11) {
            newPara4.style.backgroundColor = "violet";
        }

    })
    .catch(function(error){
        console.log('This is my error '+ error)
    });
}

}