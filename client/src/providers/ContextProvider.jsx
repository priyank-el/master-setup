import React, {createContext, useState } from 'react'
    export const UserName = createContext()

export default function ContextProvider({children}) {
    const [loginUser, setLoginUser] = useState({})
    const [token,setToken] = useState(null)

  return (
    <UserName.Provider value={{loginUser,setLoginUser}} >
      {  children }
    </UserName.Provider>
  )
}