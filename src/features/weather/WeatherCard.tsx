import { Droplets, Eye, Gauge, Wind } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WeatherData } from '@/common/types/weather'

interface WeatherCardProps {
  data: WeatherData
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  const { name, sys, weather, main, visible } = data
  const condition = weather[0]
  const iconUrl = `https://openweathermap.org/img/wn/${condition.icon}@2x.png`

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold">
              {name}, {sys.country}
            </CardTitle>
            <p className="capitalize text-muted-foreground">{condition.description}</p>
          </div>
          <img src={iconUrl} alt={condition.description} className="h-16 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <span className="text-6xl font-thin">{Math.round(main.temp)}°</span>
          <span className="mb-2 text-xl text-muted-foreground">C</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Feels like {Math.round(main.feels_like)}° · {Math.round(main.temp_min)}° /{' '}
          {Math.round(main.temp_max)}°
        </p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <StatItem icon={<Droplets className="h-4 w-4" />} label="Humidity" value={`${main.humidity}%`} />
          <StatItem icon={<Wind className="h-4 w-4" />} label="Wind" value={`${data.wind.speed} m/s`} />
          <StatItem icon={<Gauge className="h-4 w-4" />} label="Pressure" value={`${main.pressure} hPa`} />
          <StatItem icon={<Eye className="h-4 w-4" />} label="Visibility" value={`${(visibility / 1000).toFixed(1)} km`} />
        </div>
      </CardContent>
    </Card>
  )
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

const StatItem = ({ icon, label, value }: StatItemProps) => (
  <div className="flex items-center gap-2 rounded-md bg-muted p-3">
    <span className="text-muted-foreground">{icon}</span>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
)

export default WeatherCard
