package com.Equipe1.AssinaturaDigital.Assinatura;

public enum StatusAssinatura {
    CRIADA("Criada"),
    LINK_ENVIADO("Link Enviado"),
    ASSINADA("Assinada"),
    CONFIRMADA("Confirmada"),    // novo: validação com CPF/selfie OK
    RECUSADA("Recusada"),        // novo: validação com CPF/selfie falhou
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

