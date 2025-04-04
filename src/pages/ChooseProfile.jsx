export default function ChooseProfile() {
  const animals = [
    { id: 1, name: '이름', image: '/images/dog.jpg' },
    { id: 2, name: '이름', image: '/images/cat.jpg' },
    { id: 3, name: '이름', image: '/images/hamster.jpg' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl md:text-4xl font-bold text-brown-700 mb-8">
        관리를 해줄 동물을 선택하세요.
      </h1>
      <div className="flex gap-8">
        {animals.map(animal => (
          <div key={animal.id} className="flex flex-col items-center">
            <img
              src={animal.image}
              alt={animal.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-lg"
            />
            <span className="mt-3 px-4 py-2 bg-beige-300 text-lg rounded-lg shadow-md">
              {animal.name}
            </span>
          </div>
        ))}
      </div>
      <button className="w-[140px] mt-10 px-8 bg-plog-main5 text-white text-lg text-center rounded-lg shadow-md">
        추가하기
      </button>
    </div>
  );
}
