#!/usr/bin/env node --import=extensionless/register

/**
 * Simple logging test to debug client connection
 */

import { GameClient, USER_PROFILES, BET_CONFIGS } from "./index.js";

async function testLogs() {
    console.log("🧪 Testing Game Client Logs");
    console.log("=".repeat(40));

    // Create a simple user
    const testUser = {
        playerId: "test_player_001",
        playerName: "LogTestPlayer",
        currency: "USD",
    };

    console.log("\n1️⃣ Creating client with enableLogs: true");

    // Create client with explicit logging enabled
    const client = new GameClient(testUser, {
        enableLogs: true,
        autoConnect: false, // Disable auto-connect to test step by step
    });

    console.log("\n2️⃣ Manually connecting...");
    client.connect();

    console.log("\n3️⃣ Testing simple game flow...");

    try {
        console.log("📝 About to start full game flow...");

        const result = await client.executeFullGameFlow({
            betLevel: 1,
            coinValue: 1,
            freeSpin: false,
        });

        console.log("\n✅ Game flow completed!");
        console.log("Result:", result.success ? "SUCCESS" : "FAILED");
    } catch (error) {
        console.log("\n❌ Game flow failed:");
        console.log("Error message:", error.message);
        console.log("Error details:", error);

        // Show completed steps if available
        if (error.completedSteps) {
            console.log(`\n📋 Steps completed: ${error.completedSteps.length}/4`);
            error.completedSteps.forEach((step, index) => {
                console.log(`   ${index + 1}. ${step.event}: ${step.success ? "✅" : "❌"}`);
            });
        }
    } finally {
        console.log("\n🧹 Cleaning up...");
        client.cleanup();
    }

    console.log("\n🏁 Log test completed!");
}

// Handle graceful shutdown
process.on("SIGINT", () => {
    console.log("\n\n👋 Test interrupted. Goodbye!");
    process.exit(0);
});

// Run the test
testLogs().catch(console.error);
