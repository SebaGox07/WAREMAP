WAREMAP — Visualización de racks de bodega.

Proyecto de título | Ingeniería en Informática | IPCHILE

Aplicación online: https://sebagox07.github.io/WAREMAP/
Descripción
WAREMAP es una aplicación web desarrollada como prototipo funcional a partir de una necesidad observada durante una práctica profesional en la empresa Gourmet. Después de la migración desde un sistema WMS hacia Microsoft Dynamics 365, se dejó de contar con una representación visual básica de los racks de la bodega.

La propuesta busca facilitar la consulta de ubicaciones y productos mediante un mapa interactivo, sin reemplazar el sistema de gestión de inventario de la empresa. La versión actual utiliza datos de demostración almacenados en Supabase y no está integrada directamente con Microsoft Dynamics 365. Esa integración se considera una mejora futura.
Funcionalidades
- Visualización de la bodega en 3D, con racks y elementos representativos del almacenamiento.
- Vista alternativa en 2D, con acercamiento, alejamiento y desplazamiento.
- Identificación visual de ubicaciones ocupadas y vacías.
- Selección de ubicaciones para consultar rack, nivel, posición y productos asociados.
- Búsqueda por código de ubicación, SKU o nombre de producto.
- Consulta de cantidades y unidades de medida de los productos.
- Lectura de información desde Supabase mediante API REST, con actualización automática aproximadamente cada 15 segundos.
- Funcionamiento de solo consulta: esta aplicación no modifica el inventario.
Estructura de la bodega
El prototipo representa 5 racks, cada uno con 3 niveles y 7 posiciones por nivel, para un total de 105 ubicaciones. Los códigos siguen un formato como R02-N1-P05 (rack 02, nivel 1, posición 05).

Los tipos de representación utilizados incluyen ubicaciones vacías, big bags, rollos de etiquetas y rollos de sachet/film.
Tecnologías
- HTML, CSS y JavaScript.
- Three.js para la visualización tridimensional.
- Supabase (PostgreSQL y API REST) como fuente de datos.
- GitHub Pages para publicar la aplicación.
No requiere un servidor propio para ejecutar el frontend.
Estructura de archivos
WAREMAP/
├── index.html             # Interfaz principal
├── style.css              # Estilos
├── app.js                 # Vistas, búsqueda y consulta a Supabase
├── assets/                # Imágenes de identidad del proyecto
│   ├── logo-waremap.png
│   └── titulo-waremap.png
├── supabase_setup.sql     # Estructura y datos iniciales de demostración
├── .nojekyll              # Archivo de publicación en GitHub Pages
└── README.md              # Documentación
Cómo utilizar WAREMAP
1. Ingresar a https://sebagox07.github.io/WAREMAP/.
2. Seleccionar la vista 2D o 3D según la necesidad.
3. Recorrer los racks o buscar una ubicación, SKU o producto.
4. Seleccionar la ubicación para revisar su información.
5. Si un administrador modifica los datos en WAREMAP ADMIN, esperar la siguiente actualización automática para ver los cambios.
Configuración de una instalación nueva
Estos pasos son solo para reproducir el prototipo en otro entorno. La versión publicada ya fue configurada y no necesita modificarse para su uso normal.

1. Crear un proyecto en Supabase y ejecutar supabase_setup.sql desde SQL Editor para preparar la tabla public.ubicaciones con datos de demostración.
2. Configurar en app.js los valores públicos de API_CONFIG: url y publishableKey.
3. Publicar los archivos en la raíz de un repositorio de GitHub y activar Settings > Pages > Deploy from a branch > main > /(root).
4. Comprobar que la aplicación cargue las 105 ubicaciones desde Supabase.
Seguridad: utilizar únicamente la clave publicable/`anon` en el frontend. Nunca publicar contraseñas, service_role ni claves secretas. El SQL contempla lectura pública y políticas RLS; por eso no se debe cargar inventario real o confidencial en esta configuración de demostración.
Relación con WAREMAP ADMIN
WAREMAP comparte la base de datos Supabase con WAREMAP ADMIN, una aplicación separada que permite a usuarios administradores autorizados modificar la información de las ubicaciones. WAREMAP consulta esos cambios y los muestra en su siguiente actualización, pero no realiza escrituras.

Aplicación administrativa: https://sebagox07.github.io/WAREMAP-ADMIN/
Alcance del proyecto
WAREMAP es un prototipo académico funcional orientado a visualización, búsqueda y consulta. No registra movimientos de bodega, no reemplaza un WMS y no modifica existencias en Microsoft Dynamics 365. La conexión directa con Dynamics 365, la validación con más usuarios y una eventual implementación operativa quedan como posibles etapas futuras.
Estado
La aplicación se encuentra publicada en GitHub Pages y su funcionamiento junto con WAREMAP ADMIN ha sido confirmado durante el desarrollo del proyecto. Los datos utilizados son de demostración.
