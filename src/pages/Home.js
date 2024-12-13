import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from '../part/Header';
import Footer from '../part/Footer';
import axios from 'axios';
import "../css/Home.css";

export default function App() {
  const [selectedTeam, setSelectedTeam] = useState("T1");
  const [players, setPlayers] = useState([]);
  const [largestIdData, setLargestIdData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [border, setBorder] = useState(null);
  const navigate = useNavigate();

  const handlePlayer = (player) => {
    navigate('/player', { state: player });
  };

  const BoardPage = () => {
    navigate('/board');
  };

  const MapPage = () => {
    navigate('/map');
  };

  const teamColors = {
    T1: "#e4002b",
    "Gen.G": "#aa8a00",
    HLE: "#ff6b01",
    DK: "#0ec7b5",
    KT: "#FF0A07",
    BNK: "#FFC900",
    KDF: "#e73312",
    NS: "#de2027",
    DRX: "#5a8dff",
    BRO: "#00492b",
  };

  const teamFlags = {
    T1: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/T1.svg",
    "Gen.G": "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/GenG.svg",
    HLE: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/HLE.svg",
    DK: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/DK.svg",
    KT: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/KT.png",
    BNK: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/BNK.svg",
    KDF: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/Freecs.svg",
    NS: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/RedForce.svg",
    DRX: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/DRX.svg",
    BRO: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/BRION.svg",
  };

  const teamHome = {
    T1: { lat: 37.51242048414541, lng: 127.04284261764563 },
    "Gen.G": { lat: 37.51247728040455, lng: 127.04148817658047 },
    HLE: { lat: 37.65787156415134, lng: 126.7791566024117 },
    DK: { lat: 37.506599693854945, lng: 126.90055721058135 },
    KT: { lat: 37.519415305451794, lng: 126.93852269991316 },
    BNK: { lat: 37.56989078075368, lng: 126.98471298700461 },
    KDF: { lat: 37.51848362659874, lng: 127.06409803361588 },
    NS: { lat: 37.48007696390073, lng: 126.89108406168661 },
    DRX: { lat: 37.550445960623506, lng: 126.9200398842147 },
    BRO: { lat: 37.543496764377664, lng: 127.05222399402673 },
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://6743d2afb7464b1c2a65f87a.mockapi.io/player"
        );
        const data = await response.json();

        const filteredPlayers = data.filter(
          (player) => player.team === selectedTeam
        );
        setPlayers(filteredPlayers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [selectedTeam]);

  useEffect(() => {
    const loadMap = () => {
      const { kakao } = window;

      const teamCoordinates = teamHome[selectedTeam];

      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(teamCoordinates.lat, teamCoordinates.lng),
        level: 2,
      };

      const map = new kakao.maps.Map(container, options);

      const markerPosition = new kakao.maps.LatLng(
        teamCoordinates.lat,
        teamCoordinates.lng
      );
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);
    };

    if (window.kakao && window.kakao.maps) {
      loadMap();
    } else {
      console.error();
    }
  }, [selectedTeam]);

  useEffect(() => {
    const fetchLargestComment = async () => {
      try {
        const response = await axios.get('https://674bbcb571933a4e8855ef5f.mockapi.io/reviews');
        const data = response.data;

        const maxIdData = data.reduce((max, item) => (parseInt(item.id) > parseInt(max.id) ? item : max), data[0]);
        setLargestIdData(maxIdData);
      } catch (error) {
        console.error(`데이터를 가져오는 중 에러가 발생했습니다: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLargestComment();
  }, []);

  // 데이터 가져오기
  useEffect(() => {
    const fetchBorder = async () => {
      try {
        const response = await axios.get('https://674734f838c8741641d5d9a2.mockapi.io/board');
        const data = response.data;

        const maxIdData = data.reduce((max, item) => (parseInt(item.id) > parseInt(max.id) ? item : max), data[0]);
        setBorder(maxIdData);
      } catch (error) {
        console.error(`보더 데이터를 가져오는 중 에러가 발생했습니다: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBorder();
  }, []);

  // 글자수 제한 함수
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="div0">
      <Header />
      <div className="container">
        <div className="section" onClick={BoardPage}>
          <h2>게시판</h2>
          {loading ? (
            <p>로딩 중...</p>
          ) : border ? (
            <>
              <div
                style={{border:'1px white solid', borderRadius:'10px'}}
              >
                <div
                  style={{margin:'10px', fontSize:'20px'}}
                >
                  {truncateText(border.title, 20)}
                </div>
                <div
                  style={{margin:'10px', fontSize:'14px', color:'rgb(177, 177, 177)'}}
                >
                  {truncateText(border.detail, 60)}
                </div>
              </div>
            </>
          ) : (
            <p>데이터를 가져올 수 없습니다.</p>
          )}
        </div>
        <div className="section">
          <h2>최근 리뷰</h2>
          {loading ? (
            <p>로딩 중...</p>
          ) : largestIdData ? (
            <>
              <h3>"{largestIdData.review}"</h3>
              <small>{largestIdData.player}/총평</small>
            </>
          ) : (
            <p>데이터를 가져올 수 없습니다.</p>
          )}
        </div>
        <div className="section">
          <div className="section_center">
            <h2>스토브리그 </h2>
            <select
              class="class"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="T1">T1</option>
              <option value="Gen.G">Gen.G</option>
              <option value="HLE">HLE</option>
              <option value="DK">DK</option>
              <option value="KT">KT</option>
              <option value="BNK">BNK</option>
              <option value="KDF">KDF</option>
              <option value="NS">NS</option>
              <option value="DRX">DRX</option>
              <option value="BRO">BRO</option>
            </select>
          </div>
          <div
            style={{
              borderBottom: `2px solid ${teamColors[selectedTeam]}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 0",
            }}
          >
            <img
              className="h-6"
              src={teamFlags[selectedTeam]}
              alt="team flag"
              style={{ height: "2em", verticalAlign: "middle" }}
            />
            <h1
              style={{
                display: "inline-block",
                marginLeft: "0.5em",
                fontSize: "1.5em",
                fontWeight: "bold",
              }}
            >
              {selectedTeam}
            </h1>
          </div>
          <div className="matches1">
            {players.map((player) => (
              <div
                key={player.id}
                className="player-card"
                onClick={() => handlePlayer(player)}
                style={{
                  backgroundImage: `url(https://score.town/img/positionBG/${player.line}.svg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  scale: "100%",
                }}
              >
                <img src={`https://st-image.s3.ap-northeast-2.amazonaws.com/Roaster/LCK/${player.img_path}`}  />
                <div>
                  <h3>{player.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="section">
          <h2 onClick={MapPage}>사옥위치</h2>
          <div
            id="map"
            style={{
              width: "100%",
              height: "400px",
              marginTop: "20px",
              border: "1px solid #ddd",
            }}
          ></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}