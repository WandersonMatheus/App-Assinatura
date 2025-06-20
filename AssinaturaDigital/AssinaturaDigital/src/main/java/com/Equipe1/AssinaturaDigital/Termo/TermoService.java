package com.Equipe1.AssinaturaDigital.Termo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TermoService {
    @Autowired
    private TermoRepository termoRepository;
    public TermoService(TermoRepository termoRepository) {
    this.termoRepository = termoRepository;
    }

    public TermoModel criarTermo(TermoModel termo){
        if (termoRepository.existsByTitulo(termo.getTitulo())) {
            throw new IllegalArgumentException("Já existe um termo com esse título.");
        }
        return termoRepository.save(termo);
    }

    public Optional<TermoModel> buscarPorTitulo(String titulo){
        return termoRepository.findByTitulo(titulo);
    } 
    public List<TermoModel> listarTermos(){
        return termoRepository.findAll();
    }
}
