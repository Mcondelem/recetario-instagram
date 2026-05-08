package com.recetarioinstagram.api.health;

import java.time.Instant;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

  @GetMapping("/health")
  public HealthResponse health() {
    return new HealthResponse("ok", "recetario-instagram-api", Instant.now());
  }
}
