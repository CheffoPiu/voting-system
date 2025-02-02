    -- Crear tabla de usuarios (si no existe)
    CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        cedula VARCHAR(20) NOT NULL UNIQUE,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        rol VARCHAR(20) DEFAULT 'USER'
    );

    -- Crear tabla de candidatos (si no existe)
    CREATE TABLE IF NOT EXISTS candidatos (
        id SERIAL PRIMARY KEY,
        cedula VARCHAR(20) NOT NULL UNIQUE,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        partido VARCHAR(100) NOT NULL,
        numero_lista INTEGER NOT NULL UNIQUE
    );


    -- Crear tabla de votos (si no existe)
    CREATE TABLE IF NOT EXISTS votes (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        candidate_id INT NOT NULL,
        fecha_voto TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (candidate_id) REFERENCES candidatos(id) ON DELETE CASCADE
    );

    -- Insertar usuario administrador si no existe
    INSERT INTO usuarios (cedula, nombre, apellido, email, password, rol)
    SELECT '1234567890', 'Usuario', 'Principal', 'admin@email.com', 'admin123', 'ADMIN'
    WHERE NOT EXISTS (
        SELECT 1 FROM usuarios WHERE email = 'admin@email.com'
    );

    -- Mensaje de confirmación
    SELECT '✅ Tablas creadas correctamente' AS status;