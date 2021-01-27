import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';
import './styles.css';
import logo from '../../assets/logo.svg';

interface Item {
  id: number;
  title: string;
  image: string;
};

const CollectionPoints = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  return (
    <div id="page-collection-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <form>
        <h1>Cadastro do <br /> Ponto de Coleta</h1>

        <fieldset>
          <header role="legend">
            <h2>Dados</h2>
          </header>

          <div className="field">
            <label htmlFor="name">Nome da Entidade</label>
            <input type="text" name="name" id="name" />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <header role="legend">
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa.</span>
          </header>

          <MapContainer center={[-27.2092052, -49.6401092]} zoom={15} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-27.2092052, -49.6401092]}>
              <Popup>
                Um ponto no mapa.
              </Popup>
            </Marker>
          </MapContainer>

          <div className="field-group">
            <div className="field">
              <label htmlFor="state">Estado</label>
              <select name="state" id="state">
                <option value="0">Selecione um estado.</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city">
                <option value="0">Selecione uma cidade.</option>
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
              <li key={item.id}>
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
