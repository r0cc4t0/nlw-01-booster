import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './styles.css';
import logo from '../../assets/logo.svg';

const CollectionPoints = () => {

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
            <li>
              <img src="http://localhost:3333/uploads/lampadas.svg" alt="Lâmpadas" />
              <span>Lâmpadas</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/baterias.svg" alt="Pilhas e Baterias" />
              <span>Pilhas e Baterias</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/papeis-papelao.svg" alt="Papéis e Papelão" />
              <span>Papéis e Papelão</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/eletronicos.svg" alt="Resíduos Eletrônicos" />
              <span>Resíduos Eletrônicos</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/organicos.svg" alt="Resíduos Orgânicos" />
              <span>Resíduos Orgânicos</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Óleo de Cozinha" />
              <span>Óleo de Cozinha</span>
            </li>
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta.</button>
      </form>
    </div>
  );

};

export default CollectionPoints;
