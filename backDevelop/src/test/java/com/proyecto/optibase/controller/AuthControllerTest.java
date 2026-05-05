package com.proyecto.optibase.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.proyecto.optibase.model.Rol;
import com.proyecto.optibase.model.UsuarioModel;
import com.proyecto.optibase.repository.UsuarioRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Map;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthControllerTest {

    @Autowired WebApplicationContext context;
    @Autowired UsuarioRepository usuarioRepository;
    @Autowired PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private MockMvc mockMvc;

    private static String adminToken;
    private static String userToken;

    @BeforeEach
    void setUp() {
        // Construir MockMvc con Spring Security activo
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // Usuario ADMIN de prueba
        if (usuarioRepository.findByNombre("test_admin").isEmpty()) {
            UsuarioModel admin = new UsuarioModel();
            admin.setNombre("test_admin");
            admin.setContrasenya(passwordEncoder.encode("admin123"));
            admin.setRol(Rol.ROLE_ADMIN);
            usuarioRepository.save(admin);
        }
        // Usuario USER de prueba
        if (usuarioRepository.findByNombre("test_user").isEmpty()) {
            UsuarioModel user = new UsuarioModel();
            user.setNombre("test_user");
            user.setContrasenya(passwordEncoder.encode("user123"));
            user.setRol(Rol.ROLE_USER);
            usuarioRepository.save(user);
        }
    }

    @Test @Order(1)
    @DisplayName("TC-AUTH-01: Login correcto devuelve token y ROLE_ADMIN")
    void loginAdmin_correcto_devuelveToken() throws Exception {
        String body = objectMapper.writeValueAsString(
                Map.of("nombre", "test_admin", "contrasenya", "admin123")
        );
        var result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.rol").value("ROLE_ADMIN"))
                .andReturn();

        JsonNode response = objectMapper.readTree(result.getResponse().getContentAsString());
        adminToken = response.get("token").asText();
    }

    @Test @Order(2)
    @DisplayName("TC-AUTH-01b: Login correcto devuelve token y ROLE_USER")
    void loginUser_correcto_devuelveToken() throws Exception {
        String body = objectMapper.writeValueAsString(
                Map.of("nombre", "test_user", "contrasenya", "user123")
        );
        var result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.rol").value("ROLE_USER"))
                .andReturn();

        JsonNode response = objectMapper.readTree(result.getResponse().getContentAsString());
        userToken = response.get("token").asText();
    }

    @Test @Order(3)
    @DisplayName("TC-AUTH-02: Contraseña incorrecta → 401")
    void login_contrasenaIncorrecta_devuelve401() throws Exception {
        String body = objectMapper.writeValueAsString(
                Map.of("nombre", "test_admin", "contrasenya", "INCORRECTA")
        );
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Credenciales incorrectas"));
    }

    @Test @Order(4)
    @DisplayName("TC-AUTH-03: Usuario inexistente → 401")
    void login_usuarioInexistente_devuelve401() throws Exception {
        String body = objectMapper.writeValueAsString(
                Map.of("nombre", "no_existe", "contrasenya", "1234")
        );
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test @Order(5)
    @DisplayName("TC-AUTH-04: GET /api/clientes sin token → 401")
    void acceso_sinToken_devuelve401() throws Exception {
        mockMvc.perform(get("/api/clientes"))
                .andExpect(status().isUnauthorized());
    }

    @Test @Order(6)
    @DisplayName("TC-AUTH-05: GET /api/clientes con token ADMIN → 200")
    void acceso_conTokenAdmin_devuelve200() throws Exception {
        Assumptions.assumeTrue(adminToken != null, "Requiere TC-AUTH-01 completado");
        mockMvc.perform(get("/api/clientes")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test @Order(7)
    @DisplayName("TC-AUTH-06: POST /api/clientes con token USER → 403")
    void escritura_conTokenUser_devuelve403() throws Exception {
        Assumptions.assumeTrue(userToken != null, "Requiere TC-AUTH-01b completado");
        String body = objectMapper.writeValueAsString(
                Map.of("nombre", "Test", "apellidos", "Cliente")
        );
        mockMvc.perform(post("/api/clientes")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }
}