import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './style.css';
import * as Schemas from '../schemas';
// import Evaluate = Schemas.Evaluate;
// import { Buffer } from 'buffer';

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

  // const downloadPackage = async () => {
  //   try {
  //     const response = await axios.get(`http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/${packageId}`, { responseType: 'blob' });
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', `${packageId}.zip`);
  //     document.body.appendChild(link);
  //     link.click();
  //   } catch (error) {
  //     console.error('Error downloading package:', error);
  //   }
  // };

//   const downloadPackage = async () => {
//     try {
//         const response = await axios.get(`http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/${packageId}`, { responseType: 'text' });
//         const zipBuffer = Buffer.from(response.data, 'base64');
//         const blob = new Blob([zipBuffer], { type: 'application/zip' });
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', `${packageId}.zip`);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link); // Clean up
//     } catch (error) {
//         console.error('Error downloading package:', error);
//     }
// };

// const downloadPackage = async () => {
//   try {
//       const response = await axios.get(`http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/${packageId}`, { responseType: 'text' });
//       const base64Response = response.data;

//       // Decoding the base64 string to binary data
//       const binaryString = window.atob(base64Response);
//       const len = binaryString.length;
//       const bytes = new Uint8Array(len);

//       for (let i = 0; i < len; i++) {
//           bytes[i] = binaryString.charCodeAt(i);
//       }

//       // Creating a Blob from binary data
//       const blob = new Blob([bytes], { type: 'application/zip' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${packageId}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link); // Clean up
//   } catch (error) {
//       console.error('Error downloading package:', error);
//   }
// };

// const downloadPackage = async () => {
//   try {
//       const response = await axios.get(`http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/${packageId}`, { responseType: 'text' });
//       let base64Response = response.data;

//       // Replace URL-safe base64 characters if necessary
//       base64Response = base64Response.replace(/-/g, '+').replace(/_/g, '/');

//       // Remove any whitespace
//       base64Response = base64Response.replace(/\s/g, '');

//       const binaryString = window.atob(base64Response);
//       const len = binaryString.length;
//       const bytes = new Uint8Array(len);

//       for (let i = 0; i < len; i++) {
//           bytes[i] = binaryString.charCodeAt(i);
//       }

//       const blob = new Blob([bytes], { type: 'application/zip' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${packageId}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//   } catch (error) {
//       console.error('Error downloading package:', error);
//   }
// };

function base64ToArrayBuffer(base64: any) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

const downloadPackage = async () => {
  try {
      const response = await axios.get(`http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/${packageId}`, { responseType: 'text' });
      const base64Response = JSON.parse(response.data).data.Content;

      const arrayBuffer = base64ToArrayBuffer(base64Response);
      const blob = new Blob([arrayBuffer], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${packageId}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up
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
