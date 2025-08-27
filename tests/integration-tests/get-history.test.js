import { GameClientDriver } from "sc-game-service-integration-utils";
import { initUserSession } from "./helpers";
import { queryHistoryUser } from "./stubs/history-query-stubs";
import { socketOptions } from "./stubs/test-data";

describe("event get history", () => {
    let userClientDriver;
    afterAll(() => {
        userClientDriver.close();
    });

    beforeAll(async () => {
        userClientDriver = new GameClientDriver(socketOptions, initUserSession(queryHistoryUser));
        await userClientDriver.handleSignedInEvent();
    });
    describe("when page = 0", () => {
        it("should return empty details", async () => {
            // Arrange
            const expectedValue = {};

            // Act
            userClientDriver.sendGetHistoryEvent(0);
            const result = await userClientDriver.handleGameEvent((betHistoryData) => betHistoryData);

            // Assert

            expect(result).toStrictEqual(expectedValue);
        });
    });

    describe("when page > 0 and real player", () => {
        it("should return details", async () => {
            // Arrange
            const expectedValue = {
                history: {
                    betLogs: [
                        {
                            betLevel: 1,
                            betwin: 0,
                            buyFreeSpin:false,
                            coinValue: 1,
                            currency: "$US",
                            freeSpin: true,
                            id: 6,
                            multiplier: 0,
                            reachMaxWin: false,
                            time: "2022-06-03T07:32:21.142Z",
                            settlementResult: {
                                freeSpins: {
                                    count: 0,
                                    odds: 0,
                                },
                                tumbles: [
                                    {
                                        multipliers: [],
                                        newBoard: "1,0,1,2,4,8,1,6,4,4,3,1,1,4,6,6,4,2,7,2,0,6,0,5,3,3,0,6,1,0",
                                        originalBoard: "1,0,1,2,4,8,1,6,4,4,3,1,1,4,6,6,4,2,7,2,0,6,0,5,3,3,0,6,1,0",
                                        win: 0,
                                    },
                                ],
                            },
                            totalAmount: 20,
                            totalMultiplier: 0,

                            totalTumbleWin: 0,
                        },
                        {
                            betLevel: 1,
                            betwin: 0,
                            buyFreeSpin:false,
                            coinValue: 1,
                            currency: "$US",
                            freeSpin: false,
                            id: 5,
                            multiplier: 0,
                            reachMaxWin: false,
                            time: "2022-06-03T07:32:21.142Z",
                            settlementResult: {
                                freeSpins: {
                                    count: 0,
                                    odds: 0,
                                },
                                tumbles: [
                                    {
                                        multipliers: [],
                                        newBoard: "1,0,1,2,4,8,1,6,4,4,3,1,1,4,6,6,4,2,7,2,0,6,0,5,3,3,0,6,1,0",
                                        originalBoard: "1,0,1,2,4,8,1,6,4,4,3,1,1,4,6,6,4,2,7,2,0,6,0,5,3,3,0,6,1,0",
                                        win: 0,
                                    },
                                ],
                            },
                            totalAmount: 20,
                            totalMultiplier: 0,

                            totalTumbleWin: 0,
                        },
                    ],
                    page: 1,
                    pageSize: 10,
                    total: 2,
                },
            };

            // Act
            userClientDriver.sendGetHistoryEvent(1);

            // Assert
            const result = await userClientDriver.handleGameEvent((betHistoryData) => betHistoryData.history);
            expect(result).toStrictEqual(expectedValue);
        });
    });
});
