import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { setTheme } from '../../store/slices/themeSlice'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Palette, User, Bell } from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { Separator } from '@/components/ui/separator'

const Settings: React.FC = () => {
  const dispatch = useAppDispatch()
  const { theme } = useSelector((state: RootState) => state.theme)
  const [currentTheme, setCurrentTheme] = useState(theme)

  useEffect(() => {
    setCurrentTheme(theme)
  }, [theme])

  const handleThemeChange = (newTheme: string) => {
    dispatch(setTheme(newTheme))
  }

  return (
    <div className='p-6'>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {/* Settings Navigation */}
        <Card>
          <CardContent className="p-4">
            <nav className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <Palette className="mr-2 h-4 w-4" />
                Appearance
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
                size="sm"
                disabled
              >
                <User className="mr-2 h-4 w-4" />
                Account
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
                size="sm"
                disabled
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how StoryTeller looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Theme</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose the theme that best suits your preference
                </p>
                <div className="flex flex-wrap gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      currentTheme === 'light'
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <div className="bg-white border rounded-md p-3 mb-2 shadow-sm">
                      <Sun className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Light</span>
                      {currentTheme === 'light' && (
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      currentTheme === 'dark'
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <div className="bg-gray-900 border border-gray-700 rounded-md p-3 mb-2 shadow-sm">
                      <Moon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Dark</span>
                      {currentTheme === 'dark' && (
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  More appearance settings will be available in future updates, including custom color schemes and font options.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings
