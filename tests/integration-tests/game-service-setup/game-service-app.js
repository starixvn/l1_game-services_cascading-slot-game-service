import { gameConfigs as gameConfigsRepository } from "sc-base-database";
import { initAPIStub, stubUserService } from "sc-game-service-integration-utils";
import { endGameErrorUser, errorUser, internalServerErrorUser, normalUser } from "sc-game-service-integration-utils/src/stubs/user-stub";
import { SlotGameData, SlotGameDefinition } from "sc-slot-game-base";
import appConfigs from "../../../src/app-configs.IGT";
import GameApp from "../../../src/game-app";
import gameSettings from "../../../src/game-settings";
import { haveTotalMultiplierUser, placeBetUser } from "../stubs/user-stub";
import IGTSlotGameContainerRegistry from "./igt-container-registry";

export const run = async (gameName) => {
    initAPIStub(appConfigs.apiSettings.apiUrl);
    stubUserService(appConfigs, [placeBetUser, haveTotalMultiplierUser, normalUser, errorUser, internalServerErrorUser, endGameErrorUser]);

    appConfigs.database.url = appConfigs.database.url.concat(`/appName=${gameName.toLowerCase()}`);

    const app = new GameApp(gameName, appConfigs);
    await app.run();

    const gameConfigs = await gameConfigsRepository.findOne({ name: gameName.toLowerCase() }).lean().exec();

    if (gameConfigs) {
        gameSettings.id = gameConfigs.gameId;
        gameSettings.name = gameConfigs.displayName.replace(/ /g, "");

        const gameData = new SlotGameData(gameSettings.durations.wholeRound);
        const definition = new SlotGameDefinition(gameSettings);
        const container = new IGTSlotGameContainerRegistry().register(appConfigs, definition, gameData);

        await app.startGame(container);
    }
};

run("treasureisland");
