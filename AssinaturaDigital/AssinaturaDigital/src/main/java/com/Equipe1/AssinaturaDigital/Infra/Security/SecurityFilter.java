package com.Equipe1.AssinaturaDigital.Infra.Security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.Equipe1.AssinaturaDigital.Funcionario.FuncionarioModel;
import com.Equipe1.AssinaturaDigital.Funcionario.FuncionarioRepository;

import java.io.IOException;
import java.util.Collections;

@Component
public class SecurityFilter extends OncePerRequestFilter {
    @Autowired
    TokenService tokenService;
    @Autowired
    FuncionarioRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        
        // LOGS PARA DEBUG - ADICIONE ESTES
        System.out.println("=== SECURITY FILTER DEBUG ===");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Request Method: " + request.getMethod());
        System.out.println("Content-Type: " + request.getContentType());
        
        var token = this.recoverToken(request);
        System.out.println("Token extraído: " + (token != null ? "SIM" : "NÃO"));
        
        if(token != null){
            var login = tokenService.validateToken(token);
            System.out.println("Login validado: " + login);
            
            if(login != null){
                try {
                    FuncionarioModel user = userRepository.findByEmail(login).orElseThrow(() -> new RuntimeException("User Not Found"));
                    var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
                    var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("Usuário autenticado: " + user.getEmail());
                } catch (Exception e) {
                    System.out.println("Erro ao autenticar usuário: " + e.getMessage());
                }
            }
        }
        System.out.println("=== FIM DEBUG ===");
        
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request){
        var authHeader = request.getHeader("Authorization");
        if(authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }

}