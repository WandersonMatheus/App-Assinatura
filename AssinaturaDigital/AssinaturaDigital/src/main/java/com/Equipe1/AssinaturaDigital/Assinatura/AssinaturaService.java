package com.Equipe1.AssinaturaDigital.Assinatura;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.stereotype.Service;

@Service
public class AssinaturaService {
//CRUD
    private AssinaturaRepository assinaturaRepository;

    public AssinaturaService(AssinaturaRepository assinaturaRepository) {
        this.assinaturaRepository = assinaturaRepository;
    }

public AssinaturaModel criarAssinatura(String clienteId, String termoId, String cenarioId, MultipartFile pdfFile) {
    // Gerar nome aleatório para o PDF
    String nomePdf = UUID.randomUUID().toString() + ".pdf";
    Path caminho = Paths.get("uploads", nomePdf);

    try {
        Files.createDirectories(caminho.getParent()); // Garante que o diretório exista
        Files.write(caminho, pdfFile.getBytes());     // Salva o PDF
    } catch (IOException e) {
        throw new RuntimeException("Erro ao salvar o PDF", e);
    }

    // Criar nova assinatura
    AssinaturaModel novaAssinatura = new AssinaturaModel();
    novaAssinatura.setClienteId(clienteId);
    novaAssinatura.setTermoId(termoId);
    novaAssinatura.setCenarioId(cenarioId);
    novaAssinatura.setDataAssinatura(LocalDateTime.now());
    novaAssinatura.setStatus(StatusAssinatura.CRIADA);
    novaAssinatura.setPdfPath("/arquivos/" + nomePdf); // link público para frontend

    return assinaturaRepository.save(novaAssinatura);
}


// create
// GET
    public Optional<AssinaturaModel> buscarAssinatura(String id){
        return assinaturaRepository.findById(id);
    }
    public List<AssinaturaModel> listarAssinatura(){
        return assinaturaRepository.findAll();
    }
      
    public AssinaturaModel gerarLinkAssinatura(String id) {
        Optional<AssinaturaModel> assinaturaOpt = assinaturaRepository.findById(id);
        
        if (assinaturaOpt.isPresent()) {
            AssinaturaModel assinatura = assinaturaOpt.get();
            
            // Gerar link (sempre o mesmo padrão)
            String link = "http://localhost:4200/assinar/" + id;
            
            // Atualizar status e dados
            assinatura.setLinkAssinatura(link);
            assinatura.setStatus(StatusAssinatura.LINK_ENVIADO);
            assinatura.setDataEnvioLink(LocalDateTime.now());
            return assinaturaRepository.save(assinatura);
        }
        
        throw new RuntimeException("Assinatura não encontrada");
    }

    /**
 * Obter bytes do PDF da assinatura
 */
public byte[] obterPdfBytes(String id) throws Exception {
    Optional<AssinaturaModel> assinaturaOpt = assinaturaRepository.findById(id);

    if (assinaturaOpt.isEmpty()) {
        throw new Exception("Assinatura não encontrada");
    }

    AssinaturaModel assinatura = assinaturaOpt.get();

    if (assinatura.getPdfPath() == null || assinatura.getPdfPath().isEmpty()) {
        throw new Exception("PDF não encontrado para esta assinatura");
    }

    final String BASE_DIR = "E:\\Projetos\\App-Assinatura\\uploads";

    String nomeArquivo = assinatura.getPdfPath().replaceFirst("^/arquivos/", "");

    Path pdfPath = Paths.get(BASE_DIR, nomeArquivo);

    if (!Files.exists(pdfPath)) {
        throw new Exception("Arquivo PDF não existe no sistema");
    }

    return Files.readAllBytes(pdfPath);
}

    
    public AssinaturaModel marcarComoAssinada(String id) {
        Optional<AssinaturaModel> assinaturaOpt = assinaturaRepository.findById(id);
        
        if (assinaturaOpt.isPresent()) {
            AssinaturaModel assinatura = assinaturaOpt.get();
            
            assinatura.setStatus(StatusAssinatura.ASSINADA);
            assinatura.setDataAssinatura(LocalDateTime.now());
            
            
            return assinaturaRepository.save(assinatura);
        }
        
        throw new RuntimeException("Assinatura não encontrada");
    }
    
    public List<AssinaturaModel> buscarPorStatus(StatusAssinatura status) {
        return assinaturaRepository.findByStatus(status);
    }
}
