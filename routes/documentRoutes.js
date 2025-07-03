const express = require("express");
const router = express.Router();
const docCtrl = require("../controllers/documentController");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth, docCtrl.createDoc);
router.get("/public", docCtrl.getPublicDocs);
router.get("/", auth, docCtrl.getDocWithUser);
router.get("/:id", auth, docCtrl.getDocById);
router.put("/:id", auth, docCtrl.updateDoc);

module.exports = router;
