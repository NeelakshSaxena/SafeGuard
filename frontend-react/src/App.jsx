import { useEffect, useRef } from 'react';
import { useStore } from './store';
import { initSocket, socket } from './services/socket';

function App() {
  const { setOfflineStatus } = useStore();
  const iframeRef = useRef(null);

  useEffect(() => {
    // Keep the WebSockets and state management running in the React Background
    initSocket();
    
    const handleOnline = () => setOfflineStatus(false);
    const handleOffline = () => setOfflineStatus(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Forward socket events to the legacy UI
    const handlePatientUpdate = (data) => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'PATIENT_UPDATE', payload: data }, '*');
      }
    };
    
    socket.on('patient:update', handlePatientUpdate);

    return () => {
      socket.off('patient:update', handlePatientUpdate);
      socket.disconnect();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOfflineStatus]);

  // Instantly restore 100% of the legacy vanilla JS functionality 
  // by mounting it inside the React app, allowing a gradual component-by-component migration
  return (
    <div className="w-screen h-screen overflow-hidden m-0 p-0">
      <iframe 
        ref={iframeRef}
        src="/legacy/index.html" 
        className="w-full h-full border-none m-0 p-0 block"
        title="SafeGuard Legacy Dashboard"
      />
    </div>
  );
}

export default App;
