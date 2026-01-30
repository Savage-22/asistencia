import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUser, logout } from '../services/auth.service.js';
import { enrollStudent, getSections } from '../services/enrollment.service.js';
import FormInput from '../components/forms/formInput.jsx';
import FormSubmitButton from '../components/forms/formSubmitButton.jsx';

export default function AdminEnrollment() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        // Datos del estudiante
        student_first_name: '',
        student_last_name: '',
        id_section: '',
        // Datos del apoderado
        parent_first_name: '',
        parent_last_name: '',
        parent_phone: '',
        parent_email: '',
        relationship_type: 'APODERADO'
    });

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            navigate('/login');
        } else if (userData.role !== 'ADMIN') {
            navigate('/dashboard');
        } else {
            setUser(userData);
            loadSections();
        }
    }, [navigate]);

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
            const enrollmentData = {
                student: {
                    first_name: formData.student_first_name,
                    last_name: formData.student_last_name,
                    id_section: formData.id_section
                },
                parent: {
                    first_name: formData.parent_first_name,
                    last_name: formData.parent_last_name,
                    phone: formData.parent_phone,
                    email: formData.parent_email,
                    relationship_type: formData.relationship_type
                }
            };

            await enrollStudent(enrollmentData);
            setSuccess('¡Estudiante matriculado exitosamente!');
            
            // Limpiar formulario
            setFormData({
                student_first_name: '',
                student_last_name: '',
                id_section: '',
                parent_first_name: '',
                parent_last_name: '',
                parent_phone: '',
                parent_email: '',
                relationship_type: 'APODERADO'
            });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Panel de Administración
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {user.first_name} {user.last_name} - {user.role}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Ver Estudiantes
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>

                {/* Formulario de Matrícula */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Matricular Nuevo Estudiante
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Datos del Estudiante */}
                        <div className="border-b pb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Datos del Estudiante
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    id="student_first_name"
                                    name="Nombre del Estudiante"
                                    type="text"
                                    value={formData.student_first_name}
                                    onChange={handleChange}
                                    placeholder="Juan"
                                />
                                <FormInput
                                    id="student_last_name"
                                    name="Apellido del Estudiante"
                                    type="text"
                                    value={formData.student_last_name}
                                    onChange={handleChange}
                                    placeholder="Pérez"
                                />
                            </div>
                            
                            <div className="mt-4">
                                <label className="text-sm font-medium text-gray-700 text-left block mb-2">
                                    Sección
                                </label>
                                <select
                                    name="id_section"
                                    value={formData.id_section}
                                    onChange={handleChange}
                                    className="w-full bg-white rounded-md border-2 border-green-500 px-4 py-3 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="">Seleccione una sección</option>
                                    {sections.map(section => (
                                        <option key={section.id_section} value={section.id_section}>
                                            {section.grade} - {section.section_name} ({section.level})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Datos del Apoderado */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Datos del Apoderado
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    id="parent_first_name"
                                    name="Nombre del Apoderado"
                                    type="text"
                                    value={formData.parent_first_name}
                                    onChange={handleChange}
                                    placeholder="María"
                                />
                                <FormInput
                                    id="parent_last_name"
                                    name="Apellido del Apoderado"
                                    type="text"
                                    value={formData.parent_last_name}
                                    onChange={handleChange}
                                    placeholder="García"
                                />
                                <FormInput
                                    id="parent_phone"
                                    name="Teléfono del Apoderado"
                                    type="tel"
                                    value={formData.parent_phone}
                                    onChange={handleChange}
                                    placeholder="987654321"
                                    maxLength={15}
                                />
                                <FormInput
                                    id="parent_email"
                                    name="Correo Electrónico del Apoderado"
                                    type="email"
                                    value={formData.parent_email}
                                    onChange={handleChange}
                                    placeholder="maria@example.com"
                                />
                            </div>
                            
                            <div className="mt-4">
                                <label className="text-sm font-medium text-gray-700 text-left block mb-2">
                                    Relación
                                </label>
                                <select
                                    name="Relación"
                                    value={formData.relationship_type}
                                    onChange={handleChange}
                                    className="w-full bg-white rounded-md border-2 border-green-500 px-4 py-3 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="APODERADO">Apoderado</option>
                                    <option value="PADRE">Padre</option>
                                    <option value="MADRE">Madre</option>
                                </select>
                            </div>
                        </div>

                        <FormSubmitButton disabled={loading}>
                            {loading ? 'Matriculando...' : 'Matricular Estudiante'}
                        </FormSubmitButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
