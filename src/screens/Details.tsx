import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

import { Box } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { VStack, Text, HStack, useTheme, ScrollView } from 'native-base';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native';

import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';
import { CardDetails } from "../components/CardDetails";
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';

type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const navigation = useNavigation();
  const [ solution, setSolution ] = useState<string>("");
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const [ isLoadingButton, setIsLoadingButton ] = useState<boolean>(false);
  const [ order, setOrder ] = useState<OrderDetails>({} as OrderDetails);
  // console.log(order)

  const { colors } = useTheme();

  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  function handleOrderClose(){
    if(!solution){
      return Alert.alert("Solicitação", "Informe a solução para encerrar a solicitação")
    }

    setIsLoadingButton(true);

    firestore()
    .collection<OrderFirestoreDTO>("orders")
    .doc(orderId)
    .update({
      status: "closed",
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      Alert.alert("Solicitação", "solicitação encerrada.");
      navigation.goBack();
    })
    .catch((err) => {
      setIsLoadingButton(false);
      console.log(err);
      Alert.alert("Solicitação", "não foi possível encerrar a solicitação.");
    })

  }

  function handleDeleteOrder(){
    setIsLoadingButton(true);

    firestore()
    .collection<OrderFirestoreDTO>("orders")
    .doc(orderId)
    .delete()
    .then(() => {
      Alert.alert("Solicitação", "solicitação deletada.");
      navigation.goBack();
      setIsLoadingButton(false);
    })
    .catch((err) => {
      setIsLoadingButton(false);
      console.log(err);
      Alert.alert("Solicitação", "não foi possível excluir a solicitação")
    })

  }

  useEffect(() => {
    firestore()
    .collection<OrderFirestoreDTO>("orders")
    .doc(orderId)
    .get()
    .then((doc) => {
      const { patrimony, description, status, created_at, closed_at, solution } = doc.data();

      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed
      });

      setIsLoading(false);
    });

    return () => null
  }, []);

  if(isLoading){
    return <Loading/>
  }
  
  return (
    <VStack flex={1} bg={"gray.700"}>
      <Box px={6} bg={"gray.600"}>
        <Header title={"solicitação"}/>
      </Box>
      <HStack 
        bg={"gray.500"} 
        justifyContent={"center"} 
        p={1} 
        h={8}
      >
        {
          order.status === "closed" 
          ? <CircleWavyCheck size={20} color={colors.green[300]}/>
          : <Hourglass size={20} color={colors.secondary[700]}/>
        }
        <Text
          fontSize="sm"
          color={order.status === "closed" ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform={"uppercase"}
        >
          {order.status === "closed" ? "finalizado" : "em andamento"}
        </Text>
      </HStack>

      <ScrollView
        mx={5}
        showsVerticalScrollIndicator={false}
      >
        <CardDetails 
          title={"equipamento"}
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
          />
        <CardDetails 
          title={"descrição do problema"}
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em: ${order.when}`}
        />
        <CardDetails 
          title={"solução"}
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `encerrado em ${order.closed}`}
          mb={60}
        >
        {
          order.status === "open" &&
          <Input 
            bg={"gray.600"} 
            borderWidth={1} 
            borderColor={"gray.500"}
            onChangeText={setSolution}
            h={24}
            textAlignVertical={"top"}
            multiline
          />
        }
        </CardDetails>

      </ScrollView>
      
        {
          order.status === "open" 
          ? <Button 
              title={"Encerrar solicitação"}
              m={5}
              h={10}
              isLoading={isLoadingButton}
              onPress={handleOrderClose}
            />
          : <Button
              title={"Excluir solicitação"}
              m={5}
              h={10}
              color={"#FF3333"}
              onPressedColor={"#FF5C5C"}
              isLoading={isLoadingButton}
              onPress={handleDeleteOrder}
            />
        }

    </VStack>
  );
}