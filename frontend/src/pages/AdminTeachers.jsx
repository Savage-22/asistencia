import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUser, logout } from '../services/auth.service.js';
import { createTeacher, getAllTeachers, assignSections, removeSection } from '../services/teacher.service.js';
import { getSections } from '../services/enrollment.service.js';
import FormInput from '../components/forms/formInput.jsx';
import FormSubmitButton from '../components/forms/formSubmitButton.jsx';

export default function AdminTeachers() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedSections, setSelectedSections] = useState([]);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            navigate('/login');
        } else if (userData.role !== 'ADMIN') {
            navigate('/dashboard');
        } else {
            setUser(userData);
            loadTeachers();
            loadSections();
        }
    }, [navigate]);

    const loadTeachers = async () => {
        try {
            const data = await getAllTeachers();
            setTeachers(data);
        } catch (err) {
            setError(err);
        }
    };

    const loadSections = async () => {
        try {
            const data = await getSections();
            setSections(data);
        } catch (err) {
            setError(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await createTeacher(formData);
            setSuccess('¡Docente creado exitosamente!');
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                password: ''
            });
            loadTeachers();
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAssignModal = (teacher) => {
        setSelectedTeacher(teacher);
        setSelectedSections(teacher.sections?.map(s => s.id_section) || []);
        setShowAssignModal(true);
    };

    const handleSectionToggle = (sectionId) => {
        setSelectedSections(prev => {
            if (prev.includes(sectionId)) {
                return prev.filter(id => id !== sectionId);
            } else {
                return [...prev, sectionId];
            }
        });
    };

    const handleAssignSections = async () => {
        try {
            setLoading(true);
            await assignSections(selectedTeacher.id_user, selectedSections);
            setSuccess('Secciones asignadas exitosamente');
            setShowAssignModal(false);
            loadTeachers();
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Gestión de Docentes
                        </h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate('/admin/enroll')}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                                Matricular Alumno
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Formulario Crear Docente */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Crear Nuevo Docente
                        </h2>

                        {success && (
                            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <FormInput
                                id="first_name"
                                name="first_name"
                                type="text"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Juan"
                            />
                            <FormInput
                                id="last_name"
                                name="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Pérez"
                            />
                            <FormInput
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="juan@escuela.com"
                            />
                            <FormInput
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Contraseña123"
                            />
                            <FormSubmitButton disabled={loading}>
                                {loading ? 'Creando...' : 'Crear Docente'}
                            </FormSubmitButton>
                        </form>
                    </div>

                    {/* Lista de Docentes */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Docentes Registrados ({teachers.length})
                        </h2>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto">
                            {teachers.map(teacher => (
                                <div
                                    key={teacher.id_user}
                                    className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow"
                                >
                                    <h3 className="font-bold text-lg text-gray-900">
                                        {teacher.first_name} {teacher.last_name}
                                    </h3>
                                    <p className="text-sm text-gray-600">{teacher.email}</p>
                                    <p className="text-sm text-gray-600">
                                        Secciones asignadas: {teacher.sections_count || 0}
                                    </p>
                                    <button
                                        onClick={() => handleOpenAssignModal(teacher)}
                                        className="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Asignar Secciones
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal Asignar Secciones */}
                {showAssignModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Asignar Secciones - {selectedTeacher.first_name} {selectedTeacher.last_name}
                            </h3>

                            <div className="space-y-2 mb-4">
                                {sections.map(section => (
                                    <label
                                        key={section.id_section}
                                        className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedSections.includes(section.id_section)}
                                            onChange={() => handleSectionToggle(section.id_section)}
                                            className="w-5 h-5 text-green-500"
                                        />
                                        <span className="font-medium">
                                            {section.grade} - {section.section_name} ({section.level})
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleAssignSections}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                                >
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button
                                    onClick={() => setShowAssignModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
