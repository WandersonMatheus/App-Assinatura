package com.Equipe1.AssinaturaDigital.Assinatura;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Equipe1.AssinaturaDigital.Infra.Security.DTO.AssinaturaConfirmacaoRequest;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/Assinaturas")
public class AssinaturaController {

    private final AssinaturaService assinaturaService;

    public AssinaturaController(AssinaturaService assinatura) {
        this.assinaturaService = assinatura;
    }

    // Listar todas as assinaturas (protegido)
    @GetMapping
    public ResponseEntity<List<AssinaturaModel>> listarAssinaturas() {
        return ResponseEntity.ok(assinaturaService.listarAssinatura());
    }

    // Buscar assinatura por ID (protegido)
    @GetMapping("/{id}")
    public ResponseEntity<AssinaturaModel> buscarPorId(@PathVariable String id) {
        return assinaturaService.buscarAssinatura(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ NOVO: Endpoint público para visualizar assinatura
    @GetMapping("/{id}/publica")
    public ResponseEntity<AssinaturaModel> buscarAssinaturaPublica(@PathVariable String id) {
        return assinaturaService.buscarAssinatura(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Gerar link de assinatura (protegido)
    @PostMapping("/{id}/gerar-link")
    public ResponseEntity<AssinaturaModel> gerarLink(@PathVariable String id) {
        try {
            AssinaturaModel assinatura = assinaturaService.gerarLinkAssinatura(id);
            return ResponseEntity.ok(assinatura);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Marcar como assinada (público - cliente não tem login)
    @PostMapping("/{id}/assinar")
    public ResponseEntity<AssinaturaModel> marcarComoAssinada(@PathVariable String id) {
        try {
            AssinaturaModel assinatura = assinaturaService.marcarComoAssinada(id);
            return ResponseEntity.ok(assinatura);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ NOVO: Servir PDF da assinatura (público)
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> obterPdfAssinatura(@PathVariable String id) {
        try {
            byte[] pdfBytes = assinaturaService.obterPdfBytes(id);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "documento-" + id + ".pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Buscar por status (protegido)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<AssinaturaModel>> buscarPorStatus(@PathVariable StatusAssinatura status) {
        List<AssinaturaModel> assinaturas = assinaturaService.buscarPorStatus(status);
        return ResponseEntity.ok(assinaturas);
    }

    // Criar assinatura com PDF (protegido)
    @PostMapping
    public ResponseEntity<AssinaturaModel> criarAssinaturaComPdf(
        @RequestParam String clienteId,
        @RequestParam String termoId,
        @RequestParam(required = false) String cenarioId,
        @RequestParam("pdf") MultipartFile pdfFile
    ) {
        try {
            AssinaturaModel novaAssinatura = assinaturaService.criarAssinatura(clienteId, termoId, cenarioId, pdfFile);
            return ResponseEntity.ok(novaAssinatura);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
        @PostMapping("/{id}/confirmar")
    public ResponseEntity<?> confirmarAssinatura(
            @PathVariable String id,
            @RequestBody AssinaturaConfirmacaoRequest request,
            HttpServletRequest servletRequest) {

        try {
            String ip = servletRequest.getRemoteAddr();
            AssinaturaModel assinaturaConfirmada = assinaturaService.confirmarAssinatura(id, request, ip);
            return ResponseEntity.ok(assinaturaConfirmada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno ao confirmar assinatura");
        }
    }
}