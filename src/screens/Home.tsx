import { useEffect, useState } from "react";
import { Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { dateFormat } from "../utils/firestoreDateFormat"; 

import { useNavigation } from "@react-navigation/native";
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { SignOut } from 'phosphor-react-native';
import { ChatTeardropText } from "phosphor-react-native";

import Logo from "../assets/logo_secondary.svg";

import { Filter } from '../components/Filter';
import { Order, OrderProps } from "../components/Order";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { OrderFirestoreDTO } from "../DTOs/OrderFirestoreDTO";


export function Home() {
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const [ isLoadingButtonOpen, setIsLoadingButtonOpen ] = useState<boolean>(false);
  const [ isLoadingButtonClosed, setIsLoadingButtonClosed ] = useState<boolean>(false);

  const [ statusSelected, setStatusSelected ] = useState<"open" | "closed">("open");
  const [ orders, setOrders ] = useState<OrderProps[]>([]);

  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleNewOrder(){
    navigation.navigate("register");
  }

  function handleOpenDetails(orderId: string){
    navigation.navigate("details", { orderId })
  }

  function handleLogout(){
    auth()
    .signOut()
    .catch((err) => {
      console.log(err);
      return Alert.alert("Sair", "Não foi possível sair")
    })
  }

  useEffect(() => {
    setIsLoading(true);

    const unsubcribe = firestore()
    .collection("orders")
    .onSnapshot(
      ()=>{},
      (err) => console.log(err)
    )
    unsubcribe()

    const subscriber = firestore()
    .collection<OrderFirestoreDTO>("orders")
    .where("status", "==", statusSelected)
    .onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const { patrimony, description, status, created_at } = doc.data();
        return {
          id: doc.id,
          patrimony,
          description,
          status,
          when: dateFormat(created_at),
        }
      });
      setOrders(data);
      setIsLoading(false);
    });
    
    return subscriber;
  
  }, [statusSelected]);

  useEffect(() => {
    if(isLoadingButtonOpen && !isLoading) {
      setIsLoadingButtonOpen(false);
    }
  }, [isLoadingButtonOpen]);

  useEffect(() => {
    if(isLoadingButtonClosed && !isLoading) {
      setIsLoadingButtonClosed(false);
    }
  }, [isLoadingButtonClosed]);

  return (
    <VStack flex={1} pb={6} bg={"gray.700"}>
      <HStack
        w={"full"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"gray.600"}
        pt={9}
        pb={3}
        px={6}
      >
        <Logo/>

        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]}/>}
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack w={"full"} mt={4} mb={4} justifyContent={"space-between"} alignItems={"center"}>
          <Heading color={"gray.100"} fontSize={"md"}>
            Solicitações
          </Heading>
          <Text color={"gray.200"}>
            {orders.length}
          </Text>
        </HStack>
        <HStack space={3} mb={4}>
          <Filter 
            type={"open"} 
            title={"em andamento"}
            onPress={() => {
              setIsLoadingButtonOpen(true)
              setStatusSelected("open")
            }}
            isActive={statusSelected === "open"}
            isLoading={isLoadingButtonOpen}
          />
          <Filter 
            type={"closed"} 
            title={"finalizados"}
            onPress={() => {
              setIsLoadingButtonClosed(true)
              setStatusSelected("closed")
            }}
            isActive={statusSelected === "closed"}
            isLoading={isLoadingButtonClosed}
          />
        </HStack>

        {isLoading ? <Loading/> : (
          <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <Order data={item} onPress={()=> handleOpenDetails(item.id)}/>}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 100}}
            ListEmptyComponent={() => (
              <Center py={5}>
                <ChatTeardropText color={colors.gray[300]} size={40}/>
                <Text color={"gray.300"} fontSize={"xl"} mt={6} textAlign={"center"}>
                  Você ainda não possui {"\n"}
                  solicitações {statusSelected === "open" ? "em aberto" : "finalizadas"}
                </Text>
              </Center>
            )}  
          />
        )}
        
        <Button title={"Nova solicitação"} onPress={handleNewOrder} h={10}/>
      </VStack>

    </VStack>
  );
}