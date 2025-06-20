package com.Equipe1.AssinaturaDigital.Assinatura;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Document(collection = "assinaturas") 
public class AssinaturaModel {

    @Id
    private String id; 
    private String clienteId;  
    private String termoId;    
    private String cenarioId;  
    private LocalDateTime dataAssinatura;
    private String ip;
    private String localizacao;
    private String pdfPath;

    public AssinaturaModel(String clienteId, String termoId, String cenarioId, LocalDateTime dataAssinatura, String ip, String localizacao, String pdfPath) {
        this.clienteId = clienteId;
        this.termoId = termoId;
        this.cenarioId = cenarioId;
        this.dataAssinatura = dataAssinatura;
        this.ip = ip;
        this.localizacao = localizacao;
        this.pdfPath = pdfPath;
    }

    public String getPdfPath() {
        return pdfPath;
    }

    public void setPdfPath(String pdfPath) {
        this.pdfPath = pdfPath;
    }

    public StatusAssinatura getStatus() {
        return status;
    }

    public void setStatus(StatusAssinatura status) {
        this.status = status;
    }

    public String getLinkAssinatura() {
        return linkAssinatura;
    }

    public void setLinkAssinatura(String linkAssinatura) {
        this.linkAssinatura = linkAssinatura;
    }

    public LocalDateTime getDataEnvioLink() {
        return dataEnvioLink;
    }

    public void setDataEnvioLink(LocalDateTime dataEnvioLink) {
        this.dataEnvioLink = dataEnvioLink;
    }

    @Enumerated(EnumType.STRING)
    private StatusAssinatura status = StatusAssinatura.CRIADA;
    
    private String linkAssinatura; // URL gerada para o cliente
    private LocalDateTime dataEnvioLink;

    // Construtores, getters e setters

    public AssinaturaModel() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getClienteId() {
        return clienteId;
    }

    public void setClienteId(String clienteId) {
        this.clienteId = clienteId;
    }

    public String getTermoId() {
        return termoId;
    }

    public void setTermoId(String termoId) {
        this.termoId = termoId;
    }

    public String getCenarioId() {
        return cenarioId;
    }

    public void setCenarioId(String cenarioId) {
        this.cenarioId = cenarioId;
    }

    public LocalDateTime getDataAssinatura() {
        return dataAssinatura;
    }

    public void setDataAssinatura(LocalDateTime dataAssinatura) {
        this.dataAssinatura = dataAssinatura;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }
}
