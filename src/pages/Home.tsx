import { useEffect, useState, MouseEvent } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import HomeCard from '@/components/ui/HomeCard';
import { Box, Typography, CircularProgress, Alert, Stack, Card, AspectRatio, CardContent, Button } from '@mui/joy';
import useStudentsBy, { Student } from '@/hooks/useStudentsBy';
import { capitalizeFirstLetter, getRandomItems } from '@/components/utils/commonUtils';
import { IOSSwitch } from '@/components/ui/IOSSwitch';
import SkateboardingIcon from '@mui/icons-material/Skateboarding';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [randomStudents, setRandomStudents] = useState<Student[]>([]);
    const [list, setList] = useState<boolean>(false);
    const navigate = useNavigate();

    const { students, loading, error } = useStudentsBy();

    useEffect(() => {
        if (students.length > 0) {
            const randomItems = getRandomItems(students, 10);
            setRandomStudents(randomItems);
        }
    }, [students]);

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setList(event.target.checked);
    };

    // Handle navigation to the edit page
    const handleEdit = (e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, id: string) => {
        e.preventDefault();
        navigate(`/edit/${id}`);
    };

    const requiredField: (keyof Student)[] = ['name', 'nickName', 'grade', 'school', 'ministry', 'lifegroup(23-24)'];

    const inputTitleMapping: Record<string, string> = {
        name: 'Name',
        nickName: 'Korean Name',
        grade: 'Grade',
        school: 'School',
        ministry: 'Ministry',
        'lifegroup(23-24)': 'Lifegroup',
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                px: 1,
            }}
        >
            <Box
                mt={2}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}
            >
                <Typography
                    level='h4'
                    sx={{
                        py: 1,
                        textAlign: 'center',
                        background: 'none',
                    }}
                >
                    Today's Students
                </Typography>
                <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography>Swipe</Typography>
                    <IOSSwitch onChange={handleSwitchChange} />
                    <Typography>List</Typography>
                </Stack>
            </Box>

            {/* Loading Indicator */}
            {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                    <CircularProgress size='sm' />
                    <Typography sx={{ marginLeft: 1 }}>Loading students...</Typography>
                </Box>
            )}

            {/* Error Message */}
            {error && (
                <Alert color='danger' sx={{ marginTop: 2 }}>
                    {error}
                </Alert>
            )}

            {/* HomeCard Carousel */}
            {randomStudents.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: 1,
                    }}
                >
                    {list ? (
                        randomStudents.map((student) => (
                            <Card
                                key={student.id}
                                orientation='horizontal'
                                variant='outlined'
                                sx={{ marginBottom: 2, maxWidth: 600, width: '100%' }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        px: 1,
                                    }}
                                >
                                    <AspectRatio ratio='1' sx={{ width: 120 }}>
                                        {/* <img src={student.photo} loading='lazy' alt='' /> */}
                                        {student.photo ? (
                                            <img
                                                src={student.photo}
                                                loading='lazy'
                                                alt={student.name}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Box>
                                                <SkateboardingIcon fontSize='large' />
                                            </Box>
                                        )}
                                    </AspectRatio>
                                    <div>
                                        <Button
                                            color='neutral'
                                            onClick={(e) => handleEdit(e, student.id)}
                                            variant='solid'
                                        >
                                            Update Photo
                                        </Button>
                                    </div>
                                </Box>
                                <CardContent>
                                    {requiredField.map(
                                        (key) =>
                                            key !== 'parent' &&
                                            key !== 'id' &&
                                            key !== 'prayerRequests' &&
                                            (key !== 'name' ? (
                                                <Typography key={key}>
                                                    <strong>{inputTitleMapping[key]}: </strong>
                                                    {student[key] || 'N/A'}
                                                </Typography>
                                            ) : (
                                                <Typography level='h4' color='primary' key={key}>
                                                    {capitalizeFirstLetter(student[key])}
                                                </Typography>
                                            ))
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Carousel className='w-full max-w-sm'>
                            <CarouselContent>
                                {randomStudents.map((student) => (
                                    <CarouselItem key={student.id}>
                                        <HomeCard studentData={student} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious variant='link' />
                            <CarouselNext variant='link' />
                        </Carousel>
                    )}
                </Box>
            )}

            {/* Recent Updates Section */}
            {/* <Box sx={{ width: '100%', py: 4 }}>
                <Typography >
                    Recent Updates
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    {recentUpdates.map((student) => (
                        <Card key={student.id} sx={{ width: 300 }}>
                            <CardMedia component='img' height='140' image={student.photoUrl} alt={student.Name} />
                            <CardContent>
                                <Typography gutterBottom variant='h5' component='div'>
                                    {student.Name}
                                </Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    {student.notes}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box> */}
        </Box>
    );
}

export default Home;
