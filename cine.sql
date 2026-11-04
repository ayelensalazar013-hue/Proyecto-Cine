DROP DATABASE IF EXISTS Cine;
CREATE DATABASE Cine;
USE Cine;

-- =================================================================
-- 1. CREACIÓN DE TABLAS
-- =================================================================

-- Table: Cine
CREATE TABLE Cine (
    id_cine INT AUTO_INCREMENT PRIMARY KEY,
    nom_centrocomercial VARCHAR(100),
    direccion VARCHAR(150),
    nombre_cine VARCHAR(100),
    cant_salas INT
);

-- Table: Empleado
CREATE TABLE Empleado (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    id_cine INT,
    nombre_emp VARCHAR(50),
    apellido_emp VARCHAR(50),
    cuit_emp VARCHAR(20),
    cargo_emp VARCHAR(50),
    FOREIGN KEY (id_cine) REFERENCES Cine(id_cine) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: Sala
CREATE TABLE Sala (
    id_sala INT AUTO_INCREMENT PRIMARY KEY,
    id_cine INT,
    nro_sala INT,
    cant_butacas INT,
    sala_estado VARCHAR(20),
    nro_butaca INT NULL,
    butaca_estado VARCHAR(20) NULL,
    FOREIGN KEY (id_cine) REFERENCES Cine(id_cine) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: Pelicula
CREATE TABLE Pelicula (
    id_pelicula INT AUTO_INCREMENT PRIMARY KEY,
    nombre_pel VARCHAR(100),
    duracion_min INT,
    calificacion_pel VARCHAR(20),
    pais_origen VARCHAR(50),
    genero_pel VARCHAR(50),
    pel_estado VARCHAR(20)
);

-- Table: Precio
CREATE TABLE Precio (
    id_precio INT AUTO_INCREMENT PRIMARY KEY,
    id_cine INT,
    tipo_entrada VARCHAR(50),
    dia_semana VARCHAR(20),
    monto DECIMAL(10,2),
    FOREIGN KEY (id_cine) REFERENCES Cine(id_cine) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: Cliente
CREATE TABLE Cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cli VARCHAR(100),
    apellido_cli VARCHAR(100),
    dni_cli VARCHAR(20),
    email_cli VARCHAR(100),
    telefono_cli VARCHAR(20),
    fecha_nacimiento_cli DATE
);

-- Table: Funcion
CREATE TABLE Funcion (
    id_funcion INT AUTO_INCREMENT PRIMARY KEY,
    fecha_hora_funcion DATETIME,
    tipo_funcion VARCHAR(50)
);

-- Table: Programacion
CREATE TABLE Programacion (
    id_programacion_sem INT AUTO_INCREMENT PRIMARY KEY,
    id_funcion INT,
    id_pelicula INT,
    id_sala INT,
    FOREIGN KEY (id_funcion) REFERENCES Funcion(id_funcion) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_pelicula) REFERENCES Pelicula(id_pelicula) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_sala) REFERENCES Sala(id_sala) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: Comprobante_venta
CREATE TABLE Comprobante_venta (
    id_comprobante_venta INT AUTO_INCREMENT PRIMARY KEY,
    nro_venta VARCHAR(50),
    fecha_venta DATE,
    monto_total DECIMAL(10, 2),
    id_sala INT,
    id_pelicula INT,
    id_cliente INT NULL,
    horario_desde TIME,
    horario_hasta TIME,
    FOREIGN KEY (id_sala) REFERENCES Sala(id_sala) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_pelicula) REFERENCES Pelicula(id_pelicula) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Table: Entradas
CREATE TABLE Entradas (
    id_entrada INT AUTO_INCREMENT PRIMARY KEY,
    id_comprobante_venta INT,
    id_funcion INT,
    id_precio INT,
    tipo_entrada VARCHAR(50),
    reserva_estado VARCHAR(50),
    fecha_venta_entrada DATETIME,
    FOREIGN KEY (id_comprobante_venta) REFERENCES Comprobante_venta(id_comprobante_venta) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_funcion) REFERENCES Funcion(id_funcion) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_precio) REFERENCES Precio(id_precio) ON DELETE CASCADE ON UPDATE CASCADE
);
