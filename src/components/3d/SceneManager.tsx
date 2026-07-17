import { useState, useEffect } from 'react';
import TeslaVortex from './TeslaVortex';
import Tesseract from './Tesseract';
import CyberChip from './CyberChip';
import BiohybridChip from './BiohybridChip';

export default function SceneManager() {
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    // Alternar escena cada 10 segundos
    const interval = setInterval(() => {
      setActiveScene((prev) => (prev === 3 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <TeslaVortex isActive={activeScene === 0} />
      <Tesseract isActive={activeScene === 1} />
      <CyberChip isActive={activeScene === 2} />
      <BiohybridChip isActive={activeScene === 3} />
    </>
  );
}
