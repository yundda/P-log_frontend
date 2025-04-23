import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../style/petBreeds.scss';

const dogBreedTranslations = {
  Affenpinscher: '아펜핀셔',
  'Afghan Hound': '아프간 하운드',
  'African Hunting Dog': '아프리칸 헌팅 도그',
  'Airedale Terrier': '에어데일 테리어',
  'Akbash Dog': '아크바시 도그',
  Akita: '아키타',
  'Alapaha Blue Blood Bulldog': '알라파하 블루 블러드 불독',
  'Alaskan Husky': '알래스칸 허스키',
  'Alaskan Malamute': '알래스칸 말라뮤트',
  'American Bulldog': '아메리칸 불독',
  'American Bully': '아메리칸 불리',
  'American Eskimo Dog': '아메리칸 에스키모 도그',
  'American Eskimo Dog (Miniature)': '아메리칸 에스키모 도그 (소형)',
  'American Foxhound': '아메리칸 폭스하운드',
  'American Pit Bull Terrier': '아메리칸 핏불 테리어',
  'American Staffordshire Terrier': '아메리칸 스태퍼드셔 테리어',
  'American Water Spaniel': '아메리칸 워터 스패니얼',
  'Anatolian Shepherd Dog': '아나톨리안 셰퍼드 도그',
  'Appenzeller Sennenhund': '아펜첼러 세넨훈트',
  'Australian Cattle Dog': '오스트레일리안 캐틀 도그',
  'Australian Kelpie': '오스트레일리안 켈피',
  'Australian Shepherd': '오스트레일리안 셰퍼드',
  'Australian Terrier': '오스트레일리안 테리어',
  Azawakh: '아자와크',
  Barbet: '바르베',
  Basenji: '바센지',
  'Basset Bleu de Gascogne': '바셋 블루 드 가스코뉴',
  'Basset Hound': '바셋 하운드',
  Beagle: '비글',
  'Bearded Collie': '비어디드 콜리',
  Beauceron: '보세롱',
  'Bedlington Terrier': '베들링턴 테리어',
  'Belgian Malinois': '벨기에 말리노이즈',
  'Belgian Tervuren': '벨기에 터뷰런',
  'Bernese Mountain Dog': '버니즈 마운틴 도그',
  'Bichon Frise': '비숑 프리제',
  'Black and Tan Coonhound': '블랙 앤 탄 쿤하운드',
  Bloodhound: '블러드하운드',
  'Bluetick Coonhound': '블루틱 쿤하운드',
  Boerboel: '부어불',
  'Border Collie': '보더 콜리',
  'Border Terrier': '보더 테리어',
  'Boston Terrier': '보스턴 테리어',
  'Bouvier des Flandres': '부비에 데 플랑드르',
  Boxer: '복서',
  'Boykin Spaniel': '보이킨 스패니얼',
  'Bracco Italiano': '브라코 이탈리아노',
  Briard: '브리아드',
  Brittany: '브리타니',
  'Bull Terrier': '불 테리어',
  'Bull Terrier (Miniature)': '불 테리어 (소형)',
  Bullmastiff: '불마스티프',
  'Cairn Terrier': '케언 테리어',
  'Cane Corso': '카네 코르소',
  'Cardigan Welsh Corgi': '카디건 웰시 코기',
  'Catahoula Leopard Dog': '카타훌라 레오파드 도그',
  'Caucasian Shepherd (Ovcharka)': '코카시안 셰퍼드 (오프차르카)',
  'Cavalier King Charles Spaniel': '카발리에 킹 찰스 스패니얼',
  'Chesapeake Bay Retriever': '체서피크 베이 리트리버',
  'Chinese Crested': '차이니스 크레스티드',
  'Chinese Shar-Pei': '차이니스 샤페이',
  Chinook: '치누크',
  'Chow Chow': '차우차우',
  'Clumber Spaniel': '클럼버 스패니얼',
  'Cocker Spaniel': '코커 스패니얼',
  'Cocker Spaniel (American)': '코커 스패니얼 (아메리칸)',
  'Coton de Tulear': '코통 드 툴레아르',
  Dalmatian: '달마시안',
  'Doberman Pinscher': '도베르만 핀셔',
  'Dogo Argentino': '도고 아르헨티노',
  'Dutch Shepherd': '더치 셰퍼드',
  'English Setter': '잉글리시 세터',
  'English Shepherd': '잉글리시 셰퍼드',
  'English Springer Spaniel': '잉글리시 스프링어 스패니얼',
  'English Toy Spaniel': '잉글리시 토이 스패니얼',
  'English Toy Terrier': '잉글리시 토이 테리어',
  Eurasier: '유라지어',
  'Field Spaniel': '필드 스패니얼',
  'Finnish Lapphund': '핀란드 라프훈드',
  'Finnish Spitz': '핀란드 스피츠',
  'French Bulldog': '프렌치 불도그',
  'German Pinscher': '저먼 핀셔',
  'German Shepherd Dog': '저먼 셰퍼드 도그',
  'German Shorthaired Pointer': '저먼 쇼트헤어드 포인터',
  'Giant Schnauzer': '자이언트 슈나우저',
  'Glen of Imaal Terrier': '글렌 오브 이말 테리어',
  'Golden Retriever': '골든 리트리버',
  'Gordon Setter': '고든 세터',
  'Great Dane': '그레이트 데인',
  'Great Pyrenees': '그레이트 피레니즈',
  Greyhound: '그레이하운드',
  'Griffon Bruxellois': '브뤼셀 그리펀',

  Harrier: '해리어',
  Havanese: '하바나즈',
  'Irish Setter': '아이리시 세터',
  'Irish Terrier': '아이리시 테리어',
  'Irish Wolfhound': '아이리시 울프하운드',
  'Italian Greyhound': '이탈리안 그레이하운드',
  'Japanese Chin': '재패니즈 친',
  'Japanese Spitz': '재패니즈 스피츠',
  Keeshond: '키스혼드',
  Komondor: '코몬도르',
  Kooikerhondje: '쿠이커혼드예',
  Kuvasz: '쿠바즈',
  'Labrador Retriever': '래브라도 리트리버',
  'Lagotto Romagnolo': '라고토 로마뇰로',
  'Lancashire Heeler': '랭커셔 힐러',
  Leonberger: '레온베르거',
  'Lhasa Apso': '라사 압소',
  Maltese: '몰티즈',
  'Miniature American Shepherd': '미니어처 아메리칸 셰퍼드',
  'Miniature Pinscher': '미니어처 핀셔',
  'Miniature Schnauzer': '미니어처 슈나우저',
  Newfoundland: '뉴펀들랜드',
  'Norfolk Terrier': '노퍽 테리어',
  'Norwich Terrier': '노리치 테리어',
  'Nova Scotia Duck Tolling Retriever': '노바 스코샤 덕 톨링 리트리버',
  'Old English Sheepdog': '올드 잉글리시 쉽도그',
  'Olde English Bulldogge': '올드 잉글리시 불도그',
  Papillon: '파피용',
  Pekingese: '페키니즈',
  'Pembroke Welsh Corgi': '펨브록 웰시 코기',
  'Perro de Presa Canario': '페로 드 프레사 카나리오',
  'Pharaoh Hound': '파라오 하운드',
  Plott: '플롯 하운드',
  Pomeranian: '포메라니안',
  'Poodle (Miniature)': '푸들 (소형)',
  'Poodle (Toy)': '푸들 (토이)',
  Pug: '퍼그',
  Puli: '풀리',
  Pumi: '푸미',
  'Rat Terrier': '랫 테리어',
  'Redbone Coonhound': '레드본 쿤하운드',
  'Rhodesian Ridgeback': '로디지안 리지백',
  Rottweiler: '로트와일러',
  'Russian Toy': '러시안 토이',
  'Saint Bernard': '세인트 버나드',
  Saluki: '살루키',
  Samoyed: '사모예드',
  Schipperke: '스키퍼키',
  'Scottish Deerhound': '스코티시 디어하운드',
  'Scottish Terrier': '스코티시 테리어',
  'Shetland Sheepdog': '셔틀랜드 쉽도그',
  'Shiba Inu': '시바 이누',
  'Shih Tzu': '시츄',
  'Shiloh Shepherd': '실로 셰퍼드',
  'Siberian Husky': '시베리안 허스키',
  'Silky Terrier': '실키 테리어',
  'Smooth Fox Terrier': '스무스 폭스 테리어',
  'Soft Coated Wheaten Terrier': '소프트 코티드 휘튼 테리어',
  'Spanish Water Dog': '스페니시 워터 도그',
  'Spinone Italiano': '스피노네 이탈리아노',
  'Staffordshire Bull Terrier': '스태퍼드셔 불 테리어',
  'Standard Schnauzer': '스탠다드 슈나우저',
  'Swedish Vallhund': '스웨디시 발훈드',
  'Thai Ridgeback': '타이 리지백',
  'Tibetan Mastiff': '티베탄 마스티프',
  'Tibetan Spaniel': '티베탄 스패니얼',
  'Tibetan Terrier': '티베탄 테리어',
  'Toy Fox Terrier': '토이 폭스 테리어',
  'Treeing Walker Coonhound': '트리잉 워커 쿤하운드',
  Vizsla: '비즐라',
  Weimaraner: '와이머래너',
  'Welsh Springer Spaniel': '웰시 스프링어 스패니얼',
  'West Highland White Terrier': '웨스트 하이랜드 화이트 테리어',
  Whippet: '휘핏',
  'White Shepherd': '화이트 셰퍼드',
  'Wire Fox Terrier': '와이어 폭스 테리어',
  'Wirehaired Pointing Griffon': '와이어헤어드 포인팅 그리펀',
  'Wirehaired Vizsla': '와이어헤어드 비즐라',
  Xoloitzcuintli: '솔로이츠쿠인틀리',
  'Yorkshire Terrier': '요크셔 테리어',
};

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
        const translated = res.data.map(b => ({
          name: dogBreedTranslations[b.name] || [b.name],
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
      <h2 className="text-center text-2xl font-bold mb-6">
        아직 반려동물의 품종을 모르시나요?
      </h2>
      <div className="pet-breeds-wrapper flex flex-col gap-6">
        {/* 개 품종 */}
        <div className="breed-card">
          <h3 className="text-xl font-bold text-plog-main5 mb-3">
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
            <ul className="breed-list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {dogBreeds.map((breed, i) => (
                <li
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
                  <span className="text-sm font-medium">{breed.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 고양이 품종 */}
        <div className="breed-card">
          <h3 className="text-xl font-bold text-plog-main5 mb-3">
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
            <ul className="breed-list list-disc ml-5 space-y-1">
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
