import { Tower } from '../../domain/entities/Tower.js';
import { ITowerRepository } from '../../domain/interfaces/ITowerRepository.js';

export class OpenCellIdRepository extends ITowerRepository {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
        // Proxy through Vite to avoid CORS blocks
        this.baseUrl = '/api/opencellid/cell/getInArea';
    }

    async getTowersInArea(minLat, minLon, maxLat, maxLon) {
        if (!this.apiKey) {
            throw new Error('OpenCelliD API Key is missing. Please configure it in settings.');
        }

        // OpenCelliD specific params
        const params = new URLSearchParams({
            key: this.apiKey,
            BBOX: `${minLat},${minLon},${maxLat},${maxLon}`,
            format: 'json'
        });

        try {
            const response = await fetch(`${this.baseUrl}?${params}`);
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();

            console.log("Raw API Response:", data); // Debugging helper for users

            if (data.error) {
                throw new Error(`OpenCelliD Error: ${data.error}`);
            }

            // Map OpenCelliD response to our domain Tower entity
            if (!data || !data.cells) {
                return [];
            }

            return data.cells.map(cell => new Tower({
                cellId: cell.cell,
                lat: cell.lat,
                lon: cell.lon,
                radio: cell.radio,
                operator: `${cell.mcc}-${cell.mnc}`,
                cellRange: cell.range || 1000 // default 1km if openCellId doesn't return
            }));
        } catch (error) {
            console.error('Failed to fetch from OpenCelliD', error);
            throw error;
        }
    }
}
