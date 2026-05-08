package com.recetarioinstagram.api.health;

import java.time.Instant;

public record HealthResponse(String status, String service, Instant timestamp) {
}
