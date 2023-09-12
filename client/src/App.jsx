import './App.css';
import {createBrowserRouter, Route, createRoutesFromElements, RouterProvider} from 'react-router-dom'
// import { useEffect } from 'react'
// import useStore from './store';

import Layout from './Layout.jsx';

import Article from './components/Article.jsx';
import Favorites from './components/Favorites.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Search from './components/Search';

function App() {


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
      path="/"
      element={<Layout />}
      >
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path ="/search" element={<Search />} />
        <Route path="/article/:id" element={<Article />}/>
        <Route path="/favorites" element={<Favorites />} />
      </Route>
    )
  );
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
