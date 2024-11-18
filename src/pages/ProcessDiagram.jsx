import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";
import "./ProcessDiagram.css";
import DiscoverImg from "../assets/circle-image.svg";
import DevelopImg from "../assets/develop-circle.svg";
import DefineImg from "../assets/define-circle.svg";
import StackholderImg from "../assets/bottom-stackholder-section.svg";
import DiscoverBorder from "../assets/discover-border.svg";
import DefineCard from "../assets/define-border.svg";
import DesignCard from "../assets/design-border.svg";
import DevelopCard from "../assets/develop-border.svg";

const ProcessDiagram = () => {
  return (
    <div className="container product-experience-design">
      <h1 className="process-dig-title ">Product Experience Design</h1>
      <div className="border-div mb-3"></div>
      <div className="row justify-content-between p-2 w-100">
        {/* Stage 1 - Discover */}
        <div className="col-md-3  ">
          <div className="card-flex">
            <img
              src={DiscoverBorder}
              style={{
                height: "100%",
                marginTop: "30px",
              }}
            />
            <div className="stage stage-1 p-2 rounded position-relative">
              {/* <div className="stage-number">1</div> */}
              {/* <h2 className="stage-title">Discover</h2> */}

              <ul className="list-data mt-3">
                <li>
                  Understanding Business Requirements and Competition Study.
                </li>
                <li>Empathize and synthesize.</li>
              </ul>
              <span className="title">Deliverables</span>
              <div className="deliverables mt-1 red-border">
                <p>
                  Empathy Mapping, Journey Mapping, Task Flow, Personas,
                  Scenarios, Heuristic Evaluation, Competitor Analysis.
                </p>
              </div>
              <img
                src={DiscoverImg}
                alt="discover image"
                style={{
                  marginLeft: "-22px",
                  width: "200px",
                  marginTop: "20px",
                }}
              />
              {/* <div className="stage-icon">
              <img src="../assets/circle-image.svg" alt="Discover Icon" />
            </div> */}
              {/* <div className="evaluation mt-3">Stakeholder Evaluation</div> */}
            </div>
          </div>
          {/* <div className="stage stage-1 p-2 rounded position-relative">
            <div className="stage-number">1</div>
            <h2 className="stage-title">Discover</h2>

            <ul className="list-data mt-3">
              <li>
                Understanding Business Requirements and Competition Study.
              </li>
              <li>Empathize and synthesize.</li>
            </ul>
            <span className="title">Deliverables</span>
            <div className="deliverables mt-1 red-border">
              <p>
                Empathy Mapping, Journey Mapping, Task Flow, Personas,
                Scenarios, Heuristic Evaluation, Competitor Analysis.
              </p>
            </div>
            <img
              src={DiscoverImg}
              alt="discover image"
              style={{
                marginLeft: "-22px",
                width: "100%",
                marginTop: "20px",
              }}
            />
          </div> */}
        </div>

        {/* Stage 2 - Define */}
        <div className="col-md-3  ">
          <div className="card-flex">
            <img
              src={DefineCard}
              style={{
                height: "100%",
                marginTop: "30px",
              }}
            />
            <div className="stage stage-2 p-2 rounded position-relative">
              {/* <h2 className="stage-title">Define</h2> */}
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
                  marginLeft: "-22px",
                  width: "200px",
                  marginTop: "20px",
                }}
              />
              {/* <div className="stage-icon">
              <img src="path/to/define-icon.png" alt="Define Icon" />
            </div> */}
              {/* <div className="evaluation mt-3">
              User & Functionality Validation Stakeholder Evaluation
            </div> */}
            </div>
          </div>
        </div>

        {/* Stage 3 - Design */}
        <div className="col-md-3  ">
          <div className="card-flex">
            <img
              src={DesignCard}
              style={{
                height: "100%",
                marginTop: "30px",
              }}
            />
            <div className="stage stage-3 p-2 rounded position-relative">
              {/* <div className="stage-number">3</div> */}
              {/* <h2 className="stage-title">Design</h2> */}
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
                src={DiscoverImg}
                alt="discover image"
                style={{
                  marginLeft: "-22px",
                  width: "200px",
                  marginTop: "20px",
                }}
              />
              {/* <div className="stage-icon">
              <img src="path/to/design-icon.png" alt="Design Icon" />
            </div> */}
              {/* <div className="evaluation mt-3">
              User & Functionality Validation Stakeholder Evaluation
            </div> */}
            </div>
          </div>
        </div>

        {/* Stage 4 - Develop */}
        <div className="col-md-3  ">
          <div className="card-flex">
            <img
              src={DevelopCard}
              style={{
                height: "100%",
                marginTop: "30px",
              }}
            />
            <div className="stage stage-4 p-2 rounded position-relative">
              {/* <div className="stage-number">4</div>
            <h2 className="stage-title">Develop</h2> */}
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
                  marginLeft: "-22px",
                  width: "200px",
                  marginTop: "20px",
                }}
              />

              {/* <div className="stage-icon">
              <img src="path/to/develop-icon.png" alt="Develop Icon" />
            </div> */}
              {/* <div className="evaluation mt-3">Stakeholder Evaluation</div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Links */}
      {/* <div className="evaluation-links text-center">
        <div className="evaluation-box">Stakeholder Evaluation</div>
        <div className="evaluation-box">
          User & Functionality Validation Stakeholder Evaluation
        </div>
        <div className="evaluation-box">
          User & Functionality Validation Stakeholder Evaluation
        </div>
      </div> */}
      <div className="row">
        <img
          src={StackholderImg}
          alt="discover image"
          style={{
            width: "80%",
            margin: "0px auto 10px auto",
          }}
        />
      </div>
    </div>
  );
};

export default ProcessDiagram;
