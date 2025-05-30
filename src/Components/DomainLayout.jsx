/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GetAppIcon from "@mui/icons-material/GetApp";
import generatePdf from "../utils/htmlToPdf";
import SearchMockup from "./SearchMockup";
import MockupCard from "./MockupCard";
import OverlayLoader from "./OverlayLoader";
import { Popover, Box } from "@mui/material";

import { Container, Button, Row, Col, Dropdown } from "react-bootstrap";

const DomainLayout = ({
  tabName,
  mockupList,
  handleSortSelect,
  handleSearchSubmit,
}) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [selectedMockups, setSelectedMockups] = useState([]);
  const [selectedMockupsForDownload, setSelectedMockupsForDownload] = useState(
    []
  );

  const [activeButton, setActiveButton] = useState("All"); // Default to "All"
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [noMockupsFound, setNoMockupsFound] = useState(false);
  const [mockups, setMockups] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const navigate = useNavigate(); // Use useNavigate hook

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "pdf-popover" : undefined;

  const handleGenerate = (withWatermark) => {
    generatePdf(selectedMockupsForDownload, setLoading, withWatermark);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (mockupList?.length > 0) {
      setMockups(mockupList);
      setNoMockupsFound(false);
    }
  }, [mockupList]);

  const sortMockups = (sort) => {
    let sortedMockups = [...mockups];
    if (sort === "Alphabetically") {
      sortedMockups.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Assuming there's a date field for sorting by date
      sortedMockups.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    setMockups(sortedMockups);
  };

  useEffect(() => {
    if (user) {
      // fetchMockups(user.id);
      // fetchFavorites();
    }
  }, [user]);

  // Sort mockups based on selected option
  useEffect(() => {
    if (sortOption) {
      sortMockups(sortOption);
    }
  }, [sortOption]);

  const handleFavorite = async (e, mockupId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Add to favorites with true as payload
      await axios.post(
        `https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/${user.id}/like/${mockupId}`,
        true,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Toggle favorite state
      setFavorites((prev) => {
        if (prev.includes(mockupId)) {
          return prev.filter((id) => id !== mockupId);
        } else {
          return [...prev, mockupId];
        }
      });
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleDomainFilter = (domainName) => {
    setActiveButton(domainName);
    setShowFavorites(false); // Reset showFavorites state
    if (domainName === "All") {
      setMockups(mockupList);
      setNoMockupsFound(mockupList.length === 0);
    } else {
      console.log("mockupList", domainName, mockupList);
      const filteredMockups = (mockupList || []).filter(
        (mockup) =>
          (mockup.tags || []).includes(domainName) ||
          mockup.projectTitle
            .toLowerCase()
            .includes(domainName.toLowerCase()) ||
          mockup.domainname === domainName
      );
      setMockups(filteredMockups);
      setNoMockupsFound(filteredMockups.length === 0);
    }
  };

  // const handleSortSelect = (sort) => {
  //   setSortOption(sort);

  // };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const handleCardClick = (mockup, index) => {
    navigate(`/mockup/${mockup.id}`, { state: { mockup, index } });
  };

  const displayedMockups = showFavorites
    ? mockups.filter((mockup) => favorites.includes(mockup.id))
    : mockups;

  const handleCheckboxChange = (e, mockupId) => {
    e.stopPropagation(); // Stop event propagation to prevent card click
    let selected = [];
    setSelectedMockups((prevSelected) => {
      if (prevSelected.includes(mockupId)) {
        const mockupIds = prevSelected.filter((id) => id !== mockupId);
        selected = mockups.filter((mockup) => mockupIds.includes(mockup.id));
        return mockupIds;
      } else {
        const mockupIds = [...prevSelected, mockupId];
        selected = mockups.filter((mockup) => mockupIds.includes(mockup.id));
        return mockupIds;
      }
    });
    setSelectedMockupsForDownload(selected);
  };

  const handleMockupData = () => {
    const selectedMockupsData = displayedMockups?.filter(
      (res) => res?.mockupType?.name === tabName
    );
    return (selectedMockupsData || []).map((mockup) => (
      <Col lg={3} md={4} sm={4} xs={6} key={mockup.id} className="mb-4">
        <MockupCard
          handleCardClick={handleCardClick}
          mockup={mockup}
          user={user}
          selectedMockups={selectedMockups}
          favorites={favorites}
          handleFavorite={handleFavorite}
          handleCheckboxChange={handleCheckboxChange}
          tabName={tabName}
        />
      </Col>
    ));
  };

  return (
    <>
      <SearchMockup
        setMockups={setMockups}
        handleSearchSubmit={handleSearchSubmit}
      />
      <div className="container-fluid px-0">
        <Container className="p-0">
          <div className="d-flex justify-content-between align-items-center mb-4 mt-3 inner-tabs">
            <div className="d-flex flex-wrap">
              {[
                "All",
                "Mobile",
                "Moodle",
                "WordPress",
                "Analytics",
                "HRTech",
                "EdTech",
                "HealthTech",
              ].map((domain) => (
                <Button
                  style={{
                    marginBottom: "10px",
                  }}
                  key={domain}
                  variant="outline-secondary"
                  className={`me-2 ${
                    activeButton === domain ? "active-button" : ""
                  }`}
                  onClick={() => handleDomainFilter(domain)}
                >
                  {domain}
                </Button>
              ))}
            </div>
            <div className="d-flex align-items-center">
              {user?.role === "User" && (
                <Button
                  variant={showFavorites ? "secondary" : "outline-secondary"}
                  className="me-2 d-flex align-items-center"
                  onClick={toggleFavorites}
                  disabled={isLoadingFavorites}
                >
                  <FavoriteIcon fontSize="small" className="me-2" />
                  {isLoadingFavorites ? "Loading..." : "My Favorites"}
                </Button>
              )}
              {user?.role === "Admin" && tabName !== "Case Studies" && (
                <>
                  <Button
                    variant="outline-secondary"
                    className="me-2 d-flex align-items-center"
                    disabled={
                      selectedMockupsForDownload.length === 0 ? true : false
                    }
                    onClick={handleClick}
                  >
                    <GetAppIcon fontSize="small" className="me-2" />
                    Create PDF
                  </Button>

                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <Box p={1} display="flex" flexDirection="column" gap={1}>
                      <Button
                        variant="contained"
                        color="primary" style={{textAlign:'left',paddingBottom:'0'}}
                        onClick={() => handleGenerate(true)}
                      >
                        With Watermark
                      </Button>
                      <Button
                        variant="outlined" style={{textAlign:'left'}}
                        onClick={() => handleGenerate(false)}
                      >
                        Without Watermark
                      </Button>
                    </Box>
                  </Popover>
                </>
              )}
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-basic"
                >
                  Sort By {sortOption}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => handleSortSelect("Alphabetically")}
                  >
                    Alphabetically
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortSelect("Recent")}>
                    Recent
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          {noMockupsFound ? (
            <p>No mockups found for the entered keyword.</p>
          ) : (
            <Row className="mt-4">{handleMockupData()}</Row>
          )}

          {/* !displayedMockups?.length ? (
            <div className="text-center">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Loading...</p>
            </div>
          ) */}
        </Container>
      </div>
      <OverlayLoader show={loading} />
    </>
  );
};

export default DomainLayout;
