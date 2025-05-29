import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container, Carousel, Row, Col, Button, Modal } from "react-bootstrap";
import HeaderComponent from "./HeaderComponent";
import leftImg from "../assets/left.svg";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import UploadMockupModal from "./UploadMockupModal";

const MockupDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { mockup, index } = state;
  const [activeIndex, setActiveIndex] = useState(index || 0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false); // State to manage the visibility of the edit modal

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const handleFullScreen = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    setShowEditModal(true); // Show the edit modal when the edit button is clicked
  };

  const confirmDelete = () => {
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const getDeliverables = async () => {
    try {
      const response = await axios.get(
        `https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/deliverables`
      );
      if (response.status === 200) {
        console.log(response);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting mockup:", error);
      setDeleteError("Failed to delete mockup. Please try again.");
    }
  };

  useEffect(() => {
    getDeliverables();
  }, []);

  useEffect(() => {
    if (isExpanded) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => document.body.classList.remove('no-scroll');
  }, [isExpanded]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      const response = await axios.delete(
        `https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/delete/${mockup.id}`
      );

      if (response.status === 200) {
        setShowDeleteModal(false);
        // Navigate to domain layout
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Error deleting mockup:", error);
      setDeleteError("Failed to delete mockup. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleUpdate = (updatedMockup) => {
    // Handle the updated mockup data here
    console.log("Updated mockup:", updatedMockup);
    setShowEditModal(false); // Close the edit modal after update
  };

  // Style for expanded view
  const expandedStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  };

  const expandedImageStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  };

  if (!mockup) return <div>Mockup not found</div>;

  return (
    <Container fluid className="px-0">
      <HeaderComponent showModal={() => { }} />
      <Container className="m-auto">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <div
            className="mt-3"
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <img
              src={leftImg}
              alt="Back"
              style={{ marginRight: "10px" }}
              onClick={() => window.history.back()}
            />
          </div>
        </header>
        <Row>
          <Col md={8}>
            <Container className="bg-white p-4 rounded shadow-lg">
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
                    onClick={confirmDelete}
                    className="p-1"
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </div>
              </div>

              {/* Rest of the component remains the same */}
              <div id="carousel-container" className="bg-light p-3 rounded">
                <Carousel
                  activeIndex={activeIndex}
                  onSelect={handleSelect}
                  className="mb-3"
                  interval={null}
                >
                  {mockup.images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100 detailcardImg"
                        src={image}
                        alt={`Slide ${index}`}
                      />
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
                        className={`carousel-thumbnail ${index === activeIndex ? "active" : ""
                          }`}
                        onClick={() => handleSelect(index)}
                      />
                    ))}
                  </div>
                </Col>
              </Row>
            </Container>
          </Col>
          <Col md={4}>
            <Container className="bg-white p-4 rounded shadow-lg">
              <h5 className="">
                {mockup.domainname} | {mockup.subdomainname}
              </h5>
              <p>
                Contrary to popular belief, Lorem Ipsum is not simply random text...
              </p>
              <h5 className="mt-4">About Project</h5>
              <p dangerouslySetInnerHTML={{ __html: mockup.description }} />
              <h5 className="mt-4">About Screen</h5>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry...
              </p>
            </Container>
          </Col>
        </Row>

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this mockup?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Expanded Image View */}
        {/* {isExpanded && (
        <div style={expandedStyle} onClick={handleFullScreen}>
          <img
            src={mockup.images[activeIndex]}
            alt="Expanded view"
            style={expandedImageStyle}
          />
        </div>
      )} */}
        {isExpanded && (
          <div style={expandedStyle} onClick={handleFullScreen}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                maxHeight: '90vh',
                overflow: 'hidden',
                flexDirection: 'row',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Image Carousel Simulation */}
              <div
                className="vertical-carousel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  transform: `translateY(-${activeIndex * 100}%)`,
                  transition: 'transform 0.5s ease-in-out',
                  height: '90vh',
                  width: '80vw',
                }}
              >
                {mockup.images.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      height: '90vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={img}
                      alt={`expanded-${idx}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Vertical Dot Indicators (Right Side) */}
              {mockup.images.length > 1 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    marginLeft: '20px',
                    height: '90vh',
                  }}
                >
                  {mockup.images.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      role="button"
                      aria-label={`Go to image ${idx + 1}`}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: idx === activeIndex ? '#fff' : 'transparent',
                        border: '1px solid #fff',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {/* <UploadMockupModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                handleUpload={handleUpload}
            /> */}
        {showEditModal && (
          <UploadMockupModal
            show={showEditModal}
            handleClose={() => setShowEditModal(false)}
            onUpdate={handleUpdate}
            mockup={mockup}
            mockupId={id}
          />
        )}
      </Container>
    </Container>
  );
};

export default MockupDetailsPage;
