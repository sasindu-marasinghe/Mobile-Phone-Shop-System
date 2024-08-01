const mongoose = require("mongoose");

const promoEventSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["event", "promotion"],
      required: true,
    },
    details: { type: String, required: true },
    priceRange: { type: String, required: true },
    validity: { type: String, required: true },
    // make discount optional
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
      required: false,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      required: true,
    },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PromoEvent", promoEventSchema, "promoEvents");
