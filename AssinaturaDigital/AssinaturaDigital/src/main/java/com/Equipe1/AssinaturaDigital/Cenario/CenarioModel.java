package com.Equipe1.AssinaturaDigital.Cenario;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "cenarios")
public class CenarioModel {
    
    @Id
    private String id;
    private String titulo; 
    private String funcionarioId;  
    private String clienteId;   
    private List<String> termosIds; 
    private LocalDateTime dataCriacao;


    public CenarioModel() {
    }

    public CenarioModel(String titulo, String funcionarioId, String clienteId, List<String> termosIds, LocalDateTime dataCriacao) {
        this.titulo = titulo;
        this.funcionarioId = funcionarioId;
        this.clienteId = clienteId;
        this.termosIds = termosIds;
        this.dataCriacao = dataCriacao;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getFuncionarioId() {
        return funcionarioId;
    }

    public void setFuncionarioId(String funcionarioId) {
        this.funcionarioId = funcionarioId;
    }

    public String getClienteId() {
        return clienteId;
    }

    public void setClienteId(String clienteId) {
        this.clienteId = clienteId;
    }

    public List<String> getTermosIds() {
        return termosIds;
    }

    public void setTermosIds(List<String> termosIds) {
        this.termosIds = termosIds;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}
