import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import Header from '../part/Header';
import Footer from '../part/Footer';
import "../css/Board.css";

export default function Board() {
  const [borders, setBorders] = useState([]);
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  const goWright = () => {
    navigate('/board/write');
  };

  const goDetail = (bId) => {
    navigate('/board/detail', { state: bId });
  };

  // 데이터 가져오기
  useEffect(() => {
    const fetchBorders = async () => {
      try {
        const response = await axios.get('https://674734f838c8741641d5d9a2.mockapi.io/board');
        const data = response.data;
        setBorders(data);
      } catch (error) {
        console.error(`데이터를 가져오는 중 에러가 발생했습니다: ${error}`);
      }
    };

    fetchBorders();
  }, []);

  // 글자수 제한 함수
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div>
      <Header />
      <div className='div10'>
        <h2>자유 게시판</h2>

        {
          authData ? (
            <>
              <button className='make' onClick={() => goWright()}>게시물 작성</button>
            </>
          ) : (
            <>
              <button className='make'>로그인 후 작성 가능합니다</button>
            </>
          )
        }
        
        <div className='divin'>
          {borders.map((item, index) => (
            <div className='belements' onClick={() => goDetail(item.id)} key={index}>
              <div className='dtitle'>{truncateText(item.title, 20)}</div>
              <div className='detail'>{truncateText(item.detail, 60)}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
