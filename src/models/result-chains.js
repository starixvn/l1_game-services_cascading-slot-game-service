import mongoose from "mongoose";
import { ResultChainSchema } from "sc-cascading-slot-base/src/models";

export default function (gameConfigName) {
    return mongoose.model(`result_chains`, ResultChainSchema);
}
