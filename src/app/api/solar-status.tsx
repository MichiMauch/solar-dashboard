import axios, { AxiosResponse } from 'axios';

const config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=15mins',
  headers: {
    'x-authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjMzMDczYmY4MGVhYjdiNGFhOTM4ODQyNGRiYTNiODE0In0.eyJ1aWQiOiIyNDQ4NjciLCJ0b2tlbl90eXBlIjoiZGVmYXVsdCIsImlzcyI6InZybWFwaS52aWN0cm9uZW5lcmd5LmNvbSIsImF1ZCI6Imh0dHBzOi8vdnJtYXBpLnZpY3Ryb25lbmVyZ3kuY29tLyIsImlhdCI6MTcxNDY3ODcwNCwiZXhwIjoxNzE0NzY1MTA0LCJqdGkiOiIzMzA3M2JmODBlYWI3YjRhYTkzODg0MjRkYmEzYjgxNCJ9.t8HH9J1ADh3-iKqa67IT0FwsFyMwk8PQ1X-cy-XaWJzaDXhKA82nWB_GNbC0mgSxTAxXFJRAQ19sE0Q2C_Ufu-fkjQBJYSMu_s3pvWuFL7UndwgBofwde756neT83sCPdmOZsoLA1bwHacQ6J8iWTAAU8VdTC7CnRVzAaViexyaJuMG-bjmnS0itBV-koAWJg-CW_ZtxUBNoPcaX4UmgGqn2Mzw5HC_RMCW8lamuDMXTpJZsMAIbq6rIXwphdpiAFrNfr6QE1xARh7FPv2gg3fXntZdB6wMBsyAi8S3S-fHCdeAHw4Y44NZi990CsLjq938ZJVxCKTNCZqWFekj3pw'
  }
};

// Stellen Sie sicher, dass fetchData die gesamten Daten zurückgibt
export const fetchData = async () => {
  try {
    const response = await axios.request(config);
    return response.data; // Rückgabe des vollständigen Datenobjekts
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Fehler weiterleiten, um ihn in der Komponente behandeln zu können
  }
};