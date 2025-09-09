/**
 * Simple Game Client Example
 *
 * This example demonstrates basic usage of the game client to:
 * 1. Connect to the game server
 * 2. Sign in a user
 * 3. Enter the game
 * 4. Place a bet
 * 5. View game results
 */

import { GameClient, USER_PROFILES, BET_CONFIGS } from "../index.js";

async function runSimpleClient() {
    console.log("🎰 Cascading Slot Game Client - Simple Example");
    console.log("=".repeat(50));

    // Create a user profile
    const user = USER_PROFILES.CASUAL_PLAYER;
    console.log(`👤 Using player: ${user.playerName} (ID: ${user.playerId})`);

    // Create game client with logging enabled
    const client = new GameClient(user, {
        enableLogs: true,
        gameServer: {
            socketUri: "http://localhost:5001/user/treasureisland",
            proxyRoute: "/socket.io",
            gameName: "TreasureIsland",
        },
    });

    try {
        // Execute the complete game flow
        console.log("\n🚀 Starting game session...");

        const result = await client.executeFullGameFlow(BET_CONFIGS.CONSERVATIVE);

        if (result.success) {
            console.log("\n✅ Game completed successfully!");
            console.log("=".repeat(50));

            // Display results for each step
            result.steps.forEach((step, index) => {
                console.log(`\n${index + 1}. ${step.event.toUpperCase()}`);
                console.log(`   Status: ${step.success ? "✅ Success" : "❌ Failed"}`);

                if (step.event === "bet") {
                    if (step.success && step.data.endBet && step.data.endBet !== -1) {
                        console.log(`   Bet Amount: ${step.data.endBet}`);
                        console.log(`   Bet Details: ${JSON.stringify(step.data, null, 2)}`);
                    } else {
                        console.log(`   ❌ Bet Failed (endBet: ${step.data.endBet})`);
                        console.log(`   Error: ${JSON.stringify(step.error, null, 2)}`);
                        console.log(`   Data: ${JSON.stringify(step.data, null, 2)}`);
                    }
                }

                if (step.event === "endgame") {
                    const { win, bigWin, multiplier, freeSpins } = step.data;
                    console.log(`   Win Amount: ${win || 0}`);
                    console.log(`   Big Win: ${bigWin ? "🎉 YES" : "No"}`);
                    console.log(`   Multiplier: ${multiplier || 0}x`);
                    console.log(`   Free Spins: ${freeSpins || 0}`);
                }
            });

            // Show final state
            console.log("\n📊 Final Game State:");
            const finalState = client.getGameState();
            console.log(`   Signed In: ${finalState.signedIn}`);
            console.log(`   In Game: ${finalState.inGame}`);
            console.log(`   Total Multiplier: ${finalState.totalMultiplier}`);
            console.log(`   Free Spins Available: ${finalState.freeSpins}`);
        } else {
            console.log("❌ Game failed:", result.error);

            if (result.betFailure) {
                console.log("\n💥 Bet Placement Failed:");
                console.log(`   Code: ${result.betFailure.code}`);
                console.log(`   Message: ${result.betFailure.message}`);
                console.log(`   Details: ${JSON.stringify(result.betFailure.details, null, 2)}`);
            }

            if (result.completedSteps && result.completedSteps.length > 0) {
                console.log(`\n📋 Completed Steps (${result.completedSteps.length}/4):`);
                result.completedSteps.forEach((step, index) => {
                    console.log(`   ${index + 1}. ${step.event}: ${step.success ? "✅" : "❌"}`);
                });
            }
        }
    } catch (error) {
        console.error("💥 Error during game session:", error.message);

        if (error.completedSteps) {
            console.log(`\n📋 Completed ${error.completedSteps.length}/4 steps before failure`);
        }
    } finally {
        // Always clean up
        client.cleanup();
        console.log("\n🧹 Client cleaned up. Session ended.");
    }
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runSimpleClient().catch(console.error);
}

export default runSimpleClient;
