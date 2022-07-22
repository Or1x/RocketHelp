import { HStack, IconButton, useTheme, Heading, StyledProps } from 'native-base';
import { CaretLeft } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

type Props = StyledProps & {
  title: string;
}

export function Header({ title, ...next }: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleGoBack(){
    navigation.goBack();
  }

  return (
    <HStack
      w={"full"}
      justifyContent={"space-between"}
      alignItems={"center"}
      bg={"gray.600"}
      pb={2}
      pt={12}
      {...next}
    >
      <IconButton
        icon={<CaretLeft color={colors.gray[200]} size={24}/>}
        onPress={handleGoBack}
      />
      <Heading color={"gray.100"} textAlign={"center"} fontSize={"lg"} flex={1} ml={-6}>
        {title}
      </Heading>
    </HStack>
  );
}