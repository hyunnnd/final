import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../part/Header';
import Footer from '../part/Footer';
import "../css/Login.css";

export default function Login() {
  const [formData, setFormData] = useState({ uid: '', psword: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const check = (e) => {
    e.preventDefault();

    if(formData.uid === ''){
      alert('아이디를 입력해 주세요.');
      return;
    }

    if(formData.psword === ''){
      alert('비밀번호를 입력해 주세요.');
      return;
    }

    axios.get('https://672818a4270bd0b975544ed3.mockapi.io/users')
    .then((res) => {
      console.log(res.data);
      let checkInt = 0;
      for(let udata of res.data){
        if(udata.uid === formData.uid){
          if(udata.psword === formData.psword){
            login(udata);
            checkInt = 1;
            break;
          } else {
            checkInt = 2;
            break;
          }
        }
      }
      if(checkInt === 1){
        navigate('/');
      } else if(checkInt === 0) {
        alert('존재하지 않는 아이디 입니다.');
      } else {
        alert('틀린 비밀번호 입니다.');
      }
    })
    .catch((e) => {
      console.log(`데이터를 가져오는 중 에러가 발생했습니다 : ${e}`);
    });
  };

  return (
    <div>
      <Header />
      <div className='divLogin'>

        <h2>로그인</h2>
        <form>
          <div className="formInPutBox">
            <label htmlFor="uid">아이디</label><br/>
            <input
              type="text"
              name="uid"
              id="uid"
              value={formData.uid}
              onChange={change}
              style={{ marginTop: '10px', padding: '15px', width: '96%', marginBottom: '10px', background: "rgb(0, 0, 107)", border: "none", borderRadius: "10px", color: "white", fontSize: '15px' }}
            />
          </div>
          <div className="formInPutBox">
            <label htmlFor="psword">비밀번호</label><br/>
            <input
              type="password"
              name="psword"
              id="psword"
              value={formData.psword}
              onChange={change}
              style={{ marginTop: '10px', padding: '15px', width: '96%', marginBottom: '10px', background: "rgb(0, 0, 107)", border: "none", borderRadius: "10px", color: "white", fontSize: '15px' }}
            />
          </div>

          <button 
            onClick={check}
            style={{ padding: '7px 12px', backgroundColor: 'rgb(0, 0, 177)', color: 'white', border: 'none', borderRadius: '5px' }}
          >
          로그인
          </button>
        </form>

      </div>
      <Footer />
    </div>
  );
}
