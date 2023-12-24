import { Router } from "express";
import { ragisterUser } from "../controllers/user.ragister.js";
import { upload } from "../middlewere/multer.middleware.js";

const router = Router();

router.route("/ragister").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    ragisterUser
    )


export default router;