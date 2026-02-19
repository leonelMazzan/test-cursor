import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Search, Wind, Droplets, Eye, Thermometer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/common/stores/authStore'
import { useWeather } from '@/features/weather/useWeather'

const WeatherDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { status, data, error, geoBlocked, searchByCity } = useWeather()

  const [cityInput, setCityInput] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = cityInput.trim()
    if (!trimmed) return
    await searchByCity(trimmed)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">Weather Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {status === 'no-key' && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <strong>Missing API key.</strong> Add <code>VITE_OPEN_WEATHER_API_KEY</code> to your{' '}
            <code>.env</code> file and restart the dev server.
          </div>
        )}

        {(geoBlocked || status === 'idle' || status === 'error' || status === 'success') &&
          status !== 'no-key' && (
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
              <Input
                placeholder="Search by city name…"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="max-w-sm"
                aria-label="City name"
              />
              <Button type="submit" disabled={status === 'loading'}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          )}

        {geoBlocked && status === 'idle' && (
          <p className="mb-4 text-sm text-muted-foreground">
            Location access denied. Enter a city name above to get the weather.
          </p>
        )}

        {status === 'loading' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {status === 'success' && data && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                alt={data.description}
                className="h-16 w-16"
              />
              <div>
                <h2 className="text-3xl font-bold">
                  {data.city}, {data.country}
                </h2>
                <p className="capitalize text-muted-foreground">{data.description}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{data.temperature}°C</p>
                  <p className="text-sm text-muted-foreground">Feels like {data.feelsLike}°C</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{data.humidity}%</p>
                  <p className="text-sm text-muted-foreground">Relative humidity</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <Wind className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium">Wind</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{data.windSpeed} m/s</p>
                  <p className="text-sm text-muted-foreground">Wind speed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium">Visibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{data.visibility} km</p>
                  <p className="text-sm text-muted-foreground">Visibility distance</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default WeatherDashboard
