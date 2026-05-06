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

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

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

## Proximos pasos

1. Conectar Supabase para autenticacion y base de datos.
2. Crear tablas para usuarios, recetas, ingredientes, pasos y etiquetas.
3. Anadir un endpoint de extraccion con OpenAI.
4. Validar la respuesta de IA con Zod antes de guardar.
5. Sustituir los datos mock por datos privados por usuario.
