/**
 * Predefined game scenarios for the cascading slot game client
 */

export const GAME_SCENARIOS = {
    // Standard game outcomes
    NORMAL_GAME: {
        name: "Normal Game",
        description: "Standard game with typical symbol distribution",
        board: {
            base: {
                board: [1, 0, 1, 2, 4, 8, 1, 6, 4, 4, 3, 1, 1, 4, 6, 6, 4, 2, 7, 2, 0, 6, 0, 5, 3, 3, 0, 6, 1, 0],
                multipliers: [],
            },
            tumbles: [],
        },
    },

    BIG_WIN: {
        name: "Big Win Scenario",
        description: "Scenario designed to trigger big win condition",
        board: {
            base: {
                board: [1, 3, 2, 2, 1, 2, 1, 3, 3, 3, 3, 2, 3, 3, 0, 2, 2, 1, 3, 3, 3, 2, 2, 3, 2, 1, 2, 0, 1, 0],
                multipliers: [],
            },
            tumbles: [
                {
                    newSymbols: [3, 2, 3, 10, 3, 3, 3, 2, 3, 3, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 3],
                    multipliers: [6],
                },
                {
                    newSymbols: [9, 6, 5, 4, 0, 4, 0, 3, 7, 5, 8, 7, 0, 8, 3, 4, 6, 2, 8, 2],
                    multipliers: [],
                },
            ],
        },
    },

    MULTIPLIER_WIN: {
        name: "Multiplier Win",
        description: "Scenario with multiplier symbols (2x)",
        board: {
            base: {
                board: [1, 3, 2, 2, 1, 2, 1, 3, 3, 3, 3, 2, 3, 3, 0, 2, 2, 1, 3, 3, 3, 2, 2, 3, 2, 1, 2, 0, 1, 0],
                multipliers: [],
            },
            tumbles: [
                {
                    newSymbols: [3, 2, 3, 10, 3, 3, 3, 2, 3, 3, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 3],
                    multipliers: [2],
                },
                {
                    newSymbols: [9, 6, 5, 4, 0, 4, 0, 3, 7, 5, 8, 7, 0, 8, 3, 4, 6, 2, 8, 2],
                    multipliers: [],
                },
            ],
        },
    },

    HIGH_MULTIPLIER: {
        name: "High Multiplier Win",
        description: "Scenario with very high multiplier (50x)",
        board: {
            base: {
                board: [1, 3, 2, 2, 1, 2, 1, 3, 3, 3, 3, 2, 3, 3, 0, 2, 2, 1, 3, 3, 3, 2, 2, 3, 2, 1, 2, 0, 1, 0],
                multipliers: [],
            },
            tumbles: [
                {
                    newSymbols: [3, 2, 3, 10, 3, 3, 3, 2, 3, 3, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 3],
                    multipliers: [10],
                },
                {
                    newSymbols: [9, 6, 5, 4, 0, 4, 0, 3, 7, 5, 8, 7, 0, 8, 3, 4, 6, 2, 8, 2],
                    multipliers: [5],
                },
            ],
        },
    },

    FREE_SPIN: {
        name: "Free Spin Trigger",
        description: "Scenario that triggers free spin features",
        board: {
            base: {
                board: [2, 3, 9, 3, 1, 4, 4, 4, 4, 0, 2, 4, 3, 9, 1, 0, 0, 1, 0, 2, 0, 9, 2, 9, 3, 3, 1, 3, 1, 0],
                multipliers: [],
            },
            tumbles: [],
        },
    },

    CASCADING_WIN: {
        name: "Multiple Cascading Wins",
        description: "Scenario with multiple cascading wins and high multipliers",
        board: {
            base: {
                board: [8, 8, 8, 8, 8, 8, 8, 8, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6],
                multipliers: [],
            },
            tumbles: [
                {
                    newSymbols: [7, 7, 7, 7, 7, 7, 7, 7, 1, 2],
                    multipliers: [2],
                },
                {
                    newSymbols: [6, 6, 6, 6, 6, 6, 6, 6],
                    multipliers: [4],
                },
                {
                    newSymbols: [5, 5, 5, 5, 5, 5, 5, 5],
                    multipliers: [8],
                },
            ],
        },
    },

    NO_WIN: {
        name: "No Win",
        description: "Scenario with no winning combinations",
        board: {
            base: {
                board: [0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2],
                multipliers: [],
            },
            tumbles: [],
        },
    },
};

/**
 * Common bet configurations for different play styles
 */
export const BET_CONFIGS = {
    CONSERVATIVE: {
        name: "Conservative Play",
        betLevel: 1,
        coinValue: 1,
        freeSpin: false,
        description: "Safe betting with minimum stakes",
    },

    MODERATE: {
        name: "Moderate Play",
        betLevel: 3,
        coinValue: 5,
        freeSpin: false,
        description: "Balanced betting for steady play",
    },

    AGGRESSIVE: {
        name: "Aggressive Play",
        betLevel: 7,
        coinValue: 20,
        freeSpin: false,
        description: "High-risk, high-reward betting",
    },

    MAXIMUM: {
        name: "Maximum Bet",
        betLevel: 10,
        coinValue: 100,
        freeSpin: false,
        description: "Maximum possible bet amount",
    },

    FREE_SPIN: {
        name: "Free Spin",
        betLevel: 1,
        coinValue: 1,
        freeSpin: true,
        description: "Free spin bet (no cost)",
    },
};

