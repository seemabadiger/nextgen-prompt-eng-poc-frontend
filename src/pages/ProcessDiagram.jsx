import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";
import "./ProcessDiagram.css";
import DesignImg from "../assets/Design.svg";
import DotImg from "../assets/Dot.svg";
import CompanyFooterLogo from "../assets/bottom-logo.svg";
import PlusImg from "../assets/Plus.svg";
import DiscoverImg from "../assets/Discover.svg";
import DevelopImg from "../assets/Develop.svg";
import DefineImg from "../assets/Define.svg";
import StackholderImg from "../assets/bottom-stackholder-section.svg";
import DiscoverBorder from "../assets/discover-border.svg";
import DefineCard from "../assets/define-border.svg";
import DesignCard from "../assets/design-border.svg";
import DevelopCard from "../assets/develop-border.svg";

const ProcessDiagram = () => {
  const deliverables = [
    {
      label: "Empathy Mapping",
      link: "https://example.com/empathy-mapping",
      file: "https://example.com/file1.pdf",
    },
    {
      label: "Journey Mapping",
      link: "https://example.com/journey-mapping",
      file: "",
    },
    {
      label: "Task Flow",
      link: "",
      file: "https://example.com/file2.pdf",
    },
    // Add more items as needed
  ];

  const handleClick = (link, file) => {
    if (link) {
      window.open(link, "_blank"); // Open the link in a new tab
    } else if (file) {
      window.open(file, "_blank"); // Open the file in a new tab
    }
  };

  return (
    <div className="container product-experience-design">
      <div className="process-dig-title-div">
        <h1 className="process-dig-title ">Product Experience Design</h1>
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
                  {deliverables.map((item, index) => (
                    <span key={index}>
                      <a
                        href="#"
                        className="link-text"
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick(item.link, item.file);
                        }}
                      >
                        {item.label}
                      </a>
                      {index < deliverables.length - 1 && ", "}{" "}
                    </span>
                  ))}
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
                  Information Architecture, Low-hi fidelity Wireframes,
                  Prototype, Research Report.
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
                  Branding Style Guide, Visual Design, Design System, Clickable
                  Prototype.
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
                  HTML-CSS Markups, Atomic Design, Accessibility Compliance,
                  React/Angular based components.
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
