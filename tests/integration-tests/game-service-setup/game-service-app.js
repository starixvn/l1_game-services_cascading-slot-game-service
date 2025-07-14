import nock from "nock";
import { gameConfigs as gameConfigsRepository, userInfos as userInfoRepository } from "sc-base-database";
import { initAPIStub, stubUserService, subGameManagementService } from "sc-game-service-integration-utils";
import { endGameErrorUser, errorUser, internalServerErrorUser, normalUser } from "sc-game-service-integration-utils/src/stubs/user-stub";
import { SlotGameData, SlotGameDefinition } from "sc-slot-game-base";
import appConfigs from "../../../src/app-configs.IGT";
import GameApp from "../../../src/game-app";
import gameSettings from "../../../src/game-settings";
import { queryHistoryUser } from "../stubs/history-query-stubs";
import { haveTotalMultiplierUser, placeBetUser } from "../stubs/user-stub";
import IGTSlotGameContainerRegistry from "./igt-container-registry";

export const run = async (gameName) => {
    initAPIStub(appConfigs.apiSettings.apiUrl);
    stubUserService(appConfigs, [placeBetUser, haveTotalMultiplierUser, normalUser, errorUser, internalServerErrorUser, endGameErrorUser]);

    appConfigs.database.url = appConfigs.database.url.concat(`&appName=${gameName.toLowerCase()}`);

    const app = new GameApp(gameName, appConfigs);
    await app.run();

    const gameConfigs = await gameConfigsRepository.findOne({ name: gameName.toLowerCase() }).lean().exec();

    if (gameConfigs) {
        gameSettings.id = gameConfigs.gameId;
        gameSettings.name = gameConfigs.displayName.replace(/ /g, "");
        const definition = new SlotGameDefinition(gameSettings);

        await subGameManagementService(appConfigs, definition);
        const userInfos = await userInfoRepository
            .find({ UID: { $in: [placeBetUser.playerId, haveTotalMultiplierUser.playerId, queryHistoryUser.playerId] } })
            .lean()
            .exec();
        userInfos.map((userInfo) => stubUserInfo(userInfo, appConfigs));

        const gameData = new SlotGameData(gameSettings.durations.wholeRound);
        gameData.gameConfigs = gameConfigs;

        const container = new IGTSlotGameContainerRegistry().register(appConfigs, definition, gameData);

        await app.startGame(container);
    }
};

const stubUserInfo = (userInfo, appConfigs) => {
    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/users/info?id=${userInfo.id}`, () => true)
        .reply(200, buildResult(userInfo));

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .post(`/users/set-balance`, () => true)
        .reply(200, buildResult(userInfo));
    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .post(`/users/set-balance-and-decrease-scoins`, () => true)
        .reply(200, buildResult(userInfo));
    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .post(`/users/update-balance`, () => true)
        .reply(200, buildResult(userInfo));

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .post(`/users/update-stake-level`, () => true)
        .reply(200, buildResult({}));
};

const buildResult = (data) => {
    return {
        errorCode: 0,
        errorMessage: "",
        isSuccessful: true,
        data,
    };
};

run("treasureisland");
