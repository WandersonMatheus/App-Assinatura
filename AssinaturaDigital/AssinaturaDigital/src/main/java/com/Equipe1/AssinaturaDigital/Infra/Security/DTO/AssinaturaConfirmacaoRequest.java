package com.Equipe1.AssinaturaDigital.Infra.Security.DTO;

public class AssinaturaConfirmacaoRequest {

    private String cpfInformado;
    private String selfieBase64;
    private String localizacao;

    // getters e setters

    public String getCpfInformado() {
        return cpfInformado;
    }

    public void setCpfInformado(String cpfInformado) {
        this.cpfInformado = cpfInformado;
    }

    public String getSelfieBase64() {
        return selfieBase64;
    }

    public void setSelfieBase64(String selfieBase64) {
        this.selfieBase64 = selfieBase64;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }
}

