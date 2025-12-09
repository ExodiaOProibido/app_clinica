// App.js (Corrigido para usar nomes explícitos e resolver imports)
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// 1. Imports de Telas de Navegação (Menu, Splash, etc.)
import Splash from "./src/screens/Splash/Splash";
import MenuScreen from "./src/screens/Menu/MenuScreen";
import Consulta from "./src/screens/Consulta/Consulta";

// 2. Imports de Telas de Listagem (Assumindo que estes são os arquivos com SectionList)
// Se 'Medico.js' e 'Paciente.js' não exportam a tela de listagem, renomeie os imports
// Assumindo que a listagem de médico se chama MedicoOp1Screen
import MedicoOp1Screen from "./src/screens/Medico/Medico"; // 🎯 Ajuste: Se Medico.js exporta a tela de listagem
import PacienteOp1Screen from "./src/screens/Paciente/Paciente"; // 🎯 Ajuste: Se Paciente.js exporta a tela de listagem

// 3. Imports de Formulários (Cadastro/Edição)
import CadastroEdicaoMedicoScreen from "./src/screens/Medico/CadastroEdicaoMedicoScreen";
// 🎯 CORREÇÃO: Renomear o import para Pacientes para evitar conflito de nomes
import CadastroEdicaoPacienteScreen from "./src/screens/Paciente/CadastroEdicaoPacienteScreen";

const Stack = createStackNavigator();

function App() {
  // --- ESTADO DE DADOS (Mock Data) ---
  const [medicos, setMedicos] = useState([
    // ... (Seus dados mock de médicos)
    {
      id: 1,
      nome: "João de Oliveira",
      especialidade: "Cardiologista",
      crm: "12345/MG",
      email: "joao@clinica.com",
      telefone: "(31) 98765-4321",
      logradouro: "Rua A",
      numero: "100",
      complemento: "",
      bairro: "Centro",
      cidade: "BH",
      uf: "MG",
      cep: "30110-001",
    },
    {
      id: 2,
      nome: "Antônio de Oliveira",
      especialidade: "Pediatra",
      crm: "23456/MG",
      email: "antonio@clinica.com",
      telefone: "(31) 99876-5432",
      logradouro: "Av. B",
      numero: "200",
      complemento: "Sala 1",
      bairro: "Funcionários",
      cidade: "BH",
      uf: "MG",
      cep: "30110-002",
    },
    {
      id: 3,
      nome: "Maria da Silva",
      especialidade: "Dermatologista",
      crm: "34567/SP",
      email: "maria@clinica.com",
      telefone: "(11) 97654-3210",
      logradouro: "Rua C",
      numero: "300",
      complemento: "",
      bairro: "Pinheiros",
      cidade: "São Paulo",
      uf: "SP",
      cep: "05407-000",
    },
  ]);

  const [pacientes, setPacientes] = useState([
    // ... (Seus dados mock de pacientes)
    {
      id: 101,
      nome: "Pedro Alves",
      cpf: "123.456.789-00",
      email: "pedro@teste.com",
      telefone: "(31) 99111-2222",
      logradouro: "Rua X",
      numero: "50",
      complemento: "",
      bairro: "Savassi",
      cidade: "BH",
      uf: "MG",
      cep: "30110-003",
    },
    {
      id: 102,
      nome: "Alice Lima",
      cpf: "987.654.321-99",
      email: "alice@teste.com",
      telefone: "(11) 99333-4444",
      logradouro: "Av. Y",
      numero: "1500",
      complemento: "Apto 502",
      bairro: "Jardins",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01414-000",
    },
  ]);
  const [consultas, setConsultas] = useState([]);

  // --- FUNÇÕES DE NAVEGAÇÃO E PROPS ---

  // Função para injetar a lista de médicos na tela de listagem
  const MedicoList = (props) => (
    // Usa o componente de listagem de médico (assumido)
    <MedicoOp1Screen {...props} medicos={medicos} />
  );

  // Função para injetar a lista de pacientes na tela de listagem
  const PacienteList = (props) => (
    // Usa o componente de listagem de paciente (assumido)
    <PacienteOp1Screen {...props} pacientes={pacientes} />
  );

  // Função para lidar com o salvamento/edição de pacientes
  const handleSavePaciente = (pacienteData) => {
    if (pacienteData.id) {
      setPacientes((prev) =>
        prev.map((p) => (p.id === pacienteData.id ? pacienteData : p))
      );
    } else {
      const newId = Math.max(...pacientes.map((p) => p.id), 0) + 1;
      setPacientes((prev) => [...prev, { ...pacienteData, id: newId }]);
    }
  };

  // Componente wrapper para injetar a função onSave no formulário de paciente
  const PacienteFormScreen = (props) => (
    <CadastroEdicaoPacienteScreen
      {...props}
      onSave={handleSavePaciente} // Injete a função de salvar
    />
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
          component={CadastroEdicaoMedicoScreen}
          options={{ title: "Gerenciar Médico" }}
        />
        <Stack.Screen
          name="CadastroEdicaoPaciente"
          component={PacienteFormScreen}
          options={{ title: "Gerenciar Paciente" }}
        />

        {/* Tela de Construção (Ações dos Cards) */}
        <Stack.Screen
          name="EmConstrucao"
          component={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 24 }}>Em Construção!</Text>
            </View>
          )}
          options={{ title: "Em Construção" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
