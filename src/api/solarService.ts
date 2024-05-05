// src/api/solarService.ts
export interface PowerEntry {
    time: string;
    power: number;
  }
  
  export interface ResponseData {
    records: {
      Pdc: Array<[number, number]>;
      bs: Array<[number, number, number, number]>;
      total_solar_yield: Array<[number, number]>;
      total_consumption: Array<[number, number]>;
    };
  }
  
  export const fetchSolarData = async (): Promise<ResponseData> => {
    const response = await fetch('../../api/solar');
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Daten');
    }
    return await response.json();
  };

  
  