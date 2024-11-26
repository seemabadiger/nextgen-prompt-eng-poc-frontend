import { CloudUpload, Link, Delete, Save } from "@mui/icons-material";
import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import "./Dashboard.css";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const ProcessUploadModal = ({ show, handleClose, onUpload }) => {
  const { user } = useContext(AuthContext);
  const [selectedPage, setSelectedPage] = useState("Process Diagram & Artifacts");
  const [selectedOption, setSelectedOption] = useState(1);
  const [uploadItems, setUploadItems] = useState({});
  const [isEditable, setIsEditable] = useState({});
  const [currentValue, setCurrentValue] = useState({});
  const [processes, setProcesses] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [filteredDeliverables, setFilteredDeliverables] = useState([]);

  // Options and Elements data
  const pages = [
    "Visual Samples",
    "Case Studies",
    "Process Diagram & Artifacts",
    "Before After",
  ];

  // Fetch processes and deliverables data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [processRes, deliverablesRes, diagramsRes] = await Promise.all([
          axios.get("https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/processtypes"),
          axios.get("https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/deliverables"),
          axios.get("https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/getprocessdiagrams")
        ]);

        const processesData = processRes.data; // Array of processes
        const deliverablesData = deliverablesRes.data; // Array of deliverables
        const diagramsData = diagramsRes.data;

        setProcesses(processesData); // Assuming the API returns an array of strings
        setDeliverables(deliverablesData); // Assuming the API returns an array of strings

        // Set default process and deliverables
        if (processesData.length > 0) {
          const defaultProcessId = processesData[0].id; // First process as default
          // setSelectedProcessId(defaultProcessId);

          const defaultDeliverables = deliverablesData.filter(
            (deliverable) => deliverable.processTypeId === defaultProcessId
          );

          setFilteredDeliverables(defaultDeliverables);


          const defaultValues = {};
          defaultDeliverables.forEach((deliverable) => {
            // Find corresponding deliverable in process diagrams
            const diagram = diagramsData.find(
              (diagram) => diagram.processId === defaultProcessId
            );
            const linkedDeliverable = diagram?.deliverables.find(
              (d) => d.deliverableId === deliverable.id
            );

            // Map link or file to the deliverable
            defaultValues[deliverable.deliverableName] = linkedDeliverable?.deliverableLink ||
              linkedDeliverable?.deliverableFileName ||
              ""; // Default empty if none
          });
          setCurrentValue(defaultValues);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on component mount

  // Filter deliverables based on selected process
  useEffect(() => {
    if (selectedOption) {
      const filtered = (deliverables || []).filter(
        (deliverable) => deliverable.processTypeId === parseInt(selectedOption)
      );
      setFilteredDeliverables(filtered);
    }
  }, [selectedOption, deliverables]);

  const uploadProcessDiagram = async (uploadItems, userId, processTypeId) => {
    try {
      for (const [deliverable, item] of Object.entries(uploadItems)) {
        // Prepare FormData for file uploads
        const formData = new FormData();
        formData.append("UserId", userId);
        formData.append("ProcessTypeId", processTypeId);

        if (item.type === "file") {
          formData.append("DeliverableFile", item.value); // File binary data
          formData.append("DeliverableLink", ""); // No link for file upload
        } else if (item.type === "link") {
          formData.append("DeliverableFile", ""); // No file for link upload
          formData.append("DeliverableLink", item.value); // Link value
        }

        // Find DeliverableId (you might need a mapping from deliverable name to ID)
        formData.append("DeliverableId", item.deliverableId);

        // Send the request to the API
        await axios.post(
          "https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/uploadprocessdiagram",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }


    } catch (error) {
      console.error("Error uploading process diagrams:", error);
      alert("Upload failed. Please try again.");
      throw error;
    }
  };

  const handleUpload = async () => {
    try {
      // Replace with the actual user ID and selected process ID
      const userId = user.id; // Replace with actual UserId
      const processTypeId = selectedOption; // The selected process ID

      // Call the upload function
      const updatedDeliverables = await uploadProcessDiagram(uploadItems, userId, processTypeId);
      // Update the deliverables state with the new data
      setDeliverables(updatedDeliverables);
      // Reload the deliverables once all uploads are done
      const deliverablesRes = await axios.get(
        "https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/deliverables"
      );
      const defaultDeliverables = deliverablesRes.data.filter(
        (deliverable) => deliverable.processTypeId === selectedOption
      );
      setFilteredDeliverables(defaultDeliverables);
      alert("Uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("An error occurred during upload.");
    }
  };

  const handleFileUpload = (key, id, event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
      setUploadItems((prev) => ({
        ...prev,
        [key]: { type: "file", value: file, deliverableId: id }, // Store only the file name
      }));
    }
    setIsEditable((prev) => ({ ...prev, [key]: false })); // Disable editing
    setCurrentValue((prev) => ({ ...prev, [key]: file.name })); // Set file name
  };

  const handleLinkEdit = (key) => {
    setIsEditable((prev) => ({ ...prev, [key]: true })); // Enable editing
  };

  const handleSaveLink = (key, id) => {
    setUploadItems((prev) => ({
      ...prev,
      [key]: { type: "link", value: currentValue[key], deliverableId: id },
    }));
    setIsEditable((prev) => ({ ...prev, [key]: false })); // Disable editing
  };

  const handleDelete = (key) => {
    setUploadItems((prev) => {
      const newItems = { ...prev };
      delete newItems[key];
      return newItems;
    });
    setCurrentValue((prev) => {
      const newValues = { ...prev };
      delete newValues[key];
      return newValues;
    });
    setIsEditable((prev) => {
      const newEditable = { ...prev };
      delete newEditable[key];
      return newEditable;
    });
  };

  return (
    <>
      {/* Main Modal for Upload Form */}
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="process-dig-upload-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Section 1: Page Selection */}
            <Form.Group>
              <Form.Label>
                <h5 className="modal-title-color">Select Section</h5>
              </Form.Label>
              <div className="d-flex gap-4">
                {pages.map((page) => (
                  <Form.Check
                    key={page}
                    type="radio"
                    label={page}
                    name="pageOptions"
                    value={page}
                    checked={selectedPage === page}
                    onChange={() => setSelectedPage(page)}
                  />
                ))}
              </div>
            </Form.Group>

            {/* Section 2: Process Selection */}
            <Form.Group className="mt-3">
              <Form.Label>
                <h5 className="modal-title-color">Select Process</h5>
              </Form.Label>
              <div className="d-flex gap-4">
                {processes.map((process) => (
                  <Form.Check
                    key={process.id}
                    type="radio"
                    label={process.processName}
                    name="processOptions"
                    value={process.id}
                    checked={selectedOption === process.id}
                    onChange={() => setSelectedOption(process.id)}
                  />
                ))}
              </div>
            </Form.Group>

            {/* Section 3: Upload Deliverables */}
            <div className="mt-3">
              <h5 className="modal-title-color my-3">Upload Deliverables</h5>
              {filteredDeliverables.map((deliverable) => (
                <Row key={deliverable.id} className="mb-6">
                  {/* Deliverable Label */}
                  <div className="d-flex gap-10">
                    <div className="col-md-4 col-sm-8">
                      <Col md={12}>
                        <strong>{deliverable.deliverableName}</strong>
                      </Col>

                      {/* Text Field */}
                      <Col md={12} className="d-flex mt-2">
                        <Form.Control
                          type="text"
                          value={currentValue[deliverable.deliverableName] || ""}
                          placeholder={
                            uploadItems[deliverable.deliverableName]
                              ? uploadItems[deliverable.deliverableName].value
                              : "No file or link uploaded"
                          }
                          disabled={!isEditable[deliverable.deliverableName]} // Disable text field in non-editable mode
                          onChange={(e) =>
                            setCurrentValue((prev) => ({
                              ...prev,
                              [deliverable.deliverableName]: e.target.value,
                            }))
                          }
                          className={`text-field ${isEditable[deliverable.deliverableName] ? "" : "deactivated"
                            }`}
                        />

                        {/* Save Link */}
                        {isEditable[deliverable.deliverableName] && (
                          <div
                            style={{ cursor: "pointer", color: "#28a745" }}
                            onClick={() => handleSaveLink(deliverable.deliverableName, deliverable.id)}
                          >
                            <Save style={{ fontSize: "1.8rem" }} />
                          </div>
                        )}

                        {/* Delete */}
                        {uploadItems[deliverable.deliverableName] && (
                          <div
                            style={{ cursor: "pointer", color: "#6c63ff" }}
                            onClick={() => handleDelete(deliverable.deliverableName)}
                          >
                            <Delete style={{ fontSize: "1.8rem" }} />
                          </div>
                        )}
                      </Col>
                    </div>
                    <div>
                      {/* Icons for File, Link, Save, and Delete */}
                      <Col md={12} className="d-flex gap-3 ">
                        {/* File Upload */}
                        <div>
                          <Form.Control
                            type="file"
                            id={`file-upload-${deliverable.id}`}
                            style={{ display: "none" }}
                            onChange={(e) => handleFileUpload(deliverable.deliverableName, deliverable.id, e)}
                          />
                          <label
                            htmlFor={`file-upload-${deliverable.id}`}
                            style={{ cursor: "pointer", color: "#6c757d" }}
                          >
                            <CloudUpload
                              className="upload-icon"
                              style={{ fontSize: "1.8rem" }}
                            />
                          </label>
                        </div>

                        {/* Link Upload */}
                        <div
                          style={{ cursor: "pointer", color: "#6c757d" }}
                          onClick={() => handleLinkEdit(deliverable.deliverableName)}
                        >
                          <Link style={{ fontSize: "1.8rem" }} />
                        </div>
                      </Col>
                    </div>
                  </div>
                  <Col md={6}>
                    <hr className="mt-4 mb-4" />
                  </Col>
                </Row>
              ))}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer id="process-modal-footer">
          <Button
            variant="secondary"
            style={{ backgroundColor: "transparent", color: "#6E6E6E" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#6C67E1", borderColor: "#6C67E1" }}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProcessUploadModal;
