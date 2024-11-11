// DashboardLayout.jsx
import { useState, useEffect, useContext } from 'react';
import { Container, Navbar, Nav, Form, Button, Row, Col, Card, Badge, DropdownButton, Dropdown, Modal, ListGroup, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import axios from 'axios';
import './Dashboard.css';
import UploadMockupModal from './UploadMockupModal';
import NavbarComponent from './Navbar';
import GetAppIcon from '@mui/icons-material/GetApp';
import { AuthContext } from '../Context/AuthContext';
import generatePdf from '../utils/htmlToPdf';

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [mockups, setMockups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    Name: '',
    Tags: [],
    Domainname: '',
    Subdomainname: '',
    Image: ''
  });
  const [selectedMockups, setSelectedMockups] = useState([]);
  const [selectedMockupsForDownload, setSelectedMockupsForDownload] = useState([]);
  const [activeButton, setActiveButton] = useState('');
  const navigate = useNavigate(); // Use useNavigate hook

  // Fetch mockups on component mount
  useEffect(() => {
    if (user) {
      fetchMockups(user.id);
    }
  }, [user]);

  // Sort mockups based on selected option
  useEffect(() => {
    if (sortOption) {
      sortMockups(sortOption);
    }
  }, [sortOption]);

  const fetchMockups = (userId) => {
    axios.get(`https://hxstudiofileupload.azurewebsites.net/api/FileUploadAPI/${userId}/mockups`)
      .then(response => {
        const fetchedMockups = response.data.map(mockup => ({
          id: mockup.id,
          title: mockup.projectTitle,
          description: mockup.projectDescription,
          images: mockup.mockups.map(m => m.filePath),
          tags: mockup.tags.map(tag => tag.name),
          domainname: mockup.domain.name,
          subdomainname: mockup.subdomain.name
        }));
        setMockups(fetchedMockups);
      })
      .catch(error => {
        console.error('Error fetching mockups:', error);
      });
  };

  const sortMockups = (sort) => {
    let sortedMockups = [...mockups];
    if (sort === 'Alphabetically') {
      sortedMockups.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Assuming there's a date field for sorting by date
      sortedMockups.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    setMockups(sortedMockups);
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleUpload = (newMockups) => {
    setMockups(prev => [...prev, ...newMockups]);
  };

  const handleSortSelect = (sort) => {
    setSortOption(sort);
    let apiUrl;
    if (sort === 'Alphabetically') {
      apiUrl = `https://hxstudiofileupload.azurewebsites.net/api/FileUploadAPI/alphabetical?userId=${user.id}`;
    } else {
      apiUrl = `https://hxstudiofileupload.azurewebsites.net/api/FileUploadAPI/recent?userId=${user.id}`;
    }

    axios.get(apiUrl)
      .then(response => {
        const sortedMockups = response.data.map(mockup => ({
          id: mockup.id,
          title: mockup.projectTitle,
          description: mockup.projectDescription,
          images: mockup.mockups.map(m => m.filePath),
          tags: mockup.tags.map(tag => tag.name),
          domainname: mockup.domain.name,
          subdomainname: mockup.subdomain.name
        }));
        setMockups(sortedMockups);
      })
      .catch(error => {
        console.error('Error fetching sorted mockups:', error);
      });
  };

  const handleDomainFilter = (domainName) => {
    setActiveButton(domainName);
    axios.get(`https://hxstudiofileupload.azurewebsites.net/api/FileUploadAPI/searchByDomain?userId=${user.id}&domainName=${domainName}`)
      .then(response => {
        const filteredMockups = response.data.map(mockup => ({
          id: mockup.id,
          title: mockup.projectTitle,
          description: mockup.projectDescription,
          images: mockup.mockups.map(m => m.filePath),
          tags: mockup.tags.map(tag => tag.name),
          domainname: mockup.domain.name,
          subdomainname: mockup.subdomain.name
        }));
        setMockups(filteredMockups);
      })
      .catch(error => {
        console.error('Error fetching filtered mockups:', error);
        setMockups([]);
      });
  };

  const handleDelete = (mockup) => {
    axios.delete(`https://hxstudiofileupload.azurewebsites.net/api/FileUploadAPI/delete/${mockup.id}`)
      .then(() => {
        setMockups(prevMockups => prevMockups.filter(item => item.id !== mockup.id));
        console.log('Mockup deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting mockup:', error);
      });
  };

  const handleUpdate = (mockup) => {
    setSelectedMockup(mockup);
    setUpdateForm({
      Name: mockup.description,
      Tags: mockup.tags || [],
      Domainname: mockup.domainname,
      Subdomainname: mockup.subdomainname,
      Image: mockup.images[0] // Assuming the first image is the main image
    });
    setUpdateModalShow(true);
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleUpdateTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setUpdateForm(prevForm => ({
      ...prevForm,
      Tags: tags
    }));
  };

  const handleUpdateFormSubmit = (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (!updateForm.Name.trim() || !updateForm.Tags.length || !updateForm.Domainname.trim() || !updateForm.Subdomainname.trim()) {
      alert("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append('Name', updateForm.Name);
    formData.append('Tags', updateForm.Tags.join(','));
    formData.append('Domainname', updateForm.Domainname);
    formData.append('Subdomainname', updateForm.Subdomainname);
    formData.append('Image', updateForm.Image);

    if (selectedMockup) {
      axios.put(`https://hxstudiofileupload.azurewebsites.net/api/FileUploadAPI/update/${selectedMockup.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(() => {
          fetchMockups(user.id); // Refresh the page by re-fetching mockups
          setUpdateModalShow(false);
          alert('Mockup updated successfully');
        })
        .catch(error => {
          alert('Error updating mockup:', error);
        });
    }
  };

  const handleDownload = (mockup) => {
    // Handle download action
    console.log('Download clicked for', mockup);
  };

  const handleCheckboxChange = (e, mockupId) => {
    e.stopPropagation(); // Stop event propagation to prevent card click
    let selected = [];
    setSelectedMockups(prevSelected => {
      if (prevSelected.includes(mockupId)) {
        const mockupIds = prevSelected.filter(id => id !== mockupId);
        selected = mockups.filter(mockup => mockupIds.includes(mockup.id));
        return mockupIds
      } else {
        const mockupIds = [...prevSelected, mockupId];
        selected = mockups.filter(mockup => mockupIds.includes(mockup.id));
        return mockupIds;
      }
    });
    setSelectedMockupsForDownload(selected);
  };

  const handleCarouselClick = (e) => {
    e.stopPropagation(); // Prevent navigation
  };

  const handleCardClick = (mockup) => {
    navigate(`/mockup/${mockup.id}`, { state: { mockup } });
  };

  return (
    <div>
      <NavbarComponent setMockups={setMockups} showModal={handleShow} />
      <Container style={{ marginTop: '60px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
          <div className="d-flex flex-wrap">
            {['All', 'Mobile', 'Moodle', 'WordPress', 'Analytics', 'HRTech', 'EdTech', 'HealthTech'].map(domain => (
              <Button
                key={domain}
                variant="outline-secondary"
                className={`me-2 ${activeButton === domain ? 'active-button' : ''}`}
                onClick={() => handleDomainFilter(domain)}
              >
                {domain}
              </Button>
            ))}
          </div>
          <div className="d-flex align-items-center">
            <Button variant="outline-secondary" className="me-2 d-flex align-items-center" onClick={() => generatePdf(selectedMockupsForDownload)}>
              <GetAppIcon fontSize="small" className="me-2" />
              Create PDF
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">Sort By {sortOption}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSortSelect('Alphabetically')}>Alphabetically</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSortSelect('Recent')}>Recent</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <Row className="mt-4">
          {mockups.map(mockup => (
            <Col sm={3} key={mockup.id} className="mb-3">
              <Card className='template-card' onClick={() => handleCardClick(mockup)}>
                <div className="checkbox-container">
                <Form.Check 
                  type="checkbox" 
                  checked={selectedMockups.includes(mockup.id)} 
                  onChange={(e) => handleCheckboxChange(e, mockup.id)} 
                  onClick={(e) => e.stopPropagation()} // Stop event propagation to prevent card click
                />
                </div>
                <Carousel interval={null} onClick={handleCarouselClick}>
                  {mockup.images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img className="d-block w-100 cardImg" src={image} alt={`Slide ${index}`} />
                    </Carousel.Item>
                  ))}
                </Carousel>
                <Card.Body>
                  <Card.Title>{mockup.domainname}| {mockup.subdomainname}</Card.Title>
                  <Card.Text>{mockup.title}</Card.Text>
                  <ListGroup className="list-group-flush d-flex flex-row flex-wrap">
                    {mockup.tags.map(tag => (
                      <ListGroup.Item key={tag} className="border-0 p-0 me-2">
                        <Badge bg="secondary">{tag}</Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <UploadMockupModal show={show} handleClose={handleClose} handleUpload={handleUpload} />
    </div>
  );
};

export default DashboardLayout;