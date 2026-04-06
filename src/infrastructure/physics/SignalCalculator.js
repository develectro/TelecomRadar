import { SignalQuality } from '../../domain/entities/SignalQuality.js';

/**
 * Calculates estimated signal quality using Free Space Path Loss (FSPL) combined with simple urban attenuation logic.
 */
export class SignalCalculator {
    /**
     * @param {number} lat1
     * @param {number} lon1
     * @param {number} lat2
     * @param {number} lon2
     * @returns {number} distance in meters
     */
    static getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth radius in meters
        const phi1 = lat1 * Math.PI / 180;
        const phi2 = lat2 * Math.PI / 180;
        const deltaPhi = (lat2 - lat1) * Math.PI / 180;
        const deltaLambda = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    /**
     * @param {import('../../domain/entities/Tower.js').Tower} tower 
     * @param {number} userLat 
     * @param {number} userLon 
     * @returns {SignalQuality}
     */
    static estimateSignal(tower, userLat, userLon) {
        const distanceMm = Math.max(1, this.getDistance(tower.lat, tower.lon, userLat, userLon));

        // Simplistic frequency assignment based on radio
        let frequencyMHz = 1800; // default for LTE
        if (tower.radio === '5G') frequencyMHz = 3500;
        if (tower.radio === 'UMTS') frequencyMHz = 2100;
        if (tower.radio === 'GSM') frequencyMHz = 900;

        // FSPL = 20log10(d) + 20log10(f) + 32.44
        // d in km, f in MHz
        const distanceKm = distanceMm / 1000;
        const fspl = 20 * Math.log10(distanceKm) + 20 * Math.log10(frequencyMHz) + 32.44;

        // Typical parameters for simulation
        const txPower = 43; // 20W eNodeB
        const antennaGain = 15; // 15 dBi sector antenna
        const urbanLoss = 20; // Penetration / clutter loss approximation

        // RSRP = TxPower + Gain - PathLoss - OtherLosses
        let estimatedRsrp = txPower + antennaGain - fspl - urbanLoss;

        if (distanceMm > tower.cellRange) {
            estimatedRsrp -= 30; // Rapid degradation beyond intended range
        }

        return new SignalQuality({
            rsrp: Math.round(estimatedRsrp),
            physicsModel: 'FSPL + Urban Offset',
            distance: Math.round(distanceMm)
        });
    }
}
