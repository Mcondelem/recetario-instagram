# Recetario Instagram

MVP formativo para construir una app que permite guardar recetas encontradas en Instagram, convertir texto libre en una ficha estructurada y filtrarlas de forma privada.

## Estado actual

Esta primera version es un prototipo local con datos mock. Incluye:

- listado de recetas,
- formulario para pegar URL de Instagram y texto manual,
- simulacion de extraccion con IA,
- revision antes de guardar,
- detalle de receta,
- filtros por busqueda, tiempo, favoritas y pendientes.
- preparacion de Supabase con schema SQL, RLS y clientes SSR/browser.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Zod

## Desarrollo local

Instala dependencias:

```bash
npm install
```

Arranca el servidor:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Comandos utiles

```bash
npm run lint
npm run build
```

## Configuracion de Supabase

Copia `.env.example` a `.env.local` y rellena:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Despues ejecuta el SQL de `supabase/migrations/0001_initial_schema.sql` en el SQL editor de Supabase.

La guia formativa de este paso esta en `docs/formacion/02-supabase.md`.

## Proximos pasos

1. Crear el proyecto real en Supabase.
2. Ejecutar el schema SQL.
3. Crear pantallas de registro, login y logout.
4. Sustituir los datos mock por recetas privadas por usuario.
5. Anadir un endpoint de extraccion con OpenAI.
