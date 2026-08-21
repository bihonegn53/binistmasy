import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import Student from './models/Student.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Debug Logger
app.use((req, res, next) => {
  console.log(`[INCOMING REQUEST] ${req.method} ${req.url}`);
  console.log('BODY:', req.body);
  next();
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/designAcademyDB';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('[SERVER] Connected to MongoDB.'))
  .catch(err => console.error('[SERVER] MongoDB connection error:', err));

const apiRouter = express.Router();

// 🟢 GET /api/students - ሁሉንም ተማሪዎች በ A-Z ደርድሮ ማምጫ
apiRouter.get('/students', async (req, res) => {
  try {
    const students = await Student.find()
      .collation({ locale: 'en', strength: 2 })
      .sort({ fullName: 1 }); // A to Z Sorting

    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching students.' });
  }
});

// 🟢 POST /api/students - አዲስ ተማሪ መመዝገቢያ
apiRouter.post('/students', [
  body('fullName').notEmpty().withMessage('Full Name is required.').trim(),
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0]?.msg || 'Validation error.' });
  }

  const { fullName, email, emergencyName, age, gender, startDate, program, department, assessments, document } = req.body;

  try {
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email address is already registered.' });
    }

    const newStudent = new Student({
      fullName,
      email,
      emergencyName: emergencyName || '',
      age: age ? Number(age) : null,
      gender: gender || 'male',
      startDate: startDate || new Date(),
      program: program || 'regular',
      department: department || 'computer science',
      assessments: assessments || {},
      document: document || null
    });

    const savedStudent = await newStudent.save();
    return res.status(201).json(savedStudent);
  } catch (error) {
    console.error('[SERVER] Save error:', error);
    return res.status(500).json({ message: 'Server error saving student.' });
  }
});

// 🟢 POST /api/register - Admission Registration
apiRouter.post('/register', [
  body('fullName').notEmpty().withMessage('Full Name is required.').trim(),
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('age').notEmpty().withMessage('Age is required.'),
  body('gender').notEmpty().withMessage('Gender is required.'),
  body('startDate').notEmpty().withMessage('Start Date is required.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0]?.msg || 'Validation error.' });
  }

  const { fullName, email, emergencyName, age, gender, startDate, program, department, assessments, document } = req.body;

  try {
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email address is already registered.' });
    }

    const newStudent = new Student({
      fullName,
      email,
      emergencyName: emergencyName || '',
      age: Number(age),
      gender,
      startDate,
      program: program || 'regular',
      department: department || 'computer science',
      assessments: assessments || {},
      document: document || null
    });

    await newStudent.save();
    return res.status(201).json({ message: 'Registration submitted successfully!', student: newStudent });
  } catch (error) {
    console.error('[SERVER] Save error:', error);
    return res.status(500).json({ message: 'Server error saving registration.' });
  }
});

// 🟢 PUT /api/students/:id - ተማሪ ማስተካከያ
apiRouter.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    return res.json(updatedStudent);
  } catch (error) {
    console.error('[SERVER] Update error:', error);
    return res.status(500).json({ message: 'Error updating student details.' });
  }
});

// 🟢 DELETE /api/students/:id - ተማሪ ማጥፊያ
apiRouter.delete('/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    return res.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    console.error('[SERVER] Delete error:', error);
    return res.status(500).json({ message: 'Error deleting student.' });
  }
});

app.use('/api', apiRouter);

app.get('/', (req, res) => res.send('API Server is running.'));

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found on server.` });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVER] Express Server running on http://localhost:${PORT}`);
});