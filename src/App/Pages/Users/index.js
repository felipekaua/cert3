import React, { useState, useEffect } from "react";
import "./styles.scss";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import logout from '../../assets/icons/logout.png';
import cover from '../../assets/images/cover.png';
import { useUserAuth } from "../../context/UserAuthContext";
import { db } from "../../Firebase/firebase-config";
import { collection, doc, updateDoc, getDocs } from "firebase/firestore";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const usersCollectionRef = collection(db, "users");
  const { user } = useUserAuth();
  const navigate = useNavigate();

  function navigateToLogin() {
    navigate("/");
  }

  function navigateToDashboard() {
    navigate("/dashboard");
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const roleMapping = {
    "administrador": "admin",
    "moderador": "mod",
    "usuário": "user"
  };

  const searchRole = Object.keys(roleMapping).find(key => key.startsWith(search.toLowerCase())) 
    ? roleMapping[Object.keys(roleMapping).find(key => key.startsWith(search.toLowerCase()))]
    : search.toLowerCase();

  const filteredUsers = users.filter(user => 
    user.id.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase()) || 
    user.role.toLowerCase().includes(searchRole)
  );

  function refreshUsers() {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }

  function setRoleForUser() {
    if (user && user.email) {
      users.forEach((userDoc) => {
        if (userDoc.email.trim() === user.email.trim()) {
          setRole(userDoc.role);
        }
      });
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { role: newRole });
    refreshUsers();
    toast.success('Permissões atualizadas com sucesso!', {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    const initialize = async () => {
      await refreshUsers();
    };
    initialize();
  }, [user]);

  useEffect(() => {
    setRoleForUser();
  }, [users, user]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" />
      <div className="usersContainer">
        <header>
          <img draggable="false" src={cover} alt="logo"/>
          <img draggable="false" src={logout} alt="logout" onClick={navigateToLogin} />
        </header>
        <div className="userWrapper">
          <a href="/dashboard">&lt;&lt; Voltar</a>
          <input type="text" placeholder="Procure um usuário" onChange={(event) => { handleSearchChange(event) }} />
          <div className="userListContainer">
            {role === "admin" ? 
              filteredUsers.map((userObject) => (
                <div key={userObject.id}>
                  <h2>{userObject.email}</h2>
                  <select 
                    name="" 
                    id="" 
                    value={userObject.role} 
                    className={userObject.email === user.email ? "disabled" : ""}
                    disabled={userObject.email === user.email}
                    onChange={(e) => handleRoleChange(userObject.id, e.target.value)}
                  >
                    <option value="admin">Administrador</option>
                    <option value="mod">Moderador</option>
                    <option value="user">Usuário</option>
                  </select>
                </div>
              ))
            : (
              <>
                <h1>Página não Autorizada</h1>
              </>
            )}
          </div> 
        </div>
      </div>
    </>
  );
};

export default Users;