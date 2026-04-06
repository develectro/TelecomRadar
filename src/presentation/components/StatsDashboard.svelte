<script>
  import { mapTowers } from '../stores/appState.js';

  let totalTowers = $state(0);
  let stats = $state({
    '5G': 0,
    'LTE': 0,
    'UMTS': 0,
    'GSM': 0
  });

  $effect(() => {
    totalTowers = $mapTowers.length;
    stats = { '5G': 0, 'LTE': 0, 'UMTS': 0, 'GSM': 0 };
    $mapTowers.forEach(t => {
      if (stats[t.radio] !== undefined) {
        stats[t.radio]++;
      } else {
        stats[t.radio] = 1;
      }
    });
  });
</script>

<div class="stats-panel glass-panel">
  <div class="stat-item">
    <span class="value">{totalTowers}</span>
    <span class="label">Total Nodes</span>
  </div>
  <div class="divider"></div>
  <div class="stat-item 5G">
    <span class="value">{stats['5G'] || 0}</span>
    <span class="label">5G NR</span>
  </div>
  <div class="stat-item LTE">
    <span class="value">{stats['LTE'] || 0}</span>
    <span class="label">LTE</span>
  </div>
</div>

<style>
  .stats-panel {
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    padding: 1rem 1.5rem;
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  .divider {
    width: 1px;
    height: 40px;
    background: var(--border-color);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-main);
  }

  .label {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 0.25rem;
  }

  .stat-item.\35 G .value { color: var(--accent-5g); }
  .stat-item.LTE .value { color: var(--accent-lte); }
</style>
