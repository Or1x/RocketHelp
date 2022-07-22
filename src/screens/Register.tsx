import { useState } from "react";

import { VStack } from "native-base";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Register() {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ patrimony, setPatrimony ] = useState<string>("");
  const [ description, setDescription ] = useState<string>("");

  const navigation = useNavigation();

  function handleNewOrderRegister(){
    if(!description || !patrimony){
      return Alert.alert("Registrar", "Preencha todos os campos.")
    }

    setIsLoading(true);

    firestore()
    .collection("orders")
    .add({
      patrimony,
      description,
      status: "open",
      created_at: firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      Alert.alert("Solicitação", "Solicitação registrada com sucesso.");
      navigation.goBack();
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
      return Alert.alert("Solicitação", "Não foi possível registrar o pedido");
    })
  }

  return (
    <VStack flex={1} px={6} bg={"gray.600"}>
      <Header title="Nova solicitação"/>
      <Input
        placeholder={"Número do patrimônio"}
        mt={4}
        onChangeText={setPatrimony}
      />
      <Input
        placeholder={"Descrição do problema"}
        flex={1}
        mt={5}
        h={10}
        multiline
        textAlignVertical={"top"}
        onChangeText={setDescription}
      />
      <Button
        title={"Cadastrar"}
        mt={5}
        mb={6}
        h={10}
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
      />
    </VStack>
  );
}