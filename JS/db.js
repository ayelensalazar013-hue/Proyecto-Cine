console.log("DB INICIANDO");


window.AppDB = {
    db: null,
    fileName: 'cine_database.sqlite',

    // Inicializar Motor SQLite con OPFS
    initDB: async function() {
        if (this.db) return;

        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });

        // Intentar leer binario directamente de OPFS
        const opfsData = await this.readFromOPFS();

        if (opfsData) {
            this.db = new SQL.Database(opfsData);
        } else {
            // Si no existe localmente, crear esquema inicial adaptado a Cine
            this.db = new SQL.Database();
            this.db.run(`
                PRAGMA foreign_keys = ON;

                CREATE TABLE IF NOT EXISTS Cine (
                    id_cine INTEGER PRIMARY KEY AUTOINCREMENT,
                    nom_centrocomercial TEXT,
                    direccion TEXT,
                    nombre_cine TEXT,
                    cant_salas INTEGER
                );

                CREATE TABLE IF NOT EXISTS Empleado (
                    id_empleado INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_cine INTEGER,
                    nombre_emp TEXT,
                    apellido_emp TEXT,
                    cuit_emp TEXT,
                    cargo_emp TEXT,
                    FOREIGN KEY (id_cine) REFERENCES Cine(id_cine) ON DELETE CASCADE ON UPDATE CASCADE
                );

                CREATE TABLE IF NOT EXISTS Sala (
                    id_sala INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_cine INTEGER,
                    nro_sala INTEGER,
                    cant_butacas INTEGER,
                    sala_estado TEXT,
                    nro_butaca INTEGER,
                    butaca_estado TEXT,
                    FOREIGN KEY (id_cine) REFERENCES Cine(id_cine) ON DELETE CASCADE ON UPDATE CASCADE
                );

                CREATE TABLE IF NOT EXISTS Pelicula (
                    id_pelicula INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre_pel TEXT,
                    duracion_min INTEGER,
                    calificacion_pel TEXT,
                    pais_origen TEXT,
                    genero_pel TEXT,
                    pel_estado TEXT
                );

                CREATE TABLE IF NOT EXISTS Precio (
                    id_precio INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_cine INTEGER,
                    tipo_entrada TEXT,
                    dia_semana TEXT,
                    monto REAL,
                    FOREIGN KEY (id_cine) REFERENCES Cine(id_cine) ON DELETE CASCADE ON UPDATE CASCADE
                );

                CREATE TABLE IF NOT EXISTS Cliente (
                    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre_cli TEXT,
                    apellido_cli TEXT,
                    dni_cli TEXT,
                    email_cli TEXT,
                    telefono_cli TEXT,
                    fecha_nacimiento_cli TEXT
                );

                CREATE TABLE IF NOT EXISTS Funcion (
                    id_funcion INTEGER PRIMARY KEY AUTOINCREMENT,
                    fecha_hora_funcion TEXT,
                    tipo_funcion TEXT
                );

                CREATE TABLE IF NOT EXISTS Programacion (
                    id_programacion_sem INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_funcion INTEGER,
                    id_pelicula INTEGER,
                    id_sala INTEGER,
                    FOREIGN KEY (id_funcion) REFERENCES Funcion(id_funcion) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (id_pelicula) REFERENCES Pelicula(id_pelicula) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (id_sala) REFERENCES Sala(id_sala) ON DELETE CASCADE ON UPDATE CASCADE
                );

                CREATE TABLE IF NOT EXISTS Comprobante_venta (
                    id_comprobante_venta INTEGER PRIMARY KEY AUTOINCREMENT,
                    nro_venta TEXT,
                    fecha_venta TEXT,
                    monto_total REAL,
                    id_sala INTEGER,
                    id_pelicula INTEGER,
                    id_cliente INTEGER,
                    horario_desde TEXT,
                    horario_hasta TEXT,
                    FOREIGN KEY (id_sala) REFERENCES Sala(id_sala) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (id_pelicula) REFERENCES Pelicula(id_pelicula) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE SET NULL ON UPDATE CASCADE
                );

                CREATE TABLE IF NOT EXISTS Entradas (
                    id_entrada INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_comprobante_venta INTEGER,
                    id_funcion INTEGER,
                    id_precio INTEGER,
                    tipo_entrada TEXT,
                    reserva_estado TEXT,
                    fecha_venta_entrada TEXT,
                    FOREIGN KEY (id_comprobante_venta) REFERENCES Comprobante_venta(id_comprobante_venta) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (id_funcion) REFERENCES Funcion(id_funcion) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (id_precio) REFERENCES Precio(id_precio) ON DELETE CASCADE ON UPDATE CASCADE
                );

                CREATE INDEX IF NOT EXISTS idx_programacion_pelicula ON Programacion(id_pelicula);
                CREATE INDEX IF NOT EXISTS idx_entradas_funcion ON Entradas(id_funcion);
                CREATE INDEX IF NOT EXISTS idx_cliente_dni ON Cliente(dni_cli);
            `);

            // Datos base de infraestructura (sede, sala y tarifa inicial sin títulos hardcodeados)
            this.db.run(`
                INSERT INTO Cine (nom_centrocomercial, direccion, nombre_cine, cant_salas)
                VALUES ('Sede Central', 'Av. Rivadavia 1635, CABA', 'Círculo Cine Centro', 8);

                INSERT INTO Sala (id_cine, nro_sala, cant_butacas, sala_estado, nro_butaca, butaca_estado)
                VALUES (1, 1, 48, 'Habilitada', 1, 'Disponible');

                INSERT INTO Precio (id_cine, tipo_entrada, dia_semana, monto)
                VALUES (1, 'General 2D', 'Todos', 4000.00);

                INSERT INTO Pelicula (id_pelicula, nombre_pel, duracion_min, calificacion_pel, pais_origen, genero_pel, pel_estado)
VALUES 
(1, '4 HISTORIAS INCREIBLES', 82, '+13', 'Argentina', 'Comedia', 'En cartelera'),
(2, 'PERTENENCIAS', 82, 'ATP', 'Argentina', 'Documental', 'En cartelera'),
(3, '¿QUERES SER MI HIJO?', 98, '+13', 'Argentina', 'Comedia', 'En cartelera'),
(4, 'DESOBEDIENTE', 109, '+13', 'Argentina', 'Documental', 'En cartelera'),
(5, 'LA CASA', 108, '+13', 'Argentina', 'Suspenso', 'En cartelera'),
(6, 'LO DEJAMOS ACA', 98, '+13', 'Argentina', 'Comedia', 'En cartelera'),
(7, 'PEPITA LA PISTOLERA', 103, '+18', 'Argentina', 'Suspenso', 'En cartelera'),
(8, 'RETRATO, ELOGIO AL DUELO', 79, '+13', 'Argentina', 'Drama', 'Estreno'),
(9, 'EL LLANTO DEL PERRO', 72, '+18', 'Argentina', 'Terror', 'Estreno'),
(10, 'ANNEMARIE', 75, 'ATP', 'Argentina', 'Documental', 'Estreno'),
(11, 'HOSPITAL BRITANICO', 70, 'ATP', 'Argentina', 'Documental', 'Estreno'),
(12, 'MUSEO DE LA SUBVERSION', 68, 'ATP', 'Argentina', 'Documental', 'Estreno'),
(13, 'LA YEGUA DE TROYA', 64, 'ATP', 'Argentina', 'Documental', 'En cartelera'),
(14, 'ABUELO GAUCHO', 66, 'ATP', 'Argentina', 'Documental', 'En cartelera'),
(15, 'OLIVIA', 126, '+13', 'Argentina', 'Drama', 'En cartelera'),
(16, 'TRES ADIOSES', 122, 'ATP', 'España', 'Drama', 'Estreno'),
(17, 'EL BAÑO DEL PAPA', 100, '+13', 'Uruguay', 'Drama', 'Estreno'),
(18, 'MADRE SINIESTRA', 93, '+13', 'Estados Unidos', 'Terror', 'Preestreno'),
(19, 'LOS OTROS', 105, '+13', 'España', 'Terror', 'Preestreno'),
(20, 'JEANNE DIELMAN,23,QUAI DU COMMERCE,1080 BRUXELLES', 201, '+18', 'Bélgica', 'Drama', 'Preestreno'),
(21, 'LA CONVERSACION', 113, '+18', 'Estados Unidos', 'Suspenso', 'Estreno');


            `);

            await this.save(); // Guardar archivo inicial en OPFS
        }
    },

    // --- LEER DE OPFS ---
    readFromOPFS: async function() {
        try {
            const root = await navigator.storage.getDirectory();
            const fileHandle = await root.getFileHandle(this.fileName);
            const file = await fileHandle.getFile();
            const buffer = await file.arrayBuffer();
            return new Uint8Array(buffer);
        } catch (error) {
            console.info("Archivo OPFS no encontrado. Creando nueva base de datos...");
            return null;
        }
    },

    // --- GUARDAR EN OPFS ---
    save: async function() {
        try {
            const data = this.db.export(); // ArrayBuffer binario
            const root = await navigator.storage.getDirectory();
            const fileHandle = await root.getFileHandle(this.fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(data);
            await writable.close();
        } catch (error) {
            console.error("Error al guardar en OPFS:", error);
        }
    },

    // --- RESPALDO A CLOUD BAAS (Supabase Storage / API Externa) ---
    uploadToBaaS: async function(supabaseUrl, supabaseKey, userId) {
        try {
            const fileData = await this.readFromOPFS();
            if (!fileData) return false;

            const blob = new Blob([fileData], { type: 'application/x-sqlite3' });
            const filePath = `backups/cine_${userId}_database.sqlite`;

            const response = await fetch(`${supabaseUrl}/storage/v1/object/cine-backups/${filePath}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${supabaseKey}`,
                    'apikey': supabaseKey,
                    'x-upsert': 'true'
                },
                body: blob
            });

            return response.ok;
        } catch (error) {
            console.warn("Falla en sincronización BaaS Cloud:", error);
            return false;
        }
    },

    // --- DESCARGAR ARCHIVO BASE DE DATOS LOCALMENTE ---
    downloadDB: async function() {
        const fileData = await this.readFromOPFS();
        if (!fileData) return alert("No hay datos cargados.");

        const blob = new Blob([fileData], { type: 'application/x-sqlite3' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.fileName;
        a.click();
        URL.revokeObjectURL(url);
    },

    // Ejecutador de consultas SQL
    query: function(sql, params = []) {
        if (!this.db) {
            throw new Error("La base de datos no está inicializada. Ejecutá await window.AppDB.initDB() primero.");
        }
        const stmt = this.db.prepare(sql);
        stmt.bind(params);
        const result = [];
        while (stmt.step()) {
            result.push(stmt.getAsObject());
        }
        stmt.free();
        return result;
    }
};