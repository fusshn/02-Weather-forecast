// netlify/functions/weather.js
export async function handler(event) {
  const params = event.queryStringParameters || {};
  const { endpoint, city, lat, lon, iplocate } = params;
  const apiKey = process.env.OWM_KEY;

  // IP 定位
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
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
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