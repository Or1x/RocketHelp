import { Center, Spinner,useTheme } from "native-base";

export function Loading(){
  const { colors } = useTheme();
  return (
    <Center flex={1} bg="gray.700">
      <Spinner color={colors.green[300]} />
    </Center>
  )
}