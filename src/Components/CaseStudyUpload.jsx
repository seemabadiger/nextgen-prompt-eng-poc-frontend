import { useState, useEffect, useRef, useContext } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import CloudUpload from "../assets/cloud-upload.svg";
import TimesIcon from '@mui/icons-material/Close'
import { AuthContext } from '../Context/AuthContext';

const CaseStudyUpload = ({ show, handleClose, onUpload }) => {
  const { user } = useContext(AuthContext);
  const [mockups, setMockups] = useState([]);
  const [fields, setFields] = useState({
    mockuptype: '',
    title: '',
    domain: '',
    subdomain: '',
    caseStudyFile: null,
    thumbnailImage: null,
    tags: []
  });
  const tagOptions = ['Mobile', 'Web', 'Desktop', 'Tablet'];
  const [loading, setLoading] = useState(false);

  // Fetch mockup data on component mount
  useEffect(() => {
    const fetchMockups = async () => {
    //   try {
    //     const response = await axios.get(`https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/${user.id}/mockups`);
    //     //setMockups(response.data);
    //   } catch (error) {
    //     console.error('Error fetching mockups:', error);
    //   }
    };

    fetchMockups();
  }, []);

//   const handleFileChange = (e, fieldName) => {
//     setFields((prevState) => ({
//       ...prevState,
//       [fieldName]: e.target.files[0]
//     }));
//   };

const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFields({ ...fields, [name]: files[0] });
  };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFields((prevState) => ({
//       ...prevState,
//       [name]: value
//     }));
//   };
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };

  const handleTagChange = (tag) => {
    setFields((prevState) => ({
      ...prevState,
      tags: prevState.tags.includes(tag) ? prevState.tags.filter(t => t !== tag) : [...prevState.tags, tag]
    }));
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('MockupType', fields.mockuptype);
      formData.append('ProjectTitle', fields.title);
      formData.append('DomainName', fields.domain);
      formData.append('SubdomainName', fields.subdomain);
      formData.append('CaseStudyFile', fields.caseStudyFile);
      formData.append('ThumbnailImage', fields.thumbnailImage);
      fields.tags.forEach((tag) => {
        formData.append(`Tags`, tag);
      });
  
      await axios.post(`https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/upload?userId=${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Files uploaded successfully.');
      onUpload();
      handleClose();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('mockuptype', fields.mockuptype);
    formData.append('title', fields.title);
    formData.append('domain', fields.domain);
    formData.append('subdomain', fields.subdomain);
    formData.append('caseStudyFile', fields.caseStudyFile);
    formData.append('thumbnailImage', fields.thumbnailImage);
    formData.append('tags', JSON.stringify(fields.tags));

    try {
      const response = await axios.post(
        'https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/uploadcasestudy',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      onUpload(response.data); // Callback for success
      alert('Upload successful!');
    } catch (error) {
      console.error('Error uploading case study:', error);
      alert('Failed to upload the case study.');
    } finally {
      setLoading(false);
    }
  };


  const handleTagRemove = (index) => {
    setFields((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((t, i) => i !== index)
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      const newTag = e.target.value.trim();
      setFields((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, newTag]
      }));
      e.target.value = '';
    }
  };

  useEffect(() => {
    if (show) {
      setFields({
        mockuptype: '',
        title: '',
        domain: '',
        subdomain: '',
        caseStudyFile: null,
        thumbnailImage: null,
        tags: []
      });
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Upload</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-4">
          <Form.Label style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>
            SELECT SECTION
          </Form.Label>
          <div className="d-flex gap-4">
            <Form.Check
              type="radio"
              id="visual-samples"
              label="Visual Samples"
              name="mockuptype"
              value="Visual Samples"
              checked={fields.mockuptype === 'Visual Samples'}
              onChange={handleInputChange}
              className="me-3"
            />
            <Form.Check
              type="radio"
              id="case-studies"
              label="Case Studies"
              name="mockuptype"
              value="Case Studies"
              checked={fields.mockuptype === 'Case Studies'}
              onChange={handleInputChange}
              className="me-3"
            />
            <Form.Check
              type="radio"
              id="process-diagram"
              label="Process Diagram & Artifacts"
              name="mockuptype"
              value="Process Diagram & Artifacts"
              checked={fields.mockuptype === 'Process Diagram & Artifacts'}
              onChange={handleInputChange}
              className="me-3"
            />
            <Form.Check
              type="radio"
              id="before-after"
              label="Before After"
              name="mockuptype"
              value="Before After"
              checked={fields.mockuptype === 'Before After'}
              onChange={handleInputChange}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="project-title-label" style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>PROJECT TITLE</Form.Label>
          <Form.Control
            type="text"
            name='title'
            className="project-title-input"
            placeholder="Enter project title"
            style={{ height: '50px' }}
            value={fields.title}
            onChange={handleInputChange}
          />
        </Form.Group>
        <div className="d-flex justify-content-between">
          <Form.Group className="mb-3 me-2 flex-grow-1">
            <Form.Label style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>DOMAIN</Form.Label>
            <Form.Control
              as="select"
              name='domain'
              value={fields.domain}
              onChange={handleInputChange}
              className="domain-select"
              style={{ height: '50px' }}
            >
              <option value="">Select Domain</option>
              <option value="Mobile">Mobile</option>
              <option value="Moodle">Moodle</option>
              <option value="WordPress">WordPress</option>
              <option value="Analytics">Analytics</option>
              <option value="HRTech">HRTech</option>
              <option value="EdTech">EdTech</option>
              <option value="HealthTech">HealthTech</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3 ms-2 flex-grow-1">
            <Form.Label style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>SUBDOMAIN</Form.Label>
            <Form.Control
              type="text"
              name='subdomain'
              onChange={handleInputChange}
              placeholder="Enter Subdomain"
              style={{ height: '50px' }}
            />
          </Form.Group>
        </div>
        <Form.Group className="mb-3">
          <Form.Label style={{ fontSize: '1.2rem', color: '#6E6E6E', fontWeight: 'bold' }}>Upload Case Study File</Form.Label>
          <div className="upload-container" style={{
            border: '2px dashed #C2C2C2',
            borderRadius: '5px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            <input
              id="case-study-file-input"
              type="file"
              onChange={(e) => handleFileChange(e, 'caseStudyFile')}
              style={{ display: 'none' }}
            />
            <label htmlFor="case-study-file-input" className="upload-label" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8
            }}>
              <img src={CloudUpload} alt='' />
              <div>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6E6E6E', marginBottom: 1 }}>Upload Case Study File</p>
                <p style={{ fontSize: '0.875rem', color: '#6E6E6E', marginBottom: 1 }}>PDF, DOC, PPT</p>
              </div>
            </label>
          </div>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ fontSize: '1.2rem', color: '#6E6E6E', fontWeight: 'bold' }}>Upload Thumbnail Image</Form.Label>
          <div
            onClick={() => document.getElementById('thumbnail-image-input').click()}
            style={{
              border: '2px dashed #C2C2C2',
              borderRadius: '5px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, alignItems: 'center' }}>
              <div style={{ textAlign: 'left' }}>
                <img src={CloudUpload} alt='' />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6E6E6E', marginBottom: 1 }}>Upload Thumbnail Image</p>
                <p style={{ fontSize: '0.875rem', color: '#6E6E6E', marginBottom: 1 }}>JPG, PNG</p>
              </div>
              <Form.Control id="thumbnail-image-input" type="file" onChange={(e) => handleFileChange(e, 'thumbnailImage')} style={{ display: 'none' }} />
            </div>
          </div>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>TAG</Form.Label>
          <div className="tags-input-container" style={{ display: 'flex', padding: '0.8rem 0.5rem', gap: 4, border: '1px solid #C2C2C2', borderRadius: '16px', flexWrap: 'wrap' }}>
            {fields.tags?.map((tag, index) => (
              <div key={index} className="tag-item" style={{ display: 'flex', padding: '0.5rem 0.825rem', backgroundColor: '#F5F5F5', borderRadius: '16px', alignItems: 'center', justifyContent: 'center' }}>
                <span className='tags' style={{ marginRight: 3, marginTop: '-2px' }}>{tag}</span>
                <div className='close' style={{ background: '#C2C2C2 0% 0% no-repeat padding-box', borderRadius: '50%', display: 'flex', height: '20px', width: '20px', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                  <TimesIcon fontSize='0.5em' style={{ color: '#fff' }} onClick={() => handleTagRemove(index)} className="tag-remove" />
                </div>
              </div>
            ))}
            <Form.Control
              type="text"
              name='tags'
              placeholder="Add Tags"
              onKeyDown={(e) => handleTagInputKeyDown(e)}
              style={{ border: 'none', outline: 'none', flex: 1, boxShadow: 'none' }}
            />
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" style={{ backgroundColor: 'transparent', color: '#6E6E6E' }} onClick={handleClose}>Close</Button>
        <Button style={{ backgroundColor: '#6C67E1', borderColor: '#6C67E1' }} onClick={handleUpload}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CaseStudyUpload;