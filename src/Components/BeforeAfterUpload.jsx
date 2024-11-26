import { CloudUpload, Link, Delete, Save } from "@mui/icons-material";
import React, { useState } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import "./Dashboard.css";

const BeforeAfterUpload = ({ show, handleClose, onUpload }) => {
  const [selectedPage, setSelectedPage] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [uploadItems, setUploadItems] = useState({});
  const [isEditable, setIsEditable] = useState({});
  const [currentValue, setCurrentValue] = useState({});

  // Options and Elements data
  const pages = [
    "Visual Samples",
    "Case Studies",
    "Process Diagram & Artifacts",
    "Before After",
  ];
  const processes = ["Discover", "Define", "Design", "Develop"];
  const deliverables = [
    "Empathy Mapping",
    "Journey Mapping",
    "Task Flow",
    "Personas",
    "Scenarios",
    "Heuristic Evaluation",
    "Competitor Analysis",
  ];

  const handleUpload = () => {
    // Simulate API call
    console.log("Uploading:", uploadItems);
    alert("Uploaded successfully!");
  };

  const handleFileUpload = (key, event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
      setUploadItems((prev) => ({
        ...prev,
        [key]: { type: "file", value: file.name }, // Store only the file name
      }));
    }
    setIsEditable((prev) => ({ ...prev, [key]: false })); // Disable editing
    setCurrentValue((prev) => ({ ...prev, [key]: file.name })); // Set file name
  };

  const handleLinkEdit = (key) => {
    setIsEditable((prev) => ({ ...prev, [key]: true })); // Enable editing
  };

  const handleSaveLink = (key) => {
    setUploadItems((prev) => ({
      ...prev,
      [key]: { type: "link", value: currentValue[key] },
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
                    key={process}
                    type="radio"
                    label={process}
                    name="processOptions"
                    value={process}
                    checked={selectedOption === process}
                    onChange={() => setSelectedOption(process)}
                  />
                ))}
              </div>
            </Form.Group>

            {/* Section 3: Upload Deliverables */}
            <div className="mt-3">
              <h5 className="modal-title-color my-3">Upload Deliverables</h5>
              {deliverables.map((deliverable) => (
                <Row key={deliverable} className="mb-6">
                  {/* Deliverable Label */}
                  <div className="d-flex gap-10">
                    <div className="col-md-4 col-sm-8">
                      <Col md={12}>
                        <strong>{deliverable}</strong>
                      </Col>

                      {/* Text Field */}
                      <Col md={12} className="d-flex mt-2">
                        <Form.Control
                          type="text"
                          value={currentValue[deliverable] || ""}
                          placeholder={
                            uploadItems[deliverable]
                              ? uploadItems[deliverable].value
                              : "No file or link uploaded"
                          }
                          disabled={!isEditable[deliverable]} // Disable text field in non-editable mode
                          onChange={(e) =>
                            setCurrentValue((prev) => ({
                              ...prev,
                              [deliverable]: e.target.value,
                            }))
                          }
                          className={`text-field ${
                            isEditable[deliverable] ? "" : "deactivated"
                          }`}
                        />

                        {/* Save Link */}
                        {isEditable[deliverable] && (
                          <div
                            style={{ cursor: "pointer", color: "#28a745" }}
                            onClick={() => handleSaveLink(deliverable)}
                          >
                            <Save style={{ fontSize: "1.8rem" }} />
                          </div>
                        )}

                        {/* Delete */}
                        {uploadItems[deliverable] && (
                          <div
                            style={{ cursor: "pointer", color: "#6c63ff" }}
                            onClick={() => handleDelete(deliverable)}
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
                            id={`file-upload-${deliverable}`}
                            style={{ display: "none" }}
                            onChange={(e) => handleFileUpload(deliverable, e)}
                          />
                          <label
                            htmlFor={`file-upload-${deliverable}`}
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
                          onClick={() => handleLinkEdit(deliverable)}
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

export default BeforeAfterUpload;
