import fetch from 'node-fetch';

const VICTRON_LOGIN_URL = 'https://vrmapi.victronenergy.com/v2/auth/login';
const DEFAULT_EXPIRES_IN = 24 * 60 * 60; // Standardmäßig auf 24 Stunden setzen

async function renewVictronToken() {
    try {
        const response = await fetch(VICTRON_LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: process.env.VICTRON_USERNAME, 
                password: process.env.VICTRON_PASSWORD
            })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "API call to Victron failed");
        }
        return { accessToken: data.token, expiresIn: DEFAULT_EXPIRES_IN }; // Gebe DEFAULT_EXPIRES_IN zurück
    } catch (error) {
        console.error('Error renewing Victron token:', error);
        throw error;
    }
}

export default renewVictronToken;
