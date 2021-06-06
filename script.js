// Dessa variablerna hämtar in vad som finns i respesktive 
// element som den pekar på och en lista som används i de olika funktionerna
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const searchItemsList = document.querySelector('#searchList');
let searches = [];

// När man klickar på knappen "mylocaton" så ska den göra ett anrop till API:et
// den hämtar sedan informationen som sparas i ett lexikon.
$("#myLocation").click(function(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var apiKey = '57fd90dc46693c3658cd9d527b1bc349';
            request = $.ajax({
                url: "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey,
                data: {
                    units: "metric"
                }
            });
            request.done(function(response){
                const weatherData = {
                    name: response.name,
                    wind: response.wind.speed,
                    temp: Math.round(response.main.temp),
                    img: "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
                }
                addDisplay(weatherData)
                addSearch(weatherData);
            })
        });
    }
})

// Denna funktionen är nästan som föregående. Den tar in det man har skrivit in i 
// inputfältet och använder det när man sedan gör ett anrop till API:et. Informationen 
// sparas i ett lexikon. 
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var apiKey = '57fd90dc46693c3658cd9d527b1bc349'
    request = $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchInput.value + "&appid=" + apiKey,
        data: {
            units: "metric"
        }
    });
    request.catch(err => $(function () {
        document.getElementById('displayBox').style.display = "none";
        document.getElementById('secondTitle').style.marginTop = "15%";
        $("#searchInput").popover({
            placement:"bottom",
            content: "We couldn't find the city, try again!",
            trigger: "manual"
        }).popover("show");
      }));
    request.done(function(response) {
        document.getElementById('displayBox').style.display = "block";
        document.getElementById('secondTitle').style.marginTop = "4%";
        $("#searchInput").popover("hide");
        const weatherData = {
            name: response.name,
            wind: response.wind.speed,
            temp: Math.round(response.main.temp),
            img: "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
        }
        addDisplay(weatherData)
        addSearch(weatherData);
    })
});

// Denna funktionen kollar så att det man skickar in inte är tomt. Den kollar sedan ifall
// det man har skickat in är längre än 5 objekt, om den är det så tar den bort det sista 
// objektet. Sedan skickar den vidare listan. 
function addSearch(item) {
    if (item !== '') {
      const search = item;
      if (searches.length > 4) {
          searches.splice(-1, 1);
      }
      searches.unshift(search);
      addToLocalStorage(searches);
    };
}

// Denna funktionen tar informationen som skickas in till dem och visar upp det i displayrutan
// på webbsidan. Om det redan finns information där, så ersätter den det med det nya. 
function addDisplay(item){
    if (item !== '') {
        if ($("#cityName").html() == "") {
            $("#cityName").append(item.name)
            $("#cityTemp").append(item.temp + "°C")
            $("#citySpeed").append(item.wind + " m/s")
            $("#cityIcon").attr("src", item.img)
            document.getElementById('displayBox').style.display = "block";
        }
        else{
            $(".info").empty()
            $("#cityName").append(item.name)
            $("#cityTemp").append(item.temp + "°C")
            $("#citySpeed").append(item.wind + " m/s")
            $("#cityIcon").attr("src", item.img)
            
        }
    }
}

// Denna funktionen tar det som skickas in till den och visar upp det i "senast sökta"-listan
// som finns på webbsidan. Den skapar ett element för varje objekt som finns med i listan. 
function renderSearches(search) {
    searchItemsList.innerHTML = '';
    search.forEach(function(item) {
        const li = document.createElement('li');
        li.innerHTML = `
        <div class='card' id='listBox'>
            <div class="container">
                <div class='row row-cols-4'>
                    <div class="col">
                        <img id="cityIcon" src="${item.img}">
                    </div>
                    <div class='col'>
                        <p class="info" id='cityName'>${item.name}</p>
                    </div>
                    <div class='col'>
                        <p class="info" id='cityTemp'>${item.temp}°C</p>
                    </div>
                    <div class='col'>
                        <p class="info" id='citySpeed'>${item.wind} m/s</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    searchItemsList.append(li);
    });

}

// Denna funktionen lägger till det som skickas in i localstorage. Detta görs för att
// det man tidigare har sökt på ska finnas kvar även om man lämnar webbsidan. 
function addToLocalStorage(item) {
    localStorage.setItem('search', JSON.stringify(item));
    renderSearches(item);
}

// Denna funktionen kollar om det finns något i localstorage sen tidigare och lägger till det
// i listan som används för de andra funktionerna. 
function getFromLocalStorage() {
    const reference = localStorage.getItem('search');
    if (reference) {
      searchList = JSON.parse(reference);
      for (i = 0; i < searchList.length; i++){
          searches.unshift(searchList[i])
      }
      renderSearches(searchList);
    }
}
getFromLocalStorage();