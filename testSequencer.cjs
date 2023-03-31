const Sequencer = require("@jest/test-sequencer").default;

const runOrders = ["sign-in", "in-game", "get-history", "place-bet", "settlement", "expire-freespin"];

class CustomSequencer extends Sequencer {
    sort(tests) {
        const copyTests = Array.from(tests);
        return copyTests.sort((testA, testB) => {
            const testAIndex = runOrders.findIndex((file) => testA.path.includes(file));
            const testBIndex = runOrders.findIndex((file) => testB.path.includes(file));

            return testAIndex - testBIndex;
        });
    }
}

module.exports = CustomSequencer;
