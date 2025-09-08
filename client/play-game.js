#!/usr/bin/env node --import=extensionless/register

/**
 * Simple Game Launcher
 *
 * Quick way to play the cascading slot game from command line
 */

import { GameClient, USER_PROFILES, BET_CONFIGS } from "./index.js";

async function launchGame() {
    console.log("🎰 Cascading Slot Game - Starting Session");
    console.log("=".repeat(50));

    // Default player setup
    const player = {
        playerId: `player_${Date.now()}`,
        playerName: `Player${Math.floor(Math.random() * 1000)}`,
        currency: "USD",
    };

    console.log(`👤 Player: ${player.playerName} (ID: ${player.playerId})`);
    console.log("🎮 Starting game session...\n");

    // Create game client
    const client = new GameClient(player, {
        enableLogs: true,
        gameServer: {
            socketUri: "http://localhost:5001/user/treasureisland",
            proxyRoute: "/socket.io",
            gameName: "TreasureIsland",
        },
    });

    try {
        // Play a game session with moderate betting
        const result = await client.executeFullGameFlow(BET_CONFIGS.MODERATE);

        if (result.success) {
            console.log("\n🎉 Game Session Completed!");
            console.log("=".repeat(50));

            // Show game results
            const betStep = result.steps.find((step) => step.event === "bet");
            const endStep = result.steps.find((step) => step.event === "endgame");

            if (betStep && endStep) {
                const betAmount = betStep.data.endBet;
                const winAmount = endStep.data.win || 0;
                const profit = winAmount - betAmount;
                const multiplier = endStep.data.multiplier || 0;
                const bigWin = endStep.data.bigWin;
                const freeSpins = endStep.data.freeSpins || 0;

                console.log(`💰 Bet Amount: ${betAmount}`);
                console.log(`🏆 Win Amount: ${winAmount}`);
                console.log(`📊 Net Result: ${profit > 0 ? "+" : ""}${profit} ${profit > 0 ? "(WIN! 🎉)" : "(LOSS)"}`);
                console.log(`📈 Multiplier: ${multiplier}x ${multiplier > 1 ? "🚀" : ""}`);
                console.log(`⭐ Big Win: ${bigWin ? "YES! 🎆" : "No"}`);
                console.log(`🎁 Free Spins Won: ${freeSpins}`);

                // Show win category
                if (profit > betAmount * 10) {
                    console.log("\n🚀 MASSIVE WIN! Incredible result!");
                } else if (profit > betAmount * 5) {
                    console.log("\n🎆 BIG WIN! Excellent payout!");
                } else if (profit > betAmount) {
                    console.log("\n✨ GREAT WIN! Nice multiplier!");
                } else if (profit > 0) {
                    console.log("\n✅ WIN! Small profit made!");
                } else if (profit === 0) {
                    console.log("\n🤝 BREAK EVEN! No loss, no gain.");
                } else {
                    console.log("\n💸 LOSS! Better luck next time!");
                }
            }

            // Show game statistics
            console.log("\n📊 Game Session Statistics:");
            const eventHistory = client.getEventHistory();
            console.log(`   🔄 Total Events: ${eventHistory.length}`);
            console.log(
                `   ⏱️  Session Duration: ${
                    eventHistory.length > 0
                        ? "~" +
                          Math.round(
                              (new Date(eventHistory[eventHistory.length - 1].timestamp) - new Date(eventHistory[0].timestamp)) / 1000
                          ) +
                          "s"
                        : "Unknown"
                }`
            );
        } else {
            console.log("\n❌ Game Session Failed!");
            console.log(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error("\n💥 Game Session Error:");
        console.error(`   ${error.message}`);

        if (error.completedSteps) {
            console.log(`\n📋 Completed ${error.completedSteps.length}/4 game steps`);
        }
    } finally {
        // Always clean up
        client.cleanup();
        console.log("\n🧹 Session ended. Connection closed.");
        console.log("\nThanks for playing! 🎰✨");
    }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
    console.log("\n\n👋 Game session interrupted. Goodbye!");
    process.exit(0);
});

// Run game launcher
if (import.meta.url === `file://${process.argv[1]}`) {
    launchGame().catch(console.error);
}

export default launchGame;
