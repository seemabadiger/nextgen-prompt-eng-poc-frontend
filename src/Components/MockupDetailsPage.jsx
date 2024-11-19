import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Carousel, Row, Col, Button } from 'react-bootstrap';
import HeaderComponent from './HeaderComponent';
import leftImg from '../assets/left.svg';
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"; // Import delete icon

const MockupDetailsPage = () => {
    const { state } = useLocation();
    const { mockup } = state;
    const [activeIndex, setActiveIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    if (!mockup) return <div>Mockup not found</div>;

    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
    };

    const handleFullScreen = () => {
        setIsExpanded(!isExpanded);
    };

    const handleEdit = () => {
        // Implement edit functionality
        console.log('Edit clicked for mockup:', mockup.id);
    };

    const handleDelete = () => {
        // Implement delete functionality
        console.log('Delete clicked for mockup:', mockup.id);
        // Add actual delete logic here, such as API call or state management
    };

    // Style for expanded view
    const expandedStyle = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
    };

    const expandedImageStyle = {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    };

    return (
        <Container fluid className="p-4">
            <HeaderComponent showModal={() => { }} />
            <header className="d-flex justify-content-between align-items-center mb-4">
                <div className='mt-3' style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={leftImg} alt="Back" style={{ marginRight: '10px' }} onClick={() => window.history.back()} />
                    <h5>{mockup.title}</h5>
                </div>
            </header>
            <Row>
                <Col md={8}>
                    {/* Title and buttons above the carousel */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">{mockup.title}</h5>
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleFullScreen}
                                className="p-1"
                            >
                                <FullscreenIcon fontSize="small" />
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleEdit}
                                className="p-1"
                            >
                                <EditIcon fontSize="small" />
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={handleDelete}
                                className="p-1"
                            >
                                <DeleteIcon fontSize="small" />
                            </Button>
                        </div>
                    </div>
                    
                    {/* Rest of the component remains the same */}
                    <div id="carousel-container" className="bg-light p-3 rounded">
                        <Carousel activeIndex={activeIndex} onSelect={handleSelect} className="mb-3" interval={null}>
                            {mockup.images.map((image, index) => (
                                <Carousel.Item key={index}>
                                    <img className="d-block w-100 detailcardImg" src={image} alt={`Slide ${index}`} />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                    <Row className="mt-4">
                        <Col>
                            <div className="d-flex justify-content-center">
                                {mockup.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Thumbnail ${index}`}
                                        className={`carousel-thumbnail ${index === activeIndex ? 'active' : ''}`}
                                        onClick={() => handleSelect(index)}
                                    />
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    <h5 className="mt-4">{mockup.domainname} | {mockup.subdomainname}</h5>
                    <p>Contrary to popular belief, Lorem Ipsum is not simply random text...</p>
                    <h5 className="mt-4">About Project</h5>
                    <p>{mockup.description}</p>
                    <h5 className="mt-4">About Screen</h5>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
                </Col>
            </Row>

            {/* Expanded Image View */}
            {isExpanded && (
                <div 
                    style={expandedStyle}
                    onClick={handleFullScreen}
                >
                    <img
                        src={mockup.images[activeIndex]}
                        alt="Expanded view"
                        style={expandedImageStyle}
                    />
                </div>
            )}
        </Container>
    );
};

export default MockupDetailsPage;