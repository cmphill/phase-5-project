import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import useStore from "./store";

function Layout() {
  const currentUser = useStore((state) => state.current_user);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const logoutCurrentUser = useStore((state) => state.logoutCurrentUser);

  useEffect(() => {
    fetch("/api/login")
      .then((res) => res.json())
      .then((res) => {
        if (currentUser) {
          setCurrentUser(res), console.log(useStore.getState().current_user);
        } else {
          setCurrentUser(null);
        }
      });
  }, [setCurrentUser]);

  return (
    <div className="Layout">
      <header className="header">
        <Nav variant="pills" defaultActiveKey="/home">
          <Nav.Link as={NavLink} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={NavLink} to="/search">
            Search
          </Nav.Link>
          <Nav.Link as={NavLink} to="/notes">
            Notes
          </Nav.Link>
          {currentUser && (
            <Nav.Link as={NavLink} to="/users">
              Favorites
            </Nav.Link>
          )}
          {currentUser ? (
            <Nav.Link as={NavLink} onClick={logoutCurrentUser}>
              Logout
            </Nav.Link>
          ) : (
            <Nav.Link as={NavLink} to="/login">
              Login
            </Nav.Link>
          )}
        </Nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
