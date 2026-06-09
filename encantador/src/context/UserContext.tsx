import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type UserRole = 'admin' | 'cliente';

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  passwordStrength?: 'debil' | 'intermedia' | 'fuerte';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface RegisterResult {
  ok: boolean;
  message: string;
}

interface UserContextValue {
  users: CurrentUser[];
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => RegisterResult;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

function getStoredUser(): CurrentUser | null {
  const storedUser = localStorage.getItem('kpop-user');

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as CurrentUser;
  } catch {
    localStorage.removeItem('kpop-user');
    return null;
  }
}

function getStoredUsers(): CurrentUser[] {
  const storedUsers = localStorage.getItem('kpop-users');

  if (!storedUsers) {
    return [];
  }

  try {
    return JSON.parse(storedUsers) as CurrentUser[];
  } catch {
    localStorage.removeItem('kpop-users');
    return [];
  }
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(
    getStoredUser,
  );
  const [users, setUsers] = useState<CurrentUser[]>(getStoredUsers);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (storedUser) {
      setCurrentUserState(storedUser);

      setUsers((prevUsers) => {
        const exists = prevUsers.some((user) => user.id === storedUser.id);

        if (exists) {
          return prevUsers;
        }

        const updatedUsers = [...prevUsers, storedUser];
        localStorage.setItem('kpop-users', JSON.stringify(updatedUsers));
        return updatedUsers;
      });
    }
  }, []);

  const setCurrentUser = (user: CurrentUser | null) => {
    setCurrentUserState(user);

    if (user) {
      localStorage.setItem('kpop-user', JSON.stringify(user));

      setUsers((prevUsers) => {
        const exists = prevUsers.some((item) => item.id === user.id);

        const updatedUsers = exists
          ? prevUsers.map((item) => (item.id === user.id ? user : item))
          : [...prevUsers, user];

        localStorage.setItem('kpop-users', JSON.stringify(updatedUsers));
        return updatedUsers;
      });
    } else {
      localStorage.removeItem('kpop-user');
    }
  };

  const login = (email: string, password: string) => {
    const foundUser = users.find(
      (user) => user.email === email && password.length >= 6,
    );

    if (!foundUser) {
      return false;
    }

    setCurrentUser(foundUser);
    return true;
  };

const register = (
  name: string,
  email: string,
  _password: string,
): RegisterResult => {
    const exists = users.some((user) => user.email === email);

    if (exists) {
      return {
        ok: false,
        message: 'Ya existe un usuario con ese correo.',
      };
    }

    const newUser: CurrentUser = {
      id: Date.now(),
      name,
      email,
      role: 'cliente',
      isActive: true,
    };

    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);
    localStorage.setItem('kpop-users', JSON.stringify(updatedUsers));

    return {
      ok: true,
      message: 'Usuario registrado correctamente.',
    };
  };

  const logout = () => {
    const token = localStorage.getItem('kpop-token');

    if (token) {
      fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});
    }

    localStorage.removeItem('kpop-token');
    localStorage.removeItem('kpop-user');
    setCurrentUserState(null);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }

  return context;
}