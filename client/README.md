# Cascading Slot Game Client

A standalone client application for connecting to and playing the cascading slot game. This client provides real-time socket communication for the complete game flow: **signin → ingame → placebet → endgame**.

## Features

-   **Real-time Socket Communication**: Direct connection to game server
-   **Complete Game Flow**: Full support for signin, ingame, betting, and results
-   **Scenario Testing**: Predefined scenarios for testing specific outcomes
-   **Interactive CLI**: Command-line interface for easy testing
-   **Multiple User Profiles**: Different player types for various test scenarios
-   **Flexible Bet Configurations**: From conservative to aggressive betting strategies
-   **Event History Tracking**: Complete audit trail of all game events
-   **Custom Board Support**: Set specific game outcomes (when IGT API is available)

## Quick Start

### Installation

The client requires Node.js and the game service dependencies:

```bash
# Install dependencies (if not already installed)
npm install
```

### Basic Usage

```javascript
import { GameClient, USER_PROFILES, BET_CONFIGS } from "./client/index.js";

// Create a game client
const client = new GameClient(USER_PROFILES.CASUAL_PLAYER, {
    enableLogs: true,
    gameServer: {
        socketUri: "http://localhost:5001/user/treasureisland",
        proxyRoute: "/socket.io",
        gameName: "TreasureIsland",
    },
});

try {
    // Play a complete game session
    const result = await client.executeFullGameFlow(BET_CONFIGS.CONSERVATIVE);
    console.log("Game completed:", result.success);
} finally {
    client.cleanup();
}
```

### Interactive CLI

Run the interactive command-line interface:

```bash
npm run client
# or directly:
node --import=extensionless/register client/cli.js
```

The CLI provides options for:

-   **Quick Play**: Simple game session with user and bet selection
-   **Scenario Testing**: Test specific game outcomes
-   **Step-by-Step Play**: Manual control over each game step
-   **Game Information**: View available configurations and scenarios

### Example Scripts

Run the provided examples:

```bash
# Simple client example
npm run client:simple
# or directly:
node --import=extensionless/register client/examples/simple-client.js

# Scenario testing example
npm run client:scenarios
# or directly:
node --import=extensionless/register client/examples/scenario-client.js
```

## API Reference

### GameClient

#### Constructor

```javascript
new GameClient(user, (options = {}));
```

**Parameters:**

-   `user`: User profile object with `playerId` and `playerName`
-   `options`: Configuration options:
    -   `autoConnect: boolean` (default: true) - Auto-connect on creation
    -   `timeout: number` (default: 10000) - Socket timeout in ms
    -   `enableLogs: boolean` (default: true) - Enable console logging
    -   `gameServer: object` - Server connection settings

#### Main Methods

##### `executeFullGameFlow(betOptions)`

Execute complete game: signin → ingame → placebet → endgame

```javascript
const result = await client.executeFullGameFlow({
    betLevel: 1, // Bet level (1-10)
    coinValue: 1, // Coin value (1, 2, 5, 10, 20, 50, 100)
    freeSpin: false, // Is this a free spin bet
});
```

##### `signIn()`

Authenticate user and establish session

##### `enterGame()`

Enter game and receive configuration

##### `placeBet(betOptions)`

Place a bet with specified parameters

##### `endGame()`

Process game results and finalize round

#### Utility Methods

##### `setCustomBoard(boardResult)`

Set specific game outcome (requires IGT API)

##### `getGameState()`

Get current game state and session info

##### `getEventHistory()`

Get complete event history with timestamps

##### `getAvailableBetConfigs()`

Get bet configurations based on game limits

##### `calculateTotalBet(betLevel, coinValue)`

Calculate total bet amount

##### `cleanup()`

Clean up resources and close connections

### User Profiles

#### Available Profiles

```javascript
import { USER_PROFILES } from "./client/index.js";

// Available user profiles
USER_PROFILES.CASUAL_PLAYER; // New player with standard settings
USER_PROFILES.HIGH_ROLLER; // Experienced player who bets big
USER_PROFILES.BONUS_PLAYER; // Player with existing bonuses
```

#### Custom User Profile

```javascript
const customUser = {
    playerId: "user123",
    playerName: "MyPlayer",
};
```

### Bet Configurations

#### Predefined Configurations

