package com.Equipe1.AssinaturaDigital.Infra.Security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors-> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                                // ============================================
                                // ENDPOINTS PÚBLICOS (sem autenticação)
                                // ============================================
                                
                                // Autenticação
                                .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                                .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                                
                                // Assinaturas públicas (para clientes assinarem)
                                .requestMatchers(HttpMethod.GET, "/Assinaturas/*/publica").permitAll()
                                .requestMatchers(HttpMethod.POST, "/Assinaturas/*/assinar").permitAll()
                                .requestMatchers(HttpMethod.POST, "/Assinaturas/*/confirmar").permitAll()
                                .requestMatchers(HttpMethod.GET, "/Assinaturas/*/pdf").permitAll()
                                
                                // CORS preflight
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                
                                // ============================================
                                // TODOS OS OUTROS ENDPOINTS (protegidos)
                                // ============================================
                                .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:4200"));
        config.setAllowCredentials(true);
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);
        return source;
    }
}