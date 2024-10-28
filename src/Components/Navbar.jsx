import { useState, useContext } from 'react';
import { Navbar, Nav, NavDropdown, Form } from 'react-bootstrap';
import HeaderBackground from '../assets/header-bg.png';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import Logo from '../assets/logo.svg';
import Avatar from '../assets/avatar.png';
import { Navigate } from 'react-router-dom';

const NavbarComponent = ({ setMockups, showModal }) => {
    const { user, logout } = useContext(AuthContext);
    const [selectedTab, setSelectedTab] = useState('visual-samples');
    const [searchQuery, setSearchQuery] = useState('');

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const handleLogout = async () => {
        await logout();
        <Navigate to="/" />;
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const url = searchQuery
      ? `https://hxstudiofileupload.azurewebsites.net/api/FileUploadAPI/search?userId=${user?.id}&query=${searchQuery}`
      : `https://hxstudiofileupload.azurewebsites.net/api/FileUploadAPI/${user?.id}/mockups`;
        axios.get(url)
          .then(response => {
            const searchResults = response.data.map(mockup => ({
                id: mockup.id,
                title: mockup.projectTitle,
                description: mockup.projectDescription,
                images: mockup.mockups.map(m => m.filePath),
                tags: mockup.tags.map(tag => tag.name),
                domainname: mockup.domain.name,
                subdomainname: mockup.subdomain.name
            }));
            setMockups(searchResults);
          })
          .catch(error => {
            console.error('Error fetching search results:', error);
          });
      };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <Navbar expand="lg" style={{ backgroundImage: `url(${HeaderBackground})`, padding: '10px', flexDirection: 'column', opacity: 0.9 }}>
            <div className='container' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
                <Navbar.Brand href="#home" style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={Logo}
                        width="80"
                        height="80"
                        className="d-inline-block align-top"
                        alt="Logo"
                    />
                </Navbar.Brand>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => showModal(!0)} style={{ ...buttonStyle, background: 'transparent', color: '#fff', border: 'none' }}>Upload Mockup</button>
                    <NavDropdown title={<span>{user?.name} <img src={Avatar} alt="Avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', marginLeft: '10px' }} /></span>} id="user-menu-dropdown" style={{ ...buttonStyle, background: 'transparent', color: '#fff', border: 'none' }}>
                        <NavDropdown.Item href="#logout" onClick={handleLogout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </div>
            </div>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className='w-100' id="basic-navbar-nav" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '10px', transform: 'translateY(50px)' }}>
                <div className='container' style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Nav className="ml-auto" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Nav.Link
                            href="#visual-samples"
                            style={{ ...tabStyle, color: selectedTab === 'visual-samples' ? '#000' : '#fff', background: selectedTab === 'visual-samples' ? '#fff' : 'transparent', fontWeight: selectedTab === 'visual-samples' ? 500 : 'normal', borderTopLeftRadius: '5px', borderTopRightRadius: '5px', paddingBottom: '0px' }}
                            onClick={() => handleTabClick('visual-samples')}
                        >
                            <span style={{ padding: '0 10px 6px 10px', height: '100%', display: 'inline-block' }}>Visual Samples</span>
                        </Nav.Link>
                        <Nav.Link
                            href="#case-studies"
                            style={{ ...tabStyle, color: selectedTab === 'case-studies' ? '#000' : '#fff', background: selectedTab === 'case-studies' ? '#fff' : 'transparent', fontWeight: selectedTab === 'case-studies' ? 500 : 'normal', borderTopLeftRadius: '5px', borderTopRightRadius: '5px', paddingBottom: '0px' }}
                            onClick={() => handleTabClick('case-studies')}
                        >
                            <span style={{ padding: '0 10px 6px 10px', height: '100%', display: 'inline-block' }}>Case Studies</span>
                        </Nav.Link>
                        <Nav.Link
                            href="#process-diagram"
                            style={{ ...tabStyle, color: selectedTab === 'process-diagram' ? '#000' : '#fff', background: selectedTab === 'process-diagram' ? '#fff' : 'transparent', fontWeight: selectedTab === 'process-diagram' ? 500 : 'normal', borderTopLeftRadius: '5px', borderTopRightRadius: '5px', paddingBottom: '0px' }}
                            onClick={() => handleTabClick('process-diagram')}
                        >
                            <span style={{ padding: '0 10px 6px 10px', height: '100%', display: 'inline-block' }}>Process Diagram & Artifacts</span>
                        </Nav.Link>
                        <Nav.Link
                            href="#before-after"
                            style={{ ...tabStyle, color: selectedTab === 'before-after' ? '#000' : '#fff', background: selectedTab === 'before-after' ? '#fff' : 'transparent', fontWeight: selectedTab === 'before-after' ? 500 : 'normal', borderTopLeftRadius: '5px', borderTopRightRadius: '5px', paddingBottom: '0px' }}
                            onClick={() => handleTabClick('before-after')}
                        >
                            <span style={{ padding: '0 10px 6px 10px', height: '100%', display: 'inline-block' }}>Before After</span>
                        </Nav.Link>
                    </Nav>
                    <div className='container w-100 textBoxParentContainer' style={{ ...textBoxParentContainer, display: 'flex', flexDirection: 'column', background: '#fff', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', paddingTop: '8px', paddingBottom: '8px' }}>
                        <Form onSubmit={handleSearchSubmit}>
                            <label htmlFor="keyword" style={{ ...labelStyle, marginBottom: '5px' }}>Keyword</label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Form.Control
                                    type="text"
                                    placeholder="Type your keyword here..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    style={{ ...inputStyle, marginBottom: '5px' }}
                                />
                                <button type='submit' style={{ ...buttonStyle, background: '#6C67E1', height: '40px', alignSelf: 'center', marginLeft: '10px' }}>Search Mockup</button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
};

const tabStyle = {
    background: 'transparent',
    border: 'none',
    padding: '4px 15px 0px 15px 15px',
    color: '#000',
    textDecoration: 'none',
    cursor: 'pointer'
};

const textBoxParentContainer = {
    boxShadow:'rgba(149, 157, 165, 0.2) 0px 8px 24px;'
};

const labelStyle = {
    marginRight: '10px',
    fontWeight: 'bold'
};

const inputStyle = {
    border: 'none',
    outline: 'none',
    padding: '5px',
    flex: 1
};

const buttonStyle = {
    background: '#007bff',
    border: 'none',
    color: '#fff',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px'
};

export default NavbarComponent;