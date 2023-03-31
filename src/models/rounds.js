import mongoose from "mongoose";
import { Models } from "sc-cascading-slot-base";

export default function (gameConfigName) {
    return mongoose.model(`${gameConfigName}_round`, Models.RoundsSchema);
}
