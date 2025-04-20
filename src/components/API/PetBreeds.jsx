import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../style/breedsInfo.scss'; // CSS 파일 경로를 확인하세요

const PetBreeds = () => {
  const [dogBreeds, setDogBreeds] = useState([]);
  const [loadingDogs, setLoadingDogs] = useState(true);
  const [errorDogs, setErrorDogs] = useState(null);

  const [catBreeds, setCatBreeds] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [errorCats, setErrorCats] = useState(null);

  // 개 품종 API 호출 (The Dog API)
  useEffect(() => {
    axios
      .get('https://api.thedogapi.com/v1/breeds')
      .then(response => {
        // 응답 데이터는 배열이며, 각 객체의 name 속성을 사용합니다.
        const breeds = response.data.map(breed => breed.name);
        setDogBreeds(breeds);
        setLoadingDogs(false);
      })
      .catch(err => {
        console.error('개 품종 API 호출 중 에러 발생:', err);
        setErrorDogs(err);
        setLoadingDogs(false);
      });
  }, []);

  // 고양이 품종 API 호출 (The Cat API)
  useEffect(() => {
    axios
      .get('https://api.thecatapi.com/v1/breeds')
      .then(response => {
        // 응답 데이터는 각 품종에 대한 객체 배열이며, name 속성을 사용합니다.
        const breeds = response.data.map(breed => breed.name);
        setCatBreeds(breeds);
        setLoadingCats(false);
      })
      .catch(err => {
        console.error('고양이 품종 API 호출 중 에러 발생:', err);
        setErrorCats(err);
        setLoadingCats(false);
      });
  }, []);

  return (
    <div className="breeds-info container mx-auto p-4">
      <h1 className="text-3xl font-bold text-plog-main4 mb-8 text-center">
        반려동물 품종 정보
      </h1>
      <div className="breeds-container flex justify-between gap-8">
        <section className="dog-section p-4 bg-plog-main2 rounded shadow-md flex-1">
          <h2 className="text-2xl font-semibold text-plog-main5 mb-4">
            개 품종 리스트
          </h2>
          {loadingDogs ? (
            <p>개 품종 정보 로딩 중...</p>
          ) : errorDogs ? (
            <p>개 품종 정보를 불러오는 중 오류 발생: {errorDogs.message}</p>
          ) : (
            <div className="scroll-container">
              <ul>
                {dogBreeds.map((breed, index) => (
                  <li key={index} className="breed-item">
                    {breed}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="cat-section p-4 bg-plog-main2 rounded shadow-md flex-1">
          <h2 className="text-2xl font-semibold text-plog-main5 mb-4">
            고양이 품종 리스트
          </h2>
          {loadingCats ? (
            <p>고양이 품종 정보 로딩 중...</p>
          ) : errorCats ? (
            <p>고양이 품종 정보를 불러오는 중 오류 발생: {errorCats.message}</p>
          ) : (
            <div className="scroll-container">
              <ul>
                {catBreeds.map((breed, index) => (
                  <li key={index} className="breed-item">
                    {breed}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PetBreeds;
