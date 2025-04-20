import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../style/petBreeds.scss';

const PetBreeds = () => {
  const [dogBreeds, setDogBreeds] = useState([]);
  const [catBreeds, setCatBreeds] = useState([]);
  const [loadingDogs, setLoadingDogs] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [errorDogs, setErrorDogs] = useState(null);
  const [errorCats, setErrorCats] = useState(null);

  useEffect(() => {
    axios
      .get('https://api.thedogapi.com/v1/breeds')
      .then(res => {
        setDogBreeds(res.data.map(b => b.name));
        setLoadingDogs(false);
      })
      .catch(err => {
        setErrorDogs(err);
        setLoadingDogs(false);
      });

    axios
      .get('https://api.thecatapi.com/v1/breeds')
      .then(res => {
        setCatBreeds(res.data.map(b => b.name));
        setLoadingCats(false);
      })
      .catch(err => {
        setErrorCats(err);
        setLoadingCats(false);
      });
  }, []);

  return (
    <>
      <h2 className="text-center">아직 반려동물의 품종을 모르시나요?</h2>
      <div className="pet-breeds-wrapper flex flex-col gap-2">
        {/* 개 품종 */}
        <div className="breed-card">
          <h3 className="text-xl font-bold text-plog-main5 mb-2">
            🐶 개 품종 리스트
          </h3>
          {loadingDogs ? (
            <p className="text-sm text-gray-500 italic">
              🐾 냄새 맡는 중... 잠시만 기다려주세요!
            </p>
          ) : errorDogs ? (
            <p className="text-red-500">❌ 멍! 품종 정보를 못 가져왔어요...</p>
          ) : dogBreeds.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              아직 어떤 품종인지 모르는 멍멍이에요 🐶
            </p>
          ) : (
            <ul className="breed-list">
              {dogBreeds.map((breed, i) => (
                <li key={i}>{breed}</li>
              ))}
            </ul>
          )}
        </div>

        {/* 고양이 품종 */}
        <div className="breed-card">
          <h3 className="text-xl font-bold text-plog-main5 mb-2">
            🐱 고양이 품종 리스트
          </h3>
          {loadingCats ? (
            <p className="text-sm text-gray-500 italic">
              🐾 살금살금 찾아보고 있어요...!
            </p>
          ) : errorCats ? (
            <p className="text-red-500">
              ❌ 야옹! 품종 정보를 불러오지 못했어요...
            </p>
          ) : catBreeds.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              아직 어떤 품종인지 모르는 야옹이에요 🐱
            </p>
          ) : (
            <ul className="breed-list">
              {catBreeds.map((breed, i) => (
                <li key={i}>{breed}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default PetBreeds;
