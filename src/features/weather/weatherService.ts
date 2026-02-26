import type { GeocodingResult, WeatherData } from '@/common/types/weather'

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY as string | undefined
const BASE_URL = 'https://api.openweathermap.org'

const getApiKey = (): string => {
  if (!API_KEY) {
    throw new Error('VITE_OPEN_WEATHER_API_KEY is not set in .env')
  }
  return API_KEY
}

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  const key = getApiKey()
  const res = await fetch(
    `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`,
  )
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  return res.json() as Promise<WeatherData>
}

export const geocodeCity = async (city: string): Promise<GeocodingResult> => {
  const key = getApiKey()
  const res = await fetch(
    `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${key}`,
  )
  if (!res.ok) throw new Error(`Geocoding API error: ${res.status}`)
  const results = (await res.json()) as GeocodingResult[]
  if (results.length === 0) throw new Error(`City "${city}" not found.`)
  return results[0]
}

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  const { lat, lon } = await geocodeCity(city)
  return fetchWeatherByCoords(lat, lon)
}

export const getCurrentPosition = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 }),
  )
