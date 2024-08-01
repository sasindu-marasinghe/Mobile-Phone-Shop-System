const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const USER_ROLES = require("../constants/roles");

const router = express.Router();

router.get("/", authMiddleware([USER_ROLES.PE_MANAGER]), userController.getUsers);
router.get("/count", authMiddleware([USER_ROLES.PE_MANAGER]), userController.getUsersCount);
router.get("/:id", authMiddleware([USER_ROLES.PE_MANAGER]), userController.getUserById);
router.patch("/:id", authMiddleware([USER_ROLES.PE_MANAGER]), userController.updateUser);
router.delete("/:id", authMiddleware([USER_ROLES.PE_MANAGER]), userController.deleteUser);

module.exports = router;
