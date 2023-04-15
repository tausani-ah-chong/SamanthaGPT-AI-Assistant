import { useEffect, useState } from 'react';
import SamanthaVisualizer from '../components/samantha-visualizer';

export default function Home() {
  const [hasMicrophoneAccess, setHasMicrophoneAccess] = useState(false);
  const [scale, setScale] = useState(1);
  const [experienceStarted, setExperienceStarted] = useState(false);

  const audioFiles = [
    '/samantha-welcome-1.mp3',
    '/samantha-welcome-2.mp3',
  ]

  const randomAudioFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];

  const handleStartExperience = () => {
    if (experienceStarted) return

    setExperienceStarted(true);
    const audioElement = document.getElementById('ai_voice_sample') as HTMLAudioElement;
    
    if (audioElement) {
      const timeoutId = setTimeout(() => {
        audioElement.play().catch((error) => {
          console.error(`Error playing audio: ${error}`);
        });
        // setSpeaking(true);
      }, 2000); // 2000 milliseconds = 2 seconds

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }

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
      alert('Not supported on this browser, try another');
      console.error('getUserMedia is not supported on this device');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // handleAudioStream(stream);
      setHasMicrophoneAccess(true);
    } catch (err) {
      console.error(`Error accessing microphone: ${err}`);
      setHasMicrophoneAccess(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full bg-custom-orange flex-col items-center">
      <div className='z-50 py-48'>
        {!experienceStarted && <button onClick={handleStartExperience} className='text-white text-4xl'>start</button>}
        {experienceStarted && <button className='text-4xl opacity-10 text-white pointer-events-none italic'>started</button>}
      </div>
      <div className='absolute top-36 md:top-0 z-10'>
        <SamanthaVisualizer 
          scale={scale}
          experienceStarted={experienceStarted}
        />
      </div>
      <audio id="ai_voice_sample" src={randomAudioFile} preload="auto" />
      

      {!hasMicrophoneAccess && <button onClick={requestMicrophoneAccess} className='text-white text-lg italic z-50 absolute bottom-48'>*request microphone access</button>}
    </main>
  )
}
