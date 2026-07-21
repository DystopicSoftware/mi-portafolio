# Auditoría y Optimización de Rendimiento Fullstack

Este documento resume las 3 fases de optimización arquitectónica aplicadas al proyecto para maximizar el rendimiento y la resiliencia en un entorno Serverless y WebGL.

## 1. Sellado de Fuga de Memoria WebGL (Dispose method)
Se implementó un recolector de basura (Garbage Collector) manual en los componentes 3D. Las instancias de materiales (como el `tesseractMaterial` clonado) ahora se eliminan de la memoria de la GPU explícitamente mediante el método `.dispose()` dentro de un hook `useEffect` cuando el componente se desmonta, previniendo cuelgues del navegador (Memory Leaks) en sesiones prolongadas.

## 2. Eliminación de Re-renders del DOM (Zustand Transient Updates)
Se eliminaron las suscripciones directas al store de Zustand (`usePortfolioStore(state => state...)`) en los componentes 3D (`TesseractSwarm` y `ResonanceMandala`). 
En su lugar, los componentes WebGL ahora leen el estado de forma transitoria dentro del bucle de animación (`useFrame`) usando `usePortfolioStore.getState()`. Esto aísla por completo el árbol de React, previniendo re-renders masivos del Canvas cada vez que la UI (como la selección de una categoría) cambia.

## 3. Mitigación de Latencia Serverless (Warm Starts)
En el backend (`api/index.py`), se implementó un patrón *Singleton con Lazy Loading* para la instanciación del cliente de Groq.
Al usar una variable global (`client_instance`) evaluada bajo demanda (`get_groq_client()`), garantizamos que entornos sin servidor como Vercel o AWS Lambda reutilicen la misma conexión TCP y objeto en memoria a lo largo de varias peticiones consecutivas (Warm Starts). Esto reduce significativamente los tiempos de arranque en frío (Cold Starts) sin sacrificar la seguridad de los secretos.

## Adicional
Se instaló `r3f-perf` y se inyectó en el `<Canvas>` (`App.tsx`) para proporcionar una telemetría en tiempo real del uso de GPU, draw calls y carga de memoria.
