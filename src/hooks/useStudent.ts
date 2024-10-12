import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface Student {
    id: string;
    name: string;
    ministryTeam: string;
    photoURL: string;
    
}

const useStudent = (studentId: string) => {
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudent = async () => {
            setLoading(true);
            setError(null);
            try {
                const studentDocRef = doc(db, 'students', studentId);
                const studentDoc = await getDoc(studentDocRef);

                if (studentDoc.exists()) {
                    const data = studentDoc.data();
                    setStudent({
                        id: studentDoc.id,
                        name: data.name || '',
                        ministryTeam: data['Ministry Team'] || '',
                        photoURL: data.photoURL || '',
                        // Map other fields as necessary
                    });
                } else {
                    setError('Student does not exist.');
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

    return { student, loading, error };
};

export default useStudent;
