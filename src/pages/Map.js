import React, { useEffect, useRef, useState } from "react";
import Header from "../part/Header";
import Footer from "../part/Footer";

const { kakao } = window;

export default function Map() {
  const container = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedTeams, setSelectedTeams] = useState({});
  const markersRef = useRef({});

  const teamLocations = {
    T1: { lat: 37.51242048414541, lng: 127.04284261764563, address: "서울특별시 강남구 선릉로 627" },
    "Gen.G": { lat: 37.51247728040455, lng: 127.04148817658047, address: "서울 강남구 봉은사로49길 38" },
    DK: { lat: 37.506599693854945, lng: 126.90055721058135, address: "서울특별시 영등포구 도신로 73" },
    KT: { lat: 37.519415305451794, lng: 126.93852269991316, address: "서울 영등포구 여의도동 61-5" },
    HLE: { lat: 37.65787156415134, lng: 126.7791566024117, address: "경기 고양시 일산동구 강송로225번길 40" },
    DRX: { lat: 37.550445960623506, lng: 126.9200398842147, address: "서울 마포구 독막로7길 59" },
    BRO: { lat: 37.543496764377664, lng: 127.05222399402673, address: "서울 성동구 연무장5길 4" },
    KDF: { lat: 37.51848362659874, lng: 127.06409803361588, address: "서울특별시 강남구 영동대로118길 75" },
    BNK: { lat: 37.56989078075368, lng: 126.98471298700461, address: "서울특별시 종로구 종로 66" },
    NS: { lat: 37.48007696390073, lng: 126.89108406168661, address: "서울특별시 구로구 디지털로 226" }
  };

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (window.kakao) {
      const options = {
        center: new kakao.maps.LatLng(37.5709617749066, 126.981437983842),
        level: 9,
      };

      const kakaoMap = new kakao.maps.Map(container.current, options);
      setMap(kakaoMap);
    } else {
      console.error("카카오 지도 API가 로드되지 않았습니다.");
    }
  }, []);

  const handleCheckboxChange = (team) => {
    setSelectedTeams((prevSelected) => {
      const updatedSelection = { ...prevSelected };
      if (updatedSelection[team]) {
        delete updatedSelection[team];
      } else {
        updatedSelection[team] = true;
      }
      return updatedSelection;
    });
  };

  useEffect(() => {
    if (map) {
      Object.keys(teamLocations).forEach((team) => {
        const isSelected = selectedTeams[team];
        const { lat, lng } = teamLocations[team];
        let marker = markersRef.current[team];
        if (isSelected && !marker) {
          const markerPosition = new kakao.maps.LatLng(lat, lng);
          marker = new kakao.maps.Marker({ position: markerPosition });
          marker.setMap(map);
          markersRef.current[team] = marker;
        }
        else if (!isSelected && marker) {
          marker.setMap(null);
          delete markersRef.current[team];
        }
      });
    }
  }, [selectedTeams, map]);

  const handleSearch = () => {
    if (!map || !searchTerm) return;

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error("Kakao 지도 services 라이브러리가 로드되지 않았습니다.");
      return;
    }
    const geocoder = new kakao.maps.services.Geocoder();
    map.setLevel(2);
    geocoder.addressSearch(searchTerm, function (result, status) {
      if (status === kakao.maps.services.Status.OK && result && result.length > 0) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        map.setCenter(coords);
        const searchMarker = new kakao.maps.Marker({
          position: coords
        });
        searchMarker.setMap(map);
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };


  return (
    <>
      <Header />
      <div className="container1">
        <div className="section1">
          <h2>팀별 사옥 위치</h2>
          <ul>
            {Object.keys(teamLocations).map((team) => (
              <li key={team} style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  id={team}
                  checked={selectedTeams[team] || false}
                  onChange={() => handleCheckboxChange(team)}
                  style={{ marginRight: "10px" }}
                />
                <label htmlFor={team} style={{ marginRight: "10px" }}>
                  {team} : {teamLocations[team].address}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="section1">
          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="주소를 입력하세요."
              style={{ width: "200px", marginRight: "10px" }}
            />
            <button onClick={handleSearch}>검색</button>
          </div>
          <div
            ref={container}
            style={{
              width: "100%",
              height: "600px",
              marginTop: "20px",
              border: "1px solid #ddd",
            }}
          ></div>
        </div>
      </div>
      <Footer />
    </>
  );
}
