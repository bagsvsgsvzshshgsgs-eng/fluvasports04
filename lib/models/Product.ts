import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  priceStr: { type: String },
  image: { type: String },
  images: [{ type: String }],
  description: { type: String },
  category: { type: String },
  categoryId: { type: String },
  subcategoryId: { type: String },
  colors: [{ type: String }],
  colorNames: [{ type: String }],
  sizes: [{ type: String }],
  isNew: { type: Boolean, default: false },
  displayLocations: [{ type: String }],
  badges: [{ type: String }],
  stock: { type: Number, default: 0 },
  features: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { strict: false });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
