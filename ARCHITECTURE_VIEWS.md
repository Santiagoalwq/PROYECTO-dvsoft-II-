# Vistas Arquitectónicas del Sistema

## 1. Vista de Contexto

\`\`\`
┌─────────────────────────────────────────┐
│   SISTEMA DE GESTIÓN DE VENTAS          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Express API REST           │   │
│  │  - Controllers                  │   │
│  │  - Routes                       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │    SQLite Database              │   │
│  │  - Clientes                     │   │
│  │  - Productos                    │   │
│  │  - Ventas                       │   │
│  │  - Detalles Ventas              │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
         ▲
         │ HTTP/JSON
         │
    ┌────▼─────┐
    │  Postman  │
    │  Cliente  │
    └──────────┘
\`\`\`

## 2. Vista de Componentes (Arquitectura en Capas)

\`\`\`
┌──────────────────────────────────────────────────┐
│          CAPA DE PRESENTACIÓN                    │
│  (Controllers: ClientController, ProductCtrl...)  │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────┐
│          CAPA DE NEGOCIO                         │
│  (Services: ClientService, ProductService...)    │
│   - Validaciones complejas                       │
│   - Lógica de cálculos                          │
│   - Orquestación                                │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────┐
│        CAPA DE PERSISTENCIA                      │
│  (Repositories: ClientRepo, ProductRepo...)      │
│   - Operaciones CRUD                            │
│   - Consultas SQL                               │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────┐
│          CAPA DE DATOS                          │
│  (Database: connection.js, init.js)             │
│   - SQLite3 Connection                          │
│   - Query Execution                             │
└──────────────────────────────────────────────────┘
\`\`\`

## 3. Vista de Flujo de Datos - Crear Venta

\`\`\`
Postman Request
    │
    ├─ POST /api/ventas
    │ {cliente_id: 1, items: [{producto_id: 1, cantidad: 2}]}
    │
    ▼
┌──────────────────────────┐
│   SaleController.create  │ ◄─── Request llegada
│   - Valida entrada       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│   SaleService.createSale │ ◄─── Lógica de negocio
│   - Verifica cliente     │
│   - Valida productos     │
│   - Calcula totales      │
│   - Controla stock       │
└────────┬─────────────────┘
         │
         ├─────────────────────────┐
         │                         │
         ▼                         ▼
    ClientService         ProductService
    getClientById         getProductById
                          checkStock
         │                         │
         └────────────┬────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │   SaleRepository.create  │ ◄─── Crear venta
         │   .addDetail             │
         │   ProductRepository      │
         │   .updateStock           │
         └────────┬─────────────────┘
                  │
                  ▼
         ┌──────────────────────────┐
         │   SQLite Database        │ ◄─── Persistencia
         │   INSERT ventas          │
         │   INSERT detalle_ventas  │
         │   UPDATE productos       │
         └──────────────────────────┘
\`\`\`

## 4. Vista de Despliegue

\`\`\`
┌─────────────────────────────────────────┐
│         MÁQUINA LOCAL (Windows/Linux)    │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │     Node.js Runtime               │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Express Application        │  │  │
│  │  │  Puerto: 3000               │  │  │
│  │  │                             │  │  │
│  │  │  ├─ src/server.js           │  │  │
│  │  │  ├─ src/controllers/        │  │  │
│  │  │  ├─ src/services/           │  │  │
│  │  │  ├─ src/routes/             │  │  │
│  │  │  └─ src/database/           │  │  │
│  │  └──────────┬──────────────────┘  │  │
│  │             │                      │  │
│  │             ▼                      │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  SQLite Database File       │  │  │
│  │  │  src/database/ventas.db     │  │  │
│  │  └─────────────────────────────┘  │  │
│  └────────────────────┬───────────────┘  │
│                       │                  │
└───────────────────────┼──────────────────┘
                        │
                        ▼ HTTP:3000
                   ┌─────────────┐
                   │   Postman   │
                   │  Cliente    │
                   └─────────────┘
\`\`\`

## 5. Vista de Entidades y Relaciones

\`\`\`
┌─────────────────┐          ┌──────────────────┐
│    CLIENTES     │          │   PRODUCTOS      │
├─────────────────┤          ├──────────────────┤
│ id (PK)         │          │ id (PK)          │
│ nombre          │          │ codigo           │
│ identificacion  │          │ nombre           │
│ direccion       │          │ descripcion      │
│ telefono        │          │ precio_venta     │
│ email           │          │ costo            │
│ fecha_registro  │          │ cantidad_stock   │
└────────┬────────┘          │ fecha_registro   │
         │                   └────────┬─────────┘
         │ 1                         1 ▲
         │ ·                         ·
         └─ * ────────────┬───────── * ──┐
                          │              │
                    ┌─────▼────────┐ ┌──▼──────────────┐
                    │   VENTAS     │ │ DETALLE_VENTAS  │
                    ├──────────────┤ ├─────────────────┤
                    │ id (PK)      │ │ id (PK)         │
                    │ cliente_id * │ │ venta_id *      │
                    │ total        │ │ producto_id *   │
                    │ subtotal     │ │ cantidad        │
                    │ descuento    │ │ precio_unitario │
                    │ impuestos    │ │ subtotal        │
                    │ fecha_venta  │ └─────────────────┘
                    │ estado       │
                    └──────────────┘
\`\`\`

## 6. Vista de Secuencia - Registrar Cliente

\`\`\`
Postman         Controller        Service          Repository        DB
   │                │                │                 │               │
   ├─ POST /api/clientes            │                 │               │
   │─────────────────────────────────┼─────────────────┼───────────────┼──►
   │   {nombre, email, ...}          │                 │               │
   │                │                │                 │               │
   │                ├─ validateClient()                │               │
   │                │────────────────────────────────►│               │
   │                │◄─────────────── { isValid: true }               │
   │                │                 │                 │               │
   │                ├─ createClient()  │                 │               │
   │                ├────────────────────────────────► ClientRepository
   │                │                 │                 │               │
   │                │                 │   INSERT INTO clientes ...
   │                │                 │                 ├──────────────►│
   │                │                 │                 │               │
   │                │                 │                 │◄──────────────┤
   │                │                 │                 │  id: 1        │
   │                │                 │◄────────────────┤               │
   │                │◄─────────────────┤ return 1       │               │
   │◄───────────────┤                 │                 │               │
   │ 201 Created    │                 │                 │               │
   │ { id: 1 }      │                 │                 │               │
\`\`\`

## Decisiones de Arquitectura

### 1. Patrón en Capas
- **Ventaja**: Separación de responsabilidades clara
- **Beneficio**: Fácil de entender y mantener para cuarto semestre

### 2. Promesas (Async/Await)
- **Ventaja**: Código asincrónico limpio
- **Beneficio**: Mejor que callbacks para manejo de BD

### 3. SQLite
- **Ventaja**: Base de datos sin configuración
- **Beneficio**: Perfecta para desarrollo local

### 4. Validaciones Centralizadas
- **Ventaja**: Reutilizable en todos los servicios
- **Beneficio**: Consistencia en validaciones

## Calidad del Sistema Cumplida

| Atributo | Implementación |
|----------|---|
| **Seguridad** | Validación de entrada, manejo de errores, constraints BD |
| **Rendimiento** | Índices implícitos en BD, queries optimizadas |
| **Usabilidad** | Mensajes de error claros, documentación completa |
| **Escalabilidad** | Arquitectura modular permite crecer fácilmente |
| **Mantenibilidad** | Código limpio, documentado, fácil de entender |
| **Portabilidad** | Node.js + SQLite funciona en Windows y Linux |
| **Disponibilidad** | Validaciones previenen estados inconsistentes |
