# WAREMAP – GitHub Pages + Supabase REST

## 1. Crear la base online
En https://supabase.com crea un proyecto PostgreSQL. Abre **SQL Editor** y ejecuta el archivo `supabase_setup.sql`. Se crearán 105 ubicaciones con datos de ejemplo.

## 2. Conectar la aplicación
En `app.js`, al final del archivo, cambia `REEMPLAZAR_URL_SUPABASE` por **Project URL** (ej.: https://abc.supabase.co) y `REEMPLAZAR_CLAVE_PUBLICABLE` por la **publishable key** (`sb_publishable_...`) o clave pública `anon` de tu proyecto. **Nunca** publiques `service_role`, `sb_secret_` ni contraseña de PostgreSQL.

## 3. Publicar en GitHub Pages
Crea un repositorio en GitHub. Sube directamente el contenido de esta carpeta a la raíz: `index.html`, `style.css`, `app.js`, `assets/`, `.nojekyll` y, opcionalmente, `README.md`. El SQL puede quedar fuera del repositorio si prefieres. En Settings > Pages > Build and deployment, selecciona Deploy from a branch, `main`, `/ (root)`. La dirección será `https://TU_USUARIO.github.io/NOMBRE_REPOSITORIO/`.

## 4. Probar el acceso REST
Visita la página. El encabezado debe indicar `● Datos online`. La API consulta `/rest/v1/ubicaciones` cada 15 segundos, sin permisos de escritura desde el navegador. Si ves un error, revisa F12 > Console / Network y la URL y clave configuradas. Para evitar presentar inventario simulado, la pantalla permanece vacía hasta recibir los datos de la API.

## 5. Modificar productos desde Supabase SQL Editor
```sql
-- Ocupar una ubicación
update public.ubicaciones
set tipo3d = 'big_bag', productos = '[{"sku":"GOU-9999","nombre":"Producto de prueba","cantidad":50,"unidad":"Kg"}]'::jsonb
where codigo = 'R01-N1-P01';

-- Vaciar una ubicación
update public.ubicaciones
set tipo3d = 'vacio', productos = '[]'::jsonb
where codigo = 'R01-N1-P01';

-- Crear rollos: usar rollos_etiquetas o rollos_sachet en tipo3d.
```

## Seguridad
La tabla habilita RLS: el rol anónimo recibe permiso SELECT, no INSERT, UPDATE ni DELETE. La página y sus datos serán públicos para cualquiera con acceso a la URL/API. No subas información operativa real o confidencial sin autenticación y políticas restrictivas. Las operaciones de cambio se hacen únicamente en SQL Editor con una cuenta administradora. Supabase administra la API REST; no se requiere servidor PHP.

## Nota sobre disponibilidad
Los proyectos gratuitos pueden pausarse por inactividad. Consulta las condiciones vigentes de Supabase si necesitas una disponibilidad garantizada.
