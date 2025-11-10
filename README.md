(The file `c:\Users\PC\Desktop\code\README.md` exists, but is empty)
# Proyecto - Sistema de Ventas (Clientes, Productos, Ventas)

Este repositorio contiene una pequeña API REST en Node/Express con SQLite para gestionar Clientes, Productos y Ventas. Está organizada en capas (routes -> controllers -> services -> repository -> database) para mostrar una arquitectura limpia y escalable.

## Ejecutar la API localmente (Express + SQLite)

Instrucciones rápidas para levantar la API desde la carpeta raíz en Windows PowerShell:

1. Instalar dependencias (usa npm o pnpm):

	```powershell
	npm install
	```

2. Inicializar la base de datos (crea tablas):

	```powershell
	npm run init-db
	```

3. Arrancar la API:

	```powershell
	npm run start-api
	```

4. Endpoint de verificación:

	GET http://localhost:3000/api/health

Notas:
- El script `init-db` crea el fichero SQLite (`src/database/ventas.db`) y las tablas necesarias.
- `start-api` ejecuta `src/server.js` (Express). Asegúrate de tener Node >= 16 y haber corrido `npm install`.

## Documentación incluida

Los siguientes artefactos se han añadido en `docs/`:

- `ARCHITECTURE.md` — Vistas de arquitectura (Contexto, Funcional, Información/ERD, Despliegue) y mapping con el código.
- `VIDEO_SCRIPTS.md` — Guiones listos para leer en los dos videos solicitados por la entrega.
- `postman_collection.json` — Colección de ejemplo para importar en Postman / Insomnia y probar los endpoints.

---

Si necesitas que haga pruebas automáticas o añadir tests unitarios, dime y los creo (pequeños y rápidos).
