import { SlotGameData, SlotGameDefinition } from "sc-slot-game-base";
import { gameConfigs as gameConfigsRepository } from "sc-base-database";
import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import { logger } from "sc-common";
import GameApp from "./game-app";
import CascadingSlotContainerRegistry from "./cascading-slot-container-registry";

const run = async () => {
    const appName = process.env.APP_NAME;

    if (appName) {
        const gameName = appName.replace("service", "").replaceAll("_", "");

        appConfigs.database.url = appConfigs.database.url.concat(`&appName=${gameName.toLowerCase()}`);
        appConfigs.sentry.logIdentifier = gameName.toLowerCase();

        const app = new GameApp(gameName, appConfigs);
        await app.run();

        const gameConfigs = await gameConfigsRepository.findOne({ name: gameName.toLowerCase() }).lean().exec();

        if (gameConfigs) {
            gameSettings.id = gameConfigs.gameId;
            gameSettings.name = gameConfigs.displayName.replace(/ /g, "");

            const gameData = new SlotGameData(gameSettings.durations.wholeRound);
            const definition = new SlotGameDefinition(gameSettings);
            const container = new CascadingSlotContainerRegistry().register(appConfigs, definition, gameData);

            await app.startGame(container);
        }else{
            logger.logCritical(`${gameName} config doesn't exist`);
        }
    } else {
        console.log("App Name is not defined, failed to boostrap the service");
    }
};

run();
