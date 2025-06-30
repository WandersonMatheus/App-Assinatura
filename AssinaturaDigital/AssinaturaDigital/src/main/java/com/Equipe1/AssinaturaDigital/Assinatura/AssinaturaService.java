package com.Equipe1.AssinaturaDigital.Assinatura;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.Base64;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;

import com.Equipe1.AssinaturaDigital.Cliente.ClienteModel;
import com.Equipe1.AssinaturaDigital.Cliente.ClienteRepository;
import com.Equipe1.AssinaturaDigital.Infra.Security.DTO.AssinaturaConfirmacaoRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AssinaturaService {
    
    private final AssinaturaRepository assinaturaRepository;
    private final ClienteRepository clienteRepository;
    
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;
    
    @Value("${app.base.url:http://localhost:4200}")
    private String baseUrl;
    
    private static final String PDF_EXTENSION = ".pdf";
    private static final String JPG_EXTENSION = ".jpg";
    private static final String ARQUIVOS_PATH = "/arquivos/";
    private static final String SELFIES_PATH = "/selfies/";

    public AssinaturaService(AssinaturaRepository assinaturaRepository, ClienteRepository clienteRepository) {
        this.assinaturaRepository = assinaturaRepository;
        this.clienteRepository = clienteRepository;
    }

    /**
     * Cria uma nova assinatura com upload de PDF
     */
    private String gerarNomePdf() {
        return UUID.randomUUID().toString() + PDF_EXTENSION;
    } 
    public AssinaturaModel criarAssinatura(String clienteId, String termoId, String cenarioId, MultipartFile pdfFile) {
        validarParametrosObrigatorios(clienteId, termoId, cenarioId, pdfFile);
        
        String nomePdf = gerarNomePdf();
        String caminhoSalvo = salvarPdf(pdfFile, nomePdf);
        
        AssinaturaModel novaAssinatura = construirNovaAssinatura(clienteId, termoId, cenarioId, caminhoSalvo);
        
        return assinaturaRepository.save(novaAssinatura);
    }

    /**
     * Busca CPF do cliente por ID
     */
    private String buscarCpfPorClienteId(String clienteId) {
        return clienteRepository.findById(clienteId)
            .map(ClienteModel::getCpf)
            .orElse(null);
    }

    /**
     * Busca assinatura por ID
     */
    @Transactional(readOnly = true)
    public Optional<AssinaturaModel> buscarAssinatura(String id) {
        if (!StringUtils.hasText(id)) {
            return Optional.empty();
        }
        return assinaturaRepository.findById(id);
    }

    /**
     * Lista todas as assinaturas
     */
    @Transactional(readOnly = true)
    public List<AssinaturaModel> listarAssinatura() {
        return assinaturaRepository.findAll();
    }
      
    /**
     * Gera link de assinatura
     */
    public AssinaturaModel gerarLinkAssinatura(String id) {
        AssinaturaModel assinatura = buscarAssinaturaObrigatoria(id);
        
        String link = baseUrl + "/assinar/" + id;
        
        assinatura.setLinkAssinatura(link);
        assinatura.setStatus(StatusAssinatura.LINK_ENVIADO);
        assinatura.setDataEnvioLink(LocalDateTime.now());
        
        return assinaturaRepository.save(assinatura);
    }

    /**
     * Obtém bytes do PDF da assinatura
     */
    @Transactional(readOnly = true)
    public byte[] obterPdfBytes(String id) throws AssinaturaException {
        AssinaturaModel assinatura = buscarAssinaturaObrigatoria(id);
        
        if (!StringUtils.hasText(assinatura.getPdfPath())) {
            throw new AssinaturaException("PDF não encontrado para esta assinatura");
        }

        String nomeArquivo = extrairNomeArquivo(assinatura.getPdfPath());
        Path pdfPath = Paths.get(uploadDir, nomeArquivo);

        if (!Files.exists(pdfPath)) {
            throw new AssinaturaException("Arquivo PDF não existe no sistema: " + pdfPath);
        }

        try {
            return Files.readAllBytes(pdfPath);
        } catch (IOException e) {
            throw new AssinaturaException("Erro ao ler arquivo PDF", e);
        }
    }

    /**
     * Confirma assinatura com validação de CPF e salva selfie como JPG
     */
    public AssinaturaModel confirmarAssinatura(String id, AssinaturaConfirmacaoRequest request, String ip) {
        validarRequestConfirmacao(request);
        
        AssinaturaModel assinatura = buscarAssinaturaObrigatoria(id);
        
        String cpfEsperado = buscarCpfPorClienteId(assinatura.getClienteId());
        boolean cpfValido = validarCpf(cpfEsperado, request.getCpfInformado());
        
        // Salvar selfie como arquivo JPG se fornecida
        String selfiePath = null;
        if (StringUtils.hasText(request.getSelfieBase64())) {
            selfiePath = salvarSelfieComoJpg(request.getSelfieBase64(), id);
        }
        
        atualizarDadosConfirmacao(assinatura, request, ip, cpfValido, selfiePath);
        
        return assinaturaRepository.save(assinatura);
    }
    
    /**
     * Obtém bytes da selfie JPG da assinatura
     */
    @Transactional(readOnly = true)
    public byte[] obterSelfieBytes(String id) throws AssinaturaException {
        AssinaturaModel assinatura = buscarAssinaturaObrigatoria(id);
        
        if (!StringUtils.hasText(assinatura.getSelfiePath())) {
            throw new AssinaturaException("Selfie não encontrada para esta assinatura");
        }

        String nomeArquivo = extrairNomeArquivo(assinatura.getSelfiePath());
        Path selfiePath = Paths.get(uploadDir, "selfies", nomeArquivo);

        if (!Files.exists(selfiePath)) {
            throw new AssinaturaException("Arquivo de selfie não existe no sistema: " + selfiePath);
        }

        try {
            return Files.readAllBytes(selfiePath);
        } catch (IOException e) {
            throw new AssinaturaException("Erro ao ler arquivo de selfie", e);
        }
    }
    public AssinaturaModel marcarComoAssinada(String id) {
        AssinaturaModel assinatura = buscarAssinaturaObrigatoria(id);
        
        assinatura.setStatus(StatusAssinatura.ASSINADA);
        assinatura.setDataAssinatura(LocalDateTime.now());
        
        return assinaturaRepository.save(assinatura);
    }
    
    /**
     * Busca assinaturas por status
     */
    @Transactional(readOnly = true)
    public List<AssinaturaModel> buscarPorStatus(StatusAssinatura status) {
        if (status == null) {
            throw new IllegalArgumentException("Status não pode ser nulo");
        }
        return assinaturaRepository.findByStatus(status);
    }

    // Métodos auxiliares privados
    
    private void validarParametrosObrigatorios(String clienteId, String termoId, String cenarioId, MultipartFile pdfFile) {
        if (!StringUtils.hasText(clienteId)) {
            throw new IllegalArgumentException("Cliente ID é obrigatório");
        }
        if (!StringUtils.hasText(termoId)) {
            throw new IllegalArgumentException("Termo ID é obrigatório");
        }
        if (!StringUtils.hasText(cenarioId)) {
            throw new IllegalArgumentException("Cenário ID é obrigatório");
        }
        if (pdfFile == null || pdfFile.isEmpty()) {
            throw new IllegalArgumentException("Arquivo PDF é obrigatório");
        }
        if (!isPdfFile(pdfFile)) {
            throw new IllegalArgumentException("Arquivo deve ser um PDF");
        }
    }
    
    private boolean isPdfFile(MultipartFile file) {
        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();
        
        return "application/pdf".equals(contentType) || 
               (originalFilename != null && originalFilename.toLowerCase().endsWith(PDF_EXTENSION));
    }
    
    private String gerarNomeJpg() {
        return UUID.randomUUID().toString() + JPG_EXTENSION;
    }
    
    private String salvarSelfieComoJpg(String selfieBase64, String assinaturaId) {
        try {
            // Remove o prefixo data:image/jpeg;base64, se existir
            String base64Data = selfieBase64;
            if (selfieBase64.contains(",")) {
                base64Data = selfieBase64.split(",")[1];
            }
            
            // Decodifica o Base64
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);
            
            // Gera nome único para a selfie
            String nomeJpg = assinaturaId + "_selfie_" + System.currentTimeMillis() + JPG_EXTENSION;
            
            // Cria diretório de selfies se não existir
            Path selfiesDir = Paths.get(uploadDir, "selfies");
            Files.createDirectories(selfiesDir);
            
            // Salva o arquivo
            Path caminhoSelfie = selfiesDir.resolve(nomeJpg);
            Files.write(caminhoSelfie, imageBytes);
            
            return SELFIES_PATH + nomeJpg;
            
        } catch (Exception e) {
            throw new AssinaturaException("Erro ao salvar selfie como JPG", e);
        }
    }
    
    private String salvarPdf(MultipartFile pdfFile, String nomePdf) {
        Path caminho = Paths.get(uploadDir, nomePdf);
        
        try {
            Files.createDirectories(caminho.getParent());
            Files.write(caminho, pdfFile.getBytes());
            return ARQUIVOS_PATH + nomePdf;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar o PDF: " + nomePdf, e);
        }
    }
    
    private AssinaturaModel construirNovaAssinatura(String clienteId, String termoId, String cenarioId, String pdfPath) {
        AssinaturaModel assinatura = new AssinaturaModel();
        assinatura.setClienteId(clienteId);
        assinatura.setTermoId(termoId);
        assinatura.setCenarioId(cenarioId);
        assinatura.setDataAssinatura(LocalDateTime.now());
        assinatura.setStatus(StatusAssinatura.CRIADA);
        assinatura.setPdfPath(pdfPath);
        return assinatura;
    }
    
    private AssinaturaModel buscarAssinaturaObrigatoria(String id) {
        return buscarAssinatura(id)
            .orElseThrow(() -> new AssinaturaException("Assinatura não encontrada: " + id));
    }
    
    private String extrairNomeArquivo(String pdfPath) {
        return pdfPath.replaceFirst("^" + ARQUIVOS_PATH, "");
    }
    
    private void validarRequestConfirmacao(AssinaturaConfirmacaoRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request de confirmação não pode ser nulo");
        }
        if (!StringUtils.hasText(request.getCpfInformado())) {
            throw new IllegalArgumentException("CPF é obrigatório");
        }
    }
    
    private boolean validarCpf(String cpfEsperado, String cpfInformado) {
        return cpfEsperado != null && cpfEsperado.equals(cpfInformado);
    }
    
    private void atualizarDadosConfirmacao(AssinaturaModel assinatura, AssinaturaConfirmacaoRequest request, 
                                         String ip, boolean cpfValido, String selfiePath) {
        assinatura.setCpfInformado(request.getCpfInformado());
        assinatura.setSelfieBase64(request.getSelfieBase64()); // Mantém no banco também
        assinatura.setSelfiePath(selfiePath); // Novo campo para o caminho do arquivo
        assinatura.setLocalizacao(request.getLocalizacao());
        assinatura.setIp(ip);
        assinatura.setDataAssinatura(LocalDateTime.now());
        assinatura.setStatus(cpfValido ? StatusAssinatura.CONFIRMADA : StatusAssinatura.RECUSADA);
    }
    
    // Exceção customizada
    public static class AssinaturaException extends RuntimeException {
        public AssinaturaException(String message) {
            super(message);
        }
        
        public AssinaturaException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}