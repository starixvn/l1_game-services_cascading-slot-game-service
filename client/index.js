/**
 * Cascading Slot Game Client
 *
 * Standalone client application for connecting to and playing the cascading slot game.
 * Supports real-time socket communication for the complete game flow:
 * signin -> ingame -> placebet -> endgame
 */

export { default as GameClient } from "./game-client.js";
export { GAME_SCENARIOS, BET_CONFIGS, USER_PROFILES, GameScenarioUtils } from "./game-scenarios.js";

// Re-export for convenience
export const SOCKET_EVENTS = {
    SIGNIN: "signin",
    INGAME: "ingame",
    BET: "bet",
    ENDGAME: "endgame",
};

export const GAME_FLOW_STEPS = [SOCKET_EVENTS.SIGNIN, SOCKET_EVENTS.INGAME, SOCKET_EVENTS.BET, SOCKET_EVENTS.ENDGAME];

/**
 * Create a game client instance
 */
export function createGameClient(user, options = {}) {
    const { default: GameClient } = require("./game-client.js");
    return new GameClient(user, options);
}

/**
 * Play a complete game session
 */
export async function playGame(user, betConfig = null, options = {}) {
    const { BET_CONFIGS } = require("./game-scenarios.js");

    const client = createGameClient(user, options);
    const finalBetConfig = betConfig || BET_CONFIGS.CONSERVATIVE;

    try {
        const result = await client.executeFullGameFlow(finalBetConfig);
        return result;
    } finally {
        client.cleanup();
    }
}

/**
 * Play with a specific game scenario
 */
export async function playWithScenario(scenarioName, user, betConfig = null, options = {}) {
    const { GAME_SCENARIOS, BET_CONFIGS } = require("./game-scenarios.js");

    if (!GAME_SCENARIOS[scenarioName]) {
        throw new Error(`Unknown scenario: ${scenarioName}. Available: ${Object.keys(GAME_SCENARIOS).join(", ")}`);
    }

    const client = createGameClient(user, options);
    const finalBetConfig = betConfig || BET_CONFIGS.CONSERVATIVE;

    try {
        // Try to set up the scenario board (requires IGT API)
        const scenario = GAME_SCENARIOS[scenarioName];
        const boardResult = await client.setCustomBoard(scenario.board);

        if (!boardResult.success && options.enableLogs !== false) {
            console.warn(`Could not set custom board for scenario ${scenarioName}. Playing with random board.`);
        }

        // Execute the full game flow
        const result = await client.executeFullGameFlow(finalBetConfig);

        return {
            scenario: scenario.name,
            description: scenario.description,
            boardSet: boardResult.success,
            gameResult: result,
        };
    } finally {
        client.cleanup();
    }
}

// Legacy aliases for backwards compatibility
export const quickPlay = playGame;
export const playScenario = playWithScenario;
