import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import axios from "axios";
import "./Dashboard.css";
import UploadMockupModal from "./UploadMockupModal";
import NavbarComponent from "./Navbar";
import { AuthContext } from "../Context/AuthContext";
import OverlayLoader from './OverlayLoader'

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Visual Samples");
  const [mockups, setMockups] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [updateForm, setUpdateForm] = useState({
    Name: "",
    Tags: [],
    Domainname: "",
    Subdomainname: "",
    Image: "",
  });
  const [selectedMockups, setSelectedMockups] = useState([]);
  const [selectedMockupsForDownload, setSelectedMockupsForDownload] = useState(
    []
  );
  // const [activeButton, setActiveButton] = useState('');
  const navigate = useNavigate(); // Use useNavigate hook
  const [favorites, setFavorites] = useState([]);
  // const [showFavorites, setShowFavorites] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [noMockupsFound, setNoMockupsFound] = useState(false);

  // Fetch mockups on component mount
  useEffect(() => {
    if (user) {
      fetchMockups(user.id);
      // fetchFavorites();
    }
  }, [user]);

  // Sort mockups based on selected option
  useEffect(() => {
    if (sortOption) {
      sortMockups(sortOption);
    }
  }, [sortOption]);

  const fetchMockups = (userId) => {
    setLoading(true);
    axios
      .get(
        `https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/${userId}/mockups`
      )
      .then((response) => {
        const fetchedMockups = response.data.map((mockup) => ({
          id: mockup.id,
          title: mockup.projectTitle,
          description: mockup.projectDescription,
          images: mockup.mockups.map((m) => m.filePath),
          tags: mockup.mockups.flatMap((m) => m.tags.split(',')),
          domainname: mockup.domain.name,
          subdomainname: mockup.subdomain.name,
          mockupType: mockup.mockupType,
          mockupsData: mockup.mockups.map((m) => ({
            image: m.filePath,
            tags: m?.tags.split(','),
          })),
        }));
        setMockups(fetchedMockups);
        setNoMockupsFound(fetchedMockups.length === 0);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching mockups:", error);
      });
  };

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

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };
  const handleTabSelection = (val) => {
    setSelectedTab(val);
  };

  const handleUpload = () => {
    fetchMockups(user.id);
  };

  const handleSearchSubmit = (searchQuery) => {
    setMockups([]);
    setLoading(true)
    const url = `https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/search?userId=${user?.id}&query=${searchQuery}`;
    axios
      .get(url)
      .then((response) => {
        // const searchResults = response.data.map((mockup) => ({
        //   id: mockup.id,
        //   title: mockup.projectTitle,
        //   description: mockup.projectDescription,
        //   images: mockup.mockups.map((m) => m.filePath),
        //   tags: mockup.tags.map((tag) => tag.name),
        //   domainname: mockup.domain.name,
        //   subdomainname: mockup.subdomain.name,
        //   mockupType: mockup.mockupType || { "id": 2, "name": "Visual Samples" }
        // }));
        const searchResults = response.data.map((mockup) => ({
          id: mockup.id,
          title: mockup.projectTitle,
          description: mockup.projectDescription,
          images: mockup.mockups.map((m) => m.filePath),
          tags: mockup.mockups.flatMap((m) => m.tags.split(',')),
          domainname: mockup.domain.name,
          subdomainname: mockup.subdomain.name,
          mockupType: mockup.mockupType || { "id": 2, "name": "Visual Samples" },
          mockupsData: mockup.mockups.map((m) => ({
            image: m.filePath,
            tags: m?.tags.split(','),
          })),
        }));
        setMockups(searchResults);
        setNoMockupsFound(searchResults.length === 0);
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        setNoMockupsFound(true);
        setLoading(false)
      });
  };

  const handleSortSelect = (sort) => {
    setLoading(true)
    let apiUrl;
    if (sort === "Alphabetically") {
      apiUrl = `https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/alphabetical?userId=${user.id}`;
    } else {
      apiUrl = `https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/recent?userId=${user.id}`;
    }
    setMockups([]);
    axios
      .get(apiUrl)
      .then((response) => {
        console.log("API Response:", response.data); // Debugging log
        // const sortedMockups = response.data.map((mockup) => ({
        //   id: mockup.id,
        //   title: mockup.projectTitle,
        //   description: mockup.projectDescription,
        //   images: mockup.mockups.map((m) => m.filePath),
        //   tags: mockup.tags.map((tag) => tag.name),
        //   domainname: mockup.domain.name,
        //   subdomainname: mockup.subdomain.name,
        //   mockupType: mockup.mockupType,
        // }));
        const sortedMockups = response.data.map((mockup) => ({
          id: mockup.id,
          title: mockup.projectTitle,
          description: mockup.projectDescription,
          images: mockup.mockups.map((m) => m.filePath),
          tags: mockup.mockups.flatMap((m) => m.tags.split(',')),
          domainname: mockup.domain.name,
          subdomainname: mockup.subdomain.name,
          mockupType: mockup.mockupType || { "id": 2, "name": "Visual Samples" },
          mockupsData: mockup.mockups.map((m) => ({
            image: m.filePath,
            tags: m?.tags.split(','),
          })),
        }));
        setMockups(sortedMockups);
        setNoMockupsFound(sortedMockups.length === 0);
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching sorted mockups:", error);
        setLoading(false)
      });
  };
  const fetchFavorites = async () => {
    if (!user) return;
    setMockups([]);
    setIsLoadingFavorites(true);
    try {
      const response = await axios.get(
        `https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/${user.id}/likes`
      );
      const favoriteIds = response.data.map(
        (favorite) => favorite.mockupGroupId
      );
      setFavorites(favoriteIds);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  // const handleDomainFilter = (domainName) => {
  //   setActiveButton(domainName);
  //   setShowFavorites(false); // Reset showFavorites state
  //   axios.get(`https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/searchByDomain?userId=${user.id}&domainName=${domainName}`)
  //     .then(response => {
  //       const filteredMockups = response.data.map(mockup => ({
  //         id: mockup.id,
  //         title: mockup.projectTitle,
  //         description: mockup.projectDescription,
  //         images: mockup.mockups.map(m => m.filePath),
  //         tags: mockup.tags.map(tag => tag.name),
  //         domainname: mockup.domain.name,
  //         subdomainname: mockup.subdomain.name
  //       }));
  //       setMockups(filteredMockups);
  //       setNoMockupsFound(filteredMockups.length === 0);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching filtered mockups:', error);
  //       setMockups([]);
  //       setNoMockupsFound(true);
  //     });
  // };

  // const handleDelete = (mockup) => {
  //   axios.delete(`https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/delete/${mockup.id}`)
  //     .then(() => {
  //       setMockups(prevMockups => prevMockups.filter(item => item.id !== mockup.id));
  //       console.log('Mockup deleted successfully');
  //     })
  //     .catch(error => {
  //       console.error('Error deleting mockup:', error);
  //     });
  // };

  // const handleUpdate = (mockup) => {
  //   setSelectedMockup(mockup);
  //   setUpdateForm({
  //     Name: mockup.description,
  //     Tags: mockup.tags || [],
  //     Domainname: mockup.domainname,
  //     Subdomainname: mockup.subdomainname,
  //     Image: mockup.images[0] // Assuming the first image is the main image
  //   });
  //   setUpdateModalShow(true);
  // };

  // const handleUpdateFormChange = (e) => {
  //   const { name, value } = e.target;
  //   setUpdateForm(prevForm => ({
  //     ...prevForm,
  //     [name]: value
  //   }));
  // };

  // const handleUpdateTagsChange = (e) => {
  //   const tags = e.target.value.split(',').map(tag => tag.trim());
  //   setUpdateForm(prevForm => ({
  //     ...prevForm,
  //     Tags: tags
  //   }));
  // };

  // const handleUpdateFormSubmit = (e) => {
  //   e.preventDefault();

  //   // Simple client-side validation
  //   if (!updateForm.Name.trim() || !updateForm.Tags.length || !updateForm.Domainname.trim() || !updateForm.Subdomainname.trim()) {
  //     alert("Please fill out all required fields.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('Name', updateForm.Name);
  //   formData.append('Tags', updateForm.Tags.join(','));
  //   formData.append('Domainname', updateForm.Domainname);
  //   formData.append('Subdomainname', updateForm.Subdomainname);
  //   formData.append('Image', updateForm.Image);

  //   if (selectedMockup) {
  //     axios.put(`https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/update/${selectedMockup.id}`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     })
  //       .then(() => {
  //         fetchMockups(user.id); // Refresh the page by re-fetching mockups
  //         setUpdateModalShow(false);
  //         alert('Mockup updated successfully');
  //       })
  //       .catch(error => {
  //         alert('Error updating mockup:', error);
  //       });
  //   }
  // };

  // const handleDownload = (mockup) => {
  //   // Handle download action
  //   console.log('Download clicked for', mockup);
  // };

  // const handleCheckboxChange = (e, mockupId) => {
  //   e.stopPropagation(); // Stop event propagation to prevent card click
  //   let selected = [];
  //   setSelectedMockups(prevSelected => {
  //     if (prevSelected.includes(mockupId)) {
  //       const mockupIds = prevSelected.filter(id => id !== mockupId);
  //       selected = mockups.filter(mockup => mockupIds.includes(mockup.id));
  //       return mockupIds
  //     } else {
  //       const mockupIds = [...prevSelected, mockupId];
  //       selected = mockups.filter(mockup => mockupIds.includes(mockup.id));
  //       return mockupIds;
  //     }
  //   });
  //   setSelectedMockupsForDownload(selected);
  // };

  // const handleCarouselClick = (e) => {
  //   e.stopPropagation(); // Prevent navigation
  // };

  // const handleCardClick = (mockup) => {
  //   navigate(`/mockup/${mockup.id}`, { state: { mockup } });
  // };

  // const handleFavorite = async (e, mockupId) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   try {
  //     // Add to favorites with true as payload
  //     await axios.post(`https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/${user.id}/like/${mockupId}`, true, {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     // Toggle favorite state
  //     setFavorites(prev => {
  //       if (prev.includes(mockupId)) {
  //         return prev.filter(id => id !== mockupId);
  //       } else {
  //         return [...prev, mockupId];
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error updating favorites:', error);
  //   }
  // };

  return (
    <div>
      <NavbarComponent
        mockups={mockups}
        setMockups={setMockups}
        showModal={handleShow}
        handleTabSelection={handleTabSelection}
        selectedTab={selectedTab}
        handleSortSelect={handleSortSelect}
        handleSearchSubmit={handleSearchSubmit}
      />
      {show && (
        <UploadMockupModal
          show={show}
          handleClose={handleClose}
          onUpload={handleUpload}
          selectedTab={selectedTab}
        />
      )}
      <OverlayLoader show={loading} />
    </div>
  );
};

export default DashboardLayout;
