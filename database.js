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
            // Si no existe localmente, crear esquema de CINE
            this.db = new SQL.Database();
            
            this.db.run(`
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
            `);
            
            this.db.run(`
                INSERT INTO Cine (nom_centrocomercial, direccion, nombre_cine, cant_salas) VALUES 
                ('Abasto Shopping', 'Av. Corrientes 3247, CABA', 'Cine Hoyts Abasto', 12);

                INSERT INTO Sala (id_cine, nro_sala, cant_butacas, sala_estado, nro_butaca, butaca_estado) VALUES 
                (1, 1, 150, 'Habilitada', 1, 'Disponible');

                INSERT INTO Pelicula (nombre_pel, duracion_min, calificacion_pel, pais_origen, genero_pel, pel_estado) VALUES 
                ('Spider-Man: Across the Spider-Verse', 140, 'ATP', 'Estados Unidos', 'Animación', 'Activa');
            `);

            await this.save(); // Guardar archivo inicial en OPFS
        }
    },

    // LEER DE OPFS 
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

    // GUARDAR EN OPFS
    save: async function() {
        try {
            const data = this.db.export();
            const root = await navigator.storage.getDirectory();
            const fileHandle = await root.getFileHandle(this.fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(data);
            await writable.close();
        } catch (error) {
            console.error("Error al guardar en OPFS:", error);
        }
    },

    // DESCARGAR ARCHIVO BASE DE DATOS LOCALMENTE
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
