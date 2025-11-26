# TpDiseno

Trabajo practico correspondiente a la materia Diseño De Sistemas de tercer año de Ingeniería en Sistemas de Información de la Universidad Nacional Tecnológica Santa Fe.

## Tecnologías Utilizadas

### Backend

- **Java 17** - Lenguaje de programación
- **Spring Boot 3.x** - Framework principal
- **Spring Data JPA** - Capa de persistencia
- **Hibernate** - ORM (Object-Relational Mapping)
- **PostgreSQL** - Base de datos relacional
- **Maven** - Gestor de dependencias

### Frontend

- **HTML5** - Estructura
- **CSS3** - Estilos y diseño responsivo
- **JavaScript (Vanilla)** - Interactividad y comunicación con la API REST

### Arquitectura

- **REST API** - Comunicación frontend-backend
- **MVC Pattern** - Patrón de diseño
- **DTO Pattern** - Transferencia de datos

## Requisitos Previos

- Java 17 o superior
- Maven 3.6+
- PostgreSQL 12 o superior

## Configuración

### 1. Base de Datos

Crear una base de datos PostgreSQL llamada `disenodb` o usar la que esta en github:

```sql
CREATE DATABASE disenodb;
```

### 2. Configuración de la Aplicación

1. Copiar el archivo de ejemplo de configuración:
   ```bash
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```
2. Editar `application.properties` y configurar tus credenciales de PostgreSQL:
   ```properties
   spring.datasource.username=TU_USUARIO
   spring.datasource.password=TU_CONTRASEÑA
   ```

## Cómo Ejecutar la Aplicación

### Opción 1: Usando Maven Wrapper (Recomendado)

**En Linux/Mac:**

```bash
./mvnw spring-boot:run
```

**En Windows:**

```bash
mvnw.cmd spring-boot:run
```

### Opción 2: Usando Maven Instalado

```bash
mvn spring-boot:run
```

### Opción 3: Desde tu IDE

1. Abrir el proyecto en tu IDE (IntelliJ IDEA, Eclipse, VS Code)
2. Ejecutar la clase `TpDisenoApplication.java`

### Acceso a la Aplicación

Una vez iniciada, la aplicación estará disponible en:

- **Frontend:** `http://localhost:8080/`
- **API REST:** `http://localhost:8080/api/huespedes`

El frontend se sirve automáticamente desde el backend gracias a Spring Boot.

## Estructura del Proyecto

```
src/
├── main/
│   ├── java/com/diseno/tpDiseno/
│   │   ├── controller/       # Controladores REST y vistas
│   │   ├── Service/          # Lógica de negocio
│   │   ├── Dao/              # Acceso a datos (JPA)
│   │   ├── model/            # Entidades del dominio
│   │   ├── dto/              # Objetos de transferencia
│   │   ├── Exception/        # Manejo de excepciones
│   │   └── util/             # Utilidades y enums
│   └── resources/
│       ├── application.properties
│       └── static/           # Archivos estáticos (HTML, CSS, JS)
│           ├── css/
│           ├── js/
│           └── templates/
└── test/                     # Tests unitarios
```

## Convenciones del Proyecto

### Manejo de Fechas

El proyecto utiliza un formato estandarizado para las fechas:

- **Frontend (Interfaz de usuario):** `dd/MM/yyyy` (formato argentino)

  - Ejemplo: `25/12/2024`
  - Los inputs de fecha tienen máscara automática
  - Validación en tiempo real del formato

- **Backend (API y Base de Datos):** `yyyy-MM-dd` (ISO 8601)
  - Ejemplo: `2024-12-25`
  - Tipo de dato: `LocalDate` (Java)
  - Conversión automática en el frontend antes de enviar al backend

**Ejemplo de conversión:**

```javascript
// Frontend: el usuario ingresa "25/12/2024"
// JavaScript lo convierte a "2024-12-25" antes de enviar
// Backend recibe y guarda en formato ISO
```

## Endpoints API

### POST /api/huespedes

Dar de alta un nuevo huésped

**Request Body:**

```json
{
  "nombres": "Juan",
  "apellido": "Pérez",
  "tipoDocumento": "DNI",
  "nroDocumento": "12345678",
  "cuit": "20-12345678-9",
  "posIVA": "Consumidor Final",
  "fechaDeNacimiento": "1990-01-01",
  "telefono": "3424123456",
  "email": "juan@email.com",
  "ocupacion": "Ingeniero",
  "nacionalidad": "Argentina",
  "direccion": {
    "calle": "San Martín",
    "nroCalle": "1234",
    "piso": "5",
    "nroDepartamento": "B",
    "codigoPostal": "3000",
    "localidad": "Santa Fe",
    "provincia": "Santa Fe",
    "pais": "Argentina"
  }
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "nombres": "Juan",
  "apellido": "Pérez",
  "nroDocumento": "12345678"
}
```
