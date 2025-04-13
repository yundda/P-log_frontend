import BreedsInfo from '../components/API/PetBreeds';
import Weather from '../components/API/Weather';
import '../style/index.scss';

export default function Home() {
  return (
    <div className="home-container">
      <div className="weather-wrapper">
        <Weather />
      </div>
      <div className="breeds-wrapper">
        <BreedsInfo />
      </div>
    </div>
  );
}
