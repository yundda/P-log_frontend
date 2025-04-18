import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';

const API_KEY = decodeURIComponent(process.env.REACT_APP_TRAVEL_API_KEY);

export default function PetTour() {
  const [items, setItems] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [areaCodes, setAreaCodes] = useState([]);
  const [categoryCodes, setCategoryCodes] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const observer = useRef();

  const lastItemRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNo(prev => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const areaRes = await axios.get(
          'https://apis.data.go.kr/B551011/KorPetTourService/areaCode',
          {
            params: {
              serviceKey: API_KEY,
              MobileOS: 'WIN',
              MobileApp: 'Plog',
              _type: 'json',
            },
          },
        );

        const categoryRes = await axios.get(
          'https://apis.data.go.kr/B551011/KorPetTourService/categoryCode',
          {
            params: {
              serviceKey: API_KEY,
              MobileOS: 'WIN',
              MobileApp: 'Plog',
              _type: 'json',
            },
          },
        );

        const areaItems = areaRes.data?.response?.body?.items?.item || [];
        const categoryItems =
          categoryRes.data?.response?.body?.items?.item || [];

        const areas = Array.isArray(areaItems) ? areaItems : [areaItems];
        const categories = Array.isArray(categoryItems)
          ? categoryItems
          : [categoryItems];

        setAreaCodes(areas);
        setCategoryCodes(categories);
      } catch (err) {
        console.error('지역/카테고리 코드 불러오기 실패:', err);
      }
    };

    fetchCodes();
  }, []);

  const fetchData = async page => {
    setLoading(true);
    try {
      const res = await axios.get(
        'https://apis.data.go.kr/B551011/KorPetTourService/petTourSyncList',
        {
          params: {
            serviceKey: API_KEY,
            MobileOS: 'WIN',
            MobileApp: 'Plog',
            numOfRows: 10,
            pageNo: page,
            _type: 'json',
            areaCode: selectedArea || undefined,
            cat1: selectedCategory || undefined,
          },
        },
      );

      let newItems = res.data?.response?.body?.items?.item || [];
      if (!Array.isArray(newItems)) newItems = [newItems];

      const enriched = await Promise.all(
        newItems.map(async item => {
          const imageRes = await axios.get(
            'https://apis.data.go.kr/B551011/KorPetTourService/detailImage',
            {
              params: {
                serviceKey: API_KEY,
                contentId: item.contentid,
                imageYN: 'Y',
                MobileOS: 'WIN',
                MobileApp: 'Plog',
                _type: 'json',
              },
            },
          );

          const imageList = imageRes.data?.response?.body?.items?.item || [];
          const image =
            Array.isArray(imageList) && imageList.length > 0
              ? imageList[0].originimgurl
              : typeof imageList === 'object'
              ? imageList.originimgurl
              : null;

          return { ...item, image };
        }),
      );

      setItems(prev => [...prev, ...enriched]);

      if (newItems.length < 10) setHasMore(false);
    } catch (err) {
      console.error('데이터 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageNo);
  }, [pageNo]);

  const handleFilterChange = () => {
    setItems([]);
    setPageNo(1);
    setHasMore(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🐶 반려동물 동반여행지</h2>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <select
          value={selectedArea}
          onChange={e => {
            setSelectedArea(e.target.value);
            handleFilterChange();
          }}
          className="border rounded p-2"
        >
          <option value="">전체 지역</option>
          {areaCodes.map(area => (
            <option key={`${area.code}-${area.name}`} value={area.code}>
              {area.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={e => {
            setSelectedCategory(e.target.value);
            handleFilterChange();
          }}
          className="border rounded p-2"
        >
          <option value="">전체 카테고리</option>
          {categoryCodes.map(cat => (
            <option key={`${cat.cat1}-${cat.name}`} value={cat.cat1}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            ref={index === items.length - 1 ? lastItemRef : null}
            key={item.contentid}
            className="bg-white border rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="rounded-md w-full h-48 object-cover mb-3"
              />
            )}
            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{item.addr1}</p>
          </div>
        ))}
      </div>

      {loading && (
        <p className="text-center mt-4 text-gray-500">불러오는 중...</p>
      )}
      {!hasMore && (
        <p className="text-center mt-4 text-gray-400">
          모든 여행지를 불러왔어요 🎉
        </p>
      )}
    </div>
  );
}
