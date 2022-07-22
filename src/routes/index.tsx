import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { Sigin } from "../screens/Sigin";
import { AppRoutes } from "./app.routes";
import { Loading } from "../components/Loading";

export function Routes() {
  const [ isloading, setIsLoading ] = useState<boolean>(true);
  const [ user, setUser ] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    const subscriber = auth()
    .onAuthStateChanged((res) => {
      setUser(res)
      setIsLoading(false)
    });

    return subscriber;
  }, [])

  if(isloading) {
    return <Loading/>
  }

  return (
    <NavigationContainer>
      { user ? <AppRoutes/> : <Sigin/> }
    </NavigationContainer>
  )
}