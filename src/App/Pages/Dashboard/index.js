import React, { useState, useEffect } from "react";
import "./styles.scss";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import pencil from '../../assets/icons/pencil.png'
import logout from '../../assets/icons/logout.png'
import cover from '../../assets/images/cover.png'
import hollow from '../../assets/icons/hollowLike.png'
import full from '../../assets/icons/fullLike.png'
import close from '../../assets/icons/close.png'

import { useUserAuth } from "../../context/UserAuthContext";
import { db } from "../../Firebase/firebase-config";
import { collection, doc, updateDoc, getDocs, getDoc, addDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentDocRef, setCommentDocRef] = useState();
    const postsCollectionRef = collection(db, "posts");
    const { user } = useUserAuth();
    const navigate = useNavigate();

    function navigateToLogin(){
      navigate("/");
    }

    function refreshPosts(){
      const getPosts= async () => {
        const data = await getDocs(postsCollectionRef);
        setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      };

      getPosts();
    }

    useEffect(()=>{

      refreshPosts();
      
    });

    function resetCamps(){
      document.getElementById("title").value = "";
      document.getElementById("subtitle").value = "";
      document.getElementById("description").value = "";
    }
  
    function toggleNewPost(){
      let display = document.getElementsByClassName("newPostCover")[0].style.display;
      if(display === "" || display === "none" || display=== undefined){
        document.getElementsByClassName("newPostCover")[0].style.display = "flex";
      }else{
        document.getElementsByClassName("newPostCover")[0].style.display = "none"
      }
    }
  
    function handleNewPost(){

      const title = document.getElementById("title").value;
      const subtitle = document.getElementById("subtitle").value;
      const description = document.getElementById("description").value;
      const author = user.email;

      if(title!=="" && subtitle!=="" && description!=="" && author !==""){
      const submit = async()=>{
        await addDoc(collection(db, "posts"),{
          title: title,
          subtitle: subtitle,
          description: description,
          author: user.email,
        });
      }
      submit();

      toast.success('Post enviado com sucesso!', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        refreshPosts();
        resetCamps();
        toggleNewPost();
      }else{
        toast.error('Há campos vazios!', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
    }

    const handleVote = async (id) => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          let docData = docSnap.data();
          const hasVoted = docData.votes?.some(vote => vote.user === user.email);
    
          if (hasVoted) {
            await updateDoc(docRef, {
              votes: arrayRemove({ user: user.email }),
            });
          } else {
            await updateDoc(docRef, {
              votes: arrayUnion({ user: user.email }),
            });
          }
          refreshPosts(); 
        } else {
          console.log("O post não existe.");
        }
      } catch (error) {
        console.error("erro:", error);
      }
    };

    const toggleComments = async (id) => {
      try {
        const docRef = doc(db, "posts", id);
        setCommentDocRef(docRef);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let docData = docSnap.data();
          let comments = docData.comments;
          console.log(comments);
          let display = document.getElementsByClassName("commentsCover")[0].style.display;
          if(display === "" || display === "none" || display=== undefined){
            setComments(comments);
            document.getElementsByClassName("commentsCover")[0].style.display = "flex";
          }else{
          }
        } else {
          console.log("O post não existe.");
          setCommentDocRef([]);
        }
      } catch(e){
        setComments([]);
        document.getElementsByClassName("commentsCover")[0].style.display = "none";
        setCommentDocRef([]);
      }    
    }

    const handleComment = async () => {
      try {
        const docSnap = await getDoc(commentDocRef);
        if (docSnap.exists()) {
          let comment = document.getElementById("comment").value;
          await updateDoc(commentDocRef, {
            comments: arrayUnion({ autor: user.email, content: comment }),
          });
          toggleComments();
          document.getElementById("comment").value ="";
          toast.success('Comentário enviado!', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }); 
        } else {
          console.log("O post não existe.");
          setCommentDocRef([]);
        }
      } catch(error){
        console.error("erro:", error);
      }    
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
      <div className="dashboardContainer">
        <header>
            <img draggable="false" src={cover} alt="logo"/>
            <img draggable="false" src={logout} alt="logout" onClick={navigateToLogin}/>
        </header>
        <button className="newPostButton" onClick={toggleNewPost}><img draggable="false" src={pencil} alt="editar" /></button>
        <div className="postContainer">
          {posts.map((post)=>{
            return(<>
              <div>
                <h1>{post.title}</h1>
                <h2>{post.subtitle}</h2>
                <p>{post.description}</p>
                <h3>Autor(a): {post.author}</h3>
                <div>
                  <div className="votesContainer">
                  {
                    post.votes && post.votes.some(vote => vote.user === user.email) ? (
                      <img 
                        onClick={() => { handleVote(post.id); }} 
                        draggable="false" 
                        src={full} 
                        alt="Votou" 
                      />
                    ) : (
                      <img 
                        onClick={() => { handleVote(post.id); }} 
                        draggable="false" 
                        src={hollow} 
                        alt="Votar" 
                      />
                    )
                  }
                  <h5>{post.votes ? post.votes.length : 0}</h5>
                  </div>
                <h4 onClick={()=>{toggleComments(post.id)}}>Ver comentários</h4>
                </div>
                <hr/>
              </div>
            </>)
          })}
        </div>
      </div>
      <div className="newPostCover">
        <div className="newPostContainer">
          <label htmlFor="title">Título</label>
          <input type="text" id="title" />
          <label htmlFor="subtitle">Subtítulo</label>
          <input type="text" id="subtitle" />
          <label htmlFor="description">Descrição</label>
          <input type="text" id="description" />
          <div>
            <button onClick={toggleNewPost}>Cancelar</button>
            <button onClick={handleNewPost}>Enviar</button>
          </div>
        </div>
      </div>
      <div className="commentsCover">
        <div className="commentsContainer">
          <img onClick={toggleComments} draggable="false" src={close} alt="Fechar" />
          <div className="commentsOverflow">
            {
              comments && comments.map((comment)=>{
                return(<>
                  <div>
                    <h3>{comment.autor}</h3>
                    <p>{comment.content}</p>
                  </div>
                </>)
              })
            }
          </div>
          <form onSubmit={(e) => {e.preventDefault();handleComment();}}>
            <label htmlFor="comment">Compartilhe sua opinião!</label>
            <input type="text" id="comment" />
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
      </>
    )
  }
  
  export default Dashboard;