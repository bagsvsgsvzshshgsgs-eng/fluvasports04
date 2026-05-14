import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  storeName: { type: String, default: "FLUVA SPORT" },
  storeAddress: { type: String, default: "6th October, Egypt" },
  contactPhone: { type: String, default: "+20 123 456 7890" },
  contactEmail: { type: String, default: "fluvasport@gmail.com" },
  currency: { type: String, default: "EGP" },
  taxRate: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 50 },
  freeShippingThreshold: { type: Number, default: 1000 },
  maintenanceMode: { type: Boolean, default: false },
  adminEmail: { type: String, default: "Fluvasport@gmail.com" },
  adminPassword: { type: String, default: "wateryclone123" },
  adminUsers: [{ type: mongoose.Schema.Types.Mixed }],
}, { strict: false });

export default mongoose.models.Setting || mongoose.model('Setting', SettingsSchema);
