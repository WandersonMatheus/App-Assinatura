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

    // Endpoint público para visualizar assinatura
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

    // Marcar como assinada (público - cliente não tem login)
    @PostMapping("/{id}/assinar")
    public ResponseEntity<AssinaturaModel> marcarComoAssinada(@PathVariable String id) {
        try {
            AssinaturaModel assinatura = assinaturaService.marcarComoAssinada(id);
            return ResponseEntity.ok(assinatura);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Servir PDF da assinatura (público)
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

    // ✅ CORRIGIDO: Criar assinatura com PDF (protegido)
    @PostMapping
    public ResponseEntity<AssinaturaModel> criarAssinaturaComPdf(
        @RequestParam String clienteId,
        @RequestParam String termoId,
        @RequestParam(required = false) String cenarioId, // ✅ Opcional
        @RequestParam("pdf") MultipartFile pdfFile
    ) {
        System.out.println("=== BACKEND DEBUG ===");
        System.out.println("ClienteId: " + clienteId);
        System.out.println("TermoId: " + termoId);
        System.out.println("CenarioId: " + cenarioId);
        System.out.println("Pdf original filename: " + pdfFile.getOriginalFilename());
        System.out.println("Pdf size: " + pdfFile.getSize() + " bytes");
        
        try {
            // ✅ VALIDAÇÕES BÁSICAS
            if (clienteId == null || clienteId.trim().isEmpty()) {
                System.err.println("❌ ClienteId é obrigatório");
                return ResponseEntity.badRequest().build();
            }
            
            if (termoId == null || termoId.trim().isEmpty()) {
                System.err.println("❌ TermoId é obrigatório");
                return ResponseEntity.badRequest().build();
            }
            
            if (pdfFile == null || pdfFile.isEmpty()) {
                System.err.println("❌ Arquivo PDF é obrigatório");
                return ResponseEntity.badRequest().build();
            }
            
            // ✅ TRATAMENTO DO CENARIO_ID OPCIONAL
            String cenarioIdProcessado = null;
            if (cenarioId != null && !cenarioId.trim().isEmpty()) {
                cenarioIdProcessado = cenarioId.trim();
                System.out.println("✅ CenarioId processado: " + cenarioIdProcessado);
            } else {
                System.out.println("✅ CenarioId não fornecido - será null");
            }
            
            // ✅ CHAMAR O SERVICE COM PARÂMETRO TRATADO
            AssinaturaModel novaAssinatura = assinaturaService.criarAssinatura(
                clienteId.trim(), 
                termoId.trim(), 
                cenarioIdProcessado, // Pode ser null
                pdfFile
            );
            
            System.out.println("✅ Assinatura criada com sucesso: " + novaAssinatura.getId());
            return ResponseEntity.ok(novaAssinatura);
            
        } catch (IllegalArgumentException e) {
            System.err.println("❌ Erro de validação: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("❌ Erro interno: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
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