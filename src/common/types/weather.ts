export interface WeatherData {
  city: string
  country: string
  temperature: number
  feelsLike: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  visibility: number
}

export interface OpenWeatherResponse {
  name: string
  sys: { country: string }
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  weather: Array<{
    description: string
    icon: string
  }>
  wind: { speed: number }
  visibility: number
}

export interface GeocodingResult {
  lat: number
  lon: number
  name: string
  country: string
}
