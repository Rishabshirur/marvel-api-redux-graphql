// client/src/App.js
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import MarvelComicsPage from './MarvelComicsPage';
import ComicDetailsPage from './ComicDetailsPage';
import CollectionsPage from './CollectionsPage';
import Home from './Home'
import { Provider } from 'react-redux';
import store from '../store';
import ErrorPage from './ErrorPage'


function App() {
  return (
    <div>
      <header className='App-header'>
          <h1 className='App-title center'>
             MarvelAPI Comics
          </h1>
          <nav className='center'>
            <NavLink className='navlink' to='/'>
              Home
            </NavLink>
            <NavLink className='navlink' to='/marvel-comics/page/1'>
              Comics
            </NavLink>

            <NavLink className='navlink' to='/marvel-comics/collections'>
              Collections
            </NavLink>
          </nav>
        </header>
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/marvel-comics/page/:pagenum" element={<MarvelComicsPage/>} />
            <Route path="/marvel-comics/:id" element={<ComicDetailsPage/>} />
            <Route path="/marvel-comics/collections" element={<CollectionsPage/>}/>
            <Route path="*" element={<ErrorPage />} />

          </Routes>
        </Provider>  
    </div>
  );
}

export default App;