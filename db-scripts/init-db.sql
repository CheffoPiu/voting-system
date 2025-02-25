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
    SELECT '1234567890', 'Usuario', 'Principal', 'admin@email.com', '$2b$10$/PkPRVk4l.B4jWNBERFD7.Q8.hRzpeB6Ys42RH6OQ4XrpKXW1umQK', 'ADMIN'
    WHERE NOT EXISTS (
        SELECT 1 FROM usuarios WHERE email = 'admin@email.com'
    );

    -- Mensaje de confirmación
    SELECT '✅ Tablas creadas correctamente' AS status;

--Procedimientos Almacenados SP


-- reateUser
CREATE OR REPLACE FUNCTION public.sp_create_user(
    p_cedula VARCHAR,
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_email VARCHAR,
    p_password VARCHAR,
    p_rol VARCHAR DEFAULT 'USER'
)
RETURNS TABLE (
    id INT,
    cedula VARCHAR,
    nombre VARCHAR,
    apellido VARCHAR,
    email VARCHAR,
    rol VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO usuarios (cedula, nombre, apellido, email, password, rol)
    VALUES (p_cedula, p_nombre, p_apellido, p_email, p_password, p_rol)
    RETURNING usuarios.id, usuarios.cedula, usuarios.nombre, usuarios.apellido, usuarios.email, usuarios.rol;
END;
$$ LANGUAGE plpgsql;

-- getUsers
CREATE OR REPLACE FUNCTION public.sp_get_users()
RETURNS TABLE (
    id INT,
    cedula VARCHAR,
    nombre VARCHAR,
    apellido VARCHAR,
    email VARCHAR,
    rol VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    SELECT usuarios.id, usuarios.cedula, usuarios.nombre, usuarios.apellido, usuarios.email, usuarios.rol 
    FROM usuarios;
END;
$$ LANGUAGE plpgsql;


-- getTotalUsers
CREATE OR REPLACE FUNCTION public.sp_get_total_users()
RETURNS INTEGER AS $$
DECLARE
    total INTEGER;
BEGIN
    SELECT COUNT(*) INTO total FROM usuarios;
    RETURN total;
END;
$$ LANGUAGE plpgsql;


-- getUsersByIds
CREATE OR REPLACE FUNCTION public.sp_get_users_by_ids(user_ids INT[])
RETURNS TABLE (
    id INT,
    nombre VARCHAR,
    apellido VARCHAR,
    email VARCHAR,
    cedula VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    SELECT usuarios.id, usuarios.nombre, usuarios.apellido, usuarios.email, usuarios.cedula
    FROM usuarios
    WHERE usuarios.id = ANY(user_ids);
END;
$$ LANGUAGE plpgsql;


-- getUserByCedula
CREATE OR REPLACE FUNCTION public.sp_get_user_by_cedula(p_cedula VARCHAR)
RETURNS TABLE (
    id INT,
    cedula VARCHAR,
    nombre VARCHAR,
    apellido VARCHAR,
    email VARCHAR,
    password VARCHAR,
    rol VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    SELECT usuarios.id, usuarios.cedula, usuarios.nombre, usuarios.apellido, usuarios.email, usuarios.password, usuarios.rol
    FROM usuarios
    WHERE usuarios.cedula = p_cedula;
END;
$$ LANGUAGE plpgsql;


-- updateUser
CREATE OR REPLACE FUNCTION public.sp_update_user(
    p_user_id INT,
    p_cedula VARCHAR,
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_email VARCHAR,
    p_password VARCHAR,
    p_rol VARCHAR
)
RETURNS TABLE (
    id INT,
    cedula VARCHAR,
    nombre VARCHAR,
    apellido VARCHAR,
    email VARCHAR,
    rol VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    UPDATE usuarios
    SET cedula = p_cedula,
        nombre = p_nombre,
        apellido = p_apellido,
        email = p_email,
        password = p_password,
        rol = p_rol
    WHERE id = p_user_id
    RETURNING usuarios.id, usuarios.cedula, usuarios.nombre, usuarios.apellido, usuarios.email, usuarios.rol;
END;
$$ LANGUAGE plpgsql;

-- deleteUser
CREATE OR REPLACE FUNCTION public.sp_delete_user(p_user_id INT)
RETURNS TABLE (
    id INT,
    cedula VARCHAR,
    nombre VARCHAR,
    apellido VARCHAR,
    email VARCHAR,
    rol VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    DELETE FROM usuarios
    WHERE usuarios.id = p_user_id
    RETURNING usuarios.id, usuarios.cedula, usuarios.nombre, usuarios.apellido, usuarios.email, usuarios.rol;
END;
$$ LANGUAGE plpgsql;



-- createCandidato
CREATE OR REPLACE FUNCTION public.sp_create_candidato(
    p_cedula VARCHAR,
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_partido VARCHAR,
    p_numero_lista INT
)
RETURNS TABLE (
    id INT,
    cedula VARCHAR,
    nombre VARCHAR,
    apellido VARCHAR,
    partido VARCHAR,
    numero_lista INT
)
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO candidatos (cedula, nombre, apellido, partido, numero_lista)
    VALUES (p_cedula, p_nombre, p_apellido, p_partido, p_numero_lista)
    RETURNING candidatos.id, candidatos.cedula, candidatos.nombre, candidatos.apellido, candidatos.partido, candidatos.numero_lista;
END;
$$ LANGUAGE plpgsql;

-- getCandidatos
CREATE OR REPLACE FUNCTION public.sp_get_candidatos()
RETURNS TABLE (
    id INT,
    cedula VARCHAR,
    nombre VARCHAR,
    apellido VARCHAR,
    partido VARCHAR,
    numero_lista INT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.cedula, c.nombre, c.apellido, c.partido, c.numero_lista 
    FROM candidatos c;
END;
$$ LANGUAGE plpgsql;


-- updateCandidato
CREATE OR REPLACE FUNCTION public.sp_update_candidato(
    p_id INT,
    p_cedula VARCHAR,
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_partido VARCHAR,
    p_numero_lista INT
)
RETURNS TABLE (
    id INT,
    cedula VARCHAR,
    nombre VARCHAR,
    apellido VARCHAR,
    partido VARCHAR,
    numero_lista INT
)
AS $$
BEGIN
    RETURN QUERY
    UPDATE public.candidatos AS c SET
        cedula = p_cedula,
        nombre = p_nombre,
        apellido = p_apellido,
        partido = p_partido,
        numero_lista = p_numero_lista
    WHERE c.id = p_id
    RETURNING c.id, c.cedula, c.nombre, c.apellido, c.partido, c.numero_lista;
END;
$$ LANGUAGE plpgsql;


-- deleteCandidato
CREATE OR REPLACE FUNCTION public.sp_delete_candidato(p_id INT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM candidatos WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- getCandidatesByIds
CREATE OR REPLACE FUNCTION public.sp_get_candidates_by_ids(p_candidate_ids INT[])
RETURNS TABLE (
    id INT,
    nombre VARCHAR,
    partido VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.nombre, c.partido
    FROM candidatos c
    WHERE c.id = ANY(p_candidate_ids);
END;
$$ LANGUAGE plpgsql;



-- createVote
CREATE OR REPLACE FUNCTION public.sp_create_vote(
    p_user_id INT,
    p_candidate_id INT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO votes (user_id, candidate_id, fecha_voto)
    VALUES (p_user_id, p_candidate_id, NOW());
END;
$$ LANGUAGE plpgsql;

-- getResults
CREATE OR REPLACE FUNCTION public.sp_get_results()
RETURNS TABLE (
    nombre VARCHAR,
    partido VARCHAR,
    numero_lista INT,
    votos BIGINT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT c.nombre, c.partido, c.numero_lista, COUNT(v.id) as votos
    FROM votes v
    JOIN candidatos c ON v.candidate_id = c.id
    GROUP BY c.id, c.nombre, c.partido, c.numero_lista;
END;
$$ LANGUAGE plpgsql;