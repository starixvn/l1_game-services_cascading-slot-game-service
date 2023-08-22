import { CascadingHttpRouter } from "sc-cascading-slot-base/src/routers";

export default class IGTSlotHttpRouter extends CascadingHttpRouter {
    init(app) {
        super.init(app);

        app.post("/igt-api/set-board", (_req, res) => this.handleSetBoard(_req.body, res));
    }
}
