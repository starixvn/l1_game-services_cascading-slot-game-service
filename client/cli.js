#!/usr/bin/env node --import=extensionless/register

/**
 * Interactive CLI for Cascading Slot Game Client
 *
 * Usage:
 * node --import=extensionless/register cli.js
 * npm run client
 */

import readline from "readline";
import { GameClient, GAME_SCENARIOS, USER_PROFILES, BET_CONFIGS, GameScenarioUtils } from "./index.js";

class InteractiveCLI {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        this.client = null;
        this.currentUser = null;
    }

    async start() {
        console.log("🎰 Welcome to Cascading Slot Game!");
        console.log("=".repeat(50));
        var sessionConfig = await this.showSessionConfiguration();
        await this.showMainMenu(sessionConfig);
    }

    async showSessionConfiguration() {
        console.log("\n🔧 Session Configuration");
        try {
            // Input user name
            const userName = await this.prompt("\n📝 Enter User Name: ");
            if (!userName.trim()) {
                console.log("❌ User Name cannot be empty.");
                return await this.showSessionConfiguration();
            }

            // Input sessionId
            const sessionId = await this.prompt("\n📝 Enter Session ID: ");
            if (!sessionId.trim()) {
                console.log("❌ Session ID cannot be empty.");
                return await this.showSessionConfiguration();
            }

            // Input game name
            const gameName = await this.prompt("\n🎮 Enter Game Name: ");
            if (!gameName.trim()) {
                console.log("❌ Game name cannot be empty.");
                return await this.showSessionConfiguration();
            }

            // Create session configuration
            const sessionConfig = {
                sessionId: sessionId.trim(),
                gameName: gameName.trim(),
                userName: userName.trim(),
            };

            console.log("\n✅ Session Configuration:");
            console.log(sessionConfig);

            return sessionConfig;

        } catch (error) {
            console.log("💥 Session configuration failed:", error.message);
            return await this.showSessionConfiguration();
        }
    }

    async showMainMenu(sessionConfig) {
        console.log("\n🎮 Game Menu:");
        console.log("1. Quick Play (Play a game session)");
        console.log("2. Scenario Play (Play with specific scenarios)");
        console.log("3. Manual Play (Control each step)");
        console.log("4. Game Information");
        console.log("5. Exit");

        const choice = await this.prompt("\nSelect option (1-5): ");

        switch (choice.trim()) {
            case "1":
                await this.quickPlay(sessionConfig);
                break;
            case "2":
                await this.scenarioPlay(sessionConfig);
                break;
            case "3":
                await this.manualPlay(sessionConfig);
                break;
            case "4":
                await this.viewGameInfo();
                break;
            case "5":
                console.log("👋 Goodbye!");
                this.rl.close();
                return;
            default:
                console.log("❌ Invalid option. Please try again.");
                await this.showMainMenu();
        }
    }

    async quickPlay(sessionConfig) {
        console.log("\n🚀 Quick Play Mode");
        console.log("-".repeat(30));

        // Select user
        const user = await this.selectUser();
        user.sessionId = sessionConfig.sessionId;
        user.userName = sessionConfig.userName;

        // Select bet configuration
        const betConfig = await this.selectBetConfig();

        console.log(`\n🎮 Starting game with ${user.playerName}, bet: Level ${betConfig.betLevel}, Coin ${betConfig.coinValue}`);

        const client = new GameClient(user, { enableLogs: true, gameName: sessionConfig.gameName });

        try {
            const result = await client.executeFullGameFlow(betConfig);
            this.displayGameResult(result);
        } catch (error) {
            console.log("💥 Game failed:", error.message);
        } finally {
            client.cleanup();
        }

        await this.returnToMenu();
    }

    async scenarioPlay(sessionConfig) {
        console.log("\n🎯 Scenario Play Mode");
        console.log("-".repeat(30));

        // Show and select scenario
        console.log("\n📋 Available Scenarios:");
        const scenarios = Object.keys(GAME_SCENARIOS);
        scenarios.forEach((key, index) => {
            console.log(`${index + 1}. ${GAME_SCENARIOS[key].name} - ${GAME_SCENARIOS[key].description}`);
        });

        const scenarioIndex = await this.prompt(`\nSelect scenario (1-${scenarios.length}): `);
        const scenarioKey = scenarios[parseInt(scenarioIndex) - 1];

        if (!scenarioKey) {
            console.log("❌ Invalid scenario selection.");
            return await this.scenarioTesting();
        }

        // Select user and bet config
        const user = await this.selectUser();
        user.userName = sessionConfig.userName;
        user.sessionId = sessionConfig.sessionId;
        const betConfig = await this.selectBetConfig();

        console.log(`\n🎮 Testing scenario: ${GAME_SCENARIOS[scenarioKey].name}`);

        const client = new GameClient(user, { enableLogs: true, gameName: sessionConfig.gameName });

        try {
            // Set scenario board
            const scenario = GAME_SCENARIOS[scenarioKey];
            const boardResult = await client.setCustomBoard(scenario.board);

            if (boardResult.success) {
                console.log("✅ Scenario board set successfully");
            } else {
                console.log("⚠️ Could not set scenario board - using random outcome");
            }

            const result = await client.executeFullGameFlow(betConfig);
            this.displayGameResult(result);
        } catch (error) {
            console.log("💥 Scenario test failed:", error.message);
        } finally {
            client.cleanup();
        }

        await this.returnToMenu();
    }

    async manualPlay(sessionConfig) {
        console.log("\n👣 Manual Play Mode");
        console.log("-".repeat(30));

        const user = await this.selectUser();
        user.userName = sessionConfig.userName;
        user.sessionId = sessionConfig.sessionId;
        this.client = new GameClient(user, { enableLogs: true, gameName: sessionConfig.gameName });
        this.currentUser = user;

        try {
            console.log(`\n🎮 Connected as ${user.playerName}`);

            // Step 1: Sign in
            console.log("\n1️⃣ Signing in...");
            const signinResult = await this.client.signIn();
            console.log(signinResult.success ? "✅ Signed in successfully" : "❌ Sign in failed");

            // Step 2: Enter game
            console.log("\n2️⃣ Entering game...");
            const ingameResult = await this.client.enterGame();
            if (ingameResult.success) {
                console.log("✅ Entered game successfully");
                this.displayGameConfigs(ingameResult.data.gameConfigs);
            } else {
                console.log("❌ Failed to enter game");
                return;
            }

            // Step 3: Place bet
            console.log("\n3️⃣ Ready to place bet");
            const betConfig = await this.selectBetConfig(ingameResult.data.gameConfigs);

            console.log(`\n💰 Placing bet: Level ${betConfig.betLevel}, Coin ${betConfig.coinValue}`);
            const betResult = await this.client.placeBet(betConfig);

            if (betResult.success) {
                console.log(`✅ Bet placed successfully! Amount: ${betResult.data.endBet}`);
                console.log(`   Bet Data: ${JSON.stringify(betResult.data, null, 2)}`);

                // Step 4: End game (show results)
                console.log("\n4️⃣ Processing game results...");
                const endResult = await this.client.endGame();

                if (endResult.success) {
                    console.log("✅ Game completed!");
                    this.displayEndGameResult(endResult.data);
                } else {
                    console.log("❌ Failed to end game");
                }
            } else {
                console.log(`❌ Bet placement failed!`);
                console.log(`   Error: ${JSON.stringify(betResult.error, null, 2)}`);
                console.log(`   Data: ${JSON.stringify(betResult.data, null, 2)}`);
                console.log(`\n⚠️  Cannot continue with endgame - bet failed`);
            }
        } catch (error) {
            console.log("💥 Step-by-step play failed:", error.message);
        } finally {
            this.client.cleanup();
            this.client = null;
            this.currentUser = null;
        }

        await this.returnToMenu();
    }

    async viewGameInfo() {
        console.log("\n📊 Game Information");
        console.log("-".repeat(30));

        console.log("\n👥 Available User Profiles:");
        Object.entries(USER_PROFILES).forEach(([key, user]) => {
            console.log(`   ${user.playerName} (${user.playerId}) - ${user.description}`);
        });

        console.log("\n💰 Bet Configurations:");
        Object.entries(BET_CONFIGS).forEach(([key, config]) => {
            const amount = GameScenarioUtils.calculateBetAmount(config);
            console.log(`   ${config.name}: Level ${config.betLevel}, Coin ${config.coinValue} (Total: ${amount}) - ${config.description}`);
        });

        console.log("\n🎯 Available Scenarios:");
        Object.entries(GAME_SCENARIOS).forEach(([key, scenario]) => {
            console.log(`   ${scenario.name} - ${scenario.description}`);
        });

        await this.returnToMenu();
    }

    async selectUser() {
        console.log("\n👤 Select User Profile:");
        const users = Object.entries(USER_PROFILES);
        users.forEach(([key, user], index) => {
            console.log(`${index + 1}. ${user.playerName} - ${user.description}`);
        });

        const choice = await this.prompt(`\nSelect user (1-${users.length}): `);
        const userEntry = users[parseInt(choice) - 1];

        if (!userEntry) {
            console.log("❌ Invalid user selection.");
            return await this.selectUser();
        }

        return userEntry[1];
    }

    async selectBetConfig(gameConfigs = null) {
        console.log("\n💰 Select Bet Configuration:");
        const configs = Object.entries(BET_CONFIGS);
        configs.forEach(([key, config], index) => {
            const amount = GameScenarioUtils.calculateBetAmount(config);
            console.log(`${index + 1}. ${config.name} (Level ${config.betLevel}, Coin ${config.coinValue}, Total: ${amount})`);
        });

        const choice = await this.prompt(`\nSelect bet config (1-${configs.length}): `);
        const configEntry = configs[parseInt(choice) - 1];

        if (!configEntry) {
            console.log("❌ Invalid bet configuration selection.");
            return await this.selectBetConfig(gameConfigs);
        }

        const selectedConfig = { ...configEntry[1] };
        delete selectedConfig.name;
        delete selectedConfig.description;

        // Validate against game configs if available
        if (gameConfigs) {
            const errors = GameScenarioUtils.validateBetConfig(selectedConfig, gameConfigs);
            if (errors.length > 0) {
                console.log("⚠️ Bet configuration warnings:");
                errors.forEach((error) => console.log(`   ${error}`));
            }
        }

        return selectedConfig;
    }

    displayGameConfigs(gameConfigs) {
        console.log("\n📋 Game Configuration:");
        console.log(`   Bet Levels: [${gameConfigs.betLevels.join(", ")}]`);
        console.log(`   Coin Values: [${gameConfigs.coinValues.join(", ")}]`);
        console.log(`   Bet Multiplier: ${gameConfigs.betMultiplier}x`);
        console.log(`   Max Win Per Round: ${gameConfigs.maxWinPerRound}`);
    }

    displayEndGameResult(result) {
        console.log("\n🎰 Game Results:");
        console.log(`   🏆 Win Amount: ${result.win || 0}`);
        console.log(`   ⭐ Big Win: ${result.bigWin ? "🎉 YES!" : "No"}`);
        console.log(`   📈 Multiplier: ${result.multiplier || 0}x`);
        console.log(`   🎁 Free Spins: ${result.freeSpins || 0}`);
        console.log(`   💎 Total Win: ${result.totalWin || 0}`);
    }

    displayGameResult(result) {
        if (!result.success) {
            console.log("❌ Game failed:", result.error);
            return;
        }

        console.log("\n🎰 Complete Game Results:");
        console.log("=".repeat(40));

        const betStep = result.steps.find((step) => step.event === "bet");
        const endStep = result.steps.find((step) => step.event === "endgame");

        if (betStep && endStep) {
            const profit = (endStep.data.win || 0) - betStep.data.endBet;

            console.log(`💰 Bet Amount: ${betStep.data.endBet}`);
            console.log(`🏆 Win Amount: ${endStep.data.win || 0}`);
            console.log(`📊 Net Result: ${profit > 0 ? "+" : ""}${profit} (${profit > 0 ? "✅ PROFIT" : "❌ LOSS"})`);
            console.log(`⭐ Big Win: ${endStep.data.bigWin ? "🎉 YES!" : "No"}`);
            console.log(`📈 Multiplier: ${endStep.data.multiplier || 0}x`);
            console.log(`🎁 Free Spins: ${endStep.data.freeSpins || 0}`);
            console.log(`\n📄 Detailed Bet Data: ${JSON.stringify(betStep.data, null, 2)}`);
            console.log(`\n📄 Detailed End Game Data: ${JSON.stringify(endStep.data, null, 2)}`);
        }
    }

    async returnToMenu() {
        await this.prompt("\nPress Enter to return to main menu...");
        await this.showMainMenu();
    }

    prompt(question) {
        return new Promise((resolve) => {
            this.rl.question(question, resolve);
        });
    }

    close() {
        if (this.client) {
            this.client.cleanup();
        }
        this.rl.close();
    }
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const cli = new InteractiveCLI();

    // Handle graceful shutdown
    process.on("SIGINT", () => {
        console.log("\n\n👋 Goodbye!");
        cli.close();
        process.exit(0);
    });

    cli.start().catch(console.error);
} else {
    // Alternative check for direct execution
    const isMainModule = process.argv[1] && process.argv[1].includes("cli.js");

    if (isMainModule) {
        const cli = new InteractiveCLI();

        // Handle graceful shutdown
        process.on("SIGINT", () => {
            console.log("\n\n👋 Goodbye!");
            cli.close();
            process.exit(0);
        });

        cli.start().catch(console.error);
    }
}

export default InteractiveCLI;