```javascript
import { BET_CONFIGS } from "./client/index.js";

BET_CONFIGS.CONSERVATIVE; // Safe betting (Level 1, Coin 1)
BET_CONFIGS.MODERATE; // Balanced play (Level 3, Coin 5)
BET_CONFIGS.AGGRESSIVE; // High-risk play (Level 7, Coin 20)
BET_CONFIGS.MAXIMUM; // Maximum bet (Level 10, Coin 100)
BET_CONFIGS.FREE_SPIN; // Free spin configuration
```

#### Custom Bet Configuration

```javascript
const customBet = {
    betLevel: 5, // 1-10
    coinValue: 10, // 1, 2, 5, 10, 20, 50, 100
    freeSpin: false, // true for free spins
};
```

### Game Scenarios

#### Available Scenarios

```javascript
import { GAME_SCENARIOS } from "./client/index.js";

GAME_SCENARIOS.NORMAL_GAME; // Standard game with typical outcomes
GAME_SCENARIOS.BIG_WIN; // Scenario that triggers big win
GAME_SCENARIOS.MULTIPLIER_WIN; // Scenario with multiplier (2x)
GAME_SCENARIOS.HIGH_MULTIPLIER; // Scenario with high multiplier (50x)
GAME_SCENARIOS.FREE_SPIN; // Scenario that triggers free spins
GAME_SCENARIOS.CASCADING_WIN; // Multiple cascading wins (64x multiplier)
GAME_SCENARIOS.NO_WIN; // Scenario with no wins
```

#### Using Scenarios

```javascript
// Set a scenario before playing
const client = new GameClient(user);
await client.setCustomBoard(GAME_SCENARIOS.BIG_WIN.board);

// Or use the convenience function
import { playScenario } from "./client/index.js";
const result = await playScenario("BIG_WIN", user, BET_CONFIGS.MODERATE);
```

### Utility Functions

#### GameScenarioUtils

```javascript
import { GameScenarioUtils } from "./client/index.js";

// List available scenarios
const scenarios = GameScenarioUtils.listScenarios();

// List bet configurations
const betConfigs = GameScenarioUtils.listBetConfigs();

// Validate bet against game limits
const errors = GameScenarioUtils.validateBetConfig(betConfig, gameConfigs);

// Get recommended bet for risk level
const recommendedBet = GameScenarioUtils.getRecommendedBet(gameConfigs, "moderate");

// Calculate bet amount
const amount = GameScenarioUtils.calculateBetAmount(betConfig);

// Generate random user
const randomUser = GameScenarioUtils.generateRandomUser();
```

#### Convenience Functions

```javascript
import { quickPlay, playScenario, createGameClient } from "./client/index.js";

// Quick play session
const result = await quickPlay(user, BET_CONFIGS.CONSERVATIVE);

// Play specific scenario
const scenarioResult = await playScenario("BIG_WIN", user);

// Create client with default settings
const client = createGameClient(user);
```

## Configuration

### Server Configuration

```javascript
const client = new GameClient(user, {
    gameServer: {
        socketUri: "http://localhost:5001/user/treasureisland", // Game server URL
        proxyRoute: "/socket.io", // Socket.io path
        gameName: "TreasureIsland", // Game name
        igtApiUrl: "http://localhost:5001/igt-api/set-board", // IGT API for custom boards
    },
});
```

### Default Configuration

-   **Socket URI**: `http://localhost:5001/user/treasureisland`
-   **Proxy Route**: `/socket.io`
-   **Game Name**: `TreasureIsland`
-   **Auto Connect**: `true`
-   **Enable Logs**: `true`
-   **Timeout**: `10000ms`

## Game Flow

The client follows this communication pattern:

1. **Connect** → Establish socket connection to game server
2. **Sign In** → Authenticate user and create session
3. **Enter Game** → Get game configuration and current state
4. **Place Bet** → Send bet parameters and receive game results
5. **End Game** → Process final results and clean up

## Response Structure

### Sign In Response

```javascript
{
    success: true,
    event: "signin",
    data: { /* authentication data */ },
    state: { /* current game state */ }
}
```

### Game Entry Response

```javascript
{
    success: true,
    event: "ingame",
    data: {
        gameConfigs: {
            coinValues: [1, 2, 5, 10, 20, 50, 100],
            betLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            betMultiplier: 20,
            maxWinPerRound: 50000,
            odds: { /* game odds configuration */ }
        },
        totalMultiplier: 0,
        freeSpins: 0
    }
}
```

### Bet Response

