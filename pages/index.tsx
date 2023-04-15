import { useEffect, useState } from 'react';
import SamanthaVisualizer from '../components/samantha-visualizer';

export default function Home() {
  const [speaking, setSpeaking] = useState(false);
  const [hasMicrophoneAccess, setHasMicrophoneAccess] = useState(false);
  const [scale, setScale] = useState(1);

  // Handle mobile scaling
  useEffect(() => {
    if (window == null) return

    setScale(window.innerWidth <= 768 ? 0.2 : 1);
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setScale(window.innerWidth <= 768 ? 0.2 : 1);
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  async function requestMicrophoneAccess() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('getUserMedia is not supported on this device');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // handleAudioStream(stream);
      setHasMicrophoneAccess(true);
    } catch (err) {
      alert(`Error accessing microphone: ${err}`);
      setHasMicrophoneAccess(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full bg-custom-orange flex-col items-center justify-center">
      <SamanthaVisualizer 
        scale={scale}
      />
      {!hasMicrophoneAccess && <button onClick={requestMicrophoneAccess}>Request Microphone Access</button>}
    </main>
  )
}
