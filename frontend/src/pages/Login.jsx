import { useState } from 'react';
import { useNavigate } from 'react-router';
import FormInput from '../components/forms/formInput.jsx';
import FormSubmitButton from '../components/forms/formSubmitButton.jsx';
import { loginService, saveAuthData } from '../services/auth.service.js';

export default function Home() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const [loginError, setLoginError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar error cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (loginError) setLoginError('');
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Validar email
        if (!formData.email) {
            newErrors.email = 'El correo es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Correo inválido';
        }
        
        // Validar contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError(''); // Limpiar errores globales
        
        if (validateForm()) {
            try {
                // Llamar al servicio de login
                const data = await loginService(formData.email, formData.password);
                console.log('Login exitoso:', data);
                
                // Guardar token y datos del usuario
                saveAuthData(data.token, data.user);
                
                // Redirigir según el rol del usuario
                if (data.user.role === 'ADMIN') {
                    navigate('/dashboard'); // Admin va al dashboard general
                } else if (data.user.role === 'TEACHER') {
                    navigate('/teacher/dashboard'); // Docente va a su dashboard
                } else {
                    navigate('/dashboard'); // Por defecto
                }
            } catch (error) {
                console.error('Error durante el login:', error);
                setLoginError(error);
            }
            
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Iniciar Sesión
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ingresa tus credenciales para acceder
                    </p>
                </div>

                {/* Formulario */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Error de login */}
                    {loginError && (
                        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <span className="block sm:inline">{loginError}</span>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <FormInput
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com"
                            error={errors.email}
                        />

                        <FormInput
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            error={errors.password}
                        />
                    </div>

                    <FormSubmitButton>
                        Ingresar
                    </FormSubmitButton>
                </form>
            </div>
        </div>
    );
}
