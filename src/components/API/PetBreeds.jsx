import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../style/petBreeds.scss';
import { dogBreedTranslations, catBreedTranslations } from '../../assets/breed';

// 환경변수에서 API 키 불러오기
const DOG_API_KEY = process.env.REACT_APP_DOG_API_KEY;
const CAT_API_KEY = process.env.REACT_APP_CAT_API_KEY;

export default function PetBreeds() {
  const [dogBreeds, setDogBreeds] = useState([]);
  const [catBreeds, setCatBreeds] = useState([]);
  const [loadingDogs, setLoadingDogs] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [errorDogs, setErrorDogs] = useState(null);
  const [errorCats, setErrorCats] = useState(null);

  // 개 & 고양이 데이터 로드
  useEffect(() => {
    axios
      .get('https://api.thedogapi.com/v1/breeds', {
        headers: {
          // 'x-api-key':
          //   'live_hYgY4LpiCviEBGC3iASSnhyTXulHPTHCaadaPNxQVcIkjrP3l7TQzwZhc4pMZJag',
          'x-api-key': DOG_API_KEY,
        },
      })
      .then(res => {
        const translated = res.data.map(b => ({
          name: dogBreedTranslations[b.name] || b.name,
          image: b.image?.url || '',
        }));
        setDogBreeds(translated);
        setLoadingDogs(false);
      })
      .catch(err => {
        setErrorDogs(err);
        setLoadingDogs(false);
      });

    axios
      .get('https://api.thecatapi.com/v1/breeds', {
        headers: {
          'x-api-key': CAT_API_KEY,
        },
      })
      .then(res => {
        const translated = res.data.map(b => ({
          name: catBreedTranslations[b.name] || b.name,
          image: b.image?.url || '',
        }));
        setCatBreeds(translated);
        setLoadingCats(false);
      })
      .catch(err => {
        setErrorCats(err);
        setLoadingCats(false);
      });
  }, []);

  return (
    <>
      <h2 className="text-center text-xl font-bold mb-6">
        나의 반려동물의 품종을 알아볼까요?
      </h2>
      <div className="pet-breeds-wrapper flex flex-row flex-wrap gap-2 md:flex-col">
        {/* 🐶 개 품종 */}
        <div className="breed-card w-1/2">
          <h3 className="text-xl font-bold text-plog-main5 mb-3">개 품종</h3>
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
            <div className="breed-list grid grid-cols-2 gap-2">
              {dogBreeds.map((breed, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {breed.image && (
                    <img
                      src={breed.image}
                      alt={breed.name}
                      className="w-24 h-24 object-cover rounded-full mb-2 border"
                    />
                  )}
                  <span className="text-sm font-medium">{breed.name}</span>{' '}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🐱 고양이 품종 */}
        <div className="breed-card w-1/2">
          <h3 className="text-xl font-bold text-plog-main5 mb-3">
            고양이 품종
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
            <div className="breed-list grid grid-cols-2 gap-2">
              {catBreeds.map((breed, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {breed.image && (
                    <img
                      src={breed.image}
                      alt={breed.name}
                      className="w-24 h-24 object-cover rounded-full mb-2 border"
                    />
                  )}
                  <span className="text-sm font-medium">{breed.name}</span>{' '}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
