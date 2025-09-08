# Quick Start - Cascading Slot Game Client

## 🚀 Get Started in 2 Minutes

### 1. Play Instantly

```bash
npm run play
```

### 2. Interactive Game Menu

```bash
npm run client
```

### 3. Run Examples

```bash
# Simple game session
npm run client:simple

# Play different scenarios
npm run client:scenarios
```

### 4. Use Programmatically

```javascript
import { GameClient, USER_PROFILES, BET_CONFIGS } from "./client/index.js";

const client = new GameClient(USER_PROFILES.CASUAL_PLAYER);
const result = await client.executeFullGameFlow(BET_CONFIGS.CONSERVATIVE);
console.log("Game result:", result);
client.cleanup();
```

## 📋 What's Available

### User Profiles

-   `CASUAL_PLAYER` - New player
-   `HIGH_ROLLER` - Experienced player
-   `BONUS_PLAYER` - Player with bonuses

### Bet Strategies

-   `CONSERVATIVE` - Safe betting (Level 1, Coin 1)
-   `MODERATE` - Balanced play (Level 3, Coin 5)
-   `AGGRESSIVE` - High-risk (Level 7, Coin 20)
-   `MAXIMUM` - Maximum bet (Level 10, Coin 100)

### Game Scenarios

-   `BIG_WIN` - Big win condition scenario
-   `MULTIPLIER_WIN` - 2x multiplier scenario
-   `HIGH_MULTIPLIER` - 50x multiplier scenario
-   `FREE_SPIN` - Free spin trigger scenario
-   `CASCADING_WIN` - Multiple cascading wins (64x)

## 🎯 Quick Examples

```bash
# Instant game - just play!
npm run play

# Interactive game menu - choose your options
npm run client

# Simple automated session
npm run client:simple

# Play all predefined scenarios
npm run client:scenarios
```

## 🔧 Requirements

-   Game service running on `http://localhost:5001`
-   Node.js with ES6 modules support

## 📚 Full Documentation

See [README.md](./README.md) for complete API reference and advanced usage.
