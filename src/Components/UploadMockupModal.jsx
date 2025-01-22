/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useContext } from 'react';
import { Modal, Button, Form, ListGroup, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import CloudUpload from "../assets/cloud-upload.svg";
import TimesIcon from '@mui/icons-material/Close';
import Editor from './Editor';
import { AuthContext } from '../Context/AuthContext';

const process = [
  'Discover',
  'Define',
  'Design',
  'Develop'
];

const sections = [
  'Visual Samples',
  'Case Studies',
  'Process Diagram & Artifacts',
  'Before After'
];

const UploadMockupModal = ({ show, handleClose, onUpload, selectedTab }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    mockuptype: selectedTab || 'Visual Samples',
    title: '',
    domain: '',
    subdomain: '',
    description: '',
    mockups: [],
    tags: [],
    caseStudyFiles: [],
    thumbnailImages: [],
    beforeFile: [],
    afterFile: []
  });
  const editorRef = useRef(null);
  const tagOptions = ['Mobile', 'Web', 'Desktop', 'Tablet'];
  const validationSchema = Yup.object().shape({
    mockuptype: Yup.string()
      .required('Required'),
    title: Yup.string()
      .required('Required'),
    domain: Yup.string()
      .required('Required'),
    subdomain: Yup.string()
      .required('Required'),
    description: Yup.string()
      .required('Required'),
  });

  const handleFileChange = (e, values, type, setFieldValue) => {
    const mockups = values[type];
    const newFiles = Array.from(e.target.files);
    const newMockups = newFiles.map(file => ({
      file,
      title: '',
      domain: '',
      subdomain: '',
      tags: []
    }));
    setFieldValue(type, [...mockups, ...newMockups ])
  };

  const handleTagChange = (index, tag, values, type, setFieldValue) => {
    const mockups = values[type];
    mockups[index].tags = mockups[index].tags.includes(tag) ? mockups[index].filter(t => t !== tag) : [...mockups[index].tags, tag]
    setFieldValue(type, mockups)
  };

  const handleTagRemove = (fileIndex, tagIndex, values, type, setFieldValue) => {
    const mockups = values[type];
    mockups[fileIndex].tags.splice(tagIndex, 1);
    setFieldValue(type, mockups)
  };

  const handleUpload = async (values) => {
    if (values.mockups.length === 0) {
      toast('Please add at least one file.')
      return;
    }
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append('ImageGroupId', ''); // Set this value as needed
      formData.append('ProjectTitle', values.title);
      formData.append('ProjectDescription', values.description);
      formData.append('DomainName', values.domain);
      formData.append('SubdomainName', values.subdomain);
      formData.append('MockupType', values.mockuptype);
      if (values.mockuptype === 'Visual Samples') {
        values.mockups.forEach((mockup, index) => {
          formData.append('MockupFiles', mockup.file);
          formData.append(`Mockups[${index}].MockupFile`, mockup.file);
          formData.append(`Mockups[${index}].Tags`, mockup.tags ? mockup.tags.join(',') : '');
          formData.append(`Mockups[${index}].FileName`, mockup.file.name);
          formData.append(`Mockups[${index}].FilePath`, 'asdfghjkl'); // Add logic to set file path if needed
          formData.append(`Mockups[${index}].MockupGroupId`, 0); // Set this value as needed
          formData.append(`Mockups[${index}].Id`, 0); // Set this value as needed
        });
      }
      if (values.mockuptype === 'Case Studies') {
      values.caseStudyFiles.forEach((mockup, index) => {
        formData.append('MockupFiles', mockup.file);
        formData.append(`Mockups[${index}].MockupFile`, mockup.file);
        formData.append(`Mockups[${index}].Tags`, mockup.tags ? mockup.tags.join(',') : '');
        formData.append(`Mockups[${index}].FileName`, mockup.file.name);
        formData.append(`Mockups[${index}].FilePath`, 'asdfghjkl'); // Add logic to set file path if needed
        formData.append(`Mockups[${index}].MockupGroupId`, 0); // Set this value as needed
        formData.append(`Mockups[${index}].Id`, 0); // Set this value as needed
      });
      values.thumbnailImages.forEach((mockup, index) => {
        formData.append('MockupFiles', mockup.file);
        formData.append(`Mockups[${index}].MockupFile`, mockup.file);
        formData.append(`Mockups[${index}].Tags`, mockup.tags ? mockup.tags.join(',') : '');
        formData.append(`Mockups[${index}].FileName`, mockup.file.name);
        formData.append(`Mockups[${index}].FilePath`, 'asdfghjkl'); // Add logic to set file path if needed
        formData.append(`Mockups[${index}].MockupGroupId`, 0); // Set this value as needed
        formData.append(`Mockups[${index}].Id`, 0); // Set this value as needed
      });
    }
    if (values.mockuptype === 'Before After') {
      values.beforeFile.forEach((mockup, index) => {
        formData.append('MockupFiles', mockup.file);
        formData.append(`Mockups[${index}].MockupFile`, mockup.file);
        formData.append(`Mockups[${index}].Tags`, mockup.tags ? mockup.tags.join(',') : '');
        formData.append(`Mockups[${index}].FileName`, mockup.file.name);
        formData.append(`Mockups[${index}].FilePath`, 'asdfghjkl'); // Add logic to set file path if needed
        formData.append(`Mockups[${index}].MockupGroupId`, 0); // Set this value as needed
        formData.append(`Mockups[${index}].Id`, 0); // Set this value as needed
      });
      values.afterFile.forEach((mockup, index) => {
        formData.append('MockupFiles', mockup.file);
        formData.append(`Mockups[${index}].MockupFile`, mockup.file);
        formData.append(`Mockups[${index}].Tags`, mockup.tags ? mockup.tags.join(',') : '');
        formData.append(`Mockups[${index}].FileName`, mockup.file.name);
        formData.append(`Mockups[${index}].FilePath`, 'asdfghjkl'); // Add logic to set file path if needed
        formData.append(`Mockups[${index}].MockupGroupId`, 0); // Set this value as needed
        formData.append(`Mockups[${index}].Id`, 0); // Set this value as needed
      });
    }

      await axios.post(`https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/upload?userId=${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast('Files uploaded successfully.')
      onUpload(values.mockups);
      handleClose();
      setLoading(false)
    } catch (error) {
      console.error('Error uploading files:', error);
      toast('An error occurred while uploading the files.')
    }
    setLoading(false)
    handleClose();
  };

  const handleRemoveFile = (index, values, type, setFieldValue) => {
    const formData = values[type]
    formData.splice(index, 1)
    setFieldValue(type, formData)
  }

  useEffect(() => {
    if (show) {
      setFields({
        mockuptype: 'Visual Samples',
        title: '',
        domain: '',
        subdomain: '',
        description: '',
        mockups: []
      });
    }
  }, [show]);

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Formik
        initialValues={fields}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleUpload(values)
        }}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          setFieldValue
        }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Add New Mock-up</Modal.Title>
              </Modal.Header>
              <Modal.Body  style={{ maxHeight: "500px", overflowY: "auto" }}>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>
                    SELECT SECTION<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                  </Form.Label>
                  <div className="d-flex gap-4">
                    {sections.map((sec, index) => (
                      <Form.Check
                        key={index}
                        type="radio"
                        id={sec}
                        label={sec}
                        name="mockuptype"
                        value={sec}
                        checked={values.mockuptype === sec}
                        onChange={() => {
                          if (values.mockuptype !== sec) {
                            setFieldValue('caseStudyFiles', [])
                            setFieldValue('thumbnailImages', [])
                            setFieldValue('process', [])
                            setFieldValue('mockups', [])
                          }
                          setFieldValue('mockuptype', sec)
                        }}
                        className="me-3"
                    />
                    ))}
                  </div>
                  {errors.mockuptype && touched.mockuptype ? (
                    <div className='error'>{errors.mockuptype}</div>
                  ) : null}
                </Form.Group>
                {values.mockuptype === 'Process Diagram & Artifacts' && (
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>
                      SELECT PROCESS<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                    </Form.Label>
                    <div className="d-flex gap-4">
                      {process.map((sec, index) => (
                        <Form.Check
                          key={index}
                          type="radio"
                          id={sec}
                          label={sec}
                          name="process"
                          value={sec}
                          checked={values.process === sec}
                          onChange={() => setFieldValue('process', sec)}
                          className="me-3"
                      />
                      ))}
                    </div>
                    {errors.process && touched.process ? (
                      <div className='error'>{errors.process}</div>
                    ) : null}
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label className="project-title-label" style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>PROJECT TITLE<span style={{ color: 'red', marginLeft: '4px' }}>*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name='title'
                    className="project-title-input"
                    placeholder="Enter project title"
                    style={{ height: '50px' }}
                    value={values.title}
                    onChange={(e) => setFieldValue('title', e.target.value)}
                  />
                  {errors.title && touched.title ? (
                    <div className='error'>{errors.title}</div>
                  ) : null}
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <Form.Group className="mb-3 me-2 flex-grow-1">
                    <Form.Label style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>DOMAIN<span style={{ color: 'red', marginLeft: '4px' }}>*</span></Form.Label>
                    <Form.Control
                      as="select"
                      name='domain'
                      value={values.domain}
                      onChange={(e) => setFieldValue('domain', e.target.value)}
                      className="domain-select"
                      style={{ height: '50px' }}
                    >
                      <option value="">Select Domain</option>
                      {/* <option value="Mobile">Mobile</option> */}
                      {/* <option value="Moodle">Moodle</option> */}
                      {/* <option value="WordPress">WordPress</option> */}
                      {/* <option value="Analytics">Analytics</option> */}
                      <option value="HRTech">HR Tech</option>
                      <option value="EdTech">ED Tech</option>
                      <option value="HealthTech">Health Tech</option>
                      <option value="HealthTech">Others</option>
                    </Form.Control>
                    {errors.domain && touched.domain ? (
                    <div className='error'>{errors.domain}</div>
                  ) : null}
                  </Form.Group>
                  <Form.Group className="mb-3 ms-2 flex-grow-1">
                    <Form.Label style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>SUBDOMAIN<span style={{ color: 'red', marginLeft: '4px' }}>*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name='subdomain'
                      onChange={(e) => setFieldValue('subdomain', e.target.value)}
                      placeholder="Enter Subdomain"
                      style={{ height: '50px' }}
                    />
                    {errors.subdomain && touched.subdomain ? (
                    <div className='error'>{errors.subdomain}</div>
                  ) : null}
                  </Form.Group>
                </div>
                {['Visual Samples', 'Before After'].includes(values.mockuptype)}
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '0.875rem', color: '#6E6E6E', fontWeight: 'bold' }}>DESCRIPTION<span style={{ color: 'red', marginLeft: '4px' }}>*</span></Form.Label>
                  <Editor
                    ref={editorRef}
                    defaultValue={values.description}
                    onTextChange={() => setFieldValue('description', editorRef.current.root.innerHTML)}
                  />
                  {errors.description && touched.description ? (
                    <div className='error'>{errors.description}</div>
                  ) : null}
                </Form.Group>
                {values.mockuptype === 'Visual Samples' && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '1.2rem', color: '#6E6E6E', fontWeight: 'bold' }}>Attach files<span style={{ color: 'red', marginLeft: '4px' }}>*</span></Form.Label>
                      <div
                        onClick={() => document.getElementById('file-input').click()}
                        onDrop={(e) => handleFileChange(e, values, 'mockups', setFieldValue)}
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
                            <p style={{ fontSize: '0.875rem', color: '#6E6E6E', marginBottom: 1 }}>JPG, PNG</p>
                          </div>
                          <Form.Control id="file-input" type="file" multiple onChange={(e) => handleFileChange(e, values, 'mockups', setFieldValue)} style={{ display: 'none' }} />
                        </div>
                      </div>
                    </Form.Group>
                    <ListGroup>
                      {values.mockups.map((mockup, index) => (
                        <ListGroup.Item key={index} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>{mockup.file ? mockup.file.name : mockup.name}</strong>
                            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFile(index, values, 'mockups', setFieldValue)}>Remove</Button>
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
                                  checked={mockup.tags.includes(tag)}
                                  onChange={() => handleTagChange(index, tag, values, 'mockups', setFieldValue)}
                                  key={tag}
                                />
                              ))}
                            </div>
                            <div className="tags-input-container" style={{ display: 'flex', padding: '0.8rem 0.5rem', gap: 4, border: '1px solid #C2C2C2', borderRadius: '16px', flexWrap: 'wrap' }}>
                              {mockup.tags?.map((tag, tagIndex) => (
                                <div key={tagIndex} className="tag-item" style={{ display: 'flex', padding: '0.5rem 0.825rem', backgroundColor: '#F5F5F5', borderRadius: '16px', alignItems: 'center', justifyContent: 'center' }}>
                                  <span className='tags' style={{ marginRight: 3, marginTop: '-2px' }}>{tag}</span>
                                  <div className='close' style={{ background: '#C2C2C2 0% 0% no-repeat padding-box', borderRadius: '50%', display: 'flex', height: '20px', width: '20px', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                    <TimesIcon fontSize='0.5em' style={{ color: '#fff' }} onClick={() => handleTagRemove(index, tagIndex, values, 'mockups', setFieldValue)} className="tag-remove" />
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
                                    let mockuptag = mockup.tags;
                                    mockuptag = [...mockuptag, newTag];
                                    setFieldValue(`mockups[${index}].tags`, mockuptag);
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
                  </>
                )}
                {values.mockuptype === 'Case Studies' && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '1.2rem', color: '#6E6E6E', fontWeight: 'bold' }}>UPLOAD CASE STUDY FILE<span style={{ color: 'red', marginLeft: '4px' }}>*</span></Form.Label>
                      <div
                        onClick={() => document.getElementById('caseStudyFiles-file-input').click()}
                        onDrop={(e) => handleFileChange(e, values, 'caseStudyFiles', setFieldValue)}
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
                            <p style={{ fontSize: '0.875rem', color: '#6E6E6E', marginBottom: 1 }}>PDF, PPT</p>
                          </div>
                          <Form.Control id="caseStudyFiles-file-input" type="file" multiple onChange={(e) => handleFileChange(e, values, 'caseStudyFiles', setFieldValue)} style={{ display: 'none' }} />
                        </div>
                      </div>
                    </Form.Group>
                    {/* <ListGroup>
                      {values.caseStudyFiles.map((mockup, index) => (
                        <ListGroup.Item key={index} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>{mockup.file ? mockup.file.name : mockup.name}</strong>
                            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFile(index, values, 'caseStudyFiles', setFieldValue)}>Remove</Button>
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
                                  checked={mockup.tags.includes(tag)}
                                  onChange={() => handleTagChange(index, tag, values, 'caseStudyFiles', setFieldValue)}
                                  key={tag}
                                />
                              ))}
                            </div>
                            <div className="tags-input-container" style={{ display: 'flex', padding: '0.8rem 0.5rem', gap: 4, border: '1px solid #C2C2C2', borderRadius: '16px', flexWrap: 'wrap' }}>
                              {mockup.tags?.map((tag, tagIndex) => (
                                <div key={tagIndex} className="tag-item" style={{ display: 'flex', padding: '0.5rem 0.825rem', backgroundColor: '#F5F5F5', borderRadius: '16px', alignItems: 'center', justifyContent: 'center' }}>
                                  <span className='tags' style={{ marginRight: 3, marginTop: '-2px' }}>{tag}</span>
                                  <div className='close' style={{ background: '#C2C2C2 0% 0% no-repeat padding-box', borderRadius: '50%', display: 'flex', height: '20px', width: '20px', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                    <TimesIcon fontSize='0.5em' style={{ color: '#fff' }} onClick={() => handleTagRemove(index, tagIndex, values, 'caseStudyFiles', setFieldValue)} className="tag-remove" />
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
                                    let mockuptag = mockup.tags;
                                    mockuptag = [...mockuptag, newTag];
                                    setFieldValue(`caseStudyFiles[${index}].tags`, mockuptag);
                                    e.target.value = '';
                                  }
                                }}
                                style={{ border: 'none', outline: 'none', flex: 1, boxShadow: 'none' }}
                              />
                            </div>
                          </Form.Group>
                        </ListGroup.Item>
                      ))}
                    </ListGroup> */}

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '1.2rem', color: '#6E6E6E', fontWeight: 'bold' }}>UPLOAD THUMBNAIL IMAGE<span style={{ color: 'red', marginLeft: '4px' }}>*</span></Form.Label>
                      <div
                        onClick={() => document.getElementById('thumbnailImages-file-input').click()}
                        onDrop={(e) => handleFileChange(e, values, 'thumbnailImages', setFieldValue)}
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
                            <p style={{ fontSize: '0.875rem', color: '#6E6E6E', marginBottom: 1 }}>JPG, PNG</p>
                          </div>
                          <Form.Control id="thumbnailImages-file-input" type="file" multiple onChange={(e) => handleFileChange(e, values, 'thumbnailImages', setFieldValue)} style={{ display: 'none' }} />
                        </div>
                      </div>
                    </Form.Group>
                    <ListGroup>
                      {values.thumbnailImages.map((mockup, index) => (
                        <ListGroup.Item key={index} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>{mockup.file ? mockup.file.name : mockup.name}</strong>
                            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFile(index, values, 'thumbnailImages', setFieldValue)}>Remove</Button>
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
                                  checked={mockup.tags.includes(tag)}
                                  onChange={() => handleTagChange(index, tag, values, 'thumbnailImages', setFieldValue)}
                                  key={tag}
                                />
                              ))}
                            </div>
                            <div className="tags-input-container" style={{ display: 'flex', padding: '0.8rem 0.5rem', gap: 4, border: '1px solid #C2C2C2', borderRadius: '16px', flexWrap: 'wrap' }}>
                              {mockup.tags?.map((tag, tagIndex) => (
                                <div key={tagIndex} className="tag-item" style={{ display: 'flex', padding: '0.5rem 0.825rem', backgroundColor: '#F5F5F5', borderRadius: '16px', alignItems: 'center', justifyContent: 'center' }}>
                                  <span className='tags' style={{ marginRight: 3, marginTop: '-2px' }}>{tag}</span>
                                  <div className='close' style={{ background: '#C2C2C2 0% 0% no-repeat padding-box', borderRadius: '50%', display: 'flex', height: '20px', width: '20px', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                    <TimesIcon fontSize='0.5em' style={{ color: '#fff' }} onClick={() => handleTagRemove(index, tagIndex, values, 'thumbnailImages', setFieldValue)} className="tag-remove" />
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
                                    let mockuptag = mockup.tags;
                                    mockuptag = [...mockuptag, newTag];
                                    setFieldValue(`thumbnailImages[${index}].tags`, mockuptag);
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
                  </>
                )}
                {values.mockuptype === 'Before After' && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '1.2rem', color: '#6E6E6E', fontWeight: 'bold' }}>UPLOAD BEFORE DESIGN<span style={{ color: 'red', marginLeft: '4px' }}>*</span></Form.Label>
                      <div
                        onClick={() => document.getElementById('beforeFile-file-input').click()}
                        onDrop={(e) => handleFileChange(e, values, 'beforeFile', setFieldValue)}
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
                            <p style={{ fontSize: '0.875rem', color: '#6E6E6E', marginBottom: 1 }}>JPG, PNG</p>
                          </div>
                          <Form.Control id="beforeFile-file-input" type="file" multiple onChange={(e) => handleFileChange(e, values, 'beforeFile', setFieldValue)} style={{ display: 'none' }} />
                        </div>
                      </div>
                    </Form.Group>
                    <ListGroup>
                      {values.beforeFile.map((mockup, index) => (
                        <ListGroup.Item key={index} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>{mockup.file ? mockup.file.name : mockup.name}</strong>
                            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFile(index, values, 'beforeFile', setFieldValue)}>Remove</Button>
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
                                  checked={mockup.tags.includes(tag)}
                                  onChange={() => handleTagChange(index, tag, values, 'beforeFile', setFieldValue)}
                                  key={tag}
                                />
                              ))}
                            </div>
                            <div className="tags-input-container" style={{ display: 'flex', padding: '0.8rem 0.5rem', gap: 4, border: '1px solid #C2C2C2', borderRadius: '16px', flexWrap: 'wrap' }}>
                              {mockup.tags?.map((tag, tagIndex) => (
                                <div key={tagIndex} className="tag-item" style={{ display: 'flex', padding: '0.5rem 0.825rem', backgroundColor: '#F5F5F5', borderRadius: '16px', alignItems: 'center', justifyContent: 'center' }}>
                                  <span className='tags' style={{ marginRight: 3, marginTop: '-2px' }}>{tag}</span>
                                  <div className='close' style={{ background: '#C2C2C2 0% 0% no-repeat padding-box', borderRadius: '50%', display: 'flex', height: '20px', width: '20px', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                    <TimesIcon fontSize='0.5em' style={{ color: '#fff' }} onClick={() => handleTagRemove(index, tagIndex, values, 'beforeFile', setFieldValue)} className="tag-remove" />
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
                                    let mockuptag = mockup.tags;
                                    mockuptag = [...mockuptag, newTag];
                                    setFieldValue(`beforeFile[${index}].tags`, mockuptag);
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

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '1.2rem', color: '#6E6E6E', fontWeight: 'bold' }}>UPLOAD AFTER DESIGN<span style={{ color: 'red', marginLeft: '4px' }}>*</span></Form.Label>
                      <div
                        onClick={() => document.getElementById('afterFile-file-input').click()}
                        onDrop={(e) => handleFileChange(e, values, 'afterFile', setFieldValue)}
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
                            <p style={{ fontSize: '0.875rem', color: '#6E6E6E', marginBottom: 1 }}>JPG, PNG</p>
                          </div>
                          <Form.Control id="afterFile-file-input" type="file" multiple onChange={(e) => handleFileChange(e, values, 'afterFile', setFieldValue)} style={{ display: 'none' }} />
                        </div>
                      </div>
                    </Form.Group>
                    <ListGroup>
                      {values.afterFile.map((mockup, index) => (
                        <ListGroup.Item key={index} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>{mockup.file ? mockup.file.name : mockup.name}</strong>
                            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFile(index, values, 'afterFile', setFieldValue)}>Remove</Button>
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
                                  checked={mockup.tags.includes(tag)}
                                  onChange={() => handleTagChange(index, tag, values, 'afterFile', setFieldValue)}
                                  key={tag}
                                />
                              ))}
                            </div>
                            <div className="tags-input-container" style={{ display: 'flex', padding: '0.8rem 0.5rem', gap: 4, border: '1px solid #C2C2C2', borderRadius: '16px', flexWrap: 'wrap' }}>
                              {mockup.tags?.map((tag, tagIndex) => (
                                <div key={tagIndex} className="tag-item" style={{ display: 'flex', padding: '0.5rem 0.825rem', backgroundColor: '#F5F5F5', borderRadius: '16px', alignItems: 'center', justifyContent: 'center' }}>
                                  <span className='tags' style={{ marginRight: 3, marginTop: '-2px' }}>{tag}</span>
                                  <div className='close' style={{ background: '#C2C2C2 0% 0% no-repeat padding-box', borderRadius: '50%', display: 'flex', height: '20px', width: '20px', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                    <TimesIcon fontSize='0.5em' style={{ color: '#fff' }} onClick={() => handleTagRemove(index, tagIndex, values, 'afterFile', setFieldValue)} className="tag-remove" />
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
                                    let mockuptag = mockup.tags;
                                    mockuptag = [...mockuptag, newTag];
                                    setFieldValue(`afterFile[${index}].tags`, mockuptag);
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
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" style={{ backgroundColor: 'transparent', color: '#6E6E6E' }} onClick={handleClose} disabled={loading}>Close</Button>
                {/* <Button style={{ backgroundColor: '#6C67E1', borderColor: '#6C67E1' }} type="submit">Add</Button> */}
                <Button style={{ backgroundColor: '#6C67E1', borderColor: '#6C67E1' }} type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Loading...</span>
                    </>
                  ): (
                    <span>Add</span>
                  )}
                </Button>
              </Modal.Footer>
            </form>
        )}
      </Formik>
      </Modal>
    </>
  );
};

export default UploadMockupModal;