export class SignalQuality {
    /**
     * @param {Object} data
     * @param {number} data.rsrp - Reference Signal Received Power in dBm
     * @param {string} data.physicsModel - Name of the physics model used (e.g. 'FSPL')
     * @param {number} data.distance - Distance from the tower to user in meters
     */
    constructor({ rsrp, physicsModel, distance }) {
        this.rsrp = rsrp;
        this.physicsModel = physicsModel;
        this.distance = distance;
    }

    /**
     * Returns a human readable quality label based on RSRP
     * @returns {string} Excellent, Good, Fair, Poor, or None
     */
    getQualityLabel() {
        if (this.rsrp >= -80) return 'Excellent';
        if (this.rsrp >= -90) return 'Good';
        if (this.rsrp >= -105) return 'Fair';
        if (this.rsrp >= -120) return 'Poor';
        return 'None';
    }
}
