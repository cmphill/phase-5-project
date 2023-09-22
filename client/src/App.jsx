import './App.css';
import {createBrowserRouter, Route, createRoutesFromElements, RouterProvider} from 'react-router-dom'
// import { useEffect } from 'react'
// import useStore from './store';

import Layout from './Layout.jsx';

import Article from './components/Article.jsx';
import Users from './components/Users.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Search from './components/Search';
import Notes from './components/Notes.jsx';

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
        <Route path="/users" element={<Users />} />
        <Route path='/notes' element={<Notes />} />
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
