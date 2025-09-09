#!/usr/bin/env node --import=extensionless/register

/**
 * Test script to demonstrate bet failure detection
 * This will help verify that endBet = -1 is properly detected and handled
 */

import { GameClient } from "./index.js";

async function testBetFailureDetection() {
    console.log("🧪 Testing Bet Failure Detection");
    console.log("=".repeat(50));

    // Create a test user
    const testUser = {
        playerId: "test_bet_failure_001",
        playerName: "BetFailureTestPlayer",
        currency: "USD",
    };

    console.log("\n1️⃣ Creating client with logging enabled...");
    const client = new GameClient(testUser, {
        enableLogs: true,
        autoConnect: false, // Manual connection for testing
    });

    try {
        console.log("\n2️⃣ Connecting to game server...");
        client.connect();

        console.log("\n3️⃣ Starting full game flow...");
        console.log("   This will likely encounter bet failures due to game configuration");
        
        const result = await client.executeFullGameFlow({
            betLevel: 1,
            coinValue: 0.1,
            freeSpin: false,
        });

        console.log("\n📊 GAME FLOW RESULT:");
        console.log("=".repeat(30));
        console.log(`Success: ${result.success}`);
        console.log(`Flow: ${result.flow}`);

        if (result.success) {
            console.log("\n✅ All steps completed successfully!");
            result.steps.forEach((step, index) => {
                console.log(`   ${index + 1}. ${step.event}: ${step.success ? "✅" : "❌"}`);
                if (step.event === "bet" && step.data.endBet) {
                    console.log(`      Bet Amount: ${step.data.endBet}`);
                }
            });
        } else {
            console.log(`\n❌ Flow failed: ${result.error}`);
            
            // Show bet failure details if present
            if (result.betFailure) {
                console.log("\n💥 BET FAILURE DETAILS:");
                console.log(`   Error Code: ${result.betFailure.code}`);
                console.log(`   Message: ${result.betFailure.message}`);
                console.log(`   Details: ${JSON.stringify(result.betFailure.details, null, 2)}`);
            }

            // Show completed steps
            if (result.completedSteps) {
                console.log(`\n📋 Completed Steps (${result.completedSteps.length}/4):`);
                result.completedSteps.forEach((step, index) => {
                    console.log(`   ${index + 1}. ${step.event}: ${step.success ? "✅" Success" : "❌ Failed"}`);
                    
                    if (step.event === "bet") {
                        console.log(`      endBet: ${step.data.endBet}`);
                        if (step.data.endBet === -1) {
                            console.log("      🔍 Detected: endBet = -1 (failure indicator)");
                        }
                        
                        if (step.data.apiError) {
                            console.log(`      🔍 API Error: ${JSON.stringify(step.data.apiError, null, 4)}`);
                        }
                    }
                });
            }
        }

        console.log("\n📜 Event History Summary:");
        const eventHistory = client.getEventHistory();
        eventHistory.forEach((entry, index) => {
            console.log(`   ${index + 1}. [${entry.event.toUpperCase()}] ${entry.message}`);
            if (entry.event === "bet" && entry.data) {
                console.log(`      endBet: ${entry.data.endBet}`);
                if (entry.data.endBet === -1) {
                    console.log("      ⚠️  FAILURE DETECTED IN EVENT HISTORY");
                }
            }
        });

    } catch (error) {
        console.log("\n💥 Unexpected error during test:");
        console.log(`   Message: ${error.message}`);
        console.log(`   Details: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`);
    } finally {
        console.log("\n🧹 Cleaning up...");
        client.cleanup();
    }

    console.log("\n🏁 Bet failure detection test completed!");
    console.log("\n📋 What to look for:");
    console.log("   ✅ Client should detect endBet = -1 as failure");
    console.log("   ✅ Client should detect apiError with isPlaceBetFailed = true");
    console.log("   ✅ Full game flow should stop after failed bet");
    console.log("   ✅ Detailed error information should be provided");
    console.log("   ✅ Event history should show the failure");
}

// Handle graceful shutdown
process.on("SIGINT", () => {
    console.log("\n\n👋 Test interrupted. Goodbye!");
    process.exit(0);
});

// Run the test
testBetFailureDetection().catch(console.error);
