import { BrowserRouter as Router, Routes, Route} from 'react-router'
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import AdminEnrollment from './pages/AdminEnrollment.jsx';
import AdminTeachers from './pages/AdminTeachers.jsx';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/admin/enroll' element={<AdminEnrollment />} />
          <Route path='/admin/teachers' element={<AdminTeachers />} />
      </Routes>
      </div>
    </Router>
  )
};