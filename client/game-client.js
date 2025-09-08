import { GameClientDriver } from "sc-game-service-integration-utils";
import axios from "axios";

/**
 * Cascading Slot Game Client
 * A standalone client for connecting to the cascading slot game service
 */
export default class GameClient {
    constructor(user, options = {}) {
        this.user = user;
        this.options = {
            autoConnect: true,
            timeout: 10000,
            enableLogs: true,
            gameServer: {
                socketUri: "http://localhost:5001/user/treasureisland",
                proxyRoute: "/socket.io",
                gameName: "TreasureIsland",
            },
            ...options,
        };

        this.clientDriver = null;
        this.gameState = {
            signedIn: false,
            inGame: false,
            gameConfigs: null,
            currentBalance: 0,
            totalMultiplier: 0,
            lastBetResult: null,
            freeSpins: 0,
        };

        this.eventHistory = [];

        if (this.options.enableLogs) {
            console.log(`[GameClient] 🎰 Initializing Game Client`);
            console.log(`[GameClient] Logs enabled: ${this.options.enableLogs}`);
            console.log(`[GameClient] Auto-connect: ${this.options.autoConnect}`);
        }

        if (this.options.autoConnect) {
            this.connect();
        }
    }

    /**
     * Create user session data for real game connection
     */
    _createUserSession(user) {
        const timestamp = Date.now();
        return {
            session: `${user.playerId}-session-${timestamp}`,
            ss: `${user.playerId}-session-${timestamp}`,
            currency: user.currency || "USD",
            username: `${user.playerId}_${user.playerName}`,
            browserUserAgent: "cascading-slot-game-client/1.0",
            clientVersion: "1.0.0",
            timestamp: timestamp,
        };
    }

    /**
     * Establish connection to game server
     */
    connect() {
        if (this.clientDriver) {
            this.clientDriver.close();
        }

        const socketOptions = {
            socketUri: this.options.gameServer.socketUri,
            gameName: this.options.gameServer.gameName,
            proxyRoute: this.options.gameServer.proxyRoute,
        };

        if (this.options.enableLogs) {
            console.log(`[GameClient] Connecting to: ${socketOptions.socketUri}`);
            console.log(`[GameClient] Game: ${socketOptions.gameName}`);
            console.log(`[GameClient] User: ${this.user.playerName} (${this.user.playerId})`);
        }

        this.clientDriver = new GameClientDriver(socketOptions, this._createUserSession(this.user));

        if (this.options.enableLogs) {
            console.log(`[GameClient] ✅ Client driver created for user: ${this.user.playerName}`);
        }
    }

    /**
     * Close connection
     */
    disconnect() {
        if (this.clientDriver) {
            this.clientDriver.close();
            this.clientDriver = null;
        }
        this.gameState.signedIn = false;
        this.gameState.inGame = false;

        if (this.options.enableLogs) {
            console.log(`[GameClient] Disconnected user: ${this.user.playerName}`);
        }
    }

    /**
     * Step 1: Sign in to the game
     */
    async signIn() {
        if (!this.clientDriver) {
            throw new Error("Client not connected. Call connect() first.");
        }

        try {
            this._logEvent("signin", "Starting sign-in process");

            if (this.options.enableLogs) {
                console.log(`[GameClient] 📝 Attempting to sign in...`);
            }

            const result = await this.clientDriver.handleSignedInEvent();
            this.gameState.signedIn = true;

            this._logEvent("signin", "Sign-in successful", result);

            if (this.options.enableLogs) {
                console.log(`[GameClient] ✅ Sign-in successful!`);
            }

            return {
                success: true,
                event: "signin",
                data: result,
                state: { ...this.gameState },
            };
        } catch (error) {
            this._logEvent("signin", "Sign-in failed", error.message);

            if (this.options.enableLogs) {
                console.log(`[GameClient] ❌ Sign-in failed: ${error.message}`);
                console.log(`[GameClient] Error details:`, error);
            }

            throw new Error(`Sign-in failed: ${error.message}`);
        }
    }

    /**
     * Step 2: Enter game and get configurations
     */
    async enterGame() {
        if (!this.gameState.signedIn) {
            throw new Error("Must sign in before entering game");
        }

        try {
            this._logEvent("ingame", "Entering game");

            this.clientDriver.sendInGameEvent();
            const result = await this.clientDriver.handleGameEvent((inGameData) => inGameData);

            this.gameState.inGame = true;
            this.gameState.gameConfigs = result.gameConfigs;
            this.gameState.totalMultiplier = result.totalMultiplier || 0;
            this.gameState.freeSpins = result.freeSpins || 0;

            this._logEvent("ingame", "Entered game successfully", result);

            return {
                success: true,
                event: "ingame",
                data: result,
                state: { ...this.gameState },
            };
        } catch (error) {
            this._logEvent("ingame", "Enter game failed", error.message);
            throw new Error(`Enter game failed: ${error.message}`);
        }
    }

    /**
     * Step 3: Place a bet
     */
    async placeBet(betOptions = {}) {
        if (!this.gameState.inGame) {
            throw new Error("Must enter game before placing bet");
        }

        const defaultBetOptions = {
            betLevel: 1,
            coinValue: 1,
            freeSpin: false,
            totalBet: 20,
        };

        const bet = { ...defaultBetOptions, ...betOptions };

        try {
            this._logEvent("bet", "Placing bet", bet);

            this.clientDriver.emit("bet", bet);
            const result = await this.clientDriver.handleGameEvent((data) => data);

            this.gameState.lastBetResult = result;

            this._logEvent("bet", "Bet placed successfully", result);

            return {
                success: true,
                event: "bet",
                data: result,
                betOptions: bet,
                state: { ...this.gameState },
            };
        } catch (error) {
            this._logEvent("bet", "Place bet failed", error.message);
            throw new Error(`Place bet failed: ${error.message}`);
        }
    }

    /**
     * Step 4: Complete game (end game flow)
     */
    async endGame() {
        if (!this.gameState.lastBetResult) {
            throw new Error("No active game to end. Place a bet first.");
        }

        try {
            this._logEvent("endgame", "Ending game session");

            // In this game, the end game is typically when we receive the finish event
            const finishData = this.gameState.lastBetResult.finish;

            if (!finishData) {
                throw new Error("No finish data available");
            }

            const endGameResult = {
                result: finishData.result,
                win: finishData.win || 0,
                multiplier: finishData.multiplier || 0,
                bigWin: finishData.bigWin || false,
                freeSpins: finishData.freeSpins || 0,
                totalWin: finishData.totalWin || 0,
            };

            this._logEvent("endgame", "Game ended", endGameResult);

            return {
                success: true,
                event: "endgame",
                data: endGameResult,
                state: { ...this.gameState },
            };
        } catch (error) {
            this._logEvent("endgame", "End game failed", error.message);
            throw new Error(`End game failed: ${error.message}`);
        }
    }

    /**
     * Execute full game flow: signin -> ingame -> placebet -> endgame
     */
    async executeFullGameFlow(betOptions = {}) {
        const results = [];

        if (this.options.enableLogs) {
            console.log(`[GameClient] 🚀 Starting full game flow...`);
            console.log(`[GameClient] Bet options:`, betOptions);
        }

        try {
            // Step 1: Sign in
            if (this.options.enableLogs) {
                console.log(`[GameClient] Step 1/4: Sign-in`);
            }
            const signinResult = await this.signIn();
            results.push(signinResult);

            // Step 2: Enter game
            if (this.options.enableLogs) {
                console.log(`[GameClient] Step 2/4: Enter game`);
            }
            const ingameResult = await this.enterGame();
            results.push(ingameResult);

            // Step 3: Place bet
            if (this.options.enableLogs) {
                console.log(`[GameClient] Step 3/4: Place bet`);
            }
            const betResult = await this.placeBet(betOptions);
            results.push(betResult);

            // Step 4: End game
            if (this.options.enableLogs) {
                console.log(`[GameClient] Step 4/4: End game`);
            }
            const endgameResult = await this.endGame();
            results.push(endgameResult);

            const fullFlowResult = {
                success: true,
                flow: "signin -> ingame -> placebet -> endgame",
                steps: results,
                finalState: { ...this.gameState },
                eventHistory: [...this.eventHistory],
            };

            this._logEvent("fullflow", "Full game flow completed", fullFlowResult);

            if (this.options.enableLogs) {
                console.log(`[GameClient] 🎉 Full game flow completed successfully!`);
            }

            return fullFlowResult;
        } catch (error) {
            const errorResult = {
                success: false,
                flow: "signin -> ingame -> placebet -> endgame",
                error: error.message,
                completedSteps: results,
                eventHistory: [...this.eventHistory],
            };

            this._logEvent("fullflow", "Full game flow failed", errorResult);

            if (this.options.enableLogs) {
                console.log(`[GameClient] 💥 Full game flow failed: ${error.message}`);
                console.log(`[GameClient] Completed ${results.length}/4 steps`);
            }

            throw errorResult;
        }
    }

    /**
     * Set custom board result for testing specific scenarios (if IGT API is available)
     */
    async setCustomBoard(boardResult) {
        try {
            const igtApiUrl = this.options.gameServer.igtApiUrl || "http://localhost:5001/igt-api/set-board";

            await axios.post(igtApiUrl, {
                name: this.user.playerName,
                result: boardResult,
            });

            this._logEvent("setup", "Custom board set", boardResult);

            return { success: true, board: boardResult };
        } catch (error) {
            this._logEvent("setup", "Set custom board failed", error.message);
            console.warn(`Failed to set custom board: ${error.message}. This feature requires IGT API to be available.`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get current game state
     */
    getGameState() {
        return { ...this.gameState };
    }

    /**
     * Get event history
     */
    getEventHistory() {
        return [...this.eventHistory];
    }

    /**
     * Clear event history
     */
    clearEventHistory() {
        this.eventHistory = [];
    }

    /**
     * Get available bet configurations based on game config
     */
    getAvailableBetConfigs() {
        if (!this.gameState.gameConfigs) {
            return null;
        }

        const { coinValues, betLevels, betMultiplier } = this.gameState.gameConfigs;

        return {
            coinValues,
            betLevels,
            betMultiplier,
            // Generate some common bet configurations
            presets: {
                minimum: {
                    betLevel: Math.min(...betLevels),
                    coinValue: Math.min(...coinValues),
                    freeSpin: false,
                },
                medium: {
                    betLevel: betLevels[Math.floor(betLevels.length / 2)],
                    coinValue: coinValues[Math.floor(coinValues.length / 2)],
                    freeSpin: false,
                },
                maximum: {
                    betLevel: Math.max(...betLevels),
                    coinValue: Math.max(...coinValues),
                    freeSpin: false,
                },
            },
        };
    }

    /**
     * Calculate total bet amount
     */
    calculateTotalBet(betLevel, coinValue) {
        if (!this.gameState.gameConfigs) {
            return betLevel * coinValue * 20; // Default multiplier
        }
        return betLevel * coinValue * this.gameState.gameConfigs.betMultiplier;
    }

    /**
     * Private method to log events
     */
    _logEvent(event, message, data = null) {
        const eventEntry = {
            timestamp: new Date().toISOString(),
            event,
            message,
            data: data ? JSON.parse(JSON.stringify(data)) : null,
        };

        this.eventHistory.push(eventEntry);

        if (this.options.enableLogs) {
            console.log(`[${eventEntry.timestamp}] [${event.toUpperCase()}] ${message}`, data || "");
        }
    }

    /**
     * Cleanup method - should be called when done with client
     */
    cleanup() {
        this.disconnect();
        this.clearEventHistory();
        this.gameState = {
            signedIn: false,
            inGame: false,
            gameConfigs: null,
            currentBalance: 0,
            totalMultiplier: 0,
            lastBetResult: null,
            freeSpins: 0,
        };
    }
}
