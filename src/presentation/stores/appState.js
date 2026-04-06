import { writable } from 'svelte/store';

// Global application state
export const openCellIdApiKey = writable('');
export const mapTowers = writable([]); // Array of Tower objects
export const selectedTower = writable(null); // Currently selected Tower
export const simulatedUserLocation = writable(null); // {lat, lon}
export const isSimulating = writable(false);
export const mapBounds = writable(null); // {minLat, minLon, maxLat, maxLon}
export const isFetching = writable(false);
export const appError = writable(null);
