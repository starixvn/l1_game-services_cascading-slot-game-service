import mongoose from "mongoose";
import { TotalMultiplierSchema } from "sc-cascading-slot-base/src/models";

export default function (gameConfigName) {
    return mongoose.model(`${gameConfigName}_multiplier`, TotalMultiplierSchema);
}
