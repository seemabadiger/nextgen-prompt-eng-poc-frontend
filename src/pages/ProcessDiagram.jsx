import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";
import "./ProcessDiagram.css";
import DesignImg from "../assets/Design_1.svg";
import DotImg from "../assets/Dot.svg";
import CompanyFooterLogo from "../assets/bottom-logo.svg";
import PlusImg from "../assets/Plus.svg";
import DiscoverImg from "../assets/Discover_1.svg";
import DevelopImg from "../assets/Develop_1.svg";
import DefineImg from "../assets/Define_1.svg";
import StackholderImg from "../assets/bottom-stackholder-section.svg";
import DiscoverBorder from "../assets/discover-border.svg";
import DefineCard from "../assets/define-border.svg";
import DesignCard from "../assets/design-border.svg";
import DevelopCard from "../assets/develop-border.svg";
import axios from "axios";

const ProcessDiagram = () => {

  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliverables1, setDeliverables1] = useState([]);
  const [deliverables2, setDeliverables2] = useState([]);
  const [deliverables3, setDeliverables3] = useState([]);
  const [deliverables4, setDeliverables4] = useState([]);

  useEffect(() => {
    const fetchDeliverablesAndDiagrams = async () => {
      try {
        const deliverables = await axios.get(
          "https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/deliverables"
        );

        const response = await axios.get(
          "https://hxstudiofileuploadv1.azurewebsites.net/api/FileUploadAPI/getprocessdiagrams"
        );
        setDiagrams(response.data);


        const deliverablesData = deliverables.data; // Array of deliverables
        const diagramsData = response.data

        setDeliverables1(convertDeliverables(response.data, deliverablesData, 1) || []);
        setDeliverables2(convertDeliverables(response.data, deliverablesData, 2) || []);
        setDeliverables3(convertDeliverables(response.data, deliverablesData, 3) || []);
        setDeliverables4(convertDeliverables(response.data, deliverablesData, 4) || []);

        setDiagrams(diagramsData);
      } catch (error) {
        console.error("Error fetching diagrams:", error);
        alert("Failed to fetch process diagrams. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliverablesAndDiagrams();
  }, []);

  const convertDeliverables = (processData, processTypeData, processId) => {
    // Find the process matching the given processId
    const process = processData.find((item) => item.processId === processId);

    // Get the deliverables for the specific process
    const processDeliverables = process?.deliverables || [];

    // Filter deliverables from the second input that match the same processId
    const processTypeDeliverables = processTypeData.filter(
      (item) => item.processTypeId === processId
    );

    // Map the deliverables to the desired format
    const result = processTypeDeliverables.map((typeDeliverable) => {
      // Find the corresponding deliverable in the first input
      const match = processDeliverables.find(
        (deliverable) =>
          deliverable.deliverableName === typeDeliverable.deliverableName
      );

      return {
        label: typeDeliverable.deliverableName,
        link: match?.deliverableLink || "",
        file: match?.deliverableFilePath || "",
      };
    });

    return result;
  };

  const handleClick = (link, file) => {
    if (link) {
      window.open(link, "_blank"); // Open the link in a new tab
    } else if (file) {
      window.open(file, "_blank"); // Open the file in a new tab
    }
  };

  const returnDeliverables = (deliverables) => {
    return deliverables.map((item, index) => (
      <span key={index}>
        <a
          href="#"
          className="link-text"
          onClick={(e) => {
            e.preventDefault();
            if(item.link || item.file) {
              handleClick(item.link, item.file);
            }
          }}
        >
          {index + 1 !== deliverables.length ? `${item.label}, ` : item.label}
        </a>
      </span>
    ))
  }
  return (
    <div className="container product-experience-design p-4">
      <div className="process-dig-title-div">
        <h1 className="process-dig-title ">Product Experience Design Process</h1>
        <img
          src={DotImg}
          style={{
            height: "100%",
          }}
        />
      </div>
      <div className="border-div mb-3"></div>
      <div className="row justify-content-between   w-100">
        {/* Stage 1 - Discover */}
        <div className="col-sm-6 col-md-6 col-lg-3 padding-10  ">
          <div className="card-flex">
            <img
              src={DiscoverBorder}
              style={{
                height: "100%",
                marginTop: "30px",
              }}
            />
            <div className="stage stage-1   rounded position-relative">
              <ul className="list-data mt-3">
                <li>
                  Understanding Business Requirements and Competition Study.
                </li>
                <li>Empathize and synthesize.</li>
              </ul>
              <span className="title">Deliverables</span>
              <div className="deliverables mt-1 red-border">
                <p>
                  {returnDeliverables(deliverables1)}
                </p>
              </div>
              <img
                src={DiscoverImg}
                alt="discover image"
                style={{
                  marginLeft: "-18.5px",
                  marginTop: "10px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Stage 2 - Define */}
        <div className="col-sm-6 col-md-6 col-lg-3 padding-10  ">
          <div className="card-flex">
            <img
              src={DefineCard}
              style={{
                height: "100%",
                marginTop: "30px",
              }}
            />
            <div className="stage stage-2   rounded position-relative">
              <ul className="list-data mt-3">
                <li>Defining the Problem</li>
                <li>Ideating the solution</li>
                <li>User Validation</li>
              </ul>
              <span className="title">Deliverables</span>
              <div className="deliverables mt-1 pink-border">
                <p>
                  {returnDeliverables(deliverables2)}
                </p>
              </div>
              <img
                src={DefineImg}
                alt="discover image"
                style={{
                  marginLeft: "-46px",
                  marginTop: "10px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Stage 3 - Design */}
        <div className="col-sm-6 col-md-6 col-lg-3 padding-10  ">
          <div className="card-flex">
            <img
              src={DesignCard}
              style={{
                height: "100%",
                marginTop: "30px",
              }}
            />
            <div className="stage stage-3   rounded position-relative">
              <ul className="list-data mt-3 list-pd">
                <li>Visualization of the concept</li>
                <li>Defining the visual language to support Brand identity</li>
              </ul>
              <span className="title">Deliverables</span>
              <div className="deliverables mt-1 blue-border">
                <p>
                  {returnDeliverables(deliverables3)}
                </p>
              </div>
              <img
                src={DesignImg}
                alt="discover image"
                style={{
                  marginLeft: "-42.6px",
                  marginTop: "10px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Stage 4 - Develop */}
        <div className="col-sm-6 col-md-6 col-lg-3 padding-10  ">
          <div className="card-flex">
            <img
              src={DevelopCard}
              style={{
                height: "100%",
                marginTop: "30px",
              }}
            />
            <div className="stage stage-4   rounded position-relative">
              <ul className="list-data mt-3">
                <li>
                  Frontend Development to support the defined User Experience.
                </li>
                <li>
                  Browser Compatibility and Responsiveness strategy definition.
                </li>
              </ul>
              <span className="title">Deliverables</span>
              <div className="deliverables mt-1 green-border">
                <p>
                  {returnDeliverables(deliverables4)}
                </p>
              </div>

              <img
                src={DevelopImg}
                alt="discover image"
                style={{
                  marginLeft: "-38px",
                  marginTop: "10px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <img
          src={StackholderImg}
          alt="evaluation image"
          style={{
            width: "80%",
            margin: "0px auto 10px auto",
          }}
        />
      </div>
      <div className="row">
        <div className="process-dig-footer mt-5">
          <div>
            <img
              src={PlusImg}
              style={{
                height: "100%",
              }}
            />
          </div>
          <span className="footer-txt">
            © 2023 Harbinger Group |{" "}
            <a href="https://www.harbingergroup.com/" target="_blank">
              www.harbingergroup.com
              <img
                src={CompanyFooterLogo}
                style={{
                  height: "100%",
                  marginLeft: "10px",
                }}
              />
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProcessDiagram;
