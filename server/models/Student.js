import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  gender: { type: String },
  startDate: { type: String },
  program: { type: String, default: 'regular' },
  department: { type: String, default: 'computer science' },
  document: { type: String, default: null }, // ✅ የተማሪውን ሰነድ (Base64) በግልጽ ለማስቀመጥ
  assessments: {
    type: Map,
    of: Object,
    default: {}
  },
  registeredAt: { type: Date, default: Date.now }
}, { strict: false });

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;