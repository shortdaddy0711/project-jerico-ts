import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Box, Button, Input, Textarea, Typography, CircularProgress, Alert, AspectRatio } from '@mui/joy';
// import { AuthContext } from '../context/AuthContext';
import { capitalizeFirstLetter } from '@/components/utils/commonUtils';

interface Student {
    id: string;
    name: string;
    ministry: string;
    lifegroup: string;
    note?: string;
    photo?: string;
}

type FormValues = {
    name: string;
    ministry: string;
    lifegroup: string;
    note: string;
    photo: string;
    notes: string[];
};

const Edit: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    // const { user } = useContext(AuthContext);

    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [formValues, setFormValues] = useState<FormValues>({
        name: '',
        ministry: '',
        lifegroup: '',
        note: '',
        photo: '',
        notes: [],
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
    const [updating, setUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudent = async () => {
            if (!studentId) {
                setError('No student ID provided.');
                setLoading(false);
                return;
            }

            try {
                const studentDocRef = doc(db, 'students', studentId);
                const studentDoc = await getDoc(studentDocRef);

                if (studentDoc.exists()) {
                    const data = studentDoc.data();
                    setStudent({
                        id: studentDoc.id,
                        name: data.name || '',
                        ministry: data.ministry || '',
                        lifegroup: data['lifegroup(23-24)'] || '',
                        note: data.note || '',
                        photo: data.photo || '',
                    });

                    setFormValues({
                        name: data.name || '',
                        ministry: data.ministry || '',
                        lifegroup: data['lifegroup(23-24)'] || '',
                        note: data.note || '',
                        photo: data.photo || '',
                        notes: data.notes || [],
                    });
                } else {
                    setError('Student not found.');
                }
            } catch (err) {
                console.error('Error fetching student:', err);
                setError('Failed to fetch student data.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [studentId]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhotoFile(file);

            // Generate a preview of the selected photo
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        // if (!formValues.name.trim()) {
        //     setError('Name is required.');
        //     return;
        // }

        // if (!formValues.ministry.trim()) {
        //     setError('Ministry Team is required.');
        //     return;
        // }

        // if (!formValues.lifegroup.trim()) {
        //     setError('Lifegroup is required.');
        //     return;
        // }

        // File size limit (e.g., 5MB)
        const maxFileSize = 5 * 1024 * 1024; // 5MB
        if (photoFile && photoFile.size > maxFileSize) {
            setError('Photo size should not exceed 5MB.');
            return;
        }

        setUpdating(true);
        setError(null);
        setSuccess(null);

        try {
            const studentDocRef = doc(db, 'students', studentId!);
            const updatedData = {
                ministry: formValues.ministry,
                'lifegroup(23-24)': formValues.lifegroup,
                photo: '',
            };

            // Handle photo upload if a new photo is selected
            if (photoFile) {
                const timestamp = Date.now();
                const fileExtension = photoFile.name.split('.').pop();
                const fileName = `${student?.name.toLowerCase().replace(' ', '_')}-${timestamp}.${fileExtension}`;
                const photoRef = ref(storage, `students/${student?.id}/${fileName}`);
                await uploadBytes(photoRef, photoFile);
                const photoURL = await getDownloadURL(photoRef);
                updatedData.photo = photoURL;
            }

            // Update Firestore document
            await updateDoc(studentDocRef, updatedData);

            setSuccess('Student information updated successfully.');

            // Optionally, redirect to another page after a delay
            // setTimeout(() => {
            //     navigate(`/student/${studentId}`);
            // }, 2000);
        } catch (err) {
            console.error('Error updating student:', err);
            setError('Failed to update student information.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert variant='solid' color='danger'>
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 600,
                mx: 'auto',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}
        >
            <Typography level='h4' component='h1'>
                Edit Student Information
            </Typography>

            {success && (
                <Alert variant='solid' color='success'>
                    {success}
                </Alert>
            )}

            {(student?.photo || photoPreview) && (
                <AspectRatio variant='plain' ratio={1}>
                    <img
                        src={student?.photo || photoPreview}
                        alt={student?.photo ? `${student.name}'s photo` : 'Photo Preview'}
                        style={{ borderRadius: '50%' }}
                    />
                </AspectRatio>
            )}

            {/* Name Field */}
            <Box>
                <Typography level='body-lg' sx={{ mb: 1 }}>
                    Name
                </Typography>
                <Input
                    placeholder="Enter student's name"
                    name='name'
                    value={capitalizeFirstLetter(formValues.name)}
                    onChange={handleInputChange}
                    required
                    variant='outlined'
                    fullWidth
                    disabled
                />
            </Box>

            {/* Ministry Team Field */}
            <Box>
                <Typography level='body-lg' sx={{ mb: 1 }}>
                    Ministry Team
                </Typography>
                <Input
                    placeholder='Enter ministry team'
                    name='ministry'
                    value={formValues.ministry}
                    onChange={handleInputChange}
                    variant='outlined'
                    fullWidth
                />
            </Box>

            {/* Lifegroup Field */}
            <Box>
                <Typography level='body-lg' sx={{ mb: 1 }}>
                    Lifegroup
                </Typography>
                <Input
                    placeholder='Enter lifegroup'
                    name='lifegroup'
                    value={formValues.lifegroup}
                    onChange={handleInputChange}
                    variant='outlined'
                    fullWidth
                />
            </Box>

            {/* Add other input fields as necessary */}
            {/* Example: Notes using Textarea */}
            <Box>
                <Typography level='body-lg' sx={{ mb: 1 }}>
                    Teacher's Notes
                </Typography>
                <Textarea
                    placeholder='Enter additional notes'
                    name='notes'
                    value={formValues.notes || ''}
                    onChange={handleInputChange}
                    variant='outlined'
                    minRows={4}
                    maxRows={10}
                />
            </Box>

            {/* Photo Upload */}
            <Box>
                <Button variant='outlined' component='label'>
                    Upload New Photo
                    <input type='file' hidden accept='image/*' onChange={handlePhotoChange} />
                </Button>
                {photoFile && (
                    <Typography level='body-md' sx={{ mt: 1 }}>
                        Selected File: {photoFile.name}
                    </Typography>
                )}
            </Box>

            {/* Submit Button */}
            <Button type='submit' disabled={updating} variant='solid'>
                {updating ? <CircularProgress size='lg' /> : 'Update Student'}
            </Button>

            {/* Error Message */}
            {error && (
                <Alert variant='solid' color='danger'>
                    {error}
                </Alert>
            )}
        </Box>
    );
};

export default Edit;
