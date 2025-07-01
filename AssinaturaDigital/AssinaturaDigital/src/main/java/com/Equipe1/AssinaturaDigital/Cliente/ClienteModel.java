package com.Equipe1.AssinaturaDigital.Cliente;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Document(collection = "clientes")  
public class ClienteModel {
    
    @Id
    @JsonProperty("id")
    private String id;  

    @NotBlank
    private String cpf;

    @NotBlank
    private String nome;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String telefone;
    

    // Construtores, getters e setters

    public ClienteModel() {
    }

    public ClienteModel(String nome, String telefone, String email,String cpf) {
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.cpf = cpf;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }  
}
