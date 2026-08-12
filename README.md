# Decentralized IoT Authentication System

Portfolio prototype for the research project **Decentralized Authentication using PUF and Blockchain for IoT Security**.

## Features
- Device registration
- Challenge-response authentication
- Software-simulated PUF response using SHA-256
- Spoofing attack simulation
- Risk scoring
- Blockchain-style linked audit ledger
- Previous-hash/current-hash verification
- System logs
- Responsive security dashboard

## Technical scope
This is an educational web prototype. It does **not** implement a physical PUF or a production blockchain network. The PUF is simulated in software using a device/challenge-dependent SHA-256 response, while the audit ledger is a local linked-block structure.

## Run
Open `index.html` in a modern browser.

Or run:
`python -m http.server 8000`

Then open `http://localhost:8000`.

## Demo
1. Register `IOT-001`.
2. Enter `IOT-001` in the authentication field.
3. Keep the challenge `TEMP-2026-001`.
4. Click **Generate PUF Response**.
5. Click **Authenticate**.
6. Use **Simulate Spoofing Attack** to show a fake device being blocked.
7. Click **Verify Chain** to check ledger integrity.

## Interview explanation
"I built a browser-based prototype of the authentication workflow from my PUF and blockchain IoT security research. It uses a software-simulated PUF to generate a challenge-dependent response, verifies registered devices, records successful events in a linked audit ledger, and demonstrates spoofing detection. Because this is a web prototype, the PUF and blockchain are simulated rather than implemented with physical hardware or a live blockchain network."
