# TpDiseno
Trabajo practico correspondiente a la materia Diseño De Sistemas de tercer año de Ingeniería en Sistemas de Información de la Universidad Nacional Tecnológica Santa Fe.

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

La aplicación se iniciará en `http://localhost:8080`

## Estructura del Proyecto
```
src/
├── main/
│   ├── java/com/diseno/tpDiseno/
│   │   ├── controller/       # Controladores REST
│   │   ├── service/          # Lógica de negocio
│   │   ├── dao/              # Acceso a datos
│   │   ├── model/            # Entidades del dominio
│   │   ├── dto/              # Objetos de transferencia
│   │   └── exception/        # Manejo de excepciones
│   └── resources/
│       └── application.properties
└── frontend/                 # Interfaz web (HTML/CSS/JS)
```
