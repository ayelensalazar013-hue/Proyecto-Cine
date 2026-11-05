// CONSULTAS SQL PARA EL FRONTEND (Consumen window.AppDB.query)

const ConsultasCine = {
    // Script 1: Top 5 películas más vendidas
    getTopPeliculas: function() {
        return window.AppDB.query(`
            SELECT 
                Pelicula.id_pelicula,
                Pelicula.nombre_pel,
                Pelicula.genero_pel,
                COUNT(Entradas.id_entrada) AS total_entradas_vendidas
            FROM Entradas
            JOIN Comprobante_venta ON Entradas.id_comprobante_venta = Comprobante_venta.id_comprobante_venta
            JOIN Pelicula ON Comprobante_venta.id_pelicula = Pelicula.id_pelicula
            GROUP BY Pelicula.id_pelicula, Pelicula.nombre_pel, Pelicula.genero_pel
            ORDER BY total_entradas_vendidas DESC
            LIMIT 5;
        `);
    },

    // Script 2: Cartelera por fecha
    getCarteleraPorFecha: function(fecha) {
        return window.AppDB.query(`
            SELECT 
                Cine.nombre_cine,
                Sala.nro_sala,
                Pelicula.nombre_pel,
                Funcion.fecha_hora_funcion,
                Funcion.tipo_funcion
            FROM Funcion
            JOIN Programacion ON Funcion.id_funcion = Programacion.id_funcion
            JOIN Pelicula ON Programacion.id_pelicula = Pelicula.id_pelicula
            JOIN Sala ON Programacion.id_sala = Sala.id_sala
            JOIN Cine ON Sala.id_cine = Cine.id_cine
            WHERE DATE(Funcion.fecha_hora_funcion) = ?
            ORDER BY Cine.nombre_cine, Sala.nro_sala, Funcion.fecha_hora_funcion;
        `, [fecha]);
    },

    // Script 3: Catálogo de películas activas
    getPeliculasActivas: function() {
        return window.AppDB.query(`
            SELECT id_pelicula, nombre_pel, genero_pel, duracion_min, calificacion_pel, pais_origen
            FROM Pelicula
            WHERE pel_estado = 'Activa'
            ORDER BY nombre_pel ASC;
        `);
    },

    // Script 4: Buscar cliente por DNI o Apellido
    buscarCliente: function(criterio) {
        return window.AppDB.query(`
            SELECT id_cliente, nombre_cli, apellido_cli, dni_cli, email_cli, telefono_cli
            FROM Cliente
            WHERE dni_cli = ? OR apellido_cli LIKE ?;
        `, [criterio, `%${criterio}%`]);
    },

    // Script 5: Entradas reservadas
    getReservasPendientes: function() {
        return window.AppDB.query(`
            SELECT Entradas.id_entrada, Entradas.id_funcion, Entradas.tipo_entrada, Entradas.reserva_estado, Entradas.fecha_venta_entrada
            FROM Entradas
            WHERE Entradas.reserva_estado = 'Reservada'
            ORDER BY Entradas.fecha_venta_entrada DESC;
        `);
    },

    // Script 6: Películas nacionales
    getPeliculasNacionales: function() {
        return window.AppDB.query(`
            SELECT nombre_pel, genero_pel, calificacion_pel, pais_origen
            FROM Pelicula
            WHERE pais_origen = 'Argentina';
        `);
    },

    // Script 7: Estrenos y Preestrenos
    getEstrenosYPreestrenos: function() {
        return window.AppDB.query(`
            SELECT Funcion.id_funcion, Pelicula.nombre_pel, Funcion.tipo_funcion, Funcion.fecha_hora_funcion
            FROM Funcion
            JOIN Programacion ON Funcion.id_funcion = Programacion.id_funcion
            JOIN Pelicula ON Programacion.id_pelicula = Pelicula.id_pelicula
            WHERE Funcion.tipo_funcion IN ('Estreno', 'Preestreno');
        `);
    },

    // Script 8: Estado de butacas por sala
    getButacasDisponibles: function(idSala) {
        return window.AppDB.query(`
            SELECT Sala.id_sala, Sala.nro_sala, Sala.nro_butaca, Sala.butaca_estado
            FROM Sala
            WHERE Sala.id_sala = ? AND Sala.butaca_estado = 'Disponible';
        `, [idSala]);
    },

    // Script 9: Filtrar catálogo por género
    getPeliculasPorGenero: function(genero) {
        return window.AppDB.query(`
            SELECT nombre_pel, duracion_min, calificacion_pel, pais_origen
            FROM Pelicula
            WHERE genero_pel = ?
            ORDER BY duracion_min DESC;
        `, [genero]);
    },

    // Script 10: Auditoría de datos incompletos
    getAuditoriaPeliculas: function() {
        return window.AppDB.query(`
            SELECT id_pelicula, nombre_pel, duracion_min, calificacion_pel
            FROM Pelicula
            WHERE pais_origen IS NULL OR genero_pel IS NULL;
        `);
    },

    // Script 11: Películas en proyección por sede
    getProyeccionesPorSede: function() {
        return window.AppDB.query(`
            SELECT Cine.nombre_cine, Sala.nro_sala, Pelicula.nombre_pel, Pelicula.calificacion_pel, Pelicula.duracion_min
            FROM Programacion
            JOIN Sala ON Programacion.id_sala = Sala.id_sala
            JOIN Cine ON Sala.id_cine = Cine.id_cine
            JOIN Pelicula ON Programacion.id_pelicula = Pelicula.id_pelicula;
        `);
    },

    // Script 12: Películas de larga duración (> 120 min)
    getPeliculasLargas: function() {
        return window.AppDB.query(`
            SELECT nombre_pel, duracion_min, genero_pel
            FROM Pelicula
            WHERE duracion_min > 120;
        `);
    },

    // Script 13: Películas ATP
    getPeliculasATP: function() {
        return window.AppDB.query(`
            SELECT nombre_pel, calificacion_pel, pais_origen
            FROM Pelicula
            WHERE calificacion_pel = 'ATP';
        `);
    },

    // Script 14: Detalle completo de comprobante de venta
    getDetalleComprobante: function() {
        return window.AppDB.query(`
            SELECT Comprobante_venta.nro_venta, Comprobante_venta.fecha_venta, Entradas.id_funcion AS nro_funcion, Sala.nro_sala, Pelicula.nombre_pel, Comprobante_venta.horario_desde AS hora_funcion, Precio.monto AS precio, Entradas.tipo_entrada, Pelicula.calificacion_pel
            FROM Entradas
            JOIN Comprobante_venta ON Entradas.id_comprobante_venta = Comprobante_venta.id_comprobante_venta
            JOIN Sala ON Comprobante_venta.id_sala = Sala.id_sala
            JOIN Pelicula ON Comprobante_venta.id_pelicula = Pelicula.id_pelicula
            JOIN Precio ON Entradas.id_precio = Precio.id_precio;
        `);
    },

    // Script 15: Salas habilitadas
    getSalasHabilitadas: function() {
        return window.AppDB.query(`
            SELECT Cine.nombre_cine, Sala.nro_sala, Sala.cant_butacas, Sala.sala_estado
            FROM Sala
            JOIN Cine ON Sala.id_cine = Cine.id_cine
            WHERE Sala.sala_estado = 'Habilitada';
        `);
    },
    obtenerMatrizSala: function(idFuncion, idSala, filas = 10, columnas = 10) {
        const entradasOcupadas = window.AppDB.query(`
            SELECT Sala.nro_butaca 
            FROM Entradas
            JOIN Comprobante_venta ON Entradas.id_comprobante_venta = Comprobante_venta.id_comprobante_venta
            JOIN Sala ON Comprobante_venta.id_sala = Sala.id_sala
            WHERE Entradas.id_funcion = ? AND Sala.id_sala = ?;
        `, [idFuncion, idSala]);

        const listaOcupadas = entradasOcupadas.map(e => e.nro_butaca);

        const matriz = [];
        let numeroButaca = 1;

        for (let f = 0; f < filas; f++) {
            const filaActual = [];
            for (let c = 0; c < columnas; c++) {
                const estaOcupada = listaOcupadas.includes(numeroButaca);

                filaActual.push({
                    nro_butaca: numeroButaca,
                    fila: String.fromCharCode(65 + f),
                    columna: c + 1,
                    estado: estaOcupada ? 'Ocupada' : 'Disponible'
                });

                numeroButaca++;
            }
            matriz.push(filaActual);
        }

        return matriz;
    }
};

window.ConsultasCine = ConsultasCine;


