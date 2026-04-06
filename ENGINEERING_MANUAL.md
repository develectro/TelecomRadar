# Telecom Radar: Technical Engineering Manual
**Document Version:** 1.0.0
**Release Date:** Q2 2026
**Classification:** Technical Architecture & RF Engineering

---

## 1. Introduction

### 1.1 Purpose of the Document
This engineering manual serves as the definitive reference guide for the **Telecom Radar** platform. It outlines the core architectural paradigms, the implementation of Radio Frequency (RF) signal heuristics, and the application's clean design philosophy. It is intended for software architects, RF engineers, and telecom analysts seeking to extend or understand the system natively.

### 1.2 System Overview
Telecom Radar is a high-performance, web-based intelligence platform built on **Svelte 5** and **Leaflet.js**. The software acts as a "Virtual Drive Test" and cell tower intelligence gathering dashboard. By integrating crowdsourced global telemetry (via OpenCelliD), it models theoretical signal propagation visually across any terrain or geography.

---

## 2. System Architecture

Telecom Radar strictly implements a variant of **Clean Architecture** (Hexagonal Architecture) in the frontend. This ensures absolute separation of concerns between external API dependencies, business logic (physics algorithms), and the presentation layer.

### 2.1 The Domain Layer
At the heart of the system lies the purely logical `src/domain` module. It defines abstract entities without any awareness of Svelte, the DOM, or the network.

*   **`Tower.js`**: Reifies an eNodeB/gNodeB into a structured object, encapsulating properties such as Cell ID, geographical coordinates, Radio Access Technology (RAT), and operator mapping.
*   **`SignalQuality.js`**: Represents the final result of an RF simulation, encapsulating Reference Signal Received Power (RSRP) and evaluating it into a human-readable engineering label (Excellent, Good, Fair, Poor).

### 2.2 The Infrastructure Layer
The infrastructure layer acts as an adapter array, bridging the pure domain with the real world.
*   **`OpenCellIdRepository.js`**: Handles standard REST procedures with the OpenCelliD endpoint. It adapts JSON payload boundaries into instantiated `Tower` objects, fulfilling the `ITowerRepository` contract.
*   **`SignalCalculator.js`**: The deterministic mathematical engine responsible for predicting path losses based on geospatial coordinates.

### 2.3 The Presentation Layer
Leveraging the absolute bleeding edge of JavaScript frameworks (**Svelte 5**), the presentation employs *Runes* (`$state()`, `$effect()`) for immediate signal reactivity. This negates the need for Virtual DOM diffing, offering real-time physics simulations with zero latency when adjusting virtual user coordinates on the map.

---

## 3. Radio Frequency (RF) Physics Modeling

The system is augmented with an embedded heuristic simulation engine capable of deterministic RSRP calculation.

### 3.1 Haversine Geospatial Matrix
To process distances, the software relies on the **Haversine Formula**. By accounting for the Earth's radius (6371 km), it accurately deduces the arc distance between the Node and the virtual User Equipment (UE).

### 3.2 Free Space Path Loss (FSPL) Algorithm
The attenuation is roughly calculated using the inverse-square law of electromagnetism:
$$ \text{FSPL (dB)} = 20 \log_{10}(d) + 20 \log_{10}(f) + 32.44 $$
*Where `d` is distance in km, and `f` is frequency in MHz.*

### 3.3 Frequency Modeling Assumptions
Since OpenCelliD aggregates towers without specific band frequencies per cell, the `SignalCalculator` assumes macroscopic averages based on standard 3GPP deployments:
*   **GSM**: 900 MHz
*   **UMTS (3G)**: 2100 MHz
*   **LTE (4G)**: 1800 MHz (Band 3 average assumption)
*   **NR (5G)**: 3500 MHz (C-Band N78 assumption)

### 3.4 Urban Clutter and Link Budget
The Link Budget simulates standard transmit powers (e.g., 43 dBm / 20W for macroscopic sector antennas) and standard antenna gains (15 dBi). An aggressive static penalty is factored in for assumed urban clutter or wall penetration loss (~20 dB), guaranteeing conservative, real-world estimates.

---

## 4. Operation & Integration

### 4.1 Global OpenCelliD Intelligence
Accessing the platform requires an OpenCelliD API token. The platform parses the Leaflet geospatial bounding box, throttling HTTP transactions with a 800ms debounce loop to prevent API rate-limiting while the user scrolls through regions.

### 4.2 Security & Data Ephemerality
The platform stores all state in-memory (`appState.js`). Credentials and API tokens are completely client-bound and inherently volatile, meeting critical operational security postures.

---
*Generated internally for Telecom Radar Systems - Engineering Operations.*
