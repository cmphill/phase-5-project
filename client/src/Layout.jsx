import { useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom';
import useStore from './store'


function Layout() {
    const currentUser = useStore(state => state.current_user)
    const setCurrentUser = useStore(state => state.setCurrentUser)
    const logoutCurrentUser = useStore(state => state.logoutCurrentUser)
  
    useEffect(() => { 
      fetch('/api/login')
        .then(res => res.json())
        .then(res => {setCurrentUser(res), console.log(useStore.getState().current_user)})
      }, [setCurrentUser])

    return (
        <div className="layout">
            <header>
                <div className="NavBar">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="search" >Search</NavLink>
                    {currentUser? <NavLink to="favorites" >Favorites</NavLink> : null }
                    {currentUser? <a onClick={logoutCurrentUser}> Logout </a> : <NavLink to="/login" >Login</NavLink>}
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
        )

}

export default Layout;