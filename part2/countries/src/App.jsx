import { useState, useEffect } from 'react'

const Filter = ({ newFilter, handleNewFilter }) => {
  return (
    <div>
      find countries <input value={newFilter} onChange={handleNewFilter}/>
    </div>
  )
}
const Country = ({ countries, country, show, handleShow, weather }) => {
  if (countries.length === 0) return <div>search!</div>
  if (countries.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
  if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => (
          <div key={country}>
            {country}
            <button onClick={() => {handleShow(country)}}>Show</button>
          </div>
        ))}
      </div>
    )
  }
  // return <div></div>
  if (show === true)
  return (
    <div>
      <h2>{country.name}</h2>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {country.languages.map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <div className='flag'>{country.flag}</div>
      <h3>Weather in {country.capital}</h3>
      <p>Temperature {weather.temperature} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="weather icon" />
      <p>Wind {weather.wind} m/s</p>
    </div>
  )
  return <div>none</div>
}
const App = () => {
  const [newFilter, setNewFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState({
    name: '',
    capital: [],
    area: '',
    languages: [],
    flag: ''
  })
  const [show, setShow] = useState(false)
  const [weather, setWeather] = useState({
    temperature: '',
    wind: '',
    icon: ''
  })
  
  useEffect(() => {
    if (newFilter === '') {
      setCountries([])
      return
    }
    if (newFilter !== '') {
      console.log('fetching data')
      fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => response.json())
        .then(data => {
          data = data.map(data =>
            data.name.common
          )
          // console.log(newFilter)
          data = data.filter(country => country.toLowerCase().includes(newFilter.toLowerCase()))
          // console.log(data)
          setCountries(data)
          setShow(false)
          if (data.length === 1) {
            handleShow(data[0])
          }
      })
        }}, [newFilter])


  const handleNewFilter = (event) => {
    // console.log(event.target.value)
    setNewFilter(event.target.value)
  }
  
  const handleShow = (country) => {
    console.log('showing', country)
    fetch(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
      .then(response => response.json())
      .then(data => {
        const foundCountry = data
        console.log('found country', foundCountry)
        setCountry({
          ...country,
          name: foundCountry.name.common,
          capital: foundCountry.capital,
          area: foundCountry.area,
          languages: Object.values(foundCountry.languages),
          flag: foundCountry.flag
        })
        setShow(true)
        setCountries([country])
        let lat = foundCountry.latlng[0]
        let lon = foundCountry.latlng[1]
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_SOME_KEY}&units=metric`)
          .then(response => response.json())
          .then(data => {
            let newWeather = {
              temperature: data.main.temp,
              wind: data.wind.speed,
              icon: data.weather[0].icon
            }
            setWeather(newWeather)
            console.log('weather', newWeather)
          })
      })
  }
  
  return (
    <div>
      <Filter newFilter={newFilter} handleNewFilter={handleNewFilter}/>
      {/* <Notification message={notification}/> */}
      <Country countries={countries} country={country} show={show} handleShow={handleShow} weather={weather}/>
    </div>
  )
}

export default App