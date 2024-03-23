const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const Order = require("../model/ordersModel");

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

const makeOrder = async (req, res) => {
  const orders = await Order.create({
    //tenantID: req.body.tenantID,
    date: req.body.date,
    bidPrice: req.body.bidPrice,
   // houseEntityID: req.body.houseEntityID,
    status: req.body.status,
  })

  res.status(200).json(orders);
}

const filterOrders = asyncHandler(async (req, res) => {
  const { tenantID, dateRange, status } = req.body;

  const query = {};
  if (tenantID) query.tenantID = tenantID;
  if (dateRange)
    query.date = { $gte: dateRange.startDate, $lte: dateRange.endDate };
  if (status) query.status = status;

  const orders = await Order.find(query);
  res.json(orders);
});

const changeOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatusValues = ["pending", "accepted", "rejected"];
  if (!validStatusValues.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  await order.save();

  res.json({ message: "Order status updated successfully" });
});

module.exports = {
  getAllOrders,
  filterOrders,
  changeOrderStatus,
  makeOrder
};
