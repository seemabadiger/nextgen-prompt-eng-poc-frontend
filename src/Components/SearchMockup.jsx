import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../Context/AuthContext';
import { Form } from "react-bootstrap";

const SearchMockup = ({ setMockups }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [noMockupsFound, setNoMockupsFound] = useState(false);
  const [emptySearchQuery, setEmptySearchQuery] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setEmptySearchQuery(true);
      setNoMockupsFound(false);
      setMockups([]);
      setTimeout(() => {
        setEmptySearchQuery(false);
      }, 1000);
      return;
    }
    setEmptySearchQuery(false);
    const url = `https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/search?userId=${user?.id}&query=${searchQuery}`;
    axios
      .get(url)
      .then((response) => {
        const searchResults = response.data.map((mockup) => ({
          id: mockup.id,
          title: mockup.projectTitle,
          description: mockup.projectDescription,
          images: mockup.mockups.map((m) => m.filePath),
          tags: mockup.tags.map((tag) => tag.name),
          domainname: mockup.domain.name,
          subdomainname: mockup.subdomain.name,
          mockupType: mockup.mockupType || { "id": 2, "name": "Visual Samples" }
        }));
        setMockups(searchResults);
        setNoMockupsFound(searchResults.length === 0);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        setNoMockupsFound(true);
      });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value) {
      setNoMockupsFound(false);
      setEmptySearchQuery(false);
    }
  };

  return (
    <div
      className="container w-100 textBoxParentContainer"
      style={{
        ...textBoxParentContainer,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderBottomLeftRadius: "5px",
        borderTopRightRadius: "5px",
        borderBottomRightRadius: "5px",
        paddingTop: "8px",
        paddingBottom: "8px",
      }}
    >
      <Form onSubmit={handleSearchSubmit}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="w-100 ps-3 pt-2">
            <label
              htmlFor="keyword"
              style={{
                ...labelStyle,
                marginBottom: "5px",
                fontSize: "18px",
              }}
            >
              Keyword
            </label>
            <Form.Control
              type="text"
              placeholder="Type your keyword here..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                ...inputStyle,
                marginBottom: "5px",
                padding: "5px 0",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              ...buttonStyle,
              background: "#6C67E1",
              height: "58px",
              alignSelf: "center",
              padding: "5px 15px",
              marginLeft: "10px",
              whiteSpace: "nowrap",
              fontSize: "18px",
            }}
          >
            Search Mockup
          </button>
        </div>
      </Form>
      {emptySearchQuery && (
        <div style={{ marginTop: "10px", color: "red" }}>
          Please enter a keyword.
        </div>
      )}
      {searchQuery && noMockupsFound && (
        <div style={{ marginTop: "10px", color: "red" }}>
          No mockups found for the entered keyword.
        </div>
      )}
    </div>
  );
};

const textBoxParentContainer = {
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px;",
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
export default SearchMockup;
