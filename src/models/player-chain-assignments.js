import mongoose from "mongoose";
import { PlayerChainAssignmentSchema } from "sc-cascading-slot-base/src/models";

export default function (gameConfigName) {
    return mongoose.model(`player_chain_assignments`, PlayerChainAssignmentSchema);
}
