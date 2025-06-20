package com.Equipe1.AssinaturaDigital.Termo;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TermoRepository extends MongoRepository<TermoModel,String>{
    Optional<TermoModel> findByTitulo(String titulo);
    boolean existsByTitulo(String titulo);
}
