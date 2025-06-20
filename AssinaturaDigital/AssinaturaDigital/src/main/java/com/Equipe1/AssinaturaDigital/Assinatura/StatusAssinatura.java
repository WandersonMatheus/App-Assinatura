package com.Equipe1.AssinaturaDigital.Assinatura;

public enum StatusAssinatura {
    CRIADA("Criada"),
    LINK_ENVIADO("Link Enviado"), 
    ASSINADA("Assinada"),
    CANCELADA("Cancelada"),
    PENDENTE("Pendente");

    private final String descricao;
    
    StatusAssinatura(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
}
