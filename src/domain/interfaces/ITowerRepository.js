/**
 * @interface
 * Interface for fetching Tower data to abstract away the external API.
 */
export class ITowerRepository {
    /**
     * Fetch towers in a specific bounding box.
     * @param {number} minLat
     * @param {number} minLon
     * @param {number} maxLat
     * @param {number} maxLon
     * @returns {Promise<import('../entities/Tower').Tower[]>}
     */
    async getTowersInArea(minLat, minLon, maxLat, maxLon) {
        throw new Error('Not implemented');
    }
}
