# Kit Vision Verify — Mobile App

React Native / Expo companion app for the [kit-vision project]([../kit-vision](https://github.com/dylanarmstrong1/kit-vision)).
Take a photo of a kit, upload a manifest, and get an instant pass/fail verification report.

---

## Features

- 📷 Take a photo or select from your library
- 📋 Upload a kit manifest (JSON)
- ✅ View pass/fail results with missing, unexpected, and low-confidence items flagged

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) installed on your phone

---

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone.

---

## Usage

1. **Take a photo** of the kit laid out flat
2. **Upload the manifest** — a JSON file listing expected components and quantities
3. **Submit** — the app sends both to the verification backend
4. **Review results** — see what's confirmed, missing, or flagged for review

---

## Manifest Format

```json
{
  "kit_name": "Fishing Kit - POC",
  "version": "1.0",
  "components": {
    "hook_worm": 1,
    "hook_weedless": 1,
    "crankbait_red": 1
  }
}
```

---

## Project Structure

```
fishing-kit-app/
├── app/                  # Expo Router screens
├── components/           # Shared UI components
├── assets/               # Icons and images
├── .env                  # Backend API URL (not committed)
├── .gitignore
└── README.md
```

---

## Environment Variables

Create a `.env` file in the project root:

```
EXPO_PUBLIC_API_URL=http://your-backend-ip:8000
```

---

## Backend

This app requires the trained YOLOv8 verification backend to be running.
See the [fishing-kit-poc](../fishing-kit-poc) repo for setup and training instructions.
