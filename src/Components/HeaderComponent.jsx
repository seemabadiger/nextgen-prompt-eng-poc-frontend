import React, { useContext } from "react";
import { Navbar, NavDropdown } from "react-bootstrap";
import { AuthContext } from "../Context/AuthContext";
import Logo from "../assets/logo.svg";
import Avatar from "../assets/avatar.png";
import HeaderBackground from "../assets/header-bg.png";
import { useNavigate } from "react-router-dom";

const HeaderComponent = ({ showModal }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      style={{
        backgroundImage: `url(${HeaderBackground})`,
        padding: "10px",
        flexDirection: "column",
        opacity: 0.9,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <Navbar.Brand
          href="#home"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            src={Logo}
            width="136"
            height="89"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* <button
            onClick={() => showModal(true)}
            style={{
              ...buttonStyle,
              background: "transparent",
              color: "#fff",
              border: "none",
            }}
          >
            Upload Mockup
          </button> */}
          <NavDropdown
            title={
              <span>
                {user?.name}{" "}
                <img
                  src={Avatar}
                  alt="Avatar"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    marginLeft: "10px",
                  }}
                />
              </span>
            }
            id="user-menu-dropdown"
            style={{
              ...buttonStyle,
              background: "transparent",
              color: "#fff",
              border: "none",
            }}
          >
            <NavDropdown.Item href="#logout" onClick={handleLogout}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      </div>
    </Navbar>
  );
};

const buttonStyle = {
  background: "#007bff",
  border: "none",
  color: "#fff",
  padding: "5px 10px",
  cursor: "pointer",
  borderRadius: "5px",
};

export default HeaderComponent;
