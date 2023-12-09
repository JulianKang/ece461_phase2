import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './style.css';
import * as Schemas from '../schemas';

const PackagePage: React.FC = () => {
  // Access the packageId parameter from the route
  const { packageId } = useParams<string>();
  const [rating, setRating] = useState<Schemas.PackageRating>();

  // Fetch package data using the packageId

  const handleRate = async () => {
    try {
        const response = await axios.get(`http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/${packageId}/rate`);
        setRating(response.data);
    } catch (error) {
        console.error('Error fetching packages:', error);
    }
  };

  const downloadPackage = async () => {
    try {
      const response = await axios.get(`http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/${packageId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${packageId}.zip`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading package:', error);
    }
  };

  useEffect(() => {
    handleRate();
  });
  // Display package details on the page

  return (
    <div className="package-details">
      <h2>Package Details</h2>
      <p>Package ID: {packageId}</p>
      <h3>Package Ratings</h3>
      <p>Bus Factor: {rating?.BusFactor}</p>
      <p>Correctness: {rating?.Correctness}</p>
      <p>Ramp Up: {rating?.RampUp}</p>
      <p>Responsive Maintainer: {rating?.ResponsiveMaintainer}</p>
      <p>License Score: {rating?.LicenseScore}</p>
      <p>GoodPinningPractice: {rating?.GoodPinningPractice}</p>
      <p>Pull Request: {rating?.PullRequest}</p>
      <p>Net Score: {rating?.NetScore}</p>
      <button onClick={downloadPackage} className="download-button">Download Package</button>
    </div>
  );
};

export default PackagePage;
