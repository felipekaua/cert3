import React, { useState, useEffect } from "react";
import "./styles.scss";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import pencil from '../../assets/icons/pencil.png'
import userIcon from '../../assets/icons/user.png'
import logout from '../../assets/icons/logout.png'
import cover from '../../assets/images/cover.png'
import hollow from '../../assets/icons/hollowLike.png'
import full from '../../assets/icons/fullLike.png'
import close from '../../assets/icons/close.png'

import { useUserAuth } from "../../context/UserAuthContext";
import { db } from "../../Firebase/firebase-config";
import { collection, doc, updateDoc, getDocs, getDoc, addDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [commentDocRef, setCommentDocRef] = useState();
  const [showModal, setShowModal] = useState(false);
  const { user } = useUserAuth();
  const navigate = useNavigate();

  function navigateToLogin(){
    navigate("/");
  }
  function navigateToUsersPage(){
    navigate("/users");
  }

  function refreshPosts(){
    const getPosts= async () => {
      const data = await getDocs(collection(db, "posts"));
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }

  function refreshUsers() {
    const getUsers = async () => {
      const data = await getDocs(collection(db, "users"));
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
  
  useEffect(() => {
    const initialize = async () => {
      await refreshUsers();
      await refreshPosts();
    };
    initialize();
  }, [user]);
  
  useEffect(() => {
    setRoleForUser();
  }, [users, user]);
  
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
    const date = new Date();
    date.setHours(date.getUTCHours() + 3);

    if(title!=="" && subtitle!=="" && description!=="" && author !=="" && date !==""){
    const submit = async()=>{
      await addDoc(collection(db, "posts"),{
        title: title,
        subtitle: subtitle,
        description: description,
        author: user.email,
        date: date,
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

  const handleDelete = async (id) => {
    try {
      const postDocRef = doc(db, "posts", id);
      await deleteDoc(postDocRef);
      refreshPosts();
      toast.success('Post deletado com sucesso!', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      toast.error('Erro ao deletar post!', {
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
  };

  const handleDeleteComment = async (postId, comment) => {
    try {
      const postDocRef = doc(db, "posts", postId);
      await updateDoc(postDocRef, {
        comments: arrayRemove(comment)
      });
      refreshPosts();
      toast.success('Comentário deletado com sucesso!', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      toggleComments();
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
      toast.error('Erro ao deletar comentário!', {
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
  };

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
        setPostId(id);
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

  const handleMostVoted = async () => {
    try {
      const sortedPosts = [...posts].sort((a, b) => {
        const votesA = a.votes ? a.votes.length : 0;
        const votesB = b.votes ? b.votes.length : 0;
        if (votesA !== votesB) {
          return votesB - votesA;
        }
        return new Date(a.date.seconds * 1000) - new Date(b.date.seconds * 1000);
      });
      const mostVotedPost = sortedPosts[0];
      const deletePromises = sortedPosts.slice(1).map(post => {
        const postDocRef = doc(db, "posts", post.id);
        return deleteDoc(postDocRef);
      });
      await Promise.all(deletePromises);
      refreshPosts();
      toast.success(`"${mostVotedPost.title}" é a ideia mais votada!`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Erro ao fechar fórum:", error);
      toast.error('Erro ao fechar fórum!', {
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
  };

  const confirmMostVoted = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmAction = () => {
    handleMostVoted();
    closeModal();
  };

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
      {role === "admin" ? (<button className="endButton" onClick={confirmMostVoted}>Selecionar mais votado</button>) : null}
      {role === "admin" ? (<button className="usersPageButton" onClick={navigateToUsersPage}><img draggable="false" src={userIcon} alt="editar" /></button>) : null}
      <div className="postContainer">
        {posts
          .sort((a, b) => {
            const votesA = a.votes ? a.votes.length : 0;
            const votesB = b.votes ? b.votes.length : 0;
            if (votesA !== votesB) {
              return votesB - votesA;
            }
            const dateA = new Date(a.date.seconds * 1000);
            const dateB = new Date(b.date.seconds * 1000);
            return dateB - dateA;
          })
          .map((post) => {
            const postDate = new Date(post.date.seconds * 1000);
            postDate.setHours(postDate.getUTCHours() - 9);
            const formattedDate = postDate.toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }).replace(',', ' às');
            return (
              <>
                <div>
                  {(user.email === post.author || role === "mod" || role === "admin") && (
                    <h6 onClick={()=>{handleDelete(post.id)}}>Deletar Post</h6>
                  )}
                  <h1>{post.title}</h1>
                  <h2>{post.subtitle}</h2>
                  <p>{post.description}</p>
                  <h3>Autor(a): {post.author}</h3>
                  <div>
                    <div className="votesContainer">
                      {post.votes && post.votes.some((vote) => vote.user === user.email) ? (
                        <img
                          onClick={() => {
                            handleVote(post.id);
                          }}
                          draggable="false"
                          src={full}
                          alt="Votou"
                        />
                      ) : (
                        <img
                          onClick={() => {
                            handleVote(post.id);
                          }}
                          draggable="false"
                          src={hollow}
                          alt="Votar"
                        />
                      )}
                      <h5>{post.votes ? post.votes.length : 0}</h5>
                    </div>
                    <h5>{formattedDate}</h5> 
                    <h4 onClick={() => { toggleComments(post.id); }}>Ver comentários</h4>
                  </div>
                  <hr />
                </div>
              </>
            );
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
          {comments && comments.map((comment, index) => (
            <div key={index}>
              {(user.email === comment.autor || role === "mod" || role === "admin") && (
                <h6 onClick={() => handleDeleteComment(postId, comment)}>Deletar Comentário</h6>
              )}
              <h3>{comment.autor}</h3>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
        <form onSubmit={(e) => {e.preventDefault();handleComment();}}>
          <label htmlFor="comment">Compartilhe sua opinião!</label>
          <input type="text" id="comment" />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
    {showModal && (
      <div className="modal">
        <div className="modalContent">
          <h2>Tem certeza? Essa ação é irreversível.</h2>
          <button onClick={confirmAction}>Confirmar</button>
          <button onClick={closeModal}>Cancelar</button>
        </div>
      </div>
    )}
    </>
  )
}

export default Dashboard;