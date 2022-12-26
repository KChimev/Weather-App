export function getWeather(lat,lon,timezone){
return axios.get("https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime",{
    params:{
        latitude:lat,
        longitude:lon,
        timezone
    },
}
)
.then(({data})=>{
    return{
        current:ParseCurrentWeather(data),
        daily:ParseDailyWeather(data),
        hourly:ParseHourlyWeather(data),
    }
})
} 

function ParseCurrentWeather({current_weather,daily}) {
    const{
        temperature:currentTemp,
        windspeed:windSpeed,
        weathercode:iconCode 
    }=current_weather;
    //SAME AS: const currentTemp=current_weather.temperature
    const {
        temperature_2m_max:[maxTemp],
        temperature_2m_min:[minTemp],
        apparent_temperature_max:[maxFeelsLikeTemp],
        apparent_temperature_min:[minFeelsLikeTemp],
        precipitation_sum:[precip],
    }=daily; 
    //SAME AS : const maxTemp=daily.temperature_2m_max[0]

    return {
        currentTemp:Math.round(currentTemp),
        highTemp:Math.round(maxTemp),
        lowTemp:Math.round(minTemp),
        highFeelsLike:Math.round(maxFeelsLikeTemp),
        lowFeelsLike:Math.round(minFeelsLikeTemp),
        windSpeed:Math.round(windSpeed),
        precip:Math.round(precip*100)/100,
        iconCode:iconCode,
    }
}
function ParseDailyWeather({daily}){
    return daily.time.map((time,index)=>{
        return {
            timestamp:time*1000,
            iconCode:daily.weathercode[index],
            maxTemp:Math.round(daily.temperature_2m_max[index]),
        }
    })
}
function ParseHourlyWeather({hourly,current_weather}){
    return hourly.time.map((time,index)=>{
        return{
            timestamp:time*1000,
            iconCode:hourly.weathercode[index],
            temp:Math.round(hourly.temperature_2m[index]),
            feelsLike:Math.round(hourly.apparent_temperature[index]),
            windSpeed:Math.round(hourly.windspeed_10m[index]),
            precip:Math.round(hourly.precipitation[index]*100)/100,
        }
}).filter(({timestamp})=>timestamp>=current_weather.time*1000)
}


