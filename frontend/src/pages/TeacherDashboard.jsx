import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUser, logout } from '../services/auth.service.js';
import { getTeacherStudents } from '../services/teacher.service.js';
import { getStudentQR } from '../services/student.service.js';

export default function TeacherDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [studentsBySections, setStudentsBySections] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedQR, setSelectedQR] = useState(null);
    const [loadingQR, setLoadingQR] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null); // Para ver la sección seleccionada

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            navigate('/login');
        } else if (userData.role !== 'TEACHER') {
            navigate('/dashboard'); // Si es admin, va al dashboard de admin
        } else {
            setUser(userData);
            loadMyStudents(userData.id_user);
        }
    }, [navigate]);

    const loadMyStudents = async (teacherId) => {
        try {
            setLoading(true);
            const data = await getTeacherStudents(teacherId);
            setStudents(data);
            
            // Agrupar estudiantes por sección
            const grouped = data.reduce((acc, student) => {
                const sectionKey = `${student.grade} - ${student.section_name}`;
                if (!acc[sectionKey]) {
                    acc[sectionKey] = [];
                }
                acc[sectionKey].push(student);
                return acc;
            }, {});
            
            setStudentsBySections(grouped);
        } catch (err) {
            setError(err);
            if (err.includes('Token') || err.includes('Acceso denegado')) {
                logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleShowQR = async (studentId) => {
        try {
            setLoadingQR(true);
            const qrData = await getStudentQR(studentId);
            setSelectedQR(qrData);
        } catch (err) {
            alert('Error al cargar QR: ' + err);
        } finally {
            setLoadingQR(false);
        }
    };

    const handlePrintQR = () => {
        window.print();
    };

    const handleBackToSections = () => {
        setSelectedSection(null);
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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Bienvenido, Profesor {user.first_name} {user.last_name}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {user.email}
                            </p>
                            <p className="text-gray-600">
                                Total de estudiantes: <span className="font-semibold text-green-600">{students.length}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate('/teacher/attendance')}
                                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-semibold"
                            >
                                📋 Tomar Asistencia
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {error && (
                    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <p className="text-gray-600">Cargando tus estudiantes...</p>
                    </div>
                ) : Object.keys(studentsBySections).length === 0 ? (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <p className="text-gray-600">No tienes secciones asignadas todavía.</p>
                        <p className="text-gray-500 text-sm mt-2">Contacta al administrador para que te asigne secciones.</p>
                    </div>
                ) : selectedSection ? (
                    /* Vista de estudiantes de la sección seleccionada */
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Sección: {selectedSection.name}
                                <span className="text-lg font-normal text-gray-600 ml-2">
                                    ({selectedSection.students.length} estudiantes)
                                </span>
                            </h2>
                            <button
                                onClick={handleBackToSections}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                                ← Volver a Secciones
                            </button>
                        </div>

                        {/* Lista de estudiantes */}
                        <div className="space-y-3">
                            {selectedSection.students.map((student) => (
                                <div
                                    key={student.id_student}
                                    className="flex items-center justify-between border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">
                                            {student.first_name} {student.last_name}
                                        </h3>
                                        <p className="text-sm text-gray-600">ID: {student.id_student}</p>
                                        <p className="text-sm text-gray-600">
                                            Estado: {student.is_active ? (
                                                <span className="text-green-600 font-semibold">Activo</span>
                                            ) : (
                                                <span className="text-red-600 font-semibold">Inactivo</span>
                                            )}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleShowQR(student.id_student)}
                                        disabled={loadingQR}
                                        className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
                                        title="Ver QR"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Vista de tarjetas de secciones */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.keys(studentsBySections).map((sectionName) => (
                            <div
                                key={sectionName}
                                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {sectionName}
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    {studentsBySections[sectionName].length} estudiante{studentsBySections[sectionName].length !== 1 ? 's' : ''}
                                </p>
                                <button
                                    onClick={() => setSelectedSection({
                                        name: sectionName,
                                        students: studentsBySections[sectionName]
                                    })}
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Ver Sección
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal QR */}
                {selectedQR && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 print:bg-white"
                        onClick={() => setSelectedQR(null)}
                    >
                        <div
                            className="bg-white rounded-lg p-6 max-w-md w-full print:shadow-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4 print:text-center">
                                Código QR - {selectedQR.name}
                            </h3>
                            <div className="flex justify-center mb-4">
                                <img
                                    src={selectedQR.qr_image}
                                    alt={`QR de ${selectedQR.name}`}
                                    className="w-64 h-64 border border-gray-300"
                                />
                            </div>
                            <p className="text-sm text-gray-600 text-center mb-4 print:hidden">
                                Token: {selectedQR.qr_token}
                            </p>
                            <div className="flex gap-2 print:hidden">
                                <button
                                    onClick={handlePrintQR}
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    🖨️ Imprimir
                                </button>
                                <button
                                    onClick={() => setSelectedQR(null)}
                                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
