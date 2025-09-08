/**
 * Scenario-based Game Client Example
 *
 * This example demonstrates how to use predefined scenarios to test
 * specific game outcomes like big wins, multipliers, and free spins.
 */

import { GameClient, GAME_SCENARIOS, USER_PROFILES, BET_CONFIGS, GameScenarioUtils } from "../index.js";

async function runScenarioClient() {
    console.log("🎰 Cascading Slot Game Client - Scenario Testing");
    console.log("=".repeat(60));

    // Show available scenarios
    console.log("\n📋 Available Scenarios:");
    const scenarios = GameScenarioUtils.listScenarios();
    scenarios.forEach((scenario, index) => {
        console.log(`${index + 1}. ${scenario.name} - ${scenario.description}`);
    });

    // Show available bet configs
    console.log("\n💰 Available Bet Configurations:");
    const betConfigs = GameScenarioUtils.listBetConfigs();
    betConfigs.forEach((config, index) => {
        const expectedBet = GameScenarioUtils.calculateBetAmount(config);
        console.log(
            `${index + 1}. ${config.name} (Level ${config.betLevel}, Coin ${config.coinValue}, Total: ${expectedBet}) - ${
                config.description
            }`
        );
    });

    // Test multiple scenarios
    const testScenarios = ["BIG_WIN", "MULTIPLIER_WIN", "FREE_SPIN", "NO_WIN"];
    const user = USER_PROFILES.HIGH_ROLLER;

    console.log(`\n👤 Testing with user: ${user.playerName}`);
    console.log("=".repeat(60));

    for (const scenarioName of testScenarios) {
        console.log(`\n🎯 Testing Scenario: ${GAME_SCENARIOS[scenarioName].name}`);
        console.log(`📝 Description: ${GAME_SCENARIOS[scenarioName].description}`);

        // Create new client for each scenario
        const client = new GameClient(user, {
            enableLogs: false, // Disable detailed logs for cleaner output
            gameServer: {
                socketUri: "http://localhost:5001/user/treasureisland",
                proxyRoute: "/socket.io",
                gameName: "TreasureIsland",
            },
        });

        try {
            // Set up scenario board
            const scenario = GAME_SCENARIOS[scenarioName];
            const boardResult = await client.setCustomBoard(scenario.board);

            if (boardResult.success) {
                console.log("✅ Custom board set successfully");
            } else {
                console.log("⚠️ Could not set custom board, using random board");
            }

            // Play the game with moderate betting
            const gameResult = await client.executeFullGameFlow(BET_CONFIGS.MODERATE);

            if (gameResult.success) {
                // Extract key information
                const betStep = gameResult.steps.find((step) => step.event === "bet");
                const endgameStep = gameResult.steps.find((step) => step.event === "endgame");

                console.log("🎮 Game Results:");
                console.log(`   💰 Bet Amount: ${betStep.data.endBet}`);
                console.log(`   🏆 Win Amount: ${endgameStep.data.win || 0}`);
                console.log(`   ⭐ Big Win: ${endgameStep.data.bigWin ? "🎉 YES" : "No"}`);
                console.log(`   📈 Multiplier: ${endgameStep.data.multiplier || 0}x`);
                console.log(`   🎁 Free Spins: ${endgameStep.data.freeSpins || 0}`);

                // Calculate profit/loss
                const profit = (endgameStep.data.win || 0) - betStep.data.endBet;
                console.log(`   💵 Net Result: ${profit > 0 ? "+" : ""}${profit} (${profit > 0 ? "PROFIT" : "LOSS"})`);
            } else {
                console.log("❌ Game failed:", gameResult.error);
            }
        } catch (error) {
            console.log("💥 Error:", error.message);
        } finally {
            client.cleanup();
        }

        console.log("-".repeat(40));
    }

    console.log("\n🏁 Scenario testing completed!");
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runScenarioClient().catch(console.error);
}

export default runScenarioClient;
