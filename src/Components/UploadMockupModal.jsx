import { useState, useEffect, useRef,useContext } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import CloudUpload from "../assets/cloud-upload.svg";
import TimesIcon from '@mui/icons-material/Close'
import Editor from './Editor';
import { AuthContext } from '../Context/AuthContext';

const UploadMockupModal = ({ show, handleClose, onUpload }) => {
  const { user } = useContext(AuthContext);
  const [mockups, setMockups] = useState([]);
  const [fields, setFields] = useState({
    title: '',
    domain: '',
    subdomain: '',
    description: '',
    tags: []
  });
  const editorRef = useRef(null);
  const tagOptions = ['Mobile', 'Web', 'Desktop', 'Tablet'];

  // Fetch mockup data on component mount
  useEffect(() => {
    const fetchMockups = async () => {
      try {
        const response = await axios.get(`https://hxstudiofileupload.azurewebsites.net/api/FileUploadAPI/${user.id}/mockups`);
        //setMockups(response.data);
      } catch (error) {
        console.error('Error fetching mockups:', error);
      }
    };

    fetchMockups();
  }, []);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const newMockups = newFiles.map(file => ({
      file,
      title: '',
      domain:'',
      subdomain:'',
      tags: [] // Initialize as an empty array
    }));
    setMockups(newFiles);
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    setMockups(prevMockups => 
      prevMockups.map((mockup, i) => 
        i === index ? { ...mockup, [name]: value } : mockup
      )
    );
  };

  const handleTagChange = (index, tag) => {
    setFields((prevState) => ({ 
      ...prevState, 
      tags : fields.tags.includes(tag) ? fields.tags.filter(t => t !== tag) : [...fields.tags, tag]
    }));
  };

  const handleRemoveFile = (index) => {
    setMockups(prevMockups => prevMockups.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    if (e.target) {
       setFields((prevState) => ({ 
        ...prevState, 
        [e.target.name]: e.target.value 
      }));
    } else {
      setFields((prevState) => ({ 
        ...prevState, 
        description : editorRef.current.root.innerHTML 
      }));
    }
  };

  const handleUpload = async () => {
    if (mockups.length === 0) {
      alert('Please add at least one file.');
      return;
    }

    try {
      const uploadPromises = mockups.map(mockup => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              ...mockup,
              image: e.target.result,
              fileName: mockup.filename
            });
          };
          reader.readAsDataURL(mockup);
        });

      });

      const newMockups = await Promise.all(uploadPromises);
      const formData = new FormData();
      mockups.forEach((mockup, index) => {
        formData.append('MockupFiles', mockup);
      });
        formData.append('ProjectTitle', fields.title);
      formData.append('DomainName', fields.domain );
      formData.append('SubdomainName', fields.subdomain);
      formData.append(`ImageGroupId`, '');
      formData.append('ProjectDescription',fields.description);
        fields.tags.forEach((tag) => {
          formData.append(`Tags`, tag);
        });

      await axios.post(`https://hxstudiofileupload.azurewebsites.net/api/FileUploadAPI/upload?userId=${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Files uploaded sucessfully.');
     onUpload(newMockups);
      handleClose();
     setMockups([]);
    // window.location.reload();

    } catch (error) {
    console.error('Error uploading files:', error);
     // alert('An error occurred while uploading the files.');
    }
    handleClose();
  };

  const handleTagRemove = (index) => {
    setFields((prevState) => ({ 
      ...prevState, 
      tags : prevState.tags.filter((t, i) => i !== index) 
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      const newTag = e.target.value.trim();
      setFields((prevState) => ({ 
        ...prevState, 
        tags : [...prevState.tags, newTag] 
      }));
      e.target.value = '';
    }
  };
  useEffect(() => {
    if (show) {
      setFields({
        title: '',
        domain: '',
        subdomain: '',
        description: '',
        tags: []
      });
      setMockups([]);
    }
  }, [show]);
  

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Mock-up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label className="project-title-label" style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>PROJECT TITLE</Form.Label>
          <Form.Control
            type="text"
            name='title'
            className="project-title-input"
            placeholder="Enter project title"
            style={{ height: '50px' }}
            value={fields.title}
            onChange={handleChange}
          />
        </Form.Group>
        <div className="d-flex justify-content-between">
          <Form.Group className="mb-3 me-2 flex-grow-1">
            <Form.Label style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>DOMAIN</Form.Label>
            <Form.Control
              as="select"
              name='domain'
              value={fields.domain}
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="Enter Subdomain"
              style={{ height: '50px' }}
            />
          </Form.Group>
        </div>
        <Form.Group className="mb-3">
          <Form.Label style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>DESCRIPTION</Form.Label>
            <Editor
              ref={editorRef}
              onTextChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ fontSize: '1.2rem', color: '#6E6E6E', fontWeight: 'bold' }}>Attach files</Form.Label>
          <div
            onClick={() => document.getElementById('file-input').click()}
            onDrop={handleFileChange}
            onDragOver={(e) => e.preventDefault()}
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
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6E6E6E', marginBottom: 1 }}>Upload Files</p>
                <p style={{ fontSize: '0.875rem', color: '#6E6E6E', marginBottom: 1 }}>PDF, DOC, PPT, JPG, PNG</p>
              </div>
              <Form.Control id="file-input" type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
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
        <ListGroup>
          {mockups.map((mockup, index) => (
            <ListGroup.Item key={index} className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>{mockup.file ? mockup.file.name : mockup.name}</strong>
                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFile(index)}>Remove</Button>
              </div>
              <Form.Group>
                <Form.Label style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>Tags</Form.Label>
                <div>
                  {tagOptions.map((tag) => (
                    <Form.Check
                      inline
                      type="checkbox"
                      label={tag}
                      id={`tag-${index}-${tag}`}
                      checked={fields.tags ? fields.tags.includes(tag) : false}
                      onChange={() => handleTagChange(index, tag)}
                      key={tag}
                    />
                  ))}
                </div>
              </Form.Group>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" style={{ backgroundColor: 'transparent', color: '#6E6E6E' }} onClick={handleClose}>Close</Button>
        <Button style={{ backgroundColor: '#6C67E1', borderColor: '#6C67E1' }} onClick={handleUpload}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadMockupModal;