import { useState, useEffect } from 'react'
import type { WeatherData, OpenWeatherResponse, GeocodingResult } from '@/common/types/weather'

type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'no-key'

interface WeatherState {
  status: WeatherStatus
  data: WeatherData | null
  error: string | null
}

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY as string | undefined

const mapResponse = (raw: OpenWeatherResponse): WeatherData => ({
  city: raw.name,
  country: raw.sys.country,
  temperature: Math.round(raw.main.temp),
  feelsLike: Math.round(raw.main.feels_like),
  description: raw.weather[0]?.description ?? '',
  icon: raw.weather[0]?.icon ?? '',
  humidity: raw.main.humidity,
  windSpeed: raw.wind.speed,
  visibility: Math.round(raw.visibility / 1000),
})

const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  const json = (await res.json()) as OpenWeatherResponse
  return mapResponse(json)
}

const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
  const geoRes = await fetch(geoUrl)
  if (!geoRes.ok) throw new Error(`Geocoding API error: ${geoRes.status}`)
  const geoJson = (await geoRes.json()) as GeocodingResult[]

  if (!geoJson.length) throw new Error(`City "${city}" not found.`)

  const { lat, lon } = geoJson[0]
  return fetchWeatherByCoords(lat, lon)
}

// Initialise as 'loading' when key is present so the effect never needs
// a synchronous setState call at the top of its body.
const getInitialState = (): WeatherState => {
  if (!API_KEY) return { status: 'no-key', data: null, error: null }
  return { status: 'loading', data: null, error: null }
}

export const useWeather = () => {
  const [state, setState] = useState<WeatherState>(getInitialState)
  const [geoBlocked, setGeoBlocked] = useState(false)

  useEffect(() => {
    if (!API_KEY) return

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude)
          setState({ status: 'success', data, error: null })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to fetch weather.'
          setState({ status: 'error', data: null, error: message })
        }
      },
      () => {
        setGeoBlocked(true)
        setState({ status: 'idle', data: null, error: null })
      },
      { timeout: 10000 }
    )
  }, [])

  const searchByCity = async (city: string) => {
    if (!API_KEY) return

    setState({ status: 'loading', data: null, error: null })
    try {
      const data = await fetchWeatherByCity(city)
      setState({ status: 'success', data, error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather.'
      setState({ status: 'error', data: null, error: message })
    }
  }

  return { ...state, geoBlocked, searchByCity }
}
