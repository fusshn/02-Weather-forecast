const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const countrytxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherIcon = document.querySelector('.weather-icon');
const currentDateTxt = document.querySelector('.current-date-txt');
const forecastContainer = document.querySelector('.forecast-items-container');



const apiKey = 'ee9081abd252569a8343bff3f7fc5e8f'

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
         cityInput.value = '';
         cityInput.blur();
    }
});
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' &&
        cityInput.value.trim() != ''
    ) {
        updateWeatherInfo(cityInput.value)
        cityInput.value = '';
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    
    const respone = await fetch(apiUrl)

    return respone.json()
}


    function getWeatherIcon(id, isNight) {
        if (id <= 232) return 'thunderstorm.svg';
        if (id <= 321) return 'drizzle.svg';
        if (id >= 500 && id <= 504) return 'rain.svg';
        if (id === 511) return 'snow.svg';
        if (id >= 502 && id <= 531) return 'rain.svg';
        if (id <= 622) return 'snow.svg';
        if (id <= 781) return 'atmosphere.svg';
    
        // 根據白天/夜晚顯示不同的圖示
        if (id === 800) return isNight ? 'clear-n.svg' : 'clear-d.svg';
        if (id === 801) return isNight ? 'clouds-n.svg' : 'clouds-d.svg';
        if (id === 802) return 'clouds-2.svg';
        if (id === 803 || id === 804) return 'clouds-3.svg';
    
        return 'default.svg';
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)

    if (weatherData.cod !== 200) {
        showDisplaySection(notFoundSection)
        return
    }
    // console.log(weatherData)

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed },
        timezone,
        sys: { sunrise, sunset }
    } = weatherData;

    // 取得當前時間（當地時區）
    const nowUTC = Math.floor(Date.now() / 1000);
    const localTime = nowUTC + timezone;
     
    // 判斷是否為夜晚
    const isNight = localTime < sunrise || localTime > sunset;


    countrytxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = (speed * 3.6).toFixed(1) + ' km/h';

    // 日期
    currentDateTxt.textContent = getCurrentDate()

    // 更新天氣圖示
    weatherIcon.src = `./weather/${getWeatherIcon(id, isNight)}`;


    await updateforecastInfo(city)
    showDisplaySection(weatherInfoSection)
}

async function updateforecastInfo(city) {
    const forecastData = await getFetchData('forecast', city);
    
    if (forecastData.cod !== "200") {
        console.error("無法獲取天氣預報數據");
        return;
    }
    
    forecastContainer.innerHTML = ''; // 清空先前的預測內容

    const timeTaken = '12:00:00'; // 只取每天的中午 12 點天氣數據
    const dailyForecasts = {}; // 用來存放每天的唯一數據

    forecastData.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0]; // 取得日期
        const time = item.dt_txt.split(' ')[1]; // 取得時間

        if (time === timeTaken && !dailyForecasts[date]) {
            dailyForecasts[date] = item; // 只存入每天的第一筆數據（確保唯一）
        }
    });

    // 未來4天的數據
    const forecastArray = Object.values(dailyForecasts).slice(0, 4);

    forecastArray.forEach(data => {
        const { main: { temp }, weather: [{ id, main }], dt } = data;
        const forecastDate = new Date(dt * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

        // 創建新的 HTML 預測卡片
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        forecastItem.innerHTML = `
            <p class="forecast-item-date">${forecastDate}</p>
            <img class="forecast-item-icon" src="./weather/${getWeatherIcon(id)}" alt="${main}">
            <p class="forecast-item-temp">${Math.round(temp)}°C</p>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}


function showDisplaySection(section) {
    [weatherInfoSection, notFoundSection, searchCitySection]
        .forEach(section => section.style.display = 'none')
    
    section.style.display = 'flex'
}
