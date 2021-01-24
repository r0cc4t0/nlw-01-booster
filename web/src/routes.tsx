import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import CollectionPoints from './pages/CollectionPoints';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={CollectionPoints} path="/points" />
    </BrowserRouter>
  );
};

export default Routes;
