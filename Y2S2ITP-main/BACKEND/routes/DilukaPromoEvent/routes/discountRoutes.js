const express = require("express");
const discountController = require("../controllers/discountController");
const authMiddleware = require("../middleware/authMiddleware");
const USER_ROLES = require("../constants/roles");

const router = express.Router();

router.post("/", authMiddleware([USER_ROLES.PE_MANAGER]), discountController.createDiscount);
router.get("/", authMiddleware([USER_ROLES.PE_MANAGER, USER_ROLES.EA_MANAGER]), discountController.getDiscounts);
router.get("/count", authMiddleware([USER_ROLES.PE_MANAGER]), discountController.getDiscountsCount);
router.get("/:id", authMiddleware([USER_ROLES.PE_MANAGER]), discountController.getDiscountById);
router.patch("/:id", authMiddleware([USER_ROLES.PE_MANAGER]), discountController.updateDiscount);
router.delete("/:id", authMiddleware([USER_ROLES.PE_MANAGER]), discountController.deleteDiscount);

module.exports = router;
