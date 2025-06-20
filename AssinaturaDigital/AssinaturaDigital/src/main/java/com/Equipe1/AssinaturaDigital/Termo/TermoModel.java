package com.Equipe1.AssinaturaDigital.Termo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "termos")
public class TermoModel {
    @Id
    private String id; 
    private String titulo;
    private String conteudoHtml;
    private Tipo tipoTermo;
    private String versao;

    public TermoModel() {
    }

    public TermoModel(String titulo, String conteudoHtml, Tipo tipoTermo, String versao) {
        this.titulo = titulo;
        this.conteudoHtml = conteudoHtml;
        this.tipoTermo = tipoTermo;
        this.versao = versao;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getConteudoHtml() {
        return conteudoHtml;
    }

    public void setConteudoHtml(String conteudoHtml) {
        this.conteudoHtml = conteudoHtml;
    }

    public Tipo getTipoTermo() {
        return tipoTermo;
    }

    public void setTipoTermo(Tipo tipoTermo) {
        this.tipoTermo = tipoTermo;
    }

    public String getVersao() {
        return versao;
    }

    public void setVersao(String versao) {
        this.versao = versao;
    }

    @Override
    public String toString() {
        return "TermoModel{" +
                "id='" + id + '\'' +
                ", titulo='" + titulo + '\'' +
                ", tipoTermo=" + tipoTermo +
                ", versao='" + versao + '\'' +
                '}';
    }
}
