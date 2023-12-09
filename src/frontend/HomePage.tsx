import React, { useState, useEffect } from 'react';
import * as Schemas from '../schemas';
import axios from 'axios';
import './style.css';

function HomePage() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [packages, setPackages] = useState<Schemas.PackageMetadata[]>([]);

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
        }
    };

    const handleAdd = () => {
        // Logic for adding a package
        window.location.href = "/add";
        // This will need more details like a form input for package details
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
            }
        };

        fetchPackages();
    }, []);

    return (
        <div className="home-page">
            <div className="search-section">
                <input
                    type="button"
                    value="Add Package"
                    onClick={handleAdd}
                    style={{ marginTop: '10px', marginLeft: '10px', marginRight: '5px' }}
                />
                <input
                    type="button"
                    value="Reset Database"
                    onClick={handleReset}
                    style={{ marginTop: '10px', marginLeft: '5px', marginRight: '5px', float: 'right' }}
                />
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    maxLength={100} 
                    placeholder="Enter regex pattern for package search"
                    style={{ width: '300px', marginTop: '10px', marginLeft: '5px', marginRight: '10px' }}
                />
                <input
                    type="button"
                    value="Search"
                    onClick={handleSearch}
                />
            </div>
            <div className = "package-table">
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
                                <td><a href={`/package/${pkg.ID}/`}>View</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HomePage;