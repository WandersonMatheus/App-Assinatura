package com.Equipe1.AssinaturaDigital.Cenario;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class CenarioService {

    private CenarioRepository cenarioRepository;

    public CenarioService(CenarioRepository cenarioRepository) {
        this.cenarioRepository = cenarioRepository;
    }

    //criar cenario
    public CenarioModel criarCenario(CenarioModel cenario){
        return cenarioRepository.save(cenario);
    }
    //Editar cenario
    public Optional<CenarioModel> updateCenario(String id,CenarioModel dadosAtualizados){
        return cenarioRepository.findById(id)
            .map(cenario ->{
                cenario.setTitulo(dadosAtualizados.getTitulo());
                return cenarioRepository.save(cenario);
            });
    }
    //excluir cenario
    public boolean apagarCenario(String id){
        if (cenarioRepository.existsById(id)) {
            cenarioRepository.deleteById(id);
            return true;
        }
        return false;
    }
    //buscar cenario 
    public Optional<CenarioModel> buscarPorId(String id){
        return cenarioRepository.findById(id);
    }
    public List<CenarioModel> buscarPorTitulo(String titulo) {
        return cenarioRepository.findByTitulo(titulo);
    }
    //Listar cenario
    public List<CenarioModel> listarCenarios(){
        return cenarioRepository.findAll();
    }
}
