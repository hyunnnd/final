import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../part/Header';
import Footer from '../part/Footer';
import { AuthContext } from '../AuthContext';
import "../css/BoardDetail.css";

export default function BoardDetail() {
  const location = useLocation();
  const [border, setBorder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const bId = location.state;

  useEffect(() => {
    if (!bId) {
      alert('게시판 목록에서만 접근 가능합니다.');
      navigate('/board');
    }
  });

  useEffect(() => {
    const fetchBorder = async () => {
      try {
        const response = await axios.get(`https://674734f838c8741641d5d9a2.mockapi.io/board/${bId}`);
        setBorder(response.data);
      } catch (error) {
        console.error(`데이터를 가져오는 중 에러가 발생했습니다: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBorder();
  }, [bId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://674734f838c8741641d5d9a2.mockapi.io/comment_board?boardId=${bId}`);
        setComments(response.data);
      } catch (error) {
        console.error(`데이터를 가져오는 중 에러가 발생했습니다: ${error}`);
      }
    };

    fetchComments();
  }, [bId]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (!authData) {
      alert('로그인 후 댓글을 작성할 수 있습니다.');
      return;
    }

    if (comment.trim()) {
      const newComment = {
        userName: authData.name,
        make_uid: authData.uid,
        boardId: bId,
        detail: comment,
        createdAt: new Date().toISOString()
      };

      axios.post('https://674734f838c8741641d5d9a2.mockapi.io/comment_board', newComment)
        .then((res) => {
          setComments([res.data, ...comments]);
          setComment('');
        })
        .catch((err) => console.error('댓글 저장 실패:', err));
    } else {
      alert('댓글 내용을 입력해주세요.');
    }
  };

  const handleCommentDelete = (commentId) => {
    const comment = comments.find((c) => c.id === commentId);

    if (comment.userName !== authData.name) {
      alert('본인의 댓글만 삭제할 수 있습니다.');
      return;
    }

    axios.delete(`https://674734f838c8741641d5d9a2.mockapi.io/comment_board/${commentId}`)
      .then(() => {
        setComments(comments.filter((c) => c.id !== commentId));
      })
      .catch((err) => console.error('댓글 삭제 실패:', err));
  };

  const handleBoardDelete = async () => {
    if (border.make_uid !== authData.uid) {
      alert('본인의 게시글만 삭제할 수 있습니다.');
      return;
    }
  
    try {
      await axios.delete(`https://674734f838c8741641d5d9a2.mockapi.io/board/${bId}`);


      for(let comment of comments){
        axios.delete(`https://674734f838c8741641d5d9a2.mockapi.io/comment_board/${comment.id}`)
      }

      navigate('/board');
    } catch (err) {
      console.error('게시글 및 댓글 삭제 실패:', err);
    }
  };

  const handleBoardEdit = async () => {
    if (border.make_uid !== authData.uid) {
      alert('본인의 게시글만 편집할 수 있습니다.');
      return;
    }
  
    try {
      navigate('/board/edit', { state: border });
    } catch (err) {
      console.error('게시글 및 댓글 삭제 실패:', err);
    }
  };
  

  return (
    <div>
      <Header />
      
      <div className='div11'>
        <div className='inner1'>
          <div className="header-row">
            <h2>게시물 상세</h2>
            {authData && border && border.make_uid === authData.uid && (
              <div className="button-group">
                <button className='make20' onClick={handleBoardEdit}>게시물 편집</button>
                <button className='make2' onClick={handleBoardDelete}>게시물 삭제</button>
              </div>
            )}
          </div>

          {isLoading ? (
            <p>로딩 중...</p>
          ) : border ? (
            <div className='divin'>
              <div className='dettitle'>{border.title}</div>
              <small className='dmakeuser'>작성자: {border.userName} {formatDate(border.createdAt)}</small>
              <div className='detdetail'>{border.detail}</div>
            </div>
          ) : (
            <p>게시글을 불러오지 못했습니다.</p>
          )}
        </div>

        <div className="inner2">
          <h2>댓글</h2>

          <textarea 
            value={comment} 
            onChange={handleComment} 
            placeholder="댓글을 작성하세요." 
            rows="4" 
            style={{ width: '100%', marginBottom: '10px', background: "rgb(10 10 66)", border: "none", borderRadius: "10px", color: "white" }} 
          />
          <button 
            onClick={handleSubmit} 
            style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            제출
          </button>

          <div style={{ marginTop: '20px' }}>
            <h3>작성된 댓글</h3>
            
            {comments.length > 0 ? (
              comments.map((item) => (
                <div key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                  <p>{item.detail}</p>
                  <small>작성자: {item.userName} {formatDate(item.createdAt)}</small>

                  {authData && item.make_uid === authData.uid && (
                    <img 
                      className='img5' 
                      onClick={() => handleCommentDelete(item.id)} 
                      src={require('../img/images.png')} 
                      alt="삭제 아이콘" 
                      style={{ cursor: 'pointer', width: '20px', height: '20px' }} 
                    />
                  )}
                </div>
              ))
            ) : (
              <p>아직 작성된 댓글이 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
