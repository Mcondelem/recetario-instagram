# Modulo 2: Supabase, datos privados y RLS

En el prototipo inicial las recetas viven en memoria dentro de React. Eso nos sirve para validar la experiencia, pero no para una app real. El siguiente salto es guardar datos por usuario.

## Que vamos a aprender

- Que es Supabase y que partes usaremos.
- Por que una app necesita autenticacion antes de guardar datos privados.
- Como se modelan recetas, ingredientes, pasos y etiquetas en Postgres.
- Que es Row Level Security y por que evita que un usuario lea recetas de otro.
- Como se conecta Next.js a Supabase en navegador y servidor.

## Piezas creadas

- `.env.example`: plantilla de variables de entorno.
- `supabase/migrations/0001_initial_schema.sql`: tablas, indices y politicas RLS.
- `src/lib/supabase/client.ts`: cliente para componentes de navegador.
- `src/lib/supabase/server.ts`: cliente para servidor, server actions y route handlers.
- `src/lib/supabase/proxy.ts` y `src/proxy.ts`: refresco de sesion con cookies.
- `src/lib/recipes/schemas.ts`: validacion Zod del JSON que devolvera la IA.

## Siguiente ejercicio manual

1. Crear un proyecto en Supabase.
2. Copiar `NEXT_PUBLIC_SUPABASE_URL`.
3. Copiar `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` o la anon key.
4. Crear `.env.local` a partir de `.env.example`.
5. Ejecutar el SQL de `supabase/migrations/0001_initial_schema.sql` en el SQL editor.

## Idea importante

RLS significa que la seguridad vive tambien en la base de datos. Aunque un usuario modificara una peticion desde el navegador, Postgres solo devolvera filas donde `auth.uid()` coincida con el propietario.
