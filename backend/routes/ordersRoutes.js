const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  filterOrders,
  changeOrderStatus,
  makeOrder
} = require("../controllers/ordersController");

router.get("/", getAllOrders);
router.post("/makeOrder", makeOrder);
router.post("/filter", filterOrders);
router.put("/status/:id", changeOrderStatus);

module.exports = router;
