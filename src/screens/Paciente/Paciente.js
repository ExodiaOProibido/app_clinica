// src/screens/Paciente/Op1Screen.js
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Platform,
  LayoutAnimation,
  UIManager,
  Button,
  Image,
} from "react-native";

// Ícones (você precisará ter esses arquivos PNG ou usar uma biblioteca de ícones)
const IconeLupa = require("../../../assets/lupa.png"); // Exemplo
const IconeSeta = require("../../../assets/seta.png"); // Exemplo

// Habilita LayoutAnimation para Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// =========================================================================
// FUNÇÃO AUXILIAR PARA AGRUPAR E FILTRAR OS DADOS
// =========================================================================
const groupAndFilterPacientes = (pacientes, searchText) => {
  // 🎯 Filtra por Nome ou CPF (adaptado para Paciente)
  const filteredPacientes = pacientes.filter(
    (paciente) =>
      paciente.nome.toLowerCase().includes(searchText.toLowerCase()) ||
      paciente.cpf.includes(searchText)
  );

  const grouped = filteredPacientes.reduce((acc, paciente) => {
    // Agrupa pela primeira letra do Nome
    const firstLetter = paciente.nome[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(paciente);
    return acc;
  }, {});

  // Converte o objeto agrupado para o formato do SectionList
  const sections = Object.keys(grouped)
    .sort() // Garante a ordem alfabética das seções
    .map((letter) => ({
      title: letter,
      data: grouped[letter],
    }));

  return sections;
};

// =========================================================================
// COMPONENTE CARD EXPANSÍVEL DO PACIENTE
// =========================================================================
const PacienteCard = ({ paciente, navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    // Anima a mudança de layout
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  // Funções auxiliares para formatar o endereço
  const formatEndereco = (p) => {
    // Assumindo que os dados do paciente incluem o endereço completo
    return `${p.logradouro}, ${p.numero}${
      p.complemento ? " - " + p.complemento : ""
    }`;
  };

  const formatCidade = (p) => {
    return `${p.bairro}, ${p.cidade}/${p.uf} - CEP: ${p.cep}`;
  };

  return (
    <View style={cardStyles.card}>
      {/* SEÇÃO PRINCIPAL VISÍVEL */}
      <TouchableOpacity onPress={toggleExpand} style={cardStyles.mainInfo}>
        <View>
          <Text style={cardStyles.nome}>{paciente.nome}</Text>
          {/* Mostra o CPF logo abaixo do nome */}
          <Text style={cardStyles.infoSecundaria}>CPF: {paciente.cpf}</Text>
        </View>

        {/* Ícone triangular para expandir/colapsar */}
        <Image
          source={IconeSeta}
          style={[
            cardStyles.arrowIcon,
            { transform: [{ rotate: isExpanded ? "90deg" : "0deg" }] },
          ]}
        />
      </TouchableOpacity>

      {/* SEÇÃO EXPANSÍVEL (Detalhes) */}
      {isExpanded && (
        <View style={cardStyles.details}>
          <Text style={cardStyles.detailHeader}>Informações de Contato</Text>
          <Text style={cardStyles.detailText}>Email: **{paciente.email}**</Text>
          <Text style={cardStyles.detailText}>
            Telefone: **{paciente.telefone}**
          </Text>

          <Text style={cardStyles.detailHeader}>Endereço Completo</Text>
          <Text style={cardStyles.detailText}>
            Logradouro: **{formatEndereco(paciente)}**
          </Text>
          <Text style={cardStyles.detailText}>
            Local: **{formatCidade(paciente)}**
          </Text>

          <View style={cardStyles.actionButtons}>
            <Button
              title="Editar"
              onPress={() =>
                navigation.navigate("CadastroEdicaoPaciente", {
                  paciente: paciente,
                })
              }
            />
            <Button
              title="Remover Paciente"
              color="red"
              onPress={() => navigation.navigate("EmConstrucao")}
            />
          </View>
        </View>
      )}
    </View>
  );
};

// =========================================================================
// TELA PRINCIPAL (LISTAGEM DE PACIENTES)
// =========================================================================
const PacienteOp1Screen = ({ navigation, pacientes }) => {
  const [searchText, setSearchText] = useState("");

  // Use useMemo para recalcular as seções apenas quando 'pacientes' ou 'searchText' mudar
  const sections = useMemo(
    () => groupAndFilterPacientes(pacientes, searchText),
    [pacientes, searchText]
  );

  return (
    <View style={styles.container}>
      {/* CAMPO PESQUISAR (Não rolável) */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar Paciente por Nome ou CPF"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Image source={IconeLupa} style={styles.searchIcon} />
      </View>
      {/* LISTA ROLÁVEL */}
      <View style={styles.listWrapper}>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.cpf + index}
          renderItem={({ item }) => (
            <PacienteCard paciente={item} navigation={navigation} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}> {title}</Text>
          )}
          contentContainerStyle={styles.sectionListContent}
          stickySectionHeadersEnabled={true}
          // Exibe uma mensagem se a lista estiver vazia
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Nenhum paciente encontrado.
            </Text>
          )}
        />
      </View>
      <View style={styles.fixedButtonContainer}>
        <Button
          title="Cadastrar Novo Paciente"
          onPress={() =>
            navigation.navigate("CadastroEdicaoPaciente", { paciente: null })
          }
        />
      </View>
    </View>
  );
};

// =========================================================================
// ESTILOS (A maioria é mantida do Medico.js)
// =========================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: "#aaa",
  },
  listWrapper: {
    flex: 1,
  },
  sectionListContent: {
    paddingBottom: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: "#007AFF", // Destaque para a letra inicial
  },
  fixedButtonContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginBottom: 25,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#999",
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  mainInfo: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28A745", // Usei um verde diferente para distinguir de Médico (azul)
  },
  infoSecundaria: {
    // Substitui especialidade
    fontSize: 14,
    color: "#555",
  },
  arrowIcon: {
    width: 15,
    height: 15,
    tintColor: "#28A745", // Cor do ícone combinando
  },
  details: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  detailHeader: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});

export default PacienteOp1Screen;
