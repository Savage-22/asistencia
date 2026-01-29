-- 1. AULAS / SECCIONES
CREATE TABLE sections (
    id_section CHAR(2) PRIMARY KEY,
    grade VARCHAR(50) NOT NULL,
    level VARCHAR(50) NOT NULL,
    section_name CHAR(1) NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT unique_grade_section UNIQUE (grade, section_name)
);

-- 2. USUARIOS DEL SISTEMA (Docentes / Admin)
CREATE TABLE users (
    id_user CHAR(10) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'TEACHER', -- 'ADMIN', 'TEACHER'
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 3. PADRES DE FAMILIA
CREATE TABLE parents (
    id_parent CHAR(10) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL, -- Vital para WhatsApp/SMS
    email VARCHAR(100), -- Vital para Notificaciones
    created_at DATE DEFAULT CURRENT_DATE,
    CONSTRAINT unique_parent_email UNIQUE (email)
);

-- 4. ALUMNOS
CREATE TABLE students (
    id_student CHAR(10) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    qr_token VARCHAR(255) UNIQUE, -- Este es el valor que va en el QR
    id_section CHAR(2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATE DEFAULT CURRENT_DATE,
    CONSTRAINT fk_students_section
        FOREIGN KEY (id_section)
        REFERENCES section(id_section)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 5. RELACIÓN ALUMNO-PADRE (Muchos a Muchos)
CREATE TABLE student_parents (
    id_student CHAR(10) NOT NULL,
    id_parent CHAR(10) NOT NULL,
    relationship_type VARCHAR(20) NOT NULL DEFAULT 'PADRE',
    PRIMARY KEY (id_student, id_parent),
    CONSTRAINT fk_sp_student
        FOREIGN KEY (id_student)
        REFERENCES students(id_student)
        ON DELETE CASCADE,
    CONSTRAINT fk_sp_parent
        FOREIGN KEY (id_parent)
        REFERENCES parents(id_parent)
        ON DELETE CASCADE,
    CONSTRAINT chk_relationship_type
        CHECK (relationship_type IN ('PADRE', 'MADRE', 'APODERADO'))
);

-- 6. RELACIÓN DOCENTE-SECCIÓN (Muchos a Muchos)
CREATE TABLE teacher_sections (
    id_user CHAR(10) NOT NULL,
    id_section CHAR(2) NOT NULL,
    assigned_at DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_user, id_section),
    CONSTRAINT fk_ts_user
        FOREIGN KEY (id_user)
        REFERENCES users(id_user)
        ON DELETE CASCADE,
    CONSTRAINT fk_ts_section
        FOREIGN KEY (id_section)
        REFERENCES sections(id_section)
        ON DELETE CASCADE
);

-- 7. ASISTENCIA (La tabla más importante)
CREATE TABLE attendance (
    id_atten CHAR(10) PRIMARY KEY,
    id_student CHAR(10) NOT NULL,
    recorded_by CHAR(10) NOT NULL, -- Qué docente escaneó
    check_in_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_record DATE DEFAULT CURRENT_DATE, -- Para búsquedas rápidas por día
    status VARCHAR(20) NOT NULL,
    incident_comment TEXT, -- "Vino sin uniforme", etc.
    CONSTRAINT fk_attendance_student
        FOREIGN KEY (id_student)
        REFERENCES students(id_student)
        ON DELETE CASCADE,
    CONSTRAINT fk_attendance_user
        FOREIGN KEY (recorded_by)
        REFERENCES users(id_user),
    CONSTRAINT chk_attendance_status
        CHECK (status IN ('PRESENTE', 'TARDE', 'FALTA', 'JUSTIFICADO')),
    CONSTRAINT unique_attendance_per_day
        UNIQUE (id_student, date_record)
);
