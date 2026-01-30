import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Scanner } from '@yudiel/react-qr-scanner';
import { getUser, logout } from '../services/auth.service.js';
import { scanAttendance, getTodayAttendance } from '../services/attendance.service.js';

export default function TakeAttendance() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [scanning, setScanning] = useState(true);
    const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '', student: {} }
    const [todayAttendances, setTodayAttendances] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            navigate('/login');
        } else if (userData.role !== 'TEACHER') {
            navigate('/dashboard');
        } else {
            setUser(userData);
            loadTodayAttendances();
        }
    }, [navigate]);

    const loadTodayAttendances = async () => {
        try {
            const data = await getTodayAttendance();
            setTodayAttendances(data);
        } catch (err) {
            console.error('Error al cargar asistencias:', err);
        }
    };

    const handleScan = async (result) => {
        if (!scanning || !result || result.length === 0) return;

        const qrData = result[0].rawValue;
        setScanning(false); // Pausar escaneo

        try {
            const response = await scanAttendance(qrData);
            
            // Éxito - mostrar en verde
            setFeedback({
                type: 'success',
                message: '¡Asistencia registrada!',
                student: response.data.student
            });

            // Recargar lista de asistencias
            loadTodayAttendances();

            // Limpiar feedback después de 3 segundos y reanudar escaneo
            setTimeout(() => {
                setFeedback(null);
                setScanning(true);
            }, 3000);

        } catch (error) {
            // Error - mostrar en rojo
            let errorMessage = 'Error al registrar';
            
            if (error === 'QR_NO_ENCONTRADO') {
                errorMessage = 'QR no encontrado';
            } else if (error === 'ESTUDIANTE_INACTIVO') {
                errorMessage = 'Estudiante inactivo';
            } else if (error === 'YA_REGISTRADO') {
                errorMessage = 'Ya registró hoy';
            }

            setFeedback({
                type: 'error',
                message: errorMessage,
                student: null
            });

            // Limpiar error después de 2 segundos y reanudar escaneo
            setTimeout(() => {
                setFeedback(null);
                setScanning(true);
            }, 2000);
        }
    };

    const handleError = (error) => {
        console.error('Error de cámara:', error);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleBack = () => {
        navigate('/teacher/dashboard');
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Tomar Asistencia</h1>
                            <p className="text-sm text-gray-600">
                                Profesor {user.first_name} {user.last_name}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                {showHistory ? 'Escanear' : `Historial (${todayAttendances.length})`}
                            </button>
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Volver
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {!showHistory ? (
                    /* Vista de escaneo */
                    <div className="space-y-6">
                        {/* Escáner QR */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="relative">
                                <Scanner
                                    onScan={handleScan}
                                    onError={handleError}
                                    constraints={{
                                        facingMode: 'environment' // Usa cámara trasera en móviles
                                    }}
                                    styles={{
                                        container: {
                                            width: '100%',
                                            paddingTop: '75%', // Aspect ratio 4:3
                                            position: 'relative'
                                        },
                                        video: {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }
                                    }}
                                />
                                
                                {/* Overlay de guía */}
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <div className="w-64 h-64 border-4 border-white border-dashed rounded-lg"></div>
                                </div>

                                {/* Instrucción */}
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <p className="text-white text-lg font-semibold bg-black bg-opacity-50 inline-block px-4 py-2 rounded">
                                        {scanning ? 'Escanea el código QR' : 'Procesando...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feedback de resultado */}
                        {feedback && (
                            <div
                                className={`rounded-lg p-6 text-center shadow-lg transform transition-all duration-300 ${
                                    feedback.type === 'success'
                                        ? 'bg-green-500 text-white scale-105'
                                        : 'bg-red-500 text-white scale-105'
                                }`}
                            >
                                {feedback.type === 'success' ? (
                                    <>
                                        <div className="text-5xl mb-4">✓</div>
                                        <h2 className="text-3xl font-bold mb-2">
                                            {feedback.student.firstName} {feedback.student.lastName.charAt(0)}.
                                        </h2>
                                        <p className="text-xl">{feedback.message}</p>
                                        <p className="text-lg mt-2">
                                            {feedback.student.grade} - {feedback.student.section}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-5xl mb-4">✗</div>
                                        <h2 className="text-3xl font-bold mb-2">Error</h2>
                                        <p className="text-xl">{feedback.message}</p>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Instrucciones */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-bold text-blue-900 mb-2">📱 Instrucciones:</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Coloca el código QR dentro del cuadro</li>
                                <li>• Asegúrate de tener buena iluminación</li>
                                <li>• El sistema pausará automáticamente tras cada escaneo</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    /* Vista de historial */
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Asistencias de Hoy ({todayAttendances.length})
                        </h2>
                        
                        {todayAttendances.length === 0 ? (
                            <p className="text-gray-600 text-center py-8">
                                No hay asistencias registradas todavía
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {todayAttendances.map((attendance) => (
                                    <div
                                        key={attendance.id_atten}
                                        className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">
                                                {attendance.first_name} {attendance.last_name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {attendance.grade} - {attendance.section_name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-green-600">
                                                {attendance.status}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(attendance.check_in_timestamp).toLocaleTimeString('es-ES', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
