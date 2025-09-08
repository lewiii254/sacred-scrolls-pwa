import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Type, Eye, Palette } from 'lucide-react';

interface ReadingPreferences {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  textAlign: string;
  darkMode: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}

interface MobileReadingControlsProps {
  onPreferencesChange?: (preferences: ReadingPreferences) => void;
}

const FONT_FAMILIES = [
  { value: 'system', label: 'System Default' },
  { value: 'serif', label: 'Serif' },
  { value: 'sans-serif', label: 'Sans Serif' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'times', label: 'Times New Roman' },
  { value: 'palatino', label: 'Palatino' }
];

const TEXT_ALIGNMENTS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'justify', label: 'Justify' }
];

export function MobileReadingControls({ onPreferencesChange }: MobileReadingControlsProps) {
  const [preferences, setPreferences] = useState<ReadingPreferences>({
    fontSize: 16,
    lineHeight: 1.6,
    fontFamily: 'system',
    textAlign: 'left',
    darkMode: false,
    reducedMotion: false,
    highContrast: false
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bible-reading-preferences');
    if (saved) {
      try {
        const parsedPreferences = JSON.parse(saved);
        setPreferences(parsedPreferences);
      } catch (error) {
        console.error('Failed to parse reading preferences:', error);
      }
    }
  }, []);

  // Save preferences and notify parent when they change
  useEffect(() => {
    localStorage.setItem('bible-reading-preferences', JSON.stringify(preferences));
    onPreferencesChange?.(preferences);
  }, [preferences, onPreferencesChange]);

  const updatePreference = <K extends keyof ReadingPreferences>(
    key: K,
    value: ReadingPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Reading Settings</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Reading Preferences</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Font Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Type className="h-4 w-4" />
                <span>Text Formatting</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm">Font Size: {preferences.fontSize}px</Label>
                <Slider
                  value={[preferences.fontSize]}
                  onValueChange={([value]) => updatePreference('fontSize', value)}
                  min={12}
                  max={28}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm">Line Height: {preferences.lineHeight}</Label>
                <Slider
                  value={[preferences.lineHeight]}
                  onValueChange={([value]) => updatePreference('lineHeight', value)}
                  min={1.2}
                  max={2.5}
                  step={0.1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm">Font Family</Label>
                <Select value={preferences.fontFamily} onValueChange={(value) => updatePreference('fontFamily', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm">Text Alignment</Label>
                <Select value={preferences.textAlign} onValueChange={(value) => updatePreference('textAlign', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEXT_ALIGNMENTS.map((align) => (
                      <SelectItem key={align.value} value={align.value}>
                        {align.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Accessibility Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Accessibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="text-sm">High Contrast</Label>
                <Switch
                  id="high-contrast"
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => updatePreference('highContrast', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="reduced-motion" className="text-sm">Reduced Motion</Label>
                <Switch
                  id="reduced-motion"
                  checked={preferences.reducedMotion}
                  onCheckedChange={(checked) => updatePreference('reducedMotion', checked)}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`p-4 border rounded ${preferences.highContrast ? 'bg-white text-black border-black' : 'bg-muted'}`}
                style={{
                  fontSize: `${preferences.fontSize}px`,
                  lineHeight: preferences.lineHeight,
                  fontFamily: preferences.fontFamily === 'system' ? 'inherit' : preferences.fontFamily,
                  textAlign: preferences.textAlign as any
                }}
              >
                "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
                <br />
                <span className="text-sm text-muted-foreground">John 3:16</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}