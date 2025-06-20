package com.Equipe1.AssinaturaDigital.Cenario;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;



//metodos GET,PUT,Delet,Post

@RestController
@RequestMapping("/Cenarios")
public class CenarioController {

    public CenarioService cenarioService;

    public CenarioController(CenarioService cenarioService) {
        this.cenarioService = cenarioService;
    }

    // Buscar cenario
        public ResponseEntity<List<CenarioModel>> listarClientes() {
        return ResponseEntity.ok(cenarioService.listarCenarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CenarioModel> buscarPorId(@PathVariable String id) {
        return cenarioService.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    // Criar cenario
    @PostMapping
    public ResponseEntity<CenarioModel> criarCenarioController(@RequestBody CenarioModel cenario) {
        CenarioModel novoCenario = cenarioService.criarCenario(cenario);
        return ResponseEntity.ok(novoCenario);
    }
    // Editar cenario
    @PutMapping("/{id}")
    public ResponseEntity<CenarioModel> editarCenario(@PathVariable String id, @RequestBody CenarioModel cenario) {
        return cenarioService.updateCenario(id, cenario)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    // Excluir cenario
    @DeleteMapping("/{id}")
    public ResponseEntity<CenarioModel> deletarCenario(@PathVariable String id) {
        cenarioService.apagarCenario(id);
        return ResponseEntity.noContent().build();
    }
}
