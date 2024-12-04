import { Routes, Route} from "react-router-dom";
import Login from './App/Pages/Login';
import Dashboard from './App/Pages/Dashboard';
import { UserAuthContextProvider } from './App/context/UserAuthContext.js';
import ProtectedRoute from './App/context/ProtectedRoute.js';

export default function Router(){

  return (
    <UserAuthContextProvider>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      </Routes>
    </UserAuthContextProvider>
  );
};
