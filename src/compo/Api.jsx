import React, { useState } from "react";
import axios from "axios";

const REST_API_KEY = "ed6263513cc070ebd936456811904568";

const Api = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [size, setSize] = useState("50");
  const [size1, setSize1] = useState("1");
  const [prompt, setPrompt] = useState("");
  const [negative, setNegative] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태를 관리하는 상태 변수

  const generateImage = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      setIsLoading(true); // 로딩 상태를 true로 설정

      const response = await axios.post(
        "https://api.kakaobrain.com/v2/inference/karlo/t2i",
        {
          prompt: prompt,
          negative_prompt: negative,
          image_format: "png",
          upscale: true,
          samples: size1,
        },
        {
          headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // The image data is a direct URL to the image
      const imageUrl = response.data.images.map((image) => image.image);

      // Set the image URL state
      setImageUrls(imageUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // 로딩 상태를 false로 설정
    }
  };

  return (
    <div>
      <div className="imgs">
        {isLoading ? ( // 로딩 상태에 따라 로딩 이미지 또는 생성된 이미지를 표시
          <div className="loading">
            <img src="resource.gif" alt="Loading" />
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
      <form onSubmit={generateImage} className="form">
        <div className="prompt">
          <textarea
            id="prom"
            className="in-1"
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            placeholder="프롬프트를 입력해주세요."
            cols="30"
            rows="10"
            required
          ></textarea>
          <textarea
            id="native"
            className="in-1"
            onChange={(e) => {
              setNegative(e.target.value);
            }}
            placeholder="네거프롬프트를 입력해주세요."
            cols="30"
            rows="10"
            required
          ></textarea>
        </div>

        <div className="scale">
          <input
            type="range"
            min="1"
            max="100"
            className="img2"
            onChange={(e) => {
              setSize(e.target.value);
            }}
          />
          <p>{size}</p>
          <input
            type="range"
            min={1}
            max={4}
            defaultValue={1}
            onChange={(e) => {
              setSize1(e.target.value);
            }}
          />
          <p>{size1}</p>
          <div className="btn1">
            <button type="submit" className="submit">
              Generate Image
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Api;
