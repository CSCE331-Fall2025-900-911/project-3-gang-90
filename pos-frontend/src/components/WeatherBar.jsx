import { positions } from "@mui/system"
import {useState, useEffect} from "react"

const WeatherKey = import.meta.env.VITE_WEATHER;

export default function WeatherBar(){
    const [longitude, setLongitude] = useState("96.33");
    const [latitude, setLatitude] = useState("30.63");
    const [weather, setWeather] = useState("Weather faild to load");
    const [weatherDescriptoin, setWeatherDescription] = useState("faild to load");
    const [temputure, setTempeture] = useState(0);







    useEffect(()=>{
        const getWeather = async (longitude, latitude)=>{
            try{
            const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WeatherKey}`)
            if(!resp.ok){
                throw new Error("Error in resp");
            }
            const weatherJson =  await (resp).json();
            console.log(weatherJson);
            setWeather(weatherJson["weather"][0]["main"]);
            setWeatherDescription(weatherJson["weather"][0]["description"]);
            setTempeture(weatherJson["main"]["temp"])


        }catch(e){
            console.error("error in weather: ", e)
        }


        }

        const getLocation = async ()=>{
        if ("geolocation" in navigator) {
        /* geolocation is available */
            navigator.geolocation.getCurrentPosition((positions)=>{
                //send to fetch
                getWeather(positions.coords.longitude, positions.coords.latitude);

            })

        } else {
        /* geolocation IS NOT available */
            getWeather("96.33", "30.63");
        }


    }

    getLocation();


    },[])





    

    return(
        <div className="">
            <div>{weather}</div>
            <div>{weatherDescriptoin}</div>
            <div>{Math.floor((temputure-273.15)*(9/5)+32)}°F</div>
        </div>
    )




    
}