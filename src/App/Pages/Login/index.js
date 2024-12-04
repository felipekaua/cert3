import React, { useState } from "react";
import "./styles.scss";
import { useNavigate } from "react-router";
import 
{ 
  getAuth, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  setPersistence, browserSessionPersistence
} from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import cover from '../../assets/images/cover.png'

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();

    function navigateToDashboard(){
      navigate("/dashboard");
    }
    
    function Register(event){
      event.preventDefault();
      setPersistence(auth, browserSessionPersistence);
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        toast.success('Conta criada com sucesso!', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        setLogin(true) 
      })
      .catch(()=>{
        toast.error('Erro ao Cadastrar! Verifique se os dados foram preenchidos corretamente', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      });
    }

    function Login(event){
      event.preventDefault();
      setPersistence(auth, browserSessionPersistence).then(()=>{
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        navigateToDashboard();
      })
      .catch(()=>{
        toast.error('Certifique-se que seu email e senha estão corretos!', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      });
    }

    return(
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
        theme="light"/>
        <div className="pageContainer">
          <div className="accountContainer">
            {!login && <>
            <h1>Cadastre-se</h1>
            <div className="inputContainer">
              <label htmlFor="email">Email</label>
              <input id="email" placeholder="Insira seu e-mail..." type="text" onChange={(e)=>{setEmail(e.target.value)}} />
              <label htmlFor="password">Senha</label>
              <h5>mínimo de 6 caracteres</h5>
              <input id="password" placeholder="Insira sua senha..." type="text" onChange={(e)=>{setPassword(e.target.value)}} />
            </div>
            <button onClick={Register}>Cadastrar</button>
            <div>
              <h3>Ou</h3>
              <h3>Já Possui uma conta? <a href="/" onClick={(e)=>{e.preventDefault();setLogin(true)}}>Login</a></h3>
            </div>
            </>}
            {login && <>
            <h1>Bem vindo(a) de volta!</h1>
            <div className="inputContainer">
              <label htmlFor="email">Email</label>
              <input placeholder="Insira seu e-mail..." id="email" type="text" onChange={(e)=>{setEmail(e.target.value)}} />
              <label htmlFor="password">Senha</label>
              <input placeholder="Insira sua senha..." id="password" type="password" onChange={(e)=>{setPassword(e.target.value)}} />
            </div>
            <button onClick={Login}>Login</button>
            <div>
              <h3>Ou</h3>
              <h3>Não Possui uma conta? <a href="/" onClick={(e)=>{e.preventDefault();setLogin(false)}}>Cadastre-se</a></h3>
            </div>
            </>}
          </div>
          <img src={cover} alt="logo" draggable="false"/>
        </div>
      </>
    )
  }
  
  export default Login;