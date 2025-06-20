package com.Equipe1.AssinaturaDigital.Funcionario;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface FuncionarioRepository extends MongoRepository<FuncionarioModel, String> {

    // Buscar por e-mail exato
    Optional<FuncionarioModel> findByEmail(String email);

    // Verificar se já existe um email cadastrado
    boolean existsByEmail(String email);

    // Buscar por parte do nome (like)
    List<FuncionarioModel> findByNomeContainingIgnoreCase(String parteDoNome);
}
