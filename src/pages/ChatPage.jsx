import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../FirebaseConfig';
import { collection, onSnapshot, addDoc, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import './ChatPage.css';

const formatHHMM = (time) => {
  return new Date(time).toTimeString().slice(0, 5);
};

const ChatPage = () => {
  const [chatLogs, setChatLogs] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [zemi, setZemi] = useState(""); // ゼミ情報を格納するためのstate
  const [grade, setGrade] = useState(""); // 学年情報を格納するためのstate

  const userName = auth.currentUser ? auth.currentUser.displayName : "";
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const { room } = useParams();
  const messagesRef = useMemo(() => collection(db, 'chatroom', room, 'messages'), [room]);
  const chatEndRef = useRef(null);

  // サインインユーザのゼミ情報と学年をFirestoreから取得する
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
                
        if (docSnap.exists()) {
          setZemi(docSnap.data().zemi);
          setGrade(docSnap.data().grade);
        } else {
          console.log("No such document!");
        }
      }
    }

    fetchUserData();
  }, [userId]);

  const addLog = (id, data) => {
    const log = { key: id, ...data };
    setChatLogs(prev => 
      [...prev, log].sort((a, b) => a.date - b.date).slice(-20)
    );
  };

  const submitMsg = async (argMsg) => {
    const message = argMsg || inputMsg;
    if (!message) return;

    await addDoc(messagesRef, {
      name: userName,
      msg: message,
      date: new Date().getTime(),
      zemi: zemi,
      grade: grade,
      userId: userId
    });

    setInputMsg('');
  };

  useEffect(() => {
    const q = query(messagesRef, orderBy('date', 'desc'), limit(20));
    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          addLog(change.doc.id, change.doc.data());
        }
      });
    });
  }, [messagesRef]);

  useEffect(() => {
    scrollToBottom();
  }, [chatLogs]);

  function scrollToBottom() {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="chatContainer">
      <div className="chatLogContainer">
        {chatLogs.map(item => (
          <div className={`balloon_${userId === item.userId ? 'r' : 'l'}`} key={item.key}>
            {userId === item.userId ? `[${formatHHMM(item.date)}]` : ''}
            <div style={{ marginLeft: '3px' }}>
              {`${item.grade}年/${item.name}`} {item.zemi && `/${item.zemi}`}
              <p className="says">{item.msg}</p>
            </div>
            {userId === item.userId ? '' : `[${formatHHMM(item.date)}]`}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form className="chatform" onSubmit={async e => {
        e.preventDefault();
        await submitMsg();
      }}>
        <div>{userName}</div>
        <input type="text" value={inputMsg} onChange={e => setInputMsg(e.target.value)} />
        <button type="submit" className="sendButton"><span className="material-icons">send</span></button>
      </form>
    </div>
  );
};

export default ChatPage;

