import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import * as Schemas from '../schemas';
import Evaluate = Schemas.Evaluate;
import './style.css';
import JSZip from 'jszip';

const AddPage: React.FC = () => {
    const [packageData, setPackageData] = useState<Schemas.PackageData>({});
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
        if (e.target.files) {
            const file = e.target.files[0];
            const zipReader = new FileReader();
    
            zipReader.onload = async () => {
                if (file) {
                    try {
                        const zip = new JSZip();
                        const zipFile = await zip.loadAsync(zipReader.result as ArrayBuffer);
    
                        const fileContents: { [fileName: string]: string } = {};
    
                        await Promise.all(
                            Object.keys(zipFile.files).map(async (fileName) => {
                                const fileData = await zipFile.files[fileName].async('base64');
                                // console.log('fileData: ', fileData);
                                fileContents[fileName] = fileData;
                            })
                        );
    
                        // Create a single string that contains the Base64-encoded ZIP content
                        const zipContent = JSON.stringify(fileContents);
    
                        setPackageData({
                            ...packageData,
                            URL: undefined,
                            Content: zipContent,
                            JSProgram:
                                "if (process.argv.length === 7) {\nconsole.log('Success')\nprocess.exit(0)\n} else {\nconsole.log('Failed')\nprocess.exit(1)\n}\n",
                        });
    
                        setErrorMessage('');
                    } catch (error) {
                        console.log('Error while processing the ZIP file:', error);
                        setErrorMessage('Error unzipping the file.');
                    
                    }
                }
            };
    
            zipReader.readAsArrayBuffer(file);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setStatus('Uploading...');
        console.log('isPackageContent: ', Evaluate.isPackageContent(packageData.Content));
        console.log('isPackageURL: ', Evaluate.isPackageURL(packageData.URL));
        console.log('isJSProgram: ', Evaluate.isPackageJSProgram(packageData.JSProgram));

        if (!packageData.URL && !packageData.Content) {
            setErrorMessage('Please provide either a URL or a file.');
            return;
        }

        try {
            const response = await axios.post(
                'http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package',
                packageData
            );
            console.log(response.data);
            setStatus('Success');
        } catch (error) {
            setStatus('Failed');
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.message);
                console.log(error.message);
            }
        }
    };

    return (
        <div className="upload-package-page">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="npmUrl">NPM Package URL:</label>
                    <input
                        type="text"
                        id="npmUrl"
                        onChange={handleNpmUrlChange}
                        placeholder="Enter npmjs package URL"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="packageFile">Package File (zip):</label>
                    <input
                        type="file"
                        id="packageFile"
                        onChange={handleFileChange}
                        accept=".zip"
                    />
                </div>
                <p> Status: {status}</p>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">Upload Package</button>
            </form>
        </div>
    );
};

export default AddPage;
