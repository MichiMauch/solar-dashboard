// src/hooks/useIntervalFetch.ts
import { useEffect, useState } from 'react';
import { fetchSolarData, ResponseData } from '../api/solarService';

function useIntervalFetch() {
  const [data, setData] = useState<ResponseData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await fetchSolarData();
        setData(fetchedData);
      } catch (err) {
        setError('Fehler beim Laden der Daten.');
        console.error("Fehler beim Laden der Daten:", err);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => {
      console.log('Interval cleared');
      clearInterval(intervalId);
    };
  }, []);

  return { data, error };
}

export default useIntervalFetch;
