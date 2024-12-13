import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { authData, logout } = useContext(AuthContext);

  const LoginPage = () => {
    navigate('/login');
  };

  const JoinPage = () => {
    navigate('/join');
  };

  const handleHome = () => {
    navigate('/');
};

  return (
    <>
      <div className="header">
        <div onClick={handleHome}>
          <svg xmlns="http://www.w3.org/2000/svg" width="60px" viewBox="0 0 205.05208 145.52083">
            <defs>
              <clipPath id="a">
                <path fill="#fff" d="M.05 0h185.7v132H.05z"/>
              </clipPath>
            </defs>
            <g style={{opacity: 1, fill: '#4561ff', fillOpacity: 1}}>
              <g clipPath="url(#a)" style={{fill: '#4561ff', fillOpacity: 1}} transform="matrix(1.10158 0 0 1.10278 .188 -.024)">
                <path d="m111.665 82.891-.58.434-18.183-13.442-8.687-6.419L.297 1.44l.516-.381L78.793 19.5l14.109 27.207 8.687 16.756Z" style={{fill: '#4561ff', fillOpacity: 1}}/>
                <path d="m185.505 1.44-83.918 62.024-8.687 6.42-18.184 13.44-.58-.433 10.077-19.427L92.9 46.708l14.109-27.207 77.979-18.442ZM111.192 107.393v-8.245H74.375V130.942h36.817v-8.245H82.494v-15.304zM70.317 122.697H41.619V99.148H33.5V130.942h36.817zM153.98 99.186h-8.933l-5.299 11.737h-16.375V99.148h-8.123v31.794h8.123v-11.775h16.375l5.299 11.737h8.933l-7.161-15.859z" style={{fill: '#4561ff', fillOpacity: 1}}/>
              </g>
            </g>
          </svg>
        </div>
        <h1 onClick={handleHome}><small style={{fontSize: '1em', color: '#4561ff'}}>LCK</small>TOWN</h1>
        {
          authData ? (
            <>
              <button>{authData.name}님</button>
              <button onClick={logout}>로그아웃</button>
            </>
          ) : (
            <>
              <button onClick={JoinPage}>회원가입</button>
              <button onClick={LoginPage}>로그인</button>
            </>
          )
        }
      </div>
    </>
  )
}
