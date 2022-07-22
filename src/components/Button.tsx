import { Button as NativeBaseButton, IButtonProps, Heading } from "native-base";

type props = IButtonProps & {
  title: string;
  color?: string;
  onPressedColor?: string;
} 

export function Button({ title, color = "green.700", onPressedColor = "green.500", ...rest }: props){
  return (
    <NativeBaseButton 
      bg={color}
      h={14}
      fontSize={"sm"}
      rounded={"sm"}
      _pressed={{
        bg: onPressedColor
      }}
      {...rest}
    >
      <Heading color={"white"} fontSize={"sm"}>
        {title}
      </Heading>
    </NativeBaseButton>
  )
}