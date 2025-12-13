// App.js (Corrigido para usar nomes explícitos e resolver imports)
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Splash from "./src/screens/Splash/Splash";
import MenuScreen from "./src/screens/Menu/MenuScreen";
import Consulta from "./src/screens/Consulta/Consulta";

import MedicoOp1Screen from "./src/screens/Medico/Medico";
import PacienteOp1Screen from "./src/screens/Paciente/Paciente";

import CadastroEdicaoMedicoScreen from "./src/screens/Medico/CadastroEdicaoMedicoScreen";
import CadastroEdicaoPacienteScreen from "./src/screens/Paciente/CadastroEdicaoPacienteScreen";

const API_BASE_URL = "http://10.110.12.10:8089";

const Stack = createStackNavigator();

function App() {
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [consultas, setConsultas] = useState([]);

  // --- FUNÇÕES DE NAVEGAÇÃO E PROPS ---

  const MedicoList = (props) => (
    <MedicoOp1Screen
      {...props}
      medicos={medicos}
      onDeactivate={handleDeactivateMedico}
    />
  );

  // Função para injetar a lista de pacientes na tela de listagem
  const PacienteList = (props) => (
    <PacienteOp1Screen
      {...props}
      pacientes={pacientes}
      onDeactivate={handleDeactivatePaciente}
    />
  );

  const fetchMedicos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/medicos`);

      const listaMedicos = response.data.content;

      setMedicos(listaMedicos);
    } catch (error) {
      console.error(
        "Falha ao buscar médicos:",
        error.response?.data || error.message
      );
    }
  };

  // Função para Salvar/Editar Médico (POST/PUT)
  const handleSaveMedico = async (medicoData) => {
    const isEditing = !!medicoData.id;

    const dataToSend = {
      ...medicoData,

      endereco: {
        logradouro: medicoData.logradouro,
        numero: medicoData.numero,
        complemento: medicoData.complemento,
        bairro: medicoData.bairro,
        cidade: medicoData.cidade,
        uf: medicoData.uf,
        cep: medicoData.cep,
      },
    };

    // O PUT e POST do Spring Boot não esperam logradouro fora do objeto 'endereco'.
    delete dataToSend.logradouro;
    delete dataToSend.numero;
    delete dataToSend.complemento;
    delete dataToSend.bairro;
    delete dataToSend.cidade;
    delete dataToSend.uf;
    delete dataToSend.cep;

    // O seu PUT usa /medicos, o POST usa /medicos/cadastro
    const endpoint = isEditing
      ? `${API_BASE_URL}/medicos`
      : `${API_BASE_URL}/medicos/cadastro`;

    try {
      let response;
      if (isEditing) {
        response = await axios.put(endpoint, dataToSend);
      } else {
        response = await axios.post(endpoint, dataToSend);
      }

      const savedMedico = response.data; // Objeto retornado pelo Spring

      // Lógica de atualização do estado local
      if (isEditing) {
        setMedicos((prev) =>
          prev.map((m) => (m.id === savedMedico.id ? savedMedico : m))
        );
      } else {
        setMedicos((prev) => [...prev, savedMedico]);
      }

      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Falha desconhecida ao salvar";
      console.error("Falha ao salvar médico:", errorMessage);
      Alert.alert("Erro de API", errorMessage);
      return false;
    }
  };

  // Função para Desativar Médico (DELETE)
  const handleDeactivateMedico = async (id) => {
    try {
      // O axios faz a requisição DELETE para /medicos/{id}
      await axios.delete(`${API_BASE_URL}/medicos/${id}`);

      // Atualiza o estado local após o sucesso (delete lógico)
      setMedicos((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Falha desconhecida ao desativar";
      console.error("Falha ao desativar:", errorMessage);
      Alert.alert("Erro de API", errorMessage);
    }
  };

  const fetchPacientes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pacientes`);

      const listaPacientes = response.data.content;

      setPacientes(listaPacientes);
    } catch (error) {
      console.error(
        "Falha ao buscar pacientes:",
        error.response?.data || error.message
      );
    }
  };

  const handleSavePaciente = async (pacienteData) => {
    const isEditing = !!pacienteData.id;

    const endpoint = isEditing
      ? `${API_BASE_URL}/pacientes`
      : `${API_BASE_URL}/pacientes/cadastro`;

    const dataToSend = {
      ...pacienteData,
      endereco: {
        logradouro: pacienteData.logradouro,
        numero: pacienteData.numero,
        complemento: pacienteData.complemento,
        bairro: pacienteData.bairro,
        cidade: pacienteData.cidade,
        uf: pacienteData.uf,
        cep: pacienteData.cep,
      },
    };
    delete dataToSend.logradouro;
    delete dataToSend.numero;
    delete dataToSend.complemento;
    delete dataToSend.bairro;
    delete dataToSend.cidade;
    delete dataToSend.uf;
    delete dataToSend.cep;

    try {
      let response;
      if (isEditing) {
        response = await axios.put(endpoint, dataToSend);
      } else {
        response = await axios.post(endpoint, dataToSend);
      }

      const savedPaciente = response.data;

      if (isEditing) {
        setPacientes((prev) =>
          prev.map((p) => (p.id === savedPaciente.id ? savedPaciente : p))
        );
      } else {
        setPacientes((prev) => [...prev, savedPaciente]);
      }
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Falha ao salvar paciente";
      console.error("Falha ao salvar paciente:", errorMessage);
      Alert.alert("Erro de API", errorMessage);
      return false;
    }
  };
  // Função para desativar (deletar lógico) um paciente
  const handleDeactivatePaciente = (id) => {
    setPacientes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ativo: false } : p))
    );
    console.log(`Paciente ID ${id} desativado.`);
  };

  useEffect(() => {
    fetchMedicos();
    fetchPacientes();
  }, []);

  // Componente wrapper para injetar a função onSave no formulário de paciente
  const PacienteFormScreen = (props) => (
    <CadastroEdicaoPacienteScreen {...props} onSave={handleSavePaciente} />
  );

  // Wrapper para o Formulário de Médico injetando o onSave
  const MedicoFormScreen = (props) => (
    <CadastroEdicaoMedicoScreen {...props} onSave={handleSaveMedico} />
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* Telas principais */}
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: "Menu Principal" }}
        />

        {/* Listagens */}
        <Stack.Screen
          name="Medicos"
          component={MedicoList}
          options={{ title: "Médico(a)s" }}
        />
        <Stack.Screen
          name="Pacientes"
          component={PacienteList}
          options={{ title: "Pacientes" }}
        />
        <Stack.Screen
          name="Consultas"
          component={Consulta}
          options={{ title: "Consultas" }}
        />

        {/* Formulários (Cadastro/Edição) */}
        <Stack.Screen
          name="CadastroEdicaoMedico"
          component={MedicoFormScreen}
          options={{ title: "Gerenciar Médico" }}
        />
        <Stack.Screen
          name="CadastroEdicaoPaciente"
          component={PacienteFormScreen}
          options={{ title: "Gerenciar Paciente" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
