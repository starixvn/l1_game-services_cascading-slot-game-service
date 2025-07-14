import mongoose from "mongoose";
import { middlewares } from "sc-common";
import {
    createDummyCurrency,
    createDummyUsers,
    createExchangeRate,
    createGameConfig,
    createPartnerConfig,
} from "sc-game-service-integration-utils";
import { createCurrencyGroupGames } from "./currency-group-games-stub";
import { stubHistoryData } from "./history-query-stubs";
import { createDummyUsers as createCascadingSlotDummyUsers } from "./user-stub";

import idcounters from "sc-slot-game-base/src/models/id-counters";
import configs from "../../../src/app-configs.IGT";
import { freeSpins, rounds, totalMultipliers } from "../../../src/models";
import { currencyData, game, gameConfig, playerFreeSpins, playerMultipliers, rounds as roundDatas } from "./test-data";

const TreasureIslandRounds = rounds("treasureisland");
const TreasureIslandTotalMultipliers = totalMultipliers("treasureisland");
const TreasureIslandFreeSpins = freeSpins("treasureisland");

const connectDatabase = async () => {
    await middlewares.database.configureDatabase(mongoose, configs.database);
    await clearAllData();
};

const clearAllData = async () => {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.deleteMany();
    }
};

const createTestData = async () => {
    await connectDatabase();
    await createExchangeRate();
    await createGameConfig(gameConfig);
    const partnerConfig = await createPartnerConfig(game.id);
    const currency = await createDummyCurrency(partnerConfig.partnerId, currencyData.code, currencyData.name);
    await createCurrencyGroupGames(currency.groupId, game.id, gameConfig);
    await createDummyUsers(currency);
    await createCascadingSlotDummyUsers(currency);
    await createRounds();
    await createPlayerFreeSpins();
    await createPlayerMultipliers();
    await stubHistoryData(currency, TreasureIslandRounds, TreasureIslandTotalMultipliers);
    await idcounters.create({ f: "id", m: "TreasureIsland_round", c: 6 });
    console.log("Create game config & dummy user for testing successfully!");

    process.exit(0);
};

const createRounds = async () => {
    return TreasureIslandRounds.insertMany(roundDatas);
};

const createPlayerFreeSpins = async () => {
    return TreasureIslandFreeSpins.insertMany(playerFreeSpins);
};

const createPlayerMultipliers = async () => {
    return TreasureIslandTotalMultipliers.insertMany(playerMultipliers);
};

createTestData();
