import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface NotificationSettings {
  dailyReminder: boolean;
  verseOfTheDay: boolean;
  readingPlanReminders: boolean;
  communityUpdates: boolean;
  reminderTime: string; // HH:MM format
}

interface NotificationContextType {
  permission: NotificationPermission;
  settings: NotificationSettings;
  requestPermission: () => Promise<void>;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  scheduleNotification: (title: string, body: string, tag?: string) => void;
  isSupported: boolean;
}

const defaultSettings: NotificationSettings = {
  dailyReminder: true,
  verseOfTheDay: true,
  readingPlanReminders: true,
  communityUpdates: false,
  reminderTime: '08:00'
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isSupported] = useState('Notification' in window && 'serviceWorker' in navigator);

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  useEffect(() => {
    if (user) {
      loadUserSettings();
      scheduleRegularNotifications();
    }
  }, [user, settings]);

  const loadUserSettings = () => {
    const saved = localStorage.getItem(`notification_settings_${user?.id}`);
    if (saved) {
      setSettings({ ...defaultSettings, ...JSON.parse(saved) });
    }
  };

  const requestPermission = async () => {
    if (!isSupported) {
      console.warn('Notifications not supported');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // Register service worker for background notifications
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered:', registration);
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    if (user) {
      localStorage.setItem(
        `notification_settings_${user.id}`, 
        JSON.stringify(updatedSettings)
      );
    }
  };

  const scheduleNotification = (title: string, body: string, tag?: string) => {
    if (permission !== 'granted' || !isSupported) return;

    // For immediate notifications
    new Notification(title, {
      body,
      tag,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png'
    });
  };

  const scheduleRegularNotifications = () => {
    if (permission !== 'granted' || !user) return;

    // Daily reminder
    if (settings.dailyReminder) {
      scheduleDailyReminder();
    }

    // Verse of the day
    if (settings.verseOfTheDay) {
      scheduleVerseOfTheDay();
    }

    // Reading plan reminders
    if (settings.readingPlanReminders) {
      scheduleReadingPlanReminder();
    }
  };

  const scheduleDailyReminder = () => {
    // Schedule daily Bible reading reminder
    const now = new Date();
    const [hours, minutes] = settings.reminderTime.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      scheduleNotification(
        '📖 Time for Bible Reading',
        'Take a moment to read God\'s Word today',
        'daily-reminder'
      );
      
      // Schedule the next day's reminder
      setTimeout(scheduleDailyReminder, 24 * 60 * 60 * 1000);
    }, timeUntilNotification);
  };

  const scheduleVerseOfTheDay = () => {
    // Schedule verse of the day notification (9 AM)
    const now = new Date();
    const verseTime = new Date();
    verseTime.setHours(9, 0, 0, 0);

    if (verseTime <= now) {
      verseTime.setDate(verseTime.getDate() + 1);
    }

    const timeUntilVerse = verseTime.getTime() - now.getTime();

    setTimeout(() => {
      const verses = [
        { text: 'Trust in the Lord with all your heart', ref: 'Proverbs 3:5' },
        { text: 'Be strong and courageous', ref: 'Joshua 1:9' },
        { text: 'I can do all things through Christ', ref: 'Philippians 4:13' },
        { text: 'The Lord is my shepherd', ref: 'Psalm 23:1' },
        { text: 'God works for the good of those who love him', ref: 'Romans 8:28' }
      ];
      
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];
      
      scheduleNotification(
        '✨ Verse of the Day',
        `"${randomVerse.text}" - ${randomVerse.ref}`,
        'verse-of-day'
      );
      
      // Schedule tomorrow's verse
      setTimeout(scheduleVerseOfTheDay, 24 * 60 * 60 * 1000);
    }, timeUntilVerse);
  };

  const scheduleReadingPlanReminder = () => {
    // Check if user has active reading plans
    const plans = localStorage.getItem(`reading_plans_${user?.id}`);
    if (!plans) return;

    const userPlans = JSON.parse(plans);
    const activePlans = userPlans.filter((plan: any) => !plan.completed);

    if (activePlans.length > 0) {
      // Schedule reading plan reminder for evening (7 PM)
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(19, 0, 0, 0);

      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      setTimeout(() => {
        scheduleNotification(
          '📚 Reading Plan Progress',
          `Don't forget to continue your reading plan today!`,
          'reading-plan-reminder'
        );
        
        // Schedule tomorrow's reminder
        setTimeout(scheduleReadingPlanReminder, 24 * 60 * 60 * 1000);
      }, timeUntilReminder);
    }
  };

  const value: NotificationContextType = {
    permission,
    settings,
    requestPermission,
    updateSettings,
    scheduleNotification,
    isSupported
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}