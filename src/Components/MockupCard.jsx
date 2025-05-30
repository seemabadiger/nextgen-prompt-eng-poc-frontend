/* eslint-disable react/prop-types */
import { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Form, Card, Badge, ListGroup, Carousel } from "react-bootstrap";

const MockupCard = ({
  tabName,
  handleCardClick,
  mockup,
  user,
  selectedMockups,
  favorites,
  handleFavorite,
  handleCheckboxChange,
}) => {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  const handleCarouselClick = (e) => {
    e.stopPropagation(); // Prevent navigation
  };
  const cardTextStyle = {fontWeight: "bold"};
  // const selectedMockupsIds = selectedMockups.map((sid => sid.id))
  return (
    <Card
      className="template-card"
      onClick={() => handleCardClick(mockup, index)}
    >
      <div className="checkbox-container d-flex align-items-center">
        {user?.role === "User" && (
          <FavoriteIcon
            className="me-2"
            style={{
              cursor: "pointer",
              color: favorites.includes(mockup.id) ? "red" : "grey",
              fontSize: "1.25rem", // Adjust this value to match the checkbox size
            }}
            onClick={(e) => handleFavorite(e, mockup.id)}
          />
        )}
        <Form.Check
          type="checkbox"
          checked={selectedMockups.includes(mockup.id)}
          onChange={(e) => handleCheckboxChange(e, mockup.id)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <Carousel
        interval={null}
        activeIndex={index}
        onSelect={handleSelect}
        onClick={handleCarouselClick}
        // controls={(mockup.images || []).length > 1}
        controls={false}
        indicators={(mockup.images || []).length > 1}
      >
        {(mockup.images || []).map((image, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 cardImg"
              src={image}
              alt={`Slide ${index}`}
            />
          </Carousel.Item>
        ))}
        <div className="carousel-overlay"></div>
      </Carousel>
      <Card.Body style={{ cursor: "pointer" }}>
        <Card.Title className="h6">
          <span style={{color:'#6C67E1'}}>{mockup.domainname} </span> | {mockup.subdomainname}
        </Card.Title>
        <Card.Text className="h5" style={{...cardTextStyle}}>{mockup.title}</Card.Text>
        {tabName === "Visual Samples" && (
          <ListGroup className="list-group-flush d-flex flex-row flex-wrap">
            {mockup.mockupsData &&
              mockup.mockupsData.length > 0 &&
              (mockup.mockupsData[index].tags || []).map((tag) => (
                <ListGroup.Item key={tag} className="border-0 p-0 me-2 mt-1">
                  <Badge bg="secondary">{tag}</Badge>
                </ListGroup.Item>
              ))}
          </ListGroup>
        )}
        {tabName === "Case Studies" && (
          <ListGroup className="list-group-flush d-flex flex-row flex-wrap">
            {mockup.caseStudy &&
              (mockup.caseStudy.tags || []).map((tag) => (
                <ListGroup.Item key={tag} className="border-0 p-0 me-2 mt-1">
                  <Badge bg="secondary">{tag}</Badge>
                </ListGroup.Item>
              ))}
          </ListGroup>
        )}
        {tabName === "Before After" && (
          <ListGroup className="list-group-flush d-flex flex-row flex-wrap">
            {mockup.beforeAfterData &&
              mockup.beforeAfterData.length > 0 &&
              (mockup.beforeAfterData[index].tags || []).map((tag) => (
                <ListGroup.Item key={tag} className="border-0 p-0 me-2 mt-1">
                  <Badge bg="secondary">{tag}</Badge>
                </ListGroup.Item>
              ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default MockupCard;
