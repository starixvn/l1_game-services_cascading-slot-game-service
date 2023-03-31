import { CurrencyGroupGames } from "sc-game-base/src/core/models";

export const createCurrencyGroupGames = async (currencyGroupId, gameId, gameConfig) => {
    const data = {
        enabled: true,
        coinValues: [1, 2, 5, 10, 20, 50, 100],
        stakeLevels: [],
        groupId: currencyGroupId,
        maxWinPerRound: 50000,
    };

    return CurrencyGroupGames.create({ gameId, ...gameConfig, ...data });
};
