const mongoose = require("mongoose");

const schema = mongoose.Schema;

const MenuSchema = new schema(
  {
    menu: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    photo: {
      type: String,
    },
    category_id: {
      type: schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", MenuSchema);
