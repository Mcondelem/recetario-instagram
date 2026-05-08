package com.recetarioinstagram.api.health;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(HealthController.class)
class HealthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void returnsHealthStatus() throws Exception {
    mockMvc.perform(get("/health"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.status", equalTo("ok")))
      .andExpect(jsonPath("$.service", equalTo("recetario-instagram-api")))
      .andExpect(jsonPath("$.timestamp", notNullValue()));
  }
}
