import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));
app.use(compression());
app.use(morgan('dev'));

// Mongo connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/swiftlogistics';
mongoose.connect(mongoUri, { autoIndex: true }).then(()=> console.log('MongoDB connected')).catch(err=> console.error('Mongo error', err));

// Schema & Model
const timelineEventSchema = new mongoose.Schema({
  date: String,
  title: String,
  description: String,
  location: String,
  active: Boolean,
  blink: Boolean // new: allows front-end to animate a chosen event
},{ _id:false });

const trackingSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true, index: true },
  status: { type: String, enum: ['pending','in-transit','delivered'], required: true },
  statusText: String,
  origin: String,
  destination: String,
  estimatedDelivery: String,
  packageType: String,
  weight: String,
  dimensions: String,
  insurance: String,
  timeline: [timelineEventSchema],
  updatedAt: { type: Date, default: Date.now }
},{ timestamps: true });

const Tracking = mongoose.model('Tracking', trackingSchema);

// Added contact info schema & model
const contactInfoSchema = new mongoose.Schema({
  _id: { type: String, default: 'contact' },
  address: String,
  phone: String,
  email: String,
  hours: String,
  updatedAt: { type: Date, default: Date.now }
},{ timestamps:true, versionKey:false });
const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);

// Helpers
function sanitizeTracking(body){
  const allowed = ['number','status','statusText','origin','destination','estimatedDelivery','packageType','weight','dimensions','insurance','timeline'];
  const obj = {};
  allowed.forEach(k=>{ if(body[k] !== undefined) obj[k] = body[k]; });
  if(!obj.statusText && obj.status) {
    const map = { 'pending':'Pending','in-transit':'In Transit','delivered':'Delivered'};
    obj.statusText = map[obj.status] || obj.status;
  }
  if(Array.isArray(obj.timeline)){
    obj.timeline = obj.timeline.filter(ev=> ev && (ev.date||ev.title||ev.description||ev.location));
  }
  return obj;
}

// New: sanitize contact
function sanitizeContact(body){
  const allowed = ['address','phone','email','hours'];
  const obj = {};
  allowed.forEach(k=>{ if(body[k] !== undefined) obj[k] = body[k]; });
  return obj;
}

// Routes
app.get('/api/tracking', async (req,res)=>{
  const docs = await Tracking.find({}, 'number status statusText origin destination estimatedDelivery packageType weight dimensions insurance timeline updatedAt').sort('number').lean();
  res.json(docs);
});

app.get('/api/tracking/:number', async (req,res)=>{
  const doc = await Tracking.findOne({ number: req.params.number.toUpperCase() }).lean();
  if(!doc) return res.status(404).json({ error: 'Not found'});
  res.json(doc);
});

app.post('/api/tracking', async (req,res)=>{
  try {
    const payload = sanitizeTracking(req.body);
    if(!payload.number) return res.status(400).json({ error: 'number required'});
    payload.number = payload.number.toUpperCase();
    const doc = await Tracking.findOneAndUpdate({ number: payload.number }, payload, { upsert:true, new:true, setDefaultsOnInsert:true });
    res.json(doc);
  } catch(e){
    if(e.code === 11000) return res.status(409).json({ error: 'Duplicate number'});
    res.status(500).json({ error: 'Server error'});
  }
});

app.delete('/api/tracking/:number', async (req,res)=>{
  await Tracking.deleteOne({ number: req.params.number.toUpperCase() });
  res.json({ ok: true });
});

// New contact routes
app.get('/api/contact', async (req,res)=>{
  const doc = await ContactInfo.findById('contact').lean();
  if(!doc) return res.json({});
  res.json({ address: doc.address||'', phone: doc.phone||'', email: doc.email||'', hours: doc.hours||'', updatedAt: doc.updatedAt });
});

app.post('/api/contact', async (req,res)=>{
  try {
    const payload = sanitizeContact(req.body);
    payload.updatedAt = new Date();
    const doc = await ContactInfo.findByIdAndUpdate('contact', payload, { upsert:true, new:true, setDefaultsOnInsert:true });
    res.json({ address: doc.address||'', phone: doc.phone||'', email: doc.email||'', hours: doc.hours||'', updatedAt: doc.updatedAt });
  } catch(e){
    res.status(500).json({ error: 'Server error' });
  }
});

// Static (serve existing SPA)
app.use(express.static('.')); // serves index.html etc. Adjust path if needed.

// Fallback
app.use((req,res)=> res.status(404).json({ error: 'Route not found'}));

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('Server listening on', port));
