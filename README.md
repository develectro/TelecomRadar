# 📡 Telecom Radar

[![Svelte 5](https://img.shields.io/badge/Svelte-5-ff3e00?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199903?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Architecture: SOLID](https://img.shields.io/badge/Architecture-SOLID-blue?style=for-the-badge)](./ENGINEERING_MANUAL.md)

**Telecom Radar** is a premium, high-performance telecommunications intelligence dashboard. It provides real-time visualization of cellular infrastructure (OpenCelliD) combined with a deterministic RF signal propagation simulator.

---

## 🚀 Key Features

- **Live Cell Mapping**: Dynamic fetching of cell towers based on map bounding box.
- **RF Signal Simulator**: Real-time RSRP (Reference Signal Received Power) estimation using the Free Space Path Loss (FSPL) model.
- **Carrier Insights**: Automated statistics for 5G, LTE, and UMTS distribution in the viewed area.
- **Premium UX**: A dark-themed, glassmorphism-inspired interface built for engineering professional use.
- **Clean Architecture**: Strictly decoupled domain logic, infrastructure adapters, and Svelte 5 presentation layer.

## 🏗️ Architecture (SOLID)

The project follows "Clean Architecture" principles to ensure maintainability and testability:

- **Domain Layer**: Pure business logic and entities (`Tower`, `SignalQuality`).
- **Infrastructure**: API Adapters (OpenCellId) and Physics Engines.
- **Presentation**: Reactive UI components leveraging Svelte 5 Runes.

For a deep dive into the engineering specs, check out the [Engineering Manual](./ENGINEERING_MANUAL.md).

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- An **OpenCelliD API Key** (Get one at [opencellid.org](https://opencellid.org))

### Quick Start
1. Clone the repository and navigate to the folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the app in your browser and enter your API Key in the welcome overlay.

---

## 🛰️ Signal Physics Note
The simulation uses a conservative **Link Budget** model assuming:
- **Tx Power**: 43 dBm (20W)
- **Antenna Gain**: 15 dBi
- **Building Penetration Loss**: ~20 dB
- **Frequencies**: Modeled based on standard 3GPP bands (900/1800/2100/3500 MHz).

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Developed for Telecom Systems Research & Engineering.*
