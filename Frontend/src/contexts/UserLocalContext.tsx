import { ReactNode, createContext, useEffect, useState } from "react";

export interface UserLocalData {
  createdDate: string;
  email: string;
  id: string;
  lastName: string;
  name: string;
  nickname: string;
  phone: string;
  profilePhoto: string;
  roleLevel: string;
  token: string;
  logged: boolean;
}
interface UserContext {
  userLocal: UserLocalData;
  updateLocal: (type: string, data: UserLocalData) => void;
  verifyLocal: () => boolean;
}
const UserLocalContext = createContext({} as UserContext);

interface UserLocalProviderProps {
  children: ReactNode;
}

export function UserContextProvider({ children }: UserLocalProviderProps) {
  const [userLocal, setUserLocal] = useState<UserLocalData>({
    createdDate: "",
    email: "",
    id: "",
    name: "",
    lastName: "",
    nickname: "",
    phone: "",
    profilePhoto: "",
    roleLevel: "",
    token: "",
    logged: false,
  });

  useEffect(() => {
    if (typeof window !== undefined) {
      const userStorage = JSON.parse(localStorage.getItem("user") || "null");
      if (userStorage) {
        const userData: UserLocalData = {
          createdDate: userStorage.createdDate,
          email: userStorage.email,
          id: userStorage.id,
          lastName: userStorage.lastName,
          name: userStorage.name,
          nickname: userStorage.nickname,
          phone: userStorage.phone,
          profilePhoto: userStorage.profilePhoto,
          roleLevel: userStorage.roleLevel,
          token: userStorage.token,
          logged: true,
        };
        updateLocal("login", userData);
      }
    }
  }, []);

  function updateLocal(type: string, data: UserLocalData) {
    if (type === "login" || type === "update") {
      localStorage.setItem("user", JSON.stringify(data));
      setUserLocal(data);
    } else if (type === "disconnect") {
      localStorage.removeItem("user");
      setUserLocal(data);
    }
  }
  function verifyLocal() {
    if (userLocal.logged) {
      return true;
    } else {
      return false;
    }
  }
  return (
    <UserLocalContext.Provider value={{ userLocal, updateLocal, verifyLocal }}>
      {children}
    </UserLocalContext.Provider>
  );
}
export default UserLocalContext;
