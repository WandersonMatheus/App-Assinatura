package com.Equipe1.AssinaturaDigital.Termo;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/termos")
public class TermoController {

    private final TermoService termoService;
    
    public TermoController(TermoService termoService) {
        this.termoService = termoService;
    }


    //Adicionar termo
    @PostMapping
    public ResponseEntity<TermoModel> criarTermo(@RequestBody TermoModel termo){
        TermoModel novoTermo = termoService.criarTermo(termo);
        return ResponseEntity.ok(novoTermo);
    }
    //buscar termo por id
    @GetMapping("/{titulo}")
    public ResponseEntity<TermoModel> buscarPorTitulo(@PathVariable String titulo){
        return termoService.buscarPorTitulo(titulo)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    //Listar termos
    @GetMapping("/lista")
    public ResponseEntity<List<TermoModel>> listarTermos() {
        List<TermoModel> termos = termoService.listarTermos();
        return ResponseEntity.ok(termos);
    }


}
