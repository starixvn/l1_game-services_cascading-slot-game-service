import { EventConsumers } from "sc-cascading-slot-base";

export default class InGameConsumer extends EventConsumers.InGameConsumer {
    async buildPayload(realPlayer) {
        const payload = super.buildPayload(realPlayer);
        const settings = this.gameData.currencyGroupGames.find((x) => x.groupId.toString() === realPlayer.session.currencyGroupId);
        console.log(realPlayer.session);
        console.log(settings);
        payload.gameConfigs.defaultCoinValue = settings?.defaultCoinValue;

        return payload;
    }
}
