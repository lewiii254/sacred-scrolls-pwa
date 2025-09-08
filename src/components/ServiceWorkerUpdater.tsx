import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function ServiceWorkerUpdater() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [newServiceWorker, setNewServiceWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // SW has been updated and is now controlling the page
        window.location.reload();
      });

      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          console.log('Service Worker updated to version:', event.data.version);
          setShowUpdatePrompt(true);
        }
      });

      // Check for service worker registration updates
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker installed and ready
                  setNewServiceWorker(newWorker);
                  setShowUpdatePrompt(true);
                }
              });
            }
          });
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (newServiceWorker) {
      // Tell the new service worker to skip waiting and become active
      newServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      // Fallback: just reload the page
      window.location.reload();
    }
    setShowUpdatePrompt(false);
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  useEffect(() => {
    if (showUpdatePrompt) {
      toast.custom(
        (t) => (
          <div className="flex items-center justify-between w-full p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  App Update Available
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  A new version is ready. Refresh to get the latest features.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  handleDismiss();
                  toast.dismiss(t);
                }}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Later
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleUpdate();
                  toast.dismiss(t);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Update
              </Button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          id: 'sw-update'
        }
      );
    }
  }, [showUpdatePrompt]);

  return null;
}