import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { capitalizeFirstLetter } from '@/components/utils/commonUtils';

// interface Student {
//     id: string;
//     name: string;
//     ministryTeam: string;
//     // Add other relevant fields
// }

const useStudentsBy = (by?: string) => {
    const { user, userData } = useContext(AuthContext);
    const [students, setStudents] = useState<unknown[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!user) {
                setError('No authenticated user found.');
                setLoading(false);
                return;
            }

            // if (import.meta.env.DEV) {
            //     try {
            //         const response = await fetch(
            //             'https://3ec63dea-df5f-41f7-8c7a-cb241d0ced74.mock.pstmn.io/students'
            //         );

            //         const data = await response.json();

            //         if (by) {
            //             data.students = data.students.filter((student: any) => student[by] === userData[by]);
            //         }

            //         setStudents(data.students);
            //     } catch (err) {
            //         console.error('Error fetching students:', err);
            //         setError('Failed to fetch students.');
            //     } finally {
            //         setLoading(false);
            //     }
            // } else {
            try {
                let studentsBy: string = '';
                if (by) {
                    studentsBy = userData[by];

                    if (!studentsBy) {
                        setError(`${by} not assigned to you.`);
                        setLoading(false);
                        return;
                    }
                }

                const fieldInStudent: Record<string, string> = {
                    ministry: 'ministry',
                    lifegroup: 'lifegroup(23-24)',
                };

                // Query students with matching Ministry Team
                const studentsRef = collection(db, 'students');

                const queryBy =
                    by && studentsBy
                        ? query(studentsRef, where(fieldInStudent[by], '==', capitalizeFirstLetter(studentsBy)))
                        : studentsRef;
                const querySnapshot = await getDocs(queryBy);

                const studentsList: unknown[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    studentsList.push({
                        id: doc.id,
                        ...data,
                    });
                });

                setStudents(studentsList);
            } catch (err) {
                console.error('Error fetching students:', err);
                setError('Failed to fetch students.');
            } finally {
                setLoading(false);
            }
            // }
        };

        fetchStudents();
    }, [user, userData, by]);

    return { students, loading, error };
};

export default useStudentsBy;
