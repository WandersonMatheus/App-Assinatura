package com.Equipe1.AssinaturaDigital.Assinatura;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface AssinaturaRepository extends MongoRepository<AssinaturaModel,String>{

    List<AssinaturaModel> findByStatus(StatusAssinatura status);
}
