import { Router } from "express";
import { loginUser, logoutUser, ragisterUser } from "../controllers/user.ragister.js";
import { upload } from "../middlewere/multer.middleware.js";
import { verifyJWT } from "../middlewere/auth.middleware.js";

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

router.route("/login").post(loginUser);

//sequred router

router.route("/logout").post( verifyJWT,logoutUser);


export default router;