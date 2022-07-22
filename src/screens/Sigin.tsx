import { useState } from "react";
import { VStack, Heading, Icon, ScrollView, useTheme } from "native-base";
import { Alert } from "react-native";
import auth from "@react-native-firebase/auth";

import Logo from "../assets/logo_primary.svg";
import { Envelope, Key } from "phosphor-react-native";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Sigin(){
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ email, setEmail ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");
  const { colors } = useTheme();

  function handleSigin(){
    if(!email || !password){
      return Alert.alert("Entrar", "Informe seu e-mail e senha");
    }

    setIsLoading(true);
    auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {})
    .catch((err) => {
      console.log(err);
      setIsLoading(false);

      if(err.code === "auth/invalid-email"){
        return Alert.alert("Entrar", "e-mail inválido.")
      }
      
      if(err.code === "auth/wrong-password" || err.code === "auth/user-not-found"){
        return Alert.alert("Entrar", "E-mail ou senha inválida..")
      }

      return Alert.alert("Entrar", "Não foi possivel acessar.");

    })
  }

  return (
    <ScrollView bg={"gray.600"}>
      <VStack flex={1} h={"full"} alignItems={"center"} px={8} pt={24} mb={10}>
        <Logo/>
        <Heading color={"gray.100"} fontSize={"xl"} mt={20} mb={6}>
          Acesse sua conta
        </Heading>
        <Input 
          placeholder={"Insira um e-mail"}
          mb={4}
          InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4}/>}
          onChangeText={setEmail}
        />
        <Input 
          placeholder={"Insira uma senha"}
          InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4}/>}
          mb={8}
          secureTextEntry
          onChangeText={setPassword}
        />
        <Button 
          title="Entrar" 
          w="full" 
          h={12}
          onPress={handleSigin}
          isLoading={isLoading}
        />
      </VStack>
    </ScrollView>
   
  )
}
