import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import api from '../../services/api';
import Dropzone from '../../components/Dropzone';
import './styles.css';
import logo from '../../assets/logo.svg';

interface Item {
  id: number;
  title: string;
  image: string;
};

interface IBGEStateResponse {
  sigla: string;
};

interface IBGECityResponse {
  nome: string;
};

const CollectionPoints = () => {

  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
  const [selectedState, setSelectedState] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
      setSelectedPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get<IBGEStateResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
        const states = response.data.map(state => state.sigla);
        setStates(states);
      });
  }, []);

  useEffect(() => {
    if (selectedState === '0') {
      return;
    }
    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios?orderBy=nome`)
      .then(response => {
        const cities = response.data.map(city => city.nome);
        setCities(cities);
      });
  }, [selectedState]);

  function handleSelectState(event: ChangeEvent<HTMLSelectElement>) {
    const state = event.target.value;
    setSelectedState(state);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function LocationMarker() {
    useMapEvents({
      click(event: LeafletMouseEvent) {
        setSelectedPosition([event.latlng.lat, event.latlng.lng]);
      }
    });
    return (
      <Marker position={selectedPosition}>
        <Popup>Você está aqui!</Popup>
      </Marker>
    );
  }

  function Map() {
    return (
      <MapContainer center={initialPosition} zoom={15} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    );
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const state = selectedState;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();
    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('state', state);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));
    if (selectedFile) {
      data.append('image', selectedFile);
    }

    await api.post('points', data);
    alert('Ponto de coleta cadastrado!');
    history.push('/');
  }

  return (
    <div id="page-collection-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> Ponto de Coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <header role="legend">
            <h2>Dados</h2>
          </header>

          <div className="field">
            <label htmlFor="name">Nome da Entidade</label>
            <input type="text" name="name" id="name" onChange={handleInputChange} />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" onChange={handleInputChange} />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <header role="legend">
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa.</span>
          </header>

          <Map />

          <div className="field-group">
            <div className="field">
              <label htmlFor="state">Estado</label>
              <select name="state" id="state" value={selectedState} onChange={handleSelectState}>
                <option value="0">Selecione um estado.</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                <option value="0">Selecione uma cidade.</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <header role="legend">
            <h2>Ítens de Coleta</h2>
            <span>Selecione um ou mais ítens abaixo.</span>
          </header>

          <ul className="items-grid">
            {items.map(item => (
              <li key={item.id} onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''} >
                <img src={item.image} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta.</button>
      </form>
    </div>
  );

};

export default CollectionPoints;
