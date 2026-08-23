import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Student from './models/Student.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/designAcademyDB';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('[SERVER] Connected to MongoDB.'))
  .catch(err => console.error('[SERVER] MongoDB connection error:', err));

// 🛠️ 1. የተለየ የ Employee Schema
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, default: 'Engineering' },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  status: { type: String, default: 'Active' },
  avatar: { type: String, default: '' },
  documents: [
    {
      id: Number,
      name: String,
      size: String,
      type: String,
      data: String,
      uploadedAt: String
    }
  ]
}, { timestamps: true });

// 🛠️ 2. ለ Teacher የሚሆን ሙሉ በሙሉ የተስተካከለ ስኪማ (Emergency እና Documents የያዘ)
const teacherSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'Computer Science' },
  status: { type: String, default: 'Active' },
  avatar: { type: String, default: '' },
  emergencyName: { type: String, default: '' },
  emergencyPhone: { type: String, default: '' },
  documents: [
    {
      id: Number,
      name: String,
      size: String,
      type: String,
      data: String,
      uploadedAt: String
    }
  ]
}, { timestamps: true });

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);
const Course = mongoose.models.Course || mongoose.model('Course', new mongoose.Schema({
  title: String,
  department: String,
  code: String
}, { timestamps: true }));

const apiRouter = express.Router();

// --- የተማሪዎች ራውቶች ---
apiRouter.get('/students', async (req, res) => {
  try {
    const students = await Student.find().collation({ locale: 'en', strength: 2 }).sort({ fullName: 1 });
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching students.' });
  }
});

// --- የኮርሶች ራውቶች ---
apiRouter.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    return res.json(courses);
  } catch (error) {
    return res.json([]);
  }
});

apiRouter.post('/courses', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    return res.status(201).json(savedCourse);
  } catch (error) {
    return res.status(500).json({ message: 'Error saving course.' });
  }
});

// --- የሰራተኞች (Employees) ራውቶች ---
apiRouter.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    return res.json(employees);
  } catch (error) {
    return res.json([]);
  }
});

apiRouter.post('/employees', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    return res.status(201).json(savedEmployee);
  } catch (error) {
    console.error('Error saving employee:', error);
    return res.status(500).json({ message: 'Error saving employee.' });
  }
});

apiRouter.put('/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    return res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    return res.status(500).json({ message: 'Error updating employee.' });
  }
});

apiRouter.delete('/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    return res.json({ message: 'Employee deleted successfully.' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({ message: 'Error deleting employee.' });
  }
});

// --- የአስተማሪዎች (Teachers) ራውቶች ---
apiRouter.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    return res.json(teachers);
  } catch (error) {
    return res.json([]);
  }
});

apiRouter.post('/teachers', async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    const savedTeacher = await newTeacher.save();
    return res.status(201).json(savedTeacher);
  } catch (error) {
    console.error('Error saving teacher:', error);
    return res.status(500).json({ message: 'Error saving teacher.' });
  }
});

// ✏️ የአስተማሪ መረጃ ማሻሻያ (PUT Route for Teachers)
apiRouter.put('/teachers/:id', async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    return res.json(updatedTeacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    return res.status(500).json({ message: 'Error updating teacher.' });
  }
});

// 🗑️ አስተማሪን ለመሰረዝ (DELETE Route for Teachers)
apiRouter.delete('/teachers/:id', async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    return res.json({ message: 'Teacher deleted successfully.' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return res.status(500).json({ message: 'Error deleting teacher.' });
  }
});

app.use('/api', apiRouter);

app.get('/', (req, res) => res.send('API Server is running.'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVER] Express Server running on http://localhost:${PORT}`);
});