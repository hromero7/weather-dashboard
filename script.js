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

for (i = 0; i < cityArray.length; i++) {
    var newBtn = document.createElement("button");
    newBtn.setAttribute("class", "search-history-btn");
    newBtn.innerHTML = cityArray[i];
    searchHistory.prepend(newBtn);
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

    displaySearchHistory();
    
   


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
}).catch(function(error){
    console.log('This is my error '+ error)
});


// this calls 5 day forecast

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

});

displaySearchHistory();

}