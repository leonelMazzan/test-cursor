export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface WeatherMain {
  temp: number
  feels_like: number
  humidity: number
  pressure: number
  temp_min: number
  temp_max: number
}

export interface WeatherWind {
  speed: number
  deg: number
}

export interface WeatherData {
  name: string
  sys: { country: string }
  weather: WeatherCondition[]
  main: WeatherMain
  wind: WeatherWind
  visibility: number
  dt: number
}

export interface GeocodingResult {
  name: string
  lat: number
  lon: number
  country: string
}
