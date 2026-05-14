import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  quantity: { type: Number, required: true },
  size: { type: String },
  color: { type: String },
  image: { type: String },
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: 'Processing' },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { strict: false });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
