// import { MouseEvent, FormEvent, useState } from 'react';
// import { db } from '../firebaseConfig'; // Import Firestore database instance
// import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore functions
// import { useNavigate } from 'react-router-dom';

// const Search = () => {
//     const [name, setName] = useState<string>(''); // State to hold the name input
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const [studentData, setStudentData] = useState<any | null>(null); // State to hold the fetched student data
//     const [docId, setDocId] = useState<string | null>(null);
//     const [loading, setLoading] = useState<boolean>(false); // State to handle loading
//     const [error, setError] = useState<string | null>(null); // State to handle errors
//     const navigate = useNavigate();

//     // Function to handle form submission
//     const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         setStudentData(null); // Clear previous results

//         try {
//             // Query Firestore for students with the matching name
//             const q = query(collection(db, 'students'), where('Name', '==', name));
//             const querySnapshot = await getDocs(q);

//             if (querySnapshot.empty) {
//                 throw new Error('No student found with that name');
//             } else {
//                 const doc = querySnapshot.docs[0];
//                 const student = doc.data(); // Get the first matched document
//                 setDocId(doc.id);
//                 setStudentData(student); // Set the student data to the state
//             }
//         } catch (err) {
//             console.log(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
//         e.preventDefault();
//         navigate(`/edit/${docId}`);
//     };

//     return (
//         <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
//             <h1>Search Student by Name</h1>

//             {/* Search form */}
//             <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
//                 <input
//                     type='text'
//                     placeholder='Enter student name'
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     style={{ padding: '10px', width: '300px' }}
//                 />
//                 <button type='submit' style={{ padding: '10px', marginLeft: '10px' }}>
//                     Search
//                 </button>
//             </form>

//             {/* Loading indicator */}
//             {loading && <p>{`Loading student data...`}</p>}

//             {/* Error message */}
//             {error && <p style={{ color: 'red' }}>{error}</p>}

//             {/* Student data display */}
//             {studentData && (
//                 <>
//                     <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '600px' }}>
//                         {Object.entries(studentData).map(([key, value]) => (
//                             <div key={key} style={{ marginBottom: '10px' }}>
//                                 <strong>{key}: </strong>
//                                 <span>{`${value || 'N/A'}`}</span>
//                             </div>
//                         ))}
//                     </div>
//                     <button id='edit-button' onClick={handleEdit}>
//                         Edit
//                     </button>
//                 </>
//             )}
//         </div>
//     );
// };

// export default Search;

// src/components/Search.tsx

// src/components/Search.tsx

import { useState, FormEvent, MouseEvent } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Input,
    Button,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    CardActions,
    FormControl,
    FormLabel,
    CardOverflow,
    AspectRatio,
} from '@mui/joy';
import { capitalizeFirstLetter } from '@/components/utils/commonUtils';

const Search = () => {
    const [name, setName] = useState<string>(''); // Search input
    const [students, setStudents] = useState<DocumentData[]>([]); // List of matched students
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const navigate = useNavigate();

    // Handle form submission
    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setStudents([]); // Clear previous results

        try {
            if (!name.trim()) {
                setError('Please enter a name to search.');
                setLoading(false);
                return;
            }

            const nameLower = name.toLowerCase();

            // Query Firestore for students where 'nameLowercase' includes the search term
            const studentsRef = collection(db, 'students');
            const q = query(studentsRef, where('name', '>=', nameLower), where('name', '<=', nameLower + '\uf8ff'));

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('No students found matching that name.');
            } else {
                const results: DocumentData[] = [];
                querySnapshot.forEach((doc) => {
                    const student = doc.data();
                    student.id = doc.id; // Add document ID to the student data
                    results.push(student);
                });

                // Further filter results for partial matches
                const filteredResults = results.filter((student) => student.name.includes(nameLower));

                if (filteredResults.length === 0) {
                    setError('No students found matching that name.');
                } else {
                    setStudents(filteredResults);
                }
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while searching.');
        } finally {
            setLoading(false);
        }
    };

    // Handle navigation to the edit page
    const handleEdit = (e: MouseEvent<HTMLButtonElement>, id: string) => {
        e.preventDefault();
        navigate(`/edit/${id}`);
    };

    const requiredField = ['name', 'nickName', 'grade', 'school', 'ministry', 'lifegroup(23-24)'];

    const inputTitleMapping: Record<string, string> = {
        name: 'Name',
        nickName: 'Korean Name',
        grade: 'Grade',
        school: 'School',
        ministry: 'Ministry',
        'lifegroup(23-24)': 'Lifegroup',
    };

    return (
        <Box>
            <Typography
                level='h4'
                my={1}
                variant='solid'
                sx={{
                    py: 2,
                    textAlign: 'center',
                }}
            >
                Find Student by Name
            </Typography>

            {/* Search Form */}
            <form
                onSubmit={handleSearch}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                }}
            >
                <FormControl sx={{ width: 300, marginRight: 1, marginTop: { xs: 2, sm: 0 } }}>
                    {/* <FormLabel>Student Name</FormLabel> */}
                    <Input placeholder='Enter student name' value={name} onChange={(e) => setName(e.target.value)} />
                </FormControl>
                <Button type='submit' variant='solid' sx={{ marginTop: { xs: 2, sm: 0 } }}>
                    Search
                </Button>
            </form>

            {/* Loading Indicator */}
            {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                    <CircularProgress size='sm' />
                    <Typography sx={{ marginLeft: 1 }}>Loading...</Typography>
                </Box>
            )}

            {/* Error Message */}
            {error && (
                <Alert color='danger' sx={{ marginTop: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Student List */}
            {students.length > 0 && (
                <Box sx={{ marginTop: 2, p: 2 }}>
                    {students.map((student) => (
                        <Card
                            key={student.id}
                            orientation='horizontal'
                            variant='outlined'
                            sx={{ marginBottom: 2, maxWidth: 600, py: 2 }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <AspectRatio ratio='1' sx={{ width: 120, borderRadius: '100%' }}>
                                    <img src={student.photo} loading='lazy' alt='' />
                                </AspectRatio>
                                <div>
                                    <Button onClick={(e) => handleEdit(e, student.id)} variant='solid'>
                                        Edit
                                    </Button>
                                </div>
                            </Box>
                            <CardContent>
                                {requiredField.map(
                                    (key) =>
                                        key !== 'parent' &&
                                        key !== 'id' &&
                                        (key !== 'name' ? (
                                            <Typography key={key}>
                                                <strong>{inputTitleMapping[key]}: </strong>
                                                {student[key] || 'N/A'}
                                            </Typography>
                                        ) : (
                                            <Typography level='h2' color='warning'>
                                                {capitalizeFirstLetter(student[key])}
                                            </Typography>
                                        ))
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default Search;
