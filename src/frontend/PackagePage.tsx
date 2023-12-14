import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './style.css';
import * as Schemas from '../schemas';
import Evaluate = Schemas.Evaluate;

const PackagePage: React.FC = () => {
  const { packageId } = useParams<string>();
  const [rating, setRating] = useState<Schemas.PackageRating>();
  const [packageData, setPackageData] = useState<Schemas.PackageData>();
  const [packageMetadata, setPackageMetadata] = useState<Schemas.PackageMetadata>();
  const [Package, setPackage] = useState<Schemas.Package>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('Ready');

  const handleNpmUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPackageData({
        ...packageData,
        Content: undefined,
        URL: e.target.value,
        JSProgram: "if (process.argv.length === 7) {\nconsole.log('Success')\nprocess.exit(0)\n} else {\nconsole.log('Failed')\nprocess.exit(1)\n}\n",
    });
    setErrorMessage('');
};

const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
if (e.target && e.target.files) {
    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = async (event: ProgressEvent<FileReader>) => {
        try {
            if (event.target?.result && typeof event.target.result === 'string') {
                const base64String = event.target.result.split(',')[1];
                console.log('Base64 ZIP Content:', base64String);

                setPackageData({
                    ...packageData,
                    URL: undefined,
                    Content: base64String,
                    JSProgram:
                        "if (process.argv.length === 7) {\nconsole.log('Success')\nprocess.exit(0)\n} else {\nconsole.log('Failed')\nprocess.exit(1)\n}\n",
                });
            }
            setErrorMessage('');
        } catch (error) {
            console.log('Error while processing the ZIP file:', error);
            setErrorMessage('Error processing the file.');
        }
    };

    fileReader.onerror = () => {
        setErrorMessage('Error reading the file.');
    };

    if (file) {
        fileReader.readAsDataURL(file); // Read the file as a data URL (which includes the base64 encoded data)
    }
}
};

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus('Uploading...');

    if(packageData === undefined) {
        setErrorMessage('Please provide a valid package ID 1.');
        return;
    }

    if (!packageData.URL && !packageData.Content) {
        setErrorMessage('Please provide either a URL or a file.');
        return;
    }

    const segments = packageId?.split('_');
    const version = segments?.pop();
    const p_name = segments?.join('_');

    if(p_name === undefined || version === undefined || packageId === undefined) {
        setErrorMessage('Please provide a valid package ID 2.');
        return;
    }

    setPackageMetadata({
        ...packageMetadata,
        Name: p_name,
        Version: version,
        ID: packageId,
    });

    console.log('p_name: ', p_name);
    console.log('version: ', version);
    console.log('packageId: ', packageId);

    setTimeout(() => {
        console.log('Updated packageMetadata: ', packageMetadata);
        if (packageMetadata === undefined) {
            console.log('packageMetadata is still undefined');
            setErrorMessage('Please provide a valid package ID 3.');
            return;
        }
    
        setPackage({
            ...Package,
            metadata: packageMetadata,
            data: packageData,
        });
    }, 0);

    if (packageMetadata === undefined) {
        console.log('packageMetadata: ', packageMetadata);
        setErrorMessage('Please provide a valid package ID 3.');
        return;
    }

    setPackage({
        ...Package,
        metadata: packageMetadata,
        data: packageData,
    });

    try {
        console.log('isPackageContent: ', Evaluate.isPackageContent(packageData.Content));
        console.log('isPackageURL: ', Evaluate.isPackageURL(packageData.URL));
        console.log('isJSProgram: ', Evaluate.isPackageJSProgram(packageData.JSProgram));
        const response = await axios.put(
            `http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/${packageId}`,
            Package
        );
        console.log(response.data);
        setStatus('Success');
        setErrorMessage('');
    } catch (error) {
        setStatus('Failed');
        if (axios.isAxiosError(error)) {
            setErrorMessage(error.message);
            console.log(error.message);
        }
    }
};

  const handleRate = async () => {
    try {
        const response = await axios.get(`http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/${packageId}/rate`);
        setRating(response.data);
    } catch (error) {
        console.error('Error fetching packages:', error);
    }
  };

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

  return (
    <div className="package-details" tabIndex={0}>
    <h2>Package Details</h2>
    <p>Package ID: {packageId}</p>
    <h3>Package Ratings</h3>
    <ul>
        <li>Bus Factor: {rating?.BusFactor}</li>
        <li>Correctness: {rating?.Correctness}</li>
        <li>Ramp Up: {rating?.RampUp}</li>
        <li>Responsive Maintainer: {rating?.ResponsiveMaintainer}</li>
        <li>License Score: {rating?.LicenseScore}</li>
        <li>Good Pinning Practice: {rating?.GoodPinningPractice}</li>
        <li>Pull Request: {rating?.PullRequest}</li>
        <li>Net Score: {rating?.NetScore}</li>
    </ul>

    <button 
        onClick={downloadPackage} 
        className="download-button" 
        aria-label="Download Package"
        style={{ outline: 'none' }}>
        Download Package
    </button>
    <form onSubmit={handleSubmit}>
        <div tabIndex={1}> 
            <label htmlFor="packageUrl" style={{ display: 'none' }}>Package URL</label>
            <input type="text" id="packageUrl" onChange={handleNpmUrlChange} placeholder="Package URL" />
        </div>
        <div tabIndex={2}>
            <label htmlFor="packageFile" style={{ display: 'none' }}>Package File</label>
            <input type="file" id="packageFile" onChange={handleFileChange} />
        </div> 
        <button type="submit" aria-label="Update Package">Update Package</button>
    </form>
    {errorMessage && <p role="alert">Error: {errorMessage}</p>}

    <p aria-live="polite">Status: {status}</p>
</div>

  );
};

export default PackagePage;