/**
 * User profile types for different play styles
 */
export const USER_PROFILES = {
    CASUAL_PLAYER: {
        playerId: "player_001",
        playerName: "CasualGamer",
        currency: "USD",
        description: "New player with standard settings",
    },

    HIGH_ROLLER: {
        playerId: "player_002",
        playerName: "HighRoller",
        currency: "USD",
        description: "Experienced player who bets big",
    },

    BONUS_PLAYER: {
        playerId: "player_003",
        playerName: "BonusHunter",
        currency: "USD",
        description: "Player focused on bonus features",
    },

    VIP_PLAYER: {
        playerId: "vip_001",
        playerName: "VIPGamer",
        currency: "USD",
        description: "VIP player with maximum betting privileges",
    },
};

/**
 * Utility functions for game scenarios
 */
export class GameScenarioUtils {
    /**
     * Get a game scenario by name
     */
    static getScenario(scenarioName) {
        const scenario = GAME_SCENARIOS[scenarioName];
        if (!scenario) {
            throw new Error(`Unknown game scenario: ${scenarioName}. Available: ${Object.keys(GAME_SCENARIOS).join(", ")}`);
        }
        return scenario;
    }

    /**
     * Get a bet configuration by name
     */
    static getBetConfig(configName) {
        const config = BET_CONFIGS[configName];
        if (!config) {
            throw new Error(`Unknown bet configuration: ${configName}. Available: ${Object.keys(BET_CONFIGS).join(", ")}`);
        }
        return { ...config };
    }

    /**
     * Get user profile by name
     */
    static getUserProfile(profileName) {
        const profile = USER_PROFILES[profileName];
        if (!profile) {
            throw new Error(`Unknown user profile: ${profileName}. Available: ${Object.keys(USER_PROFILES).join(", ")}`);
        }
        return { ...profile };
    }

    /**
     * Calculate expected bet amount
     */
    static calculateBetAmount(betConfig, betMultiplier = 20) {
        return betConfig.betLevel * betConfig.coinValue * betMultiplier;
    }

    /**
     * Generate random user profile
     */
    static generateRandomUser() {
        const randomId = Math.floor(Math.random() * 100000);
        return {
            playerId: `player${randomId}`,
            playerName: `Player${randomId}`,
            description: "Randomly generated player",
        };
    }

    /**
     * List all available scenarios
     */
    static listScenarios() {
        return Object.keys(GAME_SCENARIOS).map((key) => ({
            key,
            name: GAME_SCENARIOS[key].name,
            description: GAME_SCENARIOS[key].description,
        }));
    }

    /**
     * List all bet configurations
     */
    static listBetConfigs() {
        return Object.keys(BET_CONFIGS).map((key) => ({
            key,
            ...BET_CONFIGS[key],
        }));
    }

    /**
     * Validate bet configuration against game limits
     */
    static validateBetConfig(betConfig, gameConfigs) {
        const errors = [];

        if (!gameConfigs) {
            return ["No game configuration available for validation"];
        }

        if (!gameConfigs.betLevels.includes(betConfig.betLevel)) {
            errors.push(`Invalid bet level: ${betConfig.betLevel}. Valid levels: ${gameConfigs.betLevels.join(", ")}`);
        }

        if (!gameConfigs.coinValues.includes(betConfig.coinValue)) {
            errors.push(`Invalid coin value: ${betConfig.coinValue}. Valid values: ${gameConfigs.coinValues.join(", ")}`);
        }

        const totalBet = this.calculateBetAmount(betConfig, gameConfigs.betMultiplier);
        if (gameConfigs.maxWinPerRound && totalBet > gameConfigs.maxWinPerRound) {
            errors.push(`Total bet (${totalBet}) exceeds maximum win per round (${gameConfigs.maxWinPerRound})`);
        }

        return errors;
    }

    /**
     * Get recommended bet config based on game configuration
     */
    static getRecommendedBet(gameConfigs, riskLevel = "moderate") {
        if (!gameConfigs) {
            return BET_CONFIGS.CONSERVATIVE;
        }

        const { betLevels, coinValues } = gameConfigs;

        switch (riskLevel.toLowerCase()) {
            case "conservative":
            case "safe":
                return {
                    betLevel: Math.min(...betLevels),
                    coinValue: Math.min(...coinValues),
                    freeSpin: false,
                };

            case "aggressive":
            case "high":
                return {
                    betLevel: Math.max(...betLevels),
                    coinValue: Math.max(...coinValues),
                    freeSpin: false,
                };

            default: // moderate
                return {
                    betLevel: betLevels[Math.floor(betLevels.length / 2)],
                    coinValue: coinValues[Math.floor(coinValues.length / 2)],
                    freeSpin: false,
                };
        }
    }
}
