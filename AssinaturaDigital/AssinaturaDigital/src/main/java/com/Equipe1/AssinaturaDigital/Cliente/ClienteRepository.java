package com.Equipe1.AssinaturaDigital.Cliente;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Equipe1.AssinaturaDigital.Funcionario.FuncionarioModel;
@Repository
public interface ClienteRepository extends MongoRepository<ClienteModel,String>{

    Optional<ClienteModel> findByEmail(String email);
    boolean existsByEmail(String email);
    List<FuncionarioModel> findByNomeContainingIgnoreCase(String parteDoNome);
}
