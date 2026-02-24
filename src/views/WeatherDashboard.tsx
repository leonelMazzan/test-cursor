import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, LogOut, MapPin, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import WeatherCard from '@/features/weather/WeatherCard'
import { fetchWeatherByCoords, fetchWeatherByCity, getCurrentPosition } from '@/features/weather/weatherService'
import { useAuth } from '@/common/hooks/useAuth'
import ThemeToggle from '@/common/components/ThemeToggle'
import type { WeatherData } from '@/common/types/weather'

type GeoStatus = 'idle' | 'loading' | 'denied' | 'success' | 'error'

const WeatherDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle')
  const [cityInput, setCityInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cityInput.trim()) return
    setSearchError('')
    setIsSearching(true)
    try {
      const data = await fetchWeatherByCity(cityInput.trim())
      setWeatherData(data)
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Could not fetch weather.')
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    setGeoStatus('loading')
    getCurrentPosition()
      .then(({ coords }) => fetchWeatherByCoords(coords.latitude, coords.longitude))
      .then((data) => {
        setWeatherData(data)
        setGeoStatus('success')
      })
      .catch((err: unknown) => {
        const isDenied =
          err instanceof GeolocationPositionError && err.code === GeolocationPositionError.PERMISSION_DENIED
        setGeoStatus(isDenied ? 'denied' : 'error')
      })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user?.email}</span>
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Sign out">
              <LogOut className="mr-1 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-10">
        <h1 className="text-3xl font-bold">Weather Dashboard</h1>

        {/* Geolocation status */}
        {geoStatus === 'loading' && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 animate-pulse" />
            <span>Detecting your location…</span>
          </div>
        )}

        {(geoStatus === 'denied' || geoStatus === 'error') && (
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center gap-3 pt-6">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p className="text-center text-sm text-muted-foreground">
                {geoStatus === 'denied'
                  ? 'Location access was denied. Search by city below.'
                  : 'Could not detect location. Search by city below.'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* City search */}
        <form onSubmit={handleCitySearch} className="flex w-full max-w-md gap-2">
          <Input
            placeholder="Search by city…"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            aria-label="City name"
          />
          <Button type="submit" disabled={isSearching} aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {searchError && (
          <p className="text-sm text-destructive">{searchError}</p>
        )}

        {/* Weather result */}
        {geoStatus === 'loading' && !weatherData && (
          <Card className="w-full max-w-md animate-pulse">
            <CardContent className="h-48 pt-6" />
          </Card>
        )}

        {weatherData && <WeatherCard data={weatherData} />}
      </main>
    </div>
  )
}

export default WeatherDashboard