```javascript
{
    success: true,
    event: "bet",
    data: {
        endBet: 200,
        finish: {
            result: "1,2,3,4,5...",  // Game board result
            win: 100,                // Win amount
            bigWin: false,           // Big win flag
            multiplier: 2,           // Multiplier achieved
            freeSpins: 0,            // Free spins won
            totalWin: 100            // Total win amount
        }
    },
    betOptions: { /* bet configuration used */ }
}
```

## Examples

### Example 1: Basic Game Session

```javascript
import { GameClient, USER_PROFILES, BET_CONFIGS } from "./client/index.js";

async function basicGame() {
    const client = new GameClient(USER_PROFILES.CASUAL_PLAYER);

    try {
        const result = await client.executeFullGameFlow(BET_CONFIGS.CONSERVATIVE);

        if (result.success) {
            console.log("Game completed successfully!");

            const betStep = result.steps.find((s) => s.event === "bet");
            const endStep = result.steps.find((s) => s.event === "endgame");

            console.log(`Bet: ${betStep.data.endBet}`);
            console.log(`Win: ${endStep.data.win || 0}`);
            console.log(`Profit: ${(endStep.data.win || 0) - betStep.data.endBet}`);
        }
    } finally {
        client.cleanup();
    }
}
```

### Example 2: Step-by-Step Control

```javascript
async function stepByStepGame() {
    const client = new GameClient(USER_PROFILES.HIGH_ROLLER);

    try {
        // Step 1: Sign in
        await client.signIn();
        console.log("Signed in:", client.getGameState().signedIn);

        // Step 2: Enter game
        const gameResult = await client.enterGame();
        console.log("Game configs:", gameResult.data.gameConfigs);

        // Step 3: Place bet
        const betResult = await client.placeBet({
            betLevel: 5,
            coinValue: 10,
            freeSpin: false,
        });
        console.log("Bet placed:", betResult.data.endBet);

        // Step 4: Get results
        const endResult = await client.endGame();
        console.log("Game results:", endResult.data);
    } finally {
        client.cleanup();
    }
}
```

### Example 3: Scenario Testing

```javascript
import { playScenario } from "./client/index.js";

async function testScenarios() {
    const scenarios = ["BIG_WIN", "MULTIPLIER_WIN", "FREE_SPIN"];
    const user = USER_PROFILES.HIGH_ROLLER;

    for (const scenario of scenarios) {
        console.log(`Testing ${scenario}...`);

        const result = await playScenario(scenario, user, BET_CONFIGS.MODERATE);

        if (result.gameResult.success) {
            const endStep = result.gameResult.steps.find((s) => s.event === "endgame");
            console.log(`${scenario}: Win ${endStep.data.win}, Multiplier ${endStep.data.multiplier}x`);
        }
    }
}
```

### Example 4: Custom Board Testing

```javascript
async function customBoardTest() {
    const client = new GameClient(USER_PROFILES.BONUS_PLAYER);

    try {
        // Set custom board for specific outcome
        await client.setCustomBoard({
            base: {
                board: [8, 8, 8, 8, 8, 8, 8, 8, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6],
                multipliers: [],
            },
            tumbles: [
                {
                    newSymbols: [7, 7, 7, 7, 7, 7, 7, 7],
                    multipliers: [10],
                },
            ],
        });

        // Play with the custom board
        const result = await client.executeFullGameFlow(BET_CONFIGS.AGGRESSIVE);
        console.log("Custom board result:", result);
    } finally {
        client.cleanup();
    }
}
```

## Troubleshooting

### Common Issues

1. **Connection Failed**: Ensure game service is running on `localhost:5001`
2. **Authentication Error**: Check user profile format and server configuration
3. **Bet Rejected**: Validate bet parameters against game configuration limits
4. **Custom Board Failed**: IGT API might not be available or accessible

### Debug Mode

Enable detailed logging:

```javascript
const client = new GameClient(user, {
    enableLogs: true,
});
```

### Error Handling

```javascript
try {
    const result = await client.executeFullGameFlow(betConfig);
    // Handle success
} catch (error) {
    console.error("Game failed:", error.message);

    // Check which steps completed
    if (error.completedSteps) {
        console.log(`Completed ${error.completedSteps.length}/4 steps`);
    }

    // View error details
    console.log("Error details:", error);
} finally {
    client.cleanup();
}
```

## Requirements

-   Node.js (ES6 modules support)
-   Game service running on localhost:5001
-   Network access to game server
-   `sc-game-service-integration-utils` package

## License

This client application is part of the cascading slot game service project.
