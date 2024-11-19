import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";
import DomainLayout from "../Components/DomainLayout";

const VisualSample = () => {
  return (
    <div className="container-fluid px-0">
      <DomainLayout />
    </div>
  );
};

export default VisualSample;
