var btn = document.querySelector("#searchBtn");
var currentForecast = document.querySelector("#currentResult");
var apiKey = "d7b6dcaa63c06de245782075294534f9";
var cityName = ""; 



// var url = "api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

// var url = "api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
btn.addEventListener("click", function(event){
    event.preventDefault();
    currentForecast.innerHTML = "";
    cityName = document.querySelector(".cityName").value; 

    
    

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
        newEl.innerHTML = displayName;
        newEl.setAttribute("class", "currentForecast");
        currentForecast.appendChild(newEl);
    //displaying the weather icon next to city
    var weatherIcon = data.weather[0].icon; 
    var iconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
    var newImg = document.createElement("img");
        newImg.setAttribute("src", iconUrl);
        newImg.setAttribute("class", "currentForecast"); 
        currentForecast.appendChild(newImg);
    //displaying the current temperature
    var tempConversion = ((data.main.temp) - 273.15) * 9/5 + 32;
    var newPara = document.createElement("p");
        newPara.innerHTML = "Temperature: " + tempConversion + "&#8457;";
        currentForecast.appendChild(newPara); 
    //displaying the current humidity
    var newPara2 = document.createElement("p");
        newPara2.innerHTML = "Humidity: " + data.main.humidity + "%";
        currentForecast.appendChild(newPara2);
    //displaying the current wind speed
    var windSpeed = (data.wind.speed) * 2.237;
    var newPara3 = document.createElement("p");
        newPara3.innerHTML = "Wind Speed: " + windSpeed + " MPH";
}).catch(function(error){
    console.log('This is my error '+ error)
});


// this calls 5 day forecast

// $.ajax({
//     url: "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey,
//     type: 'GET',
//     headers: {
//         'Access-Control-Allow-Origin':'localhost:5500'
//     }   
// }).then(function(response){
//     console.log('this is my response ' + response)
//     return response
// }).then(function(data){
//     console.log(data);
//     var newImg = document.createElement("img");
//     newImg.setAttribute("src", data.list[0].weather[0].icon);
//     document.querySelector("#forecast").appendChild(newImg);
// })
// .catch(function(error){
//     console.log('This is my error '+ error)
// });

});