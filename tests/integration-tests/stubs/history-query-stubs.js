import { createDummyUser } from "sc-game-service-integration-utils";

export const queryHistoryUser = { playerId: 3, playerName: "QueryHistoryUser", UID: "" };

export const playerMultipliers = {
    playerId: 6,
    time: "2022-06-22T06:16:07.186Z",
    uid: "UID",
    rounds: [
        {
            prevTotalMultiplier: 0,
            totalMultiplier: 2,
            multiplier: 2,
            time: "2022-06-22T06:16:07.186Z",
            roundId: 6,
        },
    ],
    ended: true,
    endTime: "2022-06-22T06:17:07.186Z",
};

export const stubHistoryData = async (currency, TreasureIslandRounds, TreasureIslandTotalMultipliers) => {
    const { userInfo, userSession } = await createDummyUser(queryHistoryUser.playerId, queryHistoryUser.playerName, currency);

    queryHistoryUser.UID = userSession.userId;
    playerMultipliers.name = userSession.playerName;

    const historyRounds = [
        {
            coinValue: 1,
            betLevel: 1,
            betMultiplier: 20,
            multiplier: 0,
            totalAmount: 20,
            totalTumbleWin: 0,
            totalMultiplier: 0,
            freeSpin: false,
            betwin: 0,
            paid: true,
            id: 5,
            uid: userSession.userId,
            name: userInfo.name,
            time: "2022-06-03T07:32:21.142+00:00",
            rate: 1,
            exchangeRateId: 1,
            odds: {
                oddsByCounts: {
                    0: [
                        { from: 8, to: 9, odds: 2 },
                        { from: 10, to: 11, odds: 15 },
                        { from: 12, to: 30, odds: 40 },
                    ],
                    1: [
                        { from: 8, to: 9, odds: 8 },
                        { from: 10, to: 11, odds: 18 },
                        { from: 12, to: 30, odds: 80 },
                    ],
                    2: [
                        { from: 8, to: 9, odds: 10 },
                        { from: 10, to: 11, odds: 20 },
                        { from: 12, to: 30, odds: 100 },
                    ],
                    3: [
                        { from: 8, to: 9, odds: 16 },
                        { from: 10, to: 11, odds: 24 },
                        { from: 12, to: 30, odds: 160 },
                    ],
                    4: [
                        { from: 8, to: 9, odds: 20 },
                        { from: 10, to: 11, odds: 30 },
                        { from: 12, to: 30, odds: 200 },
                    ],
                    5: [
                        { from: 8, to: 9, odds: 30 },
                        { from: 10, to: 11, odds: 40 },
                        { from: 12, to: 30, odds: 240 },
                    ],
                    6: [
                        { from: 8, to: 9, odds: 40 },
                        { from: 10, to: 11, odds: 100 },
                        { from: 12, to: 30, odds: 300 },
                    ],
                    7: [
                        { from: 8, to: 9, odds: 50 },
                        { from: 10, to: 11, odds: 200 },
                        { from: 12, to: 30, odds: 500 },
                    ],
                    8: [
                        { from: 8, to: 9, odds: 200 },
                        { from: 10, to: 11, odds: 500 },
                        { from: 12, to: 30, odds: 1000 },
                    ],
                },
                freeSpins: {
                    initialOdds: [
                        { count: 4, odds: 3 },
                        { count: 5, odds: 6 },
                        { count: 6, odds: 18 },
                    ],
                    additionalOdds: [{ count: 4, odds: 3 }],
                },
            },
            siteId: "4100300",
            currency: "$US",
            operatorId: "ONEworks1",
            playerId: userSession.playerId,
            __v: 0,
            endTime: "2022-06-03T07:32:21.150+00:00",
            result: "1,0,1,2,4,8,1,6,4,4,3,1,1,4,6,6,4,2,7,2,0,6,0,5,3,3,0,6,1,0",
            settlementResult: {
                tumbles: [
                    {
                        originalBoard: "1,0,1,2,4,8,1,6,4,4,3,1,1,4,6,6,4,2,7,2,0,6,0,5,3,3,0,6,1,0",
                        newBoard: "1,0,1,2,4,8,1,6,4,4,3,1,1,4,6,6,4,2,7,2,0,6,0,5,3,3,0,6,1,0",
                        multipliers: [],
                        icons: {},
                        win: 0,
                    },
                ],
                freeSpins: { count: 0, odds: 0 },
            },
        },
        {
            coinValue: 1,
            betLevel: 1,
            betMultiplier: 20,
            multiplier: 0,
            totalAmount: 20,
            totalTumbleWin: 0,
            totalMultiplier: 0,
            freeSpin: true,
            betwin: 0,
            paid: true,
            id: 6,
            uid: userSession.userId,
            name: userInfo.name,
            time: "2022-06-03T07:32:21.142+00:00",
            rate: 1,
            exchangeRateId: 1,
            odds: {
                oddsByCounts: {
                    0: [
                        { from: 8, to: 9, odds: 2 },
                        { from: 10, to: 11, odds: 15 },
                        { from: 12, to: 30, odds: 40 },
                    ],
                    1: [
                        { from: 8, to: 9, odds: 8 },
                        { from: 10, to: 11, odds: 18 },
                        { from: 12, to: 30, odds: 80 },
                    ],
                    2: [
                        { from: 8, to: 9, odds: 10 },
                        { from: 10, to: 11, odds: 20 },
                        { from: 12, to: 30, odds: 100 },
                    ],
                    3: [
                        { from: 8, to: 9, odds: 16 },
                        { from: 10, to: 11, odds: 24 },
                        { from: 12, to: 30, odds: 160 },
                    ],
                    4: [
                        { from: 8, to: 9, odds: 20 },
                        { from: 10, to: 11, odds: 30 },
                        { from: 12, to: 30, odds: 200 },
                    ],
                    5: [
                        { from: 8, to: 9, odds: 30 },
                        { from: 10, to: 11, odds: 40 },
                        { from: 12, to: 30, odds: 240 },
                    ],
                    6: [
                        { from: 8, to: 9, odds: 40 },
                        { from: 10, to: 11, odds: 100 },
                        { from: 12, to: 30, odds: 300 },
                    ],
                    7: [
                        { from: 8, to: 9, odds: 50 },
                        { from: 10, to: 11, odds: 200 },
                        { from: 12, to: 30, odds: 500 },
                    ],
                    8: [
                        { from: 8, to: 9, odds: 200 },
                        { from: 10, to: 11, odds: 500 },
                        { from: 12, to: 30, odds: 1000 },
                    ],
                },
                freeSpins: {
                    initialOdds: [
                        { count: 4, odds: 3 },
                        { count: 5, odds: 6 },
                        { count: 6, odds: 18 },
                    ],
                    additionalOdds: [{ count: 4, odds: 3 }],
                },
            },
            siteId: "4100300",
            currency: "$US",
            operatorId: "ONEworks1",
            playerId: userSession.playerId,
            __v: 0,
            endTime: "2022-06-03T07:32:21.150+00:00",
            result: "1,0,1,2,4,8,1,6,4,4,3,1,1,4,6,6,4,2,7,2,0,6,0,5,3,3,0,6,1,0",
            settlementResult: {
                tumbles: [
                    {
                        originalBoard: "1,0,1,2,4,8,1,6,4,4,3,1,1,4,6,6,4,2,7,2,0,6,0,5,3,3,0,6,1,0",
                        newBoard: "1,0,1,2,4,8,1,6,4,4,3,1,1,4,6,6,4,2,7,2,0,6,0,5,3,3,0,6,1,0",
                        multipliers: [],
                        icons: {},
                        win: 0,
                    },
                ],
                freeSpins: { count: 0, odds: 0 },
            },
        },
    ];


    await TreasureIslandRounds.insertMany(historyRounds);
    return TreasureIslandTotalMultipliers.insertMany([playerMultipliers]);
};
