package com.Equipe1.AssinaturaDigital.Funcionario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public FuncionarioModel criarFuncionario(FuncionarioModel funcionario) {
        return funcionarioRepository.save(funcionario);
    }

    public List<FuncionarioModel> listarTodos() {
        return funcionarioRepository.findAll();
    }

    public Optional<FuncionarioModel> buscarPorId(String id) {
        return funcionarioRepository.findById(id);
    }

    public Optional<FuncionarioModel> atualizarFuncionario(String id, FuncionarioModel dadosAtualizados) {
        return funcionarioRepository.findById(id)
            .map(funcionario -> {
                funcionario.setNome(dadosAtualizados.getNome());
                funcionario.setEmail(dadosAtualizados.getEmail());
                return funcionarioRepository.save(funcionario);
            });
    }

    public boolean deletarFuncionario(String id) {
        if (funcionarioRepository.existsById(id)) {
            funcionarioRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

