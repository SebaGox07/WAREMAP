
# 🏭 WAREMAP — Visualización de Racks de Bodega

**Proyecto de Título | Ingeniería en Informática | IPCHILE**

🌐 **[Ver aplicación WAREMAP Online](https://sebagox07.github.io/WAREMAP/)**

---

## 📖 Descripción del proyecto

**WAREMAP** es una aplicación web desarrollada como prototipo funcional a partir de una necesidad identificada durante una práctica profesional en la empresa **Gourmet**.

Anteriormente, la empresa utilizaba un sistema WMS (*Warehouse Management System*) que contaba con una representación visual básica de los racks de almacenamiento. Después de la migración hacia **Microsoft Dynamics 365**, esta funcionalidad dejó de estar disponible.

WAREMAP busca recuperar esta forma de consulta mediante un mapa interactivo que permite visualizar la distribución de los racks, identificar ubicaciones y consultar información de los productos almacenados.

Actualmente, la aplicación utiliza **datos simulados almacenados en Supabase**. La integración directa con Microsoft Dynamics 365 se considera una mejora futura.

---

## 🎯 Objetivo

Desarrollar una aplicación web que facilite la visualización y consulta de ubicaciones de almacenamiento, permitiendo identificar racks, niveles, posiciones y productos de manera gráfica y sencilla.

La aplicación está orientada principalmente a:

- Operarios de bodega.
- Personal de abastecimiento.
- Personal de logística.

---

## 🚀 Funcionalidades principales

### 🌐 Visualización 3D

- Representación tridimensional de los racks.
- Visualización de elementos que representan productos almacenados.
- Navegación por la representación de la bodega.
- Selección interactiva de ubicaciones.

### 🗺️ Visualización 2D

- Mapa de racks en dos dimensiones.
- Identificación de posiciones ocupadas y vacías.
- Funciones de zoom y desplazamiento.
- Selección de ubicaciones directamente desde el mapa.

### 🔎 Sistema de búsqueda

Permite buscar información utilizando:

- Código de ubicación.
- Código de producto o SKU.
- Nombre del producto.

El sistema identifica las coincidencias y permite localizar las posiciones correspondientes.

### 📦 Detalle de ubicaciones

Al seleccionar una ubicación, se muestra información como:

- Rack.
- Nivel.
- Posición.
- Código y nombre del producto.
- Cantidad almacenada.
- Unidad de medida.

### 🔄 Actualización de información

WAREMAP consulta los datos almacenados en Supabase mediante una API REST.

La aplicación realiza actualizaciones automáticas aproximadamente cada **15 segundos**, permitiendo visualizar los cambios realizados desde WAREMAP ADMIN.

**WAREMAP funciona exclusivamente como herramienta de consulta y no permite modificar el inventario.**

---

## 🏗️ Estructura de la bodega

El prototipo representa una distribución de almacenamiento compuesta por:

| Elemento | Cantidad |
|---|---:|
| Racks | 5 |
| Niveles por rack | 3 |
| Posiciones por nivel | 7 |
| **Total de ubicaciones** | **105** |

Las ubicaciones utilizan una nomenclatura como:

`R02-N1-P05`

Donde:

- `R02`: Rack 02.
- `N1`: Nivel 1.
- `P05`: Posición 05.

La representación contempla ubicaciones vacías, big bags, rollos de etiquetas y rollos de sachet o film.

---

## 💻 Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| HTML5 | Estructura de la aplicación |
| CSS3 | Diseño de la interfaz |
| JavaScript | Lógica y funcionalidades |
| Three.js | Visualización tridimensional |
| Supabase | Base de datos PostgreSQL |
| API REST | Comunicación con la base de datos |
| GitHub Pages | Publicación de la aplicación |

La aplicación funciona desde el navegador y no requiere instalar software adicional para utilizarla.

---

## 📂 Estructura del proyecto

```text
WAREMAP/
│
├── index.html
├── style.css
├── app.js
│
├── assets/
│   ├── logo-waremap.png
│   └── titulo-waremap.png
│
├── supabase_setup.sql
├── .nojekyll
└── README.md
```

**Descripción de los archivos:**

- `index.html`: estructura de la interfaz principal.
- `style.css`: estilos visuales de la aplicación.
- `app.js`: funcionamiento de las vistas, búsquedas y conexión con Supabase.
- `assets/`: imágenes utilizadas en la interfaz.
- `supabase_setup.sql`: estructura y datos iniciales de demostración.
- `.nojekyll`: configuración de publicación para GitHub Pages.

---

## 🧭 Cómo utilizar WAREMAP

1. Ingresar a **[WAREMAP Online](https://sebagox07.github.io/WAREMAP/)**.
2. Seleccionar la vista 2D o 3D.
3. Navegar por los racks o utilizar el buscador.
4. Seleccionar una ubicación.
5. Revisar la información de los productos almacenados.

Los cambios realizados desde WAREMAP ADMIN se reflejan después de la siguiente actualización automática.

---

## ⚙️ Configuración para una instalación nueva

> Esta sección es referencial. La versión publicada ya se encuentra configurada y funcionando.

1. Crear un proyecto en Supabase.
2. Ejecutar `supabase_setup.sql` desde el editor SQL para preparar las ubicaciones de demostración.
3. Configurar la URL y la clave pública de Supabase en `app.js`.
4. Publicar los archivos en un repositorio de GitHub.
5. Activar GitHub Pages desde la rama `main` y la carpeta raíz.
6. Verificar que las 105 ubicaciones se carguen correctamente.

**Importante:** no publicar contraseñas ni claves secretas de Supabase. El frontend debe utilizar únicamente una clave pública y los permisos deben estar protegidos mediante políticas RLS.

---

## 🔗 Relación con WAREMAP ADMIN

WAREMAP trabaja junto con una segunda aplicación denominada **WAREMAP ADMIN**.

Ambas aplicaciones utilizan la misma base de datos Supabase.

| WAREMAP Online | WAREMAP ADMIN |
|---|---|
| Visualización 2D y 3D | Mapa administrativo 2D |
| Consulta de productos | Edición de productos |
| Búsqueda de ubicaciones | Administración de ubicaciones |
| Acceso de consulta | Acceso administrativo autorizado |
| No modifica datos | Guarda modificaciones en Supabase |

🛠️ **[Abrir WAREMAP ADMIN](https://sebagox07.github.io/WAREMAP-ADMIN/)**

---

## 📌 Alcance y limitaciones

WAREMAP es un **prototipo académico funcional**.

Actualmente:

- Permite visualizar y consultar ubicaciones.
- Utiliza información simulada almacenada en Supabase.
- No modifica existencias ni registra movimientos de inventario.
- No reemplaza un sistema WMS o ERP.
- No está conectado directamente con Microsoft Dynamics 365.

La integración con Dynamics 365, las pruebas con más usuarios y una posible implementación operativa quedan consideradas como futuras mejoras.

---

## 📊 Estado del proyecto

**Estado actual: Prototipo funcional publicado.**

La aplicación se encuentra disponible mediante GitHub Pages y comparte información con WAREMAP ADMIN a través de Supabase.

El desarrollo forma parte del proyecto de título de la carrera de **Ingeniería en Informática de IPCHILE**.

---

## 👨‍💻 Autor

**Sebastián González**

Proyecto de Título — Ingeniería en Informática  
IPCHILE — Chile

---

*WAREMAP — Una forma visual de consultar y comprender las ubicaciones de almacenamiento.*
