import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUser, logout } from '../services/auth.service.js';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            navigate('/login');
        } else {
            setUser(userData);
        }
    }, [navigate]);

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
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Dashboard - Sistema de Asistencia
                    </h2>
                    <p className="text-gray-600">
                        ¡El login está funcionando correctamente! 🎉
                    </p>
                    <p className="text-gray-600 mt-2">
                        Ahora puedes comenzar a desarrollar las funcionalidades del sistema.
                    </p>
                </div>
            </div>
        </div>
    );
}
