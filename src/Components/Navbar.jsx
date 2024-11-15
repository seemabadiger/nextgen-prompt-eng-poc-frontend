import { useState, useContext } from "react";
import { Navbar, Nav, NavDropdown, Tab } from "react-bootstrap";
import HeaderBackground from "../assets/header-bg.png";
import { AuthContext } from "../Context/AuthContext";
import Logo from "../assets/logo.svg";
import HarbingerLogo from "../assets/harbinger_logo.svg";
import UploadLogo from "../assets/upload_logo.svg";
import Avatar from "../assets/avatar.png";
import { Navigate } from "react-router-dom";
import CaseStudies from "../pages/CaseStudies";
import ProcessDiagram from "../pages/ProcessDiagram";
import BeforeAfter from "../pages/BeforeAfter";
import SearchMockup from "./SearchMockup";
import VisualSample from "../pages/VisualSample";

const NavbarComponent = ({ setMockups, showModal }) => {
  const { user, logout } = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState("visual-samples");
  const [key, setKey] = useState("tab1");

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleLogout = async () => {
    await logout();
    <Navigate to="/" />;
  };

  return (
    <Navbar
      expand="lg"
      style={{
        backgroundImage: `url(${HeaderBackground})`,
        padding: "9px 0 0 0",
        flexDirection: "column",
        height: "254px",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Navbar.Brand
          className="pt-3 pb-0"
          href="#home"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            src={Logo}
            width="136"
            height="89"
            className="d-inline-block align-top navbar-logo"
            alt="Logo"
          />
          <div className="logo-divider"></div>
          <span
            style={{ color: "#fff", fontSize: "12px", marginBottom: "35px" }}
          >
            By
          </span>
          <img
            src={HarbingerLogo}
            width="148"
            height="48"
            className="d-inline-block align-top"
            alt="Harbinger Logo"
          />
        </Navbar.Brand>
        <div style={{ display: "flex", gap: "10px" }}>
          {user?.role?.toLowerCase() === "admin" && (
            <button
              onClick={() => showModal(!0)}
              style={{
                ...buttonStyle,
                background: "transparent",
                color: "#fff",
                border: "none",
                borderRight: "1px solid #fff",
                textDecoration: "underline",
                borderRadius: "0",
                fontWeight: "bold",
                padding: "0px 20px 5px 10px",
              }}
            >
              <img
                style={{
                  marginRight: "5px",
                }}
                src={UploadLogo}
                width="20"
                height="20"
                className="d-inline-block "
                alt="Upload Logo"
              />{" "}
              Upload
            </button>
          )}
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
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse
        className="w-100"
        id="basic-navbar-nav"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          transform: "translateY(50px)",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <Tab.Container
            id="tabs-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
          >
            <Nav
              variant="pills"
              className="ml-auto main-nav-tab"
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <Nav.Item>
                <Nav.Link
                  // href="#visual-samples"
                  eventKey={"tab1"}
                  style={{
                    ...tabStyle,
                    color: selectedTab === "visual-samples" ? "#000" : "#fff",
                    background:
                      selectedTab === "visual-samples" ? "#fff" : "transparent",
                    fontWeight:
                      selectedTab === "visual-samples" ? 500 : "normal",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }}
                  onClick={() => handleTabClick("visual-samples")}
                >
                  <span
                    style={{
                      padding: "0 0 6px 0",
                      height: "100%",
                      display: "inline-block",
                      borderBottomLeftRadius: "0px",
                      borderBottomRightRadius: "0px",
                    }}
                  >
                    Visual Samples
                  </span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  // href="#case-studies"
                  eventKey={"tab2"}
                  style={{
                    ...tabStyle,
                    color: selectedTab === "case-studies" ? "#000" : "#fff",
                    background:
                      selectedTab === "case-studies" ? "#fff" : "transparent",
                    fontWeight: selectedTab === "case-studies" ? 500 : "normal",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }}
                  onClick={() => handleTabClick("case-studies")}
                >
                  <span
                    style={{
                      padding: "0 0 6px 0",
                      height: "100%",
                      display: "inline-block",
                    }}
                  >
                    Case Studies
                  </span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Link
                // href="#process-diagram"
                eventKey={"tab3"}
                style={{
                  ...tabStyle,
                  color: selectedTab === "process-diagram" ? "#000" : "#fff",
                  background:
                    selectedTab === "process-diagram" ? "#fff" : "transparent",
                  fontWeight:
                    selectedTab === "process-diagram" ? 500 : "normal",
                  borderTopLeftRadius: "5px",
                  borderTopRightRadius: "5px",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                }}
                onClick={() => handleTabClick("process-diagram")}
              >
                <span
                  style={{
                    padding: "0 0 5px 0",
                    height: "100%",
                    display: "inline-block",
                  }}
                >
                  Process Diagram & Artifacts
                </span>
              </Nav.Link>
              <Nav.Item>
                <Nav.Link
                  // href="#before-after"
                  eventKey={"tab4"}
                  style={{
                    ...tabStyle,
                    color: selectedTab === "before-after" ? "#000" : "#fff",
                    background:
                      selectedTab === "before-after" ? "#fff" : "transparent",
                    fontWeight: selectedTab === "before-after" ? 500 : "normal",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }}
                  onClick={() => handleTabClick("before-after")}
                >
                  <span
                    style={{
                      padding: "0 0 6px 0",
                      height: "100%",
                      display: "inline-block",
                    }}
                  >
                    Before After
                  </span>
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="tab1">
                <SearchMockup setMockups={setMockups} />
                <VisualSample />
              </Tab.Pane>
              <Tab.Pane eventKey="tab2">
                <SearchMockup setMockups={setMockups} />
                <CaseStudies />
              </Tab.Pane>
              <Tab.Pane eventKey="tab3">
                <ProcessDiagram />
              </Tab.Pane>
              <Tab.Pane eventKey="tab4">
                <SearchMockup setMockups={setMockups} />
                <BeforeAfter />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

const tabStyle = {
  background: "transparent",
  border: "none",
  padding: "4px 15px 0px 15px 15px",
  color: "#000",
  textDecoration: "none",
  cursor: "pointer",
};

const textBoxParentContainer = {
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
};

const labelStyle = {
  marginRight: "10px",
  fontWeight: "bold",
};

const inputStyle = {
  border: "none",
  outline: "none",
  padding: "5px",
  flex: 1,
};

const buttonStyle = {
  background: "#007bff",
  border: "none",
  color: "#fff",
  padding: "5px 10px",
  cursor: "pointer",
  borderRadius: "5px",
};

export default NavbarComponent;
