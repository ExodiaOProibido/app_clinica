package com.medpro.medpro.model.dto;

import com.medpro.medpro.model.entity.Paciente;
import com.medpro.medpro.model.entity.Endereco;

public record DadosListagemPaciente(Long id, String nome, String email, String telefone, String cpf, Endereco endereco) {
    public DadosListagemPaciente(Paciente paciente){
        this(paciente.getId(), paciente.getNome(), paciente.getEmail(), paciente.getTelefone(), paciente.getCpf(), paciente.getEndereco());
    }
}
