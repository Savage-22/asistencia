import QRCode from 'qrcode';

/**
 * Genera una imagen de código QR en formato Data URI (Base64).
 * 
 * ¿Para qué sirve?
 * - Cada estudiante tendrá un QR único con su ID
 * - El docente escanea el QR para marcar asistencia
 * - El QR contiene el id_student encriptado o el qr_token
 * 
 * @param {string} textToEncode - El texto único que contendrá el QR (ej: id_student o qr_token)
 * @returns {Promise<string>} - Data URI en base64 (ej: "data:image/png;base64,iVBORw..." * 
 */
export const generateQRCodeImage = async (textToEncode) => {
    try {
        const options = {
            errorCorrectionLevel: 'H', // Alto nivel de corrección (resiste hasta 30% de daño)
            type: 'image/png',
            quality: 0.92,
            margin: 1,                  // Margen blanco (1 = mínimo)
            width: 300,                 // Tamaño en píxeles (añadí esto)
            color: {
                dark: '#000000',        // Color de los módulos (negro)
                light: '#ffffff'        // Color del fondo (blanco)
            }
        };

        const dataUri = await QRCode.toDataURL(textToEncode, options);
        return dataUri;

    } catch (error) {
        console.error('Error al generar el código QR:', error);
        throw new Error('No se pudo generar el código QR.');
    }
};

/**
 * Generar un token único y seguro para el QR del estudiante
 * crypto nativo de Node.js (SHA-256)
 * 
 * @param {string} studentId - ID del estudiante (ej: "2026100001")
 * @returns {string} - Token único de 32 caracteres hexadecimales
 * 
 * @example
 * generateQRToken('2026100001') 
 * // Resultado: "a7f3e9c2d1b8f4a6e5c3d2b1a9f8e7c6d5b4a3f2e1d0c9b8a7f6e5d4c3b2a1"
 */
export const generateQRToken = async (studentId) => {
    const crypto = await import('crypto');
    
    // Combinar ID + timestamp para garantizar unicidad
    const dataToHash = `${studentId}-${Date.now()}-${Math.random()}`;
    
    // Generar hash SHA-256 (64 caracteres hex)
    const hash = crypto.createHash('sha256')
        .update(dataToHash)
        .digest('hex');
    
    // Retornar los primeros 32 caracteres (suficiente para unicidad)
    return hash.substring(0, 32);
};
