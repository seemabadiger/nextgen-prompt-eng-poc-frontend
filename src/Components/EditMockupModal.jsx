import { useState, useEffect, useRef, useContext } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import CloudUpload from "../assets/cloud-upload.svg";
import TimesIcon from '@mui/icons-material/Close';
import Editor from './Editor';
import { AuthContext } from '../Context/AuthContext';

const EditMockupModal = ({ show, handleClose, onUpdate, mockup, mockupId }) => {
  const { user } = useContext(AuthContext);
  const [fields, setFields] = useState({
    mockuptype: mockup.mockuptype || '',
    title: mockup.title || '',
    domain: mockup.domain || '',
    subdomain: mockup.subdomain || '',
    description: mockup.description || '',
  });
  const [tags, setTags] = useState(mockup.tags || {});
  const [files, setFiles] = useState(mockup.files || []);
  const editorRef = useRef(null);
  const tagOptions = ['Mobile', 'Web', 'Desktop', 'Tablet'];

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const newMockups = newFiles.map(file => ({
      file,
      title: '',
      domain: '',
      subdomain: '',
      tags: [] // Initialize as an empty array
    }));
    setFiles([...files, ...newMockups]);
    setTags(newFiles.reduce((acc, file, index) => {
      acc[index] = [];
      return acc;
    }, {}));
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleTagChange = (index, tag) => {
    setTags((prevState) => ({
      ...prevState,
      [index]: prevState[index].includes(tag) ? prevState[index].filter(t => t !== tag) : [...prevState[index], tag]
    }));
  };

  const handleTagRemove = (fileIndex, tagIndex) => {
    setTags((prevState) => {
      const newTags = { ...prevState };
      newTags[fileIndex] = newTags[fileIndex].filter((_, i) => i !== tagIndex);
      return newTags;
    });
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
        description: editorRef.current.root.innerHTML
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      console.log('imgggid', mockup);
      formData.append('ImageGroupId', mockup.imageGroupId || ''); // Set this value as needed
      formData.append('ProjectTitle', fields.title);
      formData.append('ProjectDescription', fields.description);
      formData.append('DomainName', fields.domain);
      formData.append('SubdomainName', fields.subdomain);
      formData.append('MockupType', fields.mockuptype);

      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file.file);
        formData.append(`files[${index}][title]`, file.title);
        formData.append(`files[${index}][domain]`, file.domain);
        formData.append(`files[${index}][subdomain]`, file.subdomain);
        formData.append(`files[${index}][tags]`, JSON.stringify(tags[index] || []));
      });

      await axios.put(`https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/update/${mockupId}?userId=${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Mockup updated successfully.');
      onUpdate(fields);
      handleClose();
    } catch (error) {
      console.error('Error updating mockup:', error);
      alert('An error occurred while updating the mockup.');
    }
  };

  useEffect(() => {
    if (show) {
      setFields({
        mockuptype: mockup.mockuptype || '',
        title: mockup.title || '',
        domain: mockup.domain || '',
        subdomain: mockup.subdomain || '',
        description: mockup.description || '',
      });
      setTags(mockup.tags || {});
      setFiles(mockup.files || []);
    }
  }, [show, mockup]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Mock-up</Modal.Title>
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
              onChange={handleChange}
              className="me-3"
            />
            <Form.Check
              type="radio"
              id="case-studies"
              label="Case Studies"
              name="mockuptype"
              value="Case Studies"
              checked={fields.mockuptype === 'Case Studies'}
              onChange={handleChange}
              className="me-3"
            />
            <Form.Check
              type="radio"
              id="process-diagram"
              label="Process Diagram & Artifacts"
              name="mockuptype"
              value="Process Diagram & Artifacts"
              checked={fields.mockuptype === 'Process Diagram & Artifacts'}
              onChange={handleChange}
              className="me-3"
            />
            <Form.Check
              type="radio"
              id="before-after"
              label="Before After"
              name="mockuptype"
              value="Before After"
              checked={fields.mockuptype === 'Before After'}
              onChange={handleChange}
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
              value={fields.subdomain}
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
            initialContent={fields.description}
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
        <ListGroup>
          {files.map((file, index) => (
            <ListGroup.Item key={index} className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>{file.file ? file.file.name : file.name}</strong>
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
                      checked={tags[index] ? tags[index].includes(tag) : false}
                      onChange={() => handleTagChange(index, tag)}
                      key={tag}
                    />
                  ))}
                </div>
                <div className="tags-input-container" style={{ display: 'flex', padding: '0.8rem 0.5rem', gap: 4, border: '1px solid #C2C2C2', borderRadius: '16px', flexWrap: 'wrap' }}>
                  {tags[index]?.map((tag, tagIndex) => (
                    <div key={tagIndex} className="tag-item" style={{ display: 'flex', padding: '0.5rem 0.825rem', backgroundColor: '#F5F5F5', borderRadius: '16px', alignItems: 'center', justifyContent: 'center' }}>
                      <span className='tags' style={{ marginRight: 3, marginTop: '-2px' }}>{tag}</span>
                      <div className='close' style={{ background: '#C2C2C2 0% 0% no-repeat padding-box', borderRadius: '50%', display: 'flex', height: '20px', width: '20px', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                        <TimesIcon fontSize='0.5em' style={{ color: '#fff' }} onClick={() => handleTagRemove(index, tagIndex)} className="tag-remove" />
                      </div>
                    </div>
                  ))}
                  <Form.Control
                    type="text"
                    name='tags'
                    placeholder="Add Tags"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim() !== '') {
                        const newTag = e.target.value.trim();
                        setTags((prevState) => ({
                          ...prevState,
                          [index]: [...(prevState[index] || []), newTag]
                        }));
                        e.target.value = '';
                      }
                    }}
                    style={{ border: 'none', outline: 'none', flex: 1, boxShadow: 'none' }}
                  />
                </div>
              </Form.Group>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" style={{ backgroundColor: 'transparent', color: '#6E6E6E' }} onClick={handleClose}>Close</Button>
        <Button style={{ backgroundColor: '#6C67E1', borderColor: '#6C67E1' }} onClick={handleUpdate}>Update</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditMockupModal;