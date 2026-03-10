// netlify/functions/weather.js
export async function handler(event) {
  const { endpoint, city, lat, lon } = event.queryStringParameters;
  const apiKey = process.env.OWM_KEY;

  //IP定位
  if (iplocate) {
    const clientIP = event.headers['x-forwarded-for'] || '';
    const res = await fetch(`http://ip-api.com/json/${clientIP}`);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  }

  let url = "";
  if (lat && lon) {
    // 經緯度查詢
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
    // 城市名稱查詢（weather 或 forecast）
    url = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;
  }

  const res = await fetch(url);
  const data = await res.json();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}