# Modulo 3: autenticacion con Supabase

En este paso el prototipo deja de ser una pantalla abierta y empieza a comportarse como una app privada.

## Que hemos construido

- Acciones de servidor para registro, login y logout.
- Pantalla de autenticacion cuando no hay sesion.
- Recetario protegido cuando Supabase devuelve un usuario valido.
- Boton de cerrar sesion dentro del recetario.
- Trigger SQL para crear un perfil al registrar usuario.

## Archivos clave

- `src/app/page.tsx`: decide si mostrar login o recetario.
- `src/app/auth/actions.ts`: conecta formularios con Supabase Auth.
- `src/components/auth-panel.tsx`: formularios de registro e inicio de sesion.
- `src/components/recipe-app.tsx`: prototipo del recetario protegido.
- `supabase/migrations/0002_profile_signup_trigger.sql`: crea perfiles automaticamente.

## Ejercicio manual

1. En Supabase, abre el SQL editor.
2. Ejecuta `supabase/migrations/0002_profile_signup_trigger.sql`.
3. Arranca la app con `npm run dev`.
4. Crea una cuenta desde la pantalla inicial.
5. Si Supabase requiere confirmar email, revisa el correo.
6. Inicia sesion y comprueba que aparece el recetario.

## Idea importante

La autenticacion no solo cambia la interfaz. Tambien nos da `auth.uid()`, que es la pieza que usa RLS para filtrar datos privados en Postgres.
