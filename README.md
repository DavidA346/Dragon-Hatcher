# 🐉 Dragon Hatcher – A Mobile Clicker Game

## Project Overview

**Dragon Hatcher** is a mobile game built using React Native and Expo that engages users in raising dragons from eggs to adulthood. The game features time-based progression, global state management, sprite animations, and persistent data storage to deliver an interactive and immersive user experience. Players begin with dragon eggs and watch them hatch into baby and then adult dragons over time. The game's real-time lifecycle progression encourages players to return regularly, while intuitive controls and engaging animations make the experience fun and rewarding. The architecture was designed with scalability in mind, allowing easy addition of new dragon types, lifecycle stages, and animations.

---

## Features

- **Time-Based Lifecycle Mechanics**: Dragons grow from eggs to babies to adults over real time
- **Global State Management**: Zustand ensures consistent behavior across components
- **Data Persistence**: AsyncStorage retains user progress even after app restarts
- **Robust Testing**: Jest unit tests validate game logic and state transitions
- **Scalable Asset Pipeline**: Easily supports multiple dragon types and sprite stages
- **Built with Expo**: Simple setup and cross-platform mobile development

---

## Tech Stack

| Area         | Tools & Libraries                         |
|--------------|--------------------------------------------|
| Frontend     | React Native (Expo), JavaScript            |
| State Mgmt   | Zustand                                    |
| Persistence  | AsyncStorage                               |
| Testing      | Jest                                       |
| Version Ctrl | Git, GitHub                                |

---

## Prerequisites

Before running the game, ensure the following are installed:

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A mobile emulator or Expo Go app on your phone

---

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/DavidA346/Dragon-Hatcher.git
cd Dragon-Hatcher
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npx expo start
```

4. **Launch the App**
  - Scan the QR code with Expo Go (on iOS or Android)
  - Or run on emulator via:
  ```bash
  npx expo start --android
  npx expo start --ios
  ```

