import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUser, logout } from '../services/auth.service.js';
import { getAllStudents, getStudentQR } from '../services/student.service.js';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedQR, setSelectedQR] = useState(null);
    const [loadingQR, setLoadingQR] = useState(false);

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            navigate('/login');
        } else {
            setUser(userData);
            loadStudents();
        }
    }, [navigate]);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const data = await getAllStudents();
            setStudents(data);
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
                                Bienvenido, {user.first_name} {user.last_name}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Email: {user.email}
                            </p>
                            <p className="text-gray-600">
                                Rol: <span className="font-semibold text-green-600">{user.role}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {user.role === 'ADMIN' && (
                                <>
                                    <button
                                        onClick={() => navigate('/admin/teachers')}
                                        className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                                    >
                                        Gestionar Docentes
                                    </button>
                                    <button
                                        onClick={() => navigate('/admin/enroll')}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Matricular Alumno
                                    </button>
                                </>
                            )}
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
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Códigos QR de Estudiantes
                    </h2>

                    {error && (
                        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <p className="text-gray-600">Cargando estudiantes...</p>
                    ) : students.length === 0 ? (
                        <p className="text-gray-600">No hay estudiantes registrados.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {students.map((student) => (
                                <div
                                    key={student.id_student}
                                    className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow"
                                >
                                    <h3 className="font-bold text-lg text-gray-900">
                                        {student.first_name} {student.last_name}
                                    </h3>
                                    <p className="text-sm text-gray-600">ID: {student.id_student}</p>
                                    <p className="text-sm text-gray-600">
                                        Sección: {student.id_section || 'Sin asignar'}
                                    </p>
                                    <button
                                        onClick={() => handleShowQR(student.id_student)}
                                        disabled={loadingQR}
                                        className="mt-3 w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                                    >
                                        {loadingQR ? 'Cargando...' : 'Ver QR'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal QR */}
                {selectedQR && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedQR(null)}
                    >
                        <div
                            className="bg-white rounded-lg p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Código QR - {selectedQR.name}
                            </h3>
                            <div className="flex justify-center mb-4">
                                <img
                                    src={selectedQR.qr_image}
                                    alt={`QR de ${selectedQR.name}`}
                                    className="w-64 h-64 border border-gray-300"
                                />
                            </div>
                            <p className="text-sm text-gray-600 text-center mb-4">
                                Token: {selectedQR.qr_token}
                            </p>
                            <button
                                onClick={() => setSelectedQR(null)}
                                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
