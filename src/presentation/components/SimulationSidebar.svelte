<script>
  import { selectedTower, simulatedUserLocation, isSimulating } from '../stores/appState.js';
  import { SignalCalculator } from '../../infrastructure/physics/SignalCalculator.js';

  let signalResult = $state(null);

  // Reactively calculate signal when selected tower or simulated user location changes
  $effect(() => {
    if ($selectedTower && $simulatedUserLocation) {
      signalResult = SignalCalculator.estimateSignal(
        $selectedTower,
        $simulatedUserLocation.lat,
        $simulatedUserLocation.lon
      );
    } else {
      signalResult = null;
    }
  });

  function closeSidebar() {
    selectedTower.set(null);
  }
</script>

{#if $selectedTower}
<div class="sidebar glass-panel">
  <div class="header">
    <h3>Virtual Simulator</h3>
    <button class="close-btn" onclick={closeSidebar}>&times;</button>
  </div>
  
  <div class="section">
    <h4>Tower Details</h4>
    <div class="row">
      <span class="label">Operator</span>
      <strong class="value">{$selectedTower.operator}</strong>
    </div>
    <div class="row">
      <span class="label">Technology</span>
      <span class="tag {$selectedTower.radio}">{$selectedTower.radio}</span>
    </div>
    <div class="row">
      <span class="label">Cell ID</span>
      <span class="value">{$selectedTower.cellId}</span>
    </div>
  </div>

  <div class="section">
    <h4>Signal Physics (FSPL)</h4>
    {#if signalResult}
      <div class="signal-display">
        <div class="rsrp-value">{signalResult.rsrp} <small>dBm</small></div>
        <div class="quality-label {signalResult.getQualityLabel().toLowerCase()}">
          {signalResult.getQualityLabel()}
        </div>
      </div>
      <div class="row">
        <span class="label">Distance</span>
        <span class="value">{signalResult.distance} m</span>
      </div>
    {:else}
      <div class="sim-hint">
        <p>Simulation active. Click anywhere on the map to test signal drop-off.</p>
      </div>
    {/if}
  </div>
</div>
{/if}

<style>
  .sidebar {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 320px;
    z-index: 1000;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1rem;
  }

  .header h3 {
    margin: 0;
    color: var(--text-main);
    font-size: 1.1rem;
    letter-spacing: 1px;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
  }
  .close-btn:hover { color: var(--danger); }

  .section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .section h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.85rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.95rem;
  }

  .label { color: var(--text-muted); }
  .value { font-weight: 600; color: var(--text-main); }

  .tag {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: bold;
    color: #fff;
    background: var(--text-muted);
  }
  .tag.LTE { background: var(--accent-lte); }
  .tag.\35 G { background: var(--accent-5g); color: #000; }
  .tag.UMTS { background: var(--accent-3g); }

  .signal-display {
    text-align: center;
    padding: 1.5rem;
    background: rgba(0,0,0,0.3);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
    margin-bottom: 0.5rem;
  }

  .rsrp-value {
    font-size: 2.5rem;
    font-weight: 700;
    font-family: monospace;
    color: var(--text-main);
  }
  .rsrp-value small { font-size: 1rem; color: var(--text-muted); }

  .quality-label {
    margin-top: 0.5rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.9rem;
  }

  .quality-label.excellent { color: #10b981; } /* Emerald */
  .quality-label.good { color: #f59e0b; } /* Amber */
  .quality-label.fair { color: #f97316; } /* Orange */
  .quality-label.poor, .quality-label.none { color: var(--danger); }

  .sim-hint {
    padding: 1rem;
    background: rgba(6, 182, 212, 0.1);
    border: 1px dashed var(--accent-5g);
    border-radius: var(--radius-sm);
    color: var(--accent-5g);
    font-size: 0.85rem;
    text-align: center;
    line-height: 1.5;
  }
</style>
