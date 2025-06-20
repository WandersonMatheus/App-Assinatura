package com.Equipe1.AssinaturaDigital.Infra.Security.Controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Equipe1.AssinaturaDigital.Funcionario.FuncionarioModel;
import com.Equipe1.AssinaturaDigital.Funcionario.FuncionarioRepository;
import com.Equipe1.AssinaturaDigital.Infra.Security.TokenService;
import com.Equipe1.AssinaturaDigital.Infra.Security.DTO.LoginRequestDTO;
import com.Equipe1.AssinaturaDigital.Infra.Security.DTO.RegisterDTO;
import com.Equipe1.AssinaturaDigital.Infra.Security.DTO.ResponseDTO;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/auth")
public class AuthController {
    private final FuncionarioRepository funcionario;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    public AuthController(FuncionarioRepository funcionario, PasswordEncoder passwordEncoder,TokenService tokenService){
        this.funcionario = funcionario;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity login( @RequestBody LoginRequestDTO body) {
    var optionalUser = funcionario.findByEmail(body.email()).orElseThrow(()->new RuntimeException("Usuário não encontrado"));
        if(passwordEncoder.matches(body.password(),optionalUser.getPassword())){
            String token = this.tokenService.generateToken(optionalUser);
            return  ResponseEntity.ok(new ResponseDTO(optionalUser.getNome(),token));
        }
        return ResponseEntity.badRequest().build();
    }
    @PostMapping("/register")
    public ResponseEntity register( @RequestBody RegisterDTO body) {
    Optional<FuncionarioModel> users = funcionario.findByEmail(body.email());
    if(users.isEmpty()){
        var newUser = new FuncionarioModel();
        newUser.setSenha(passwordEncoder.encode(body.password()));
        newUser.setEmail(body.email());
        newUser.setNome(body.nome());
        this.funcionario.save(newUser);

        String token = this.tokenService.generateToken(newUser);
        return  ResponseEntity.ok(new ResponseDTO(newUser.getNome(),token));
    }
        return ResponseEntity.badRequest().build();
    }
}