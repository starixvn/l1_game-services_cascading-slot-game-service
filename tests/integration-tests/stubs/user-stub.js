import { createDummyUser } from "sc-game-service-integration-utils";

export const haveTotalMultiplierUser = { playerId: 2, playerName: "HaveTotalMultiplierUser" };
export const placeBetUser = { playerId: 4, playerName: "PlaceBetUser" };

export const createDummyUsers = async (currency) => {
    await createDummyUser(haveTotalMultiplierUser.playerId, haveTotalMultiplierUser.playerName, currency);
    await createDummyUser(placeBetUser.playerId, placeBetUser.playerName, currency);
};
