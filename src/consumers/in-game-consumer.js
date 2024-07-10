import { EventConsumers } from "sc-cascading-slot-base";

export default class InGameConsumer extends EventConsumers.InGameConsumer {
    async buildPayload(realPlayer) {
        const payload = await super.buildPayload(realPlayer);
        const settings = this.gameData.currencyGroupGames.find((x) => x.groupId.toString() === realPlayer.session.currencyGroupId);
        payload.gameConfigs.defaultCoinValue = settings?.defaultCoinValue;

        return payload;
    }
}
