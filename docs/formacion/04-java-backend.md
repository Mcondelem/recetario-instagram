# Modulo 4: backend Java con Spring Boot

En este modulo separamos responsabilidades:

- Next.js se queda como frontend.
- Supabase mantiene Auth y Postgres.
- Spring Boot empieza a ser nuestra API de negocio.

## Por que Java aqui

Java con Spring Boot es muy usado para backends robustos. Nos permite practicar arquitectura de API, validacion, servicios, tests y seguridad con JWT.

## Que hemos creado

- `apps/api/pom.xml`: proyecto Maven con Spring Boot 3 y Java 21.
- `RecetarioInstagramApiApplication`: punto de entrada.
- `HealthController`: primer endpoint.
- `HealthControllerTest`: test automatico del endpoint.
- `application.yml`: configuracion base.

## Primer endpoint

```text
GET /health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "recetario-instagram-api",
  "timestamp": "..."
}
```

## Siguiente paso

Anadir seguridad para validar tokens JWT de Supabase. Asi el frontend podra llamar a Java y Java sabra que usuario esta autenticado.
