// src/screens/Medico/Op1Screen.js (Refatorado para o estilo Paciente)
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
  Alert,
} from "react-native";

const IconeLupa = require("../../../assets/lupa.png");
const IconeSeta = require("../../../assets/seta.png");

// Habilita LayoutAnimation para Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// =========================================================================
// FUNÇÃO AUXILIAR PARA AGRUPAR E FILTRAR OS DADOS (Mantida)
// =========================================================================
const groupAndFilterMedicos = (medicos, searchText) => {
  const filteredMedicos = medicos.filter(
    (medico) =>
      medico.nome.toLowerCase().includes(searchText.toLowerCase()) ||
      medico.especialidade.toLowerCase().includes(searchText.toLowerCase())
  );

  const grouped = filteredMedicos.reduce((acc, medico) => {
    const firstLetter = medico.nome[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(medico);
    return acc;
  }, {});

  const sections = Object.keys(grouped)
    .sort()
    .map((letter) => ({
      title: letter,
      data: grouped[letter],
    }));

  return sections;
};

// =========================================================================
// COMPONENTE CARD EXPANSÍVEL DO MÉDICO (Refatorado)
// =========================================================================


const MedicoCard = ({ medico, navigation, onDeactivate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
const endereco = medico.endereco;

const formatEndereco = (endereco) => {
  if (!endereco) return "Endereço indisponível.";
  // Acessa as propriedades dentro do objeto 'endereco'
  return `${endereco.logradouro}, ${endereco.numero}${
    endereco.complemento ? " - " + endereco.complemento : ""
  }`;
};

const formatCidade = (endereco) => {
  if (!endereco) return "";
  // Acessa as propriedades dentro do objeto 'endereco'
  return `${endereco.bairro}, ${endereco.cidade}/${endereco.uf} - CEP: ${endereco.cep}`;
};

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };
  const handleDeactivate = () => {
    Alert.alert(
      "Confirmação",
      `Deseja realmente desativar o perfil de ${medico.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, Desativar",
          style: "destructive",
          onPress: () => onDeactivate(medico.id),
        },
      ]
    );
  };

  return (
    <View style={cardStyles.card}>
      {/* SEÇÃO PRINCIPAL VISÍVEL */}
      <TouchableOpacity onPress={toggleExpand} style={cardStyles.mainInfo}>
        <View>
          <Text style={cardStyles.nome}>{medico.nome}</Text>
          <Text style={cardStyles.infoSecundaria}>
            {medico.especialidade} | CRM: {medico.crm}
          </Text>
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

      {isExpanded && (
        <View style={cardStyles.details}>
          {/* NOVO: Cabeçalho para Contato */}
          <Text style={cardStyles.detailHeader}>Informações de Contato</Text>
          <Text style={cardStyles.detailText}>Email: {medico.email}</Text>
          <Text style={cardStyles.detailText}>Telefone: {medico.telefone}</Text>

          {/* NOVO: Cabeçalho para Endereço */}
          <Text style={cardStyles.detailHeader}>Endereço Profissional</Text>
          <Text style={cardStyles.detailText}>
            Logradouro: {formatEndereco(endereco)}
          </Text>
          <Text style={cardStyles.detailText}>
            Local: {formatCidade(endereco)}
          </Text>

          <View style={cardStyles.actionButtons}>
            <Button
              title="Editar"
              onPress={() =>
                navigation.navigate("CadastroEdicaoMedico", { medico: medico })
              }
            />
            <Button
              title="Desativar Perfil"
              color="red"
              onPress={handleDeactivate} 
            />
          </View>
        </View>
      )}
    </View>
  );
};

// =========================================================================
// TELA PRINCIPAL
// =========================================================================
const Op1Screen = ({ navigation, medicos, onDeactivate }) => {
  const [searchText, setSearchText] = useState("");

  const activeMedicos = medicos.filter((m) => m.ativo !== false);

  const sections = useMemo(
    //  Usa a lista filtrada para agrupar e pesquisar
    () => groupAndFilterMedicos(activeMedicos, searchText),
    [activeMedicos, searchText]
  );

  return (
    <View style={styles.container}>
      {/* CAMPO PESQUISAR */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar Médico ou Especialidade"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Image source={IconeLupa} style={styles.searchIcon} />
      </View>
      {/* LISTA ROLÁVEL */}
      <View style={styles.listWrapper}>
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MedicoCard
              medico={item}
              navigation={navigation}
              onDeactivate={onDeactivate}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={styles.sectionListContent}
          stickySectionHeadersEnabled={true}
        />
      </View>
      <View style={styles.fixedButtonContainer}>
        <Button
          title="Cadastrar Novo Perfil"
          onPress={() =>
            navigation.navigate("CadastroEdicaoMedico", { medico: null })
          }
        />
      </View>
    </View>
  );
};

// =========================================================================
// ESTILOS (Adicionado 'infoSecundaria' e 'detailHeader' ao cardStyles)
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
    color: "#007AFF", 
  },
  fixedButtonContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginBottom: 25,
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
    color: "#007AFF", 
  },
  infoSecundaria: {
    fontSize: 14,
    color: "#555",
  },
  arrowIcon: {
    width: 15,
    height: 15,
    tintColor: "#007AFF",
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

export default Op1Screen;
