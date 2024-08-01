const express = require("express");
const promoEventController = require("../controllers/promoEventController");
const authMiddleware = require("../middleware/authMiddleware");
const USER_ROLES = require("../constants/roles");

const router = express.Router();

router.post("/", authMiddleware([USER_ROLES.PE_MANAGER, USER_ROLES.EA_MANAGER]), promoEventController.createPromoEvent);
router.get("/", authMiddleware([USER_ROLES.EA_MANAGER, USER_ROLES.PE_MANAGER, USER_ROLES.CUSTOMER]), promoEventController.getPromoEvents);
router.get("/count", authMiddleware([USER_ROLES.EA_MANAGER, USER_ROLES.PE_MANAGER]), promoEventController.getPromoEventsCount);
router.get("/active", authMiddleware([USER_ROLES.CUSTOMER, USER_ROLES.PE_MANAGER, USER_ROLES.EA_MANAGER]), promoEventController.getActivePromoEvents);
router.get("/:id", authMiddleware([USER_ROLES.EA_MANAGER, USER_ROLES.PE_MANAGER, USER_ROLES.CUSTOMER]), promoEventController.getPromoEventById);
router.patch("/:id", authMiddleware([USER_ROLES.PE_MANAGER]), promoEventController.updatePromoEvent);
router.delete("/:id", authMiddleware([USER_ROLES.PE_MANAGER]), promoEventController.deletePromoEvent);

module.exports = router;
