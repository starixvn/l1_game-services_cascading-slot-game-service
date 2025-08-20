import { logger } from "sc-common";
import GameManagementApiClientFactory, { getOrDefault } from "sc-game-base/src/core/game-management-api";
import { SlotGameData, SlotGameDefinition } from "sc-slot-game-base";
import appConfigs from "./app-configs";
import CascadingSlotContainerRegistry from "./cascading-slot-container-registry";
import GameApp from "./game-app";
import gameSettings from "./game-settings";

const run = async () => {
    const appName = process.env.APP_NAME;

    if (appName) {
        const gameName = appName.replace("service", "").replaceAll("_", "");

        appConfigs.database.url = appConfigs.database.url.concat(`&appName=${gameName.toLowerCase()}`);
        appConfigs.sentry.logIdentifier = gameName.toLowerCase();

        const app = new GameApp(gameName, appConfigs);
        await app.run();

        const gameConfigs = await getOrDefault(
            new GameManagementApiClientFactory(appConfigs).instance().gameConfigs.getGameConfigs(gameName),
            null
        );

        if (gameConfigs) {
            gameSettings.id = gameConfigs.gameId;
            gameSettings.name = gameConfigs.displayName.replace(/ /g, "");

            const gameData = new SlotGameData(gameSettings.durations.wholeRound);
            gameData.gameConfigs = gameConfigs;

            const definition = new SlotGameDefinition(gameSettings);
            const container = new CascadingSlotContainerRegistry().register(appConfigs, definition, gameData);

            await app.startGame(container);
        } else {
            logger.logCritical(`${gameName} config doesn't exist`);
        }
    } else {
        console.log("App Name is not defined, failed to boostrap the service");
    }
};

run();
