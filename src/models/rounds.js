import mongoose from "mongoose";

const schema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    siteId: { type: String },
    uid: { type: String },

    coinValue: { type: Number, default: 0 },
    betLevel: { type: Number, default: 0 },
    betMultiplier: { type: Number, default: 0 },
    multiplier: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    totalTumbleWin: { type: Number, default: 0 },
    totalMultiplier: { type: Number, default: 0 },
    freeSpin: { type: Boolean, default: false },
    reachMaxWin: { type: Boolean, default: false },
    buyFreeSpin: { type: Boolean, default: false },
    buyFreeSpinRefRoundId: { type: Number, required: false },

    result: { type: String },
    settlementResult: { type: Object },

    odds: { type: Object },
    betwin: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
    time: { type: Date },
    endTime: { type: Date },

    currency: { type: String, require: true },
    currencyCode: { type: String, require: false },
    currencyGroupId: { type: String, require: false },
    rate: { type: Number, require: true },
    exchangeRateId: { type: Number, require: true },

    operatorId: { type: String, require: true },
    playerId: { type: String },
});

export default function (gameConfigName) {
    return mongoose.model(`${gameConfigName}_round`, schema);
}
