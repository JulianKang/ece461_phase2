import React, { useState, useEffect } from 'react';
import * as Schemas from '../schemas';
import axios from 'axios';
import './style.css';

function HomePage() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [packages, setPackages] = useState<Schemas.PackageMetadata[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        try {
            console.log(searchTerm);
            if(searchTerm === '') {
                const response = await axios.post('http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/packages', [{
                    Version:"*",
                    Name:"*"
                }]);
                setPackages(response.data[0]);
                return;
            }
            const response = await axios.post(`http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/byRegEx`, { RegEx: searchTerm });
            setPackages(response.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
            let errorMessage = "Failed to do something exceptional";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError(errorMessage);
            console.log(errorMessage);
        }
    };

    const handleReset = async () => {
        try {
            await axios.delete('http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/reset');
            // Reset the package list and search term
            setPackages([]);
            setSearchTerm('');
        } catch (error) {
            console.error('Error resetting database:', error);
            let errorMessage = "Failed to do something exceptional";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError(errorMessage);
        }
    };

    const handleAdd = () => {
        window.location.href = "/add";
    };

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const temp: Schemas.PackageQuery[] = [{
                    Version:"*",
                    Name:"*"
                }];
                console.log("isQuery:", Schemas.Evaluate.isPackageQuery(temp[0]));
                // console.log(temp);
                const response = await axios.post('http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/packages', temp);
                console.log(response.data[0]);
                setPackages(response.data[0]);
            } catch (error) {
                console.error('Error fetching packages:', error);
                let errorMessage = "Failed to do something exceptional";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                setError(errorMessage);
            }
        };

        fetchPackages();
    }, []);

    return (
        <div className="home-page">
    <div className="search-section">
       
        <div aria-live="polite" style={{ color: 'red', marginTop: '10px' }}>
            {error && <span>{error}</span>}
        </div>

        
        <button
            onClick={handleAdd} 
            style={{ marginTop: '10px', marginLeft: '10px', marginRight: '5px' }}
            aria-label="Add Package"
        >
            Add Package
        </button>

        <button
            onClick={handleReset}
            style={{ marginTop: '10px', marginLeft: '5px', marginRight: '5px', float: 'right' }}
            aria-label="Reset Database"
        >
            Reset Database
        </button>

        
        <label htmlFor="packageSearch" style={{ display: 'none' }}>Search Packages</label>
        <input 
            type="text" 
            id="packageSearch"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            maxLength={100} 
            placeholder="Enter regex pattern for package search"
            style={{ width: '300px', marginTop: '10px', marginLeft: '5px', marginRight: '10px' }}
        />

        <button
            onClick={handleSearch}
            aria-label="Search"
        >
            Search
        </button>
    </div>

    <div className="package-table">
        
        <table style={{ marginTop: '10px', marginLeft: '10px' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid #000', padding: '8px' }}>Package Name</th>
                    <th style={{ border: '1px solid #000', padding: '8px' }}>Package Version</th>
                    <th style={{ border: '1px solid #000', padding: '8px' }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {packages.map((pkg, index) => (
                    <tr key={index}> 
                        <td>{pkg.Name}</td>
                        <td>{pkg.Version}</td>
                        <td><a href={`/package/${pkg.ID}/`} aria-label={`View package ${pkg.Name}`}>View</a></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>

    );
}

export default HomePage;