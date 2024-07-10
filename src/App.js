import { useEffect, useState } from 'react';
import axios from 'axios';
import data from './country_state_json/countries.json';

function App() {
  /* getting data from json file */
  const allCountries = Object.keys(data);
  const [inputData, setInputData] = useState({ "country": "", "city": "" });
  const [isCountrySelected, setisCountrySelected] = useState(false);
  const [weatherData, setweatherData] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country" && value !== '') setisCountrySelected(true)
    setInputData({ ...inputData, [name]: value });
  }

  const fetchWeatherData = async () => {
    try {
      if (inputData.country !== "" && inputData.city !== "") {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${inputData.city}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`)
        setweatherData(response.data);
      }
    } catch (error) {
      alert(error.response.data.message);
      setweatherData({});
    }
  }

  useEffect(() => {
    fetchWeatherData();
  }, [inputData]);
  return (
    <>
      <div className="row d-flex justify-content-center py-5">
        <div className="col-md-8 col-lg-6 col-xl-5">
          <div className="row mb-3">
            <div className="col-md-6">
              <select name="country" id="country" className="form-control" value={inputData.country} onChange={(e) => { handleChange(e) }}>
                <option value="" style={{ display: 'none' }}>Select Country</option>
                {allCountries.map((element, index) => (
                  <option value={element} key={index}>{element}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <select name="city" id="city" className="form-control" onChange={(e) => { handleChange(e) }} value={inputData.city} disabled={!isCountrySelected}>
                <option value="" style={{ display: 'none' }}>Select City</option>
                {inputData.country !== "" && data[inputData.country].map((element, index) => (
                  <option value={element} key={index}>{element}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="card text-body" style={{ "borderRadius": "35px" }}>
            <div className="card-body p-4">

              <div className="d-flex">
                <h6 className="flex-grow-1">{weatherData.name || "--"}</h6>
                <h6>{weatherData.sys ? weatherData.sys.country : "--"}</h6>
              </div>

              <div className="d-flex flex-column text-center mt-5 mb-4">
                <h6 className="display-4 mb-0 font-weight-bold"> {weatherData.main ? weatherData.main.temp : "--"}°C </h6>
                <span className="small" style={{ "color": "#868B94" }}>{weatherData.weather ? weatherData.weather[0].main : "--"}</span>
              </div>

              <div className="d-flex align-items-center">
                <div className="flex-grow-1" style={{ "fontSize": "1rem" }}>
                  <div><i className="fas fa-wind fa-fw" style={{ "color": "#868B94" }}></i> <span className="ms-1"> {weatherData.weather ? weatherData.wind.speed : "--"} km/h
                  </span>
                  </div>
                  <div><i className="fas fa-tint fa-fw" style={{ "color": "#868B94" }}></i> <span className="ms-1"> {weatherData.main ? weatherData.main.humidity : "--"}%
                  </span></div>
                </div>
                <div>
                  {weatherData.weather && (
                    <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                      width="100px" alt='' />
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;
