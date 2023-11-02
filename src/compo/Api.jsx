import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Side from "./Side";
const REST_API_KEY = "ed6263513cc070ebd936456811904568";

const Api = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [size, setSize] = useState("50");
  const [size1, setSize1] = useState("1");
  const [upsacle, setupsacle] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [negative, setNegative] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태를 관리하는 상태 변수
  const settingOptionRef = useRef("none");
  const rotation = useRef("rotate(0deg)");
  const buttonRef = useRef(null);
  const imgref = useRef();

  const generateImage = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      setIsLoading(true); // 로딩 상태를 true로 설정
      buttonRef.current.disabled = true; // 버튼 비활성화
      buttonRef.current.style.background = "red"
      imgref.current.src = "gg.gif"

      const response = await axios.post(
        "https://api.kakaobrain.com/v2/inference/karlo/t2i",
        {
          prompt: prompt,
          negative_prompt: negative,
          image_format: "png",
          upscale: upsacle,
          samples: size1,
        },
        {
          headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 이미지 인덱스
      setImageUrls(response.data.images.map((image) => image.image))

      // 이미지 저장출력
      
      console.log("upscale state : ", upsacle);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // 로딩 상태를 false로 설정
      enableButton(); // 버튼 상태 업데이트
      buttonRef.current.style.background = "#0288D1"
      imgref.current.src = "Geneal.png"
    }
  };
  
  useEffect(() => {
    enableButton(); // 컴포넌트 렌더링 시에도 버튼 상태를 업데이트하기 위해 enableButton 호출
  }, [isLoading]);

  const handleButtonClick = () => {
    // 버튼 클릭 시 .Setting__opstion 요소의 숨김 상태 변경
    if (settingOptionRef.current && rotation.current) {
      const displayStyle = settingOptionRef.current.style.display;
      const transformStyle = rotation.current.style.transform;
      settingOptionRef.current.style.display =
        displayStyle === "flex" ? "none" : "flex";
        rotation.current.style.transform =
        transformStyle === "rotate(0deg)" ? "rotate(180deg)" :  "rotate(0deg)" ;
    }
  };

  const enableButton = () => {
    if (buttonRef.current) {
      buttonRef.current.disabled = isLoading;
    }
  };

  return (
    <div>
      <Side></Side>
      <div className="container">
        <form onSubmit={generateImage} className="form">
          <div>
            <div className="prompt">
              <h1>Prompt</h1>
              <textarea
                id="prom"
                className="in-1 fontstyles"
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
                placeholder="ex. A cute cat in a blue house"
                cols="30"
                rows="10"
                required
              ></textarea>
            </div>
            <div className="naprompt">
              <h1>Negative Propmt</h1>
              <textarea
                id="native"
                className="in-1 fontstyles"
                onChange={(e) => {
                  setNegative(e.target.value);
                }}
                placeholder="ex. scary, dirty"
                cols="30"
                rows="10"
                required
              ></textarea>
            </div>
          </div>
          <div className="Setting">
            <h3>Setting</h3>
            <img
              src="expand_less.png"
              alt=""
              onClick={handleButtonClick}
              ref={rotation}
              className="active__img"
            />
            <div></div>
          </div>
          <div className="Setting__opstion" ref={settingOptionRef}>
            <h5>Image</h5>
            <button type="button">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">4</button>
          </div>
          <div className="Api__Generate">
            <button type="submit" className="Generate-active" ref={buttonRef} onClick={enableButton}>
              <img src="Geneal.png" ref={imgref}/>
              Generate
            </button>
            {/* <input
            type="checkbox"
            id="upscale"
            onChange={(e) => {
              setupsacle(e.target.checked);
            }}
          /> */}
          </div>
        </form>
      </div>
      <div className="imgs">
        {isLoading ? ( // 로딩 상태에 따라 로딩 이미지 또는 생성된 이미지를 표시
          <div className="loading">
            <img
              src="funder-the-sea-octopus.gif"
              alt="Loading"
              className="lodingimg"
            />
            {/* <p>Loading...</p> */}
          </div>
        ) : (
          imageUrls &&
          imageUrls.map((imageUrl, index) => (
            <div className="img" key={index}>
              <img src={imageUrl} alt="Generated" className="img" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Api;