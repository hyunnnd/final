import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../part/Header';
import Footer from '../part/Footer';

export default function Join() {
  const [formData, setFormData] = useState({ uid: '', psword: '', name: '' });
  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function add(){
    axios.post("https://672818a4270bd0b975544ed3.mockapi.io/users", formData)
    .then((res) => {
      alert('성공적으로 저장되었습니다!');
      navigate("/");
    })
    .catch((e) => {
      console.log(`데이터를 가져오는 중 에러가 발생했습니다 : ${e}`);
    });
  }

  const check = (e) => {
    e.preventDefault();

    if(formData.name === ''){
      alert('이름을 입력해 주세요.');
      return;
    }

    if(formData.uid === ''){
      alert('아이디를 입력해 주세요.');
      return;
    }

    if(formData.uid.length < 5){
      alert('아이디는 적어도 5글자 이상으로 입력해 주세요.');
      return;
    }

    if(formData.psword === ''){
      alert('비밀번호를 입력해 주세요.');
      return;
    }

    if(formData.psword.length < 4){
      alert('비밀번호는 적어도 4글자 이상으로 입력해 주세요.');
      return;
    }

    axios.get('https://672818a4270bd0b975544ed3.mockapi.io/users')
    .then((res) => {
      let checkInt = 0;
      for(let udata of res.data){
        if(udata.uid === formData.uid){
          checkInt = 1;
          break;
        }

        if(udata.name === formData.name){
          checkInt = 2;
          break;
        }
      }

      if(checkInt === 1){
        alert('같은 아이디를 사용하는 다른 사용자가 존재합니다 다른 아이디를 입력해 주세요.');
      } else if(checkInt === 2){
        alert('같은 닉네임을 사용하는 다른 사용자가 존재합니다 다른 닉네임을 입력해 주세요.');
      } else {
        add();
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

        <h2>회원가입</h2>
        <form>
          <div className="formInPutBox">
            <label htmlFor="name">닉네임</label><br/>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={change}
              style={{ marginTop: '10px', padding: '15px', width: '96%', marginBottom: '10px', background: "rgb(0, 0, 107)", border: "none", borderRadius: "10px", color: "white", fontSize: '15px' }}
            />
          </div>
          <div className="formInPutBox">
            <label htmlFor="uid">아이디</label>
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
            <label htmlFor="psword">비밀번호</label>
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
            회원가입
          </button>
        </form>

      </div>
      <Footer />
    </div>
  );
}
