import BreedsInfo from '../components/API/PetBreeds';
import PetTour from '../components/API/PetTour';
import Weather from '../components/API/Weather';
import '../style/index.scss';

export default function Home() {
  return (
    <div className="home-container">
      <div className="card weather-wrapper">
        <Weather />
      </div>
      <div className="card breeds-wrapper">
        <BreedsInfo />
      </div>
      <div className="card petTour-wrapper">
        <PetTour />
      </div>
    </div>
  );
}
