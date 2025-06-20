package com.Equipe1.AssinaturaDigital.Cenario;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface CenarioRepository extends MongoRepository<CenarioModel,String>{
    List<CenarioModel> findByTitulo(String titulo);
}
