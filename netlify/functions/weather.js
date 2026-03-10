// netlify/functions/weather.js
export async function handler(event) {
  const city = event.queryStringParameters.city || 'Taipei';
  
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OWM_KEY}&units=metric&lang=zh_tw`
  );
  const data = await res.json();
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
}