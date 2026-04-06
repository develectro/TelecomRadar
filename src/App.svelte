<script>
  import MapCanvas from './presentation/components/MapCanvas.svelte';
  import SimulationSidebar from './presentation/components/SimulationSidebar.svelte';
  import StatsDashboard from './presentation/components/StatsDashboard.svelte';
  import { openCellIdApiKey, isFetching, appError, mapBounds, mapTowers } from './presentation/stores/appState.js';
  import { OpenCellIdRepository } from './infrastructure/api/OpenCellIdRepository.js';

  let tempKey = $state('');

  function saveKey() {
    if(tempKey.trim() !== '') {
      openCellIdApiKey.set(tempKey.trim());
    }
  }

  // Reactive statement to fetch towers when map bounds or API key change
  $effect(() => {
    async function fetchTowers() {
      if (!$openCellIdApiKey || !$mapBounds) return;
      
      const repo = new OpenCellIdRepository($openCellIdApiKey);
      isFetching.set(true);
      appError.set(null);
      
      try {
        const towers = await repo.getTowersInArea(
          $mapBounds.minLat,
          $mapBounds.minLon,
          $mapBounds.maxLat,
          $mapBounds.maxLon
        );
        mapTowers.set(towers);
      } catch (err) {
        appError.set(err.message);
      } finally {
        isFetching.set(false);
      }
    }
    
    const timeout = setTimeout(fetchTowers, 800);
    return () => clearTimeout(timeout);
  });
</script>

<main>
  <!-- Background Map -->
  <MapCanvas />

  <!-- Overlay UI Panels -->
  {#if !$openCellIdApiKey}
    <div class="overlay-center glass-panel">
      <h2>Telecom Radar</h2>
      <p>Enter your OpenCelliD API Key to start scanning live telecom data.</p>
      <div class="input-group">
        <input type="text" bind:value={tempKey} placeholder="API Key (e.g. pk.abc123...)" />
        <button onclick={saveKey}>Start Scanning</button>
      </div>
    </div>
  {:else}
    <SimulationSidebar />
    <StatsDashboard />
  {/if}

  {#if $isFetching}
    <div class="status-indicator glass-panel">
      Tracing RF Signals...
    </div>
  {/if}

  {#if $appError}
    <div class="error-panel glass-panel">
      Error: {$appError}
    </div>
  {/if}
</main>

<style>
  main {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .overlay-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    padding: 2.5rem;
    text-align: center;
    width: 90%;
    max-width: 450px;
  }

  .overlay-center h2 {
    margin-bottom: 0.5rem;
    color: var(--accent-5g);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .overlay-center p {
    font-size: 0.95rem;
    color: var(--text-muted);
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  input {
    padding: 1rem;
    font-size: 1rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
    background: rgba(0,0,0,0.4);
    color: var(--text-main);
    outline: none;
    font-family: var(--font-family);
    transition: border-color 0.3s;
  }

  input:focus {
    border-color: var(--accent-5g);
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
  }

  button {
    background: var(--accent-5g);
    color: #000;
    font-weight: 700;
    font-size: 1rem;
    padding: 1rem;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  button:hover {
    box-shadow: 0 0 25px rgba(6, 182, 212, 0.6);
    transform: translateY(-2px);
  }

  .status-indicator {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    padding: 0.75rem 1.5rem;
    color: var(--accent-5g);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 1px;
    animation: pulse 2s infinite;
  }

  .error-panel {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    padding: 1rem 2rem;
    background: rgba(239, 68, 68, 0.85); /* Red */
    color: white;
    border: 1px solid var(--danger);
  }

  @keyframes pulse {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
  }
</style>
