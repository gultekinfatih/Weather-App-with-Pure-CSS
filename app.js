//Doms
const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.querySelector("#locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");

//Default city
let cityInput = "İstanbul";

//Paneldeki şehirlere click event ekle
cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    /*Default şehri panelden tıklananla değiştir*/
    cityInput = e.target.innerHTML;
    fetchWeatherData(); /*API ile bilgileri getirecek fonksiyon*/
  });
});

// Forma submit event ekleme
form.addEventListener("submit", (e) => {
  /*eğer search bar boşsa*/
  if (search.value.length == 0) {
    alert("Please type in a city name");
  } else {
    cityInput = search.value; /*Default şehri input ile değiştir*/
    fetchWeatherData();
    search.value = ""; /*arama yaptıktan sonra search bar boşalt*/
    app.style.opacity =
      "0"; /* aramadan sonra ekranı karart/app tamamen opak olur ve background rengi kalır*/
  }
  e.preventDefault(); /*input boşsa form submit engelle*/
});

// Haftanın günü için fonksiyon
function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[new Date(`${day}/${month}/${year}`).getDay()];
}

// Fetch API
function fetchWeatherData() {
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=5158f9ca98fa42ac943212925222702&q=${cityInput}`
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);

      // Temp, condition and icon
      temp.innerHTML = Math.round(data.current.temp_c) + "°";
      conditionOutput.innerHTML = data.current.condition.text;
      icon.src = data.current.condition.icon;

      //Şehir datasından tarih ve saati alıp bunları yeni değişkenlere ata
      const date = data.location.localtime; /*"2022-02-28 1:34"*/
      const y = parseInt(date.substr(0, 4)); /*year/numbera çevir/index 0+4*/
      const m = parseInt(date.substr(5, 2)); /* month*/
      const d = parseInt(date.substr(8, 2)); /* day*/
      const time = date.substr(11); /*11. indexten sonrasını al*/

      //Tarihin formatını ayarla
      dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
      timeOutput.innerHTML = time;
      nameOutput.innerHTML = data.location.name;

      //Weather details
      cloudOutput.innerHTML = data.current.cloud + "%";
      humidityOutput.innerHTML = data.current.humidity + "%";
      windOutput.innerHTML = data.current.wind_kph + "km/h";

      //Defaultta time "day" olarak ayarla
      let timeOfDay = "day";

      //Her Weather condition için id ataması
      const code = data.current.condition.code;

      //Aranılan şehirde gece ise gece moduna geç
      if (!data.current.is_day) {
        timeOfDay = "night";
      }

      /*eğer hava clear ise arka plan resmini clear yap*/
      if (code == 1000) {
        app.style.backgroundImage = `url(/images/${timeOfDay}/clear.jpg)`;
        /*gece veya gündüze göre arama buton rengi*/
        btn.style.background = "#e5ba92";
        if (timeOfDay == "night") {
          btn.style.background = "#181e27";
        }
      } else if (
        /*Cloudy weather code için buton ve arka plan*/
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1279 ||
        code == 1282
      ) {
        app.style.backgroundImage = `url(/images/${timeOfDay}/cloudy.jpg)`;
        btn.style.background = "#fa6d1b";
        if (timeOfDay == "night") {
          btn.style.background = "#181e27";
        }
        //Rainy weather
      } else if (
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1180 ||
        code == 1183 ||
        code == 1186 ||
        code == 1189 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1246 ||
        code == 1249 ||
        code == 1252
      ) {
        app.style.backgroundImage = `url(/images/${timeOfDay}/rainy.jpg)`;
        btn.style.background = "#647d75";
        if (timeOfDay == "night") {
          btn.style.background = "#325c80";
        }
      } else {
        /*Snowy Weather*/
        app.style.backgroundImage = `url(/images/${timeOfDay}/snowy.jpg)`;
        btn.style.background = "#4d72aa";
        if (timeOfDay == "night") {
          btn.style.background = "#1b1b1b";
        }
      }
      app.style.opacity = "1";
    })

    //eğer girilen input datası yoksa;
    .catch(() => {
      alert("City not found, please try again");
      app.style.opacity = "1";
    });
}

fetchWeatherData();

app.style.opacity = "1";
