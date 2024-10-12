import useStudentsBy from '@/hooks/useStudentsBy';
import { Typography, Box, CircularProgress, Alert, Stack, AspectRatio, CardContent, Card } from '@mui/joy';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import HomeCard from '@/components/ui/HomeCard';
import { capitalizeFirstLetter } from '@/components/utils/commonUtils';
import { useState } from 'react';
import { IOSSwitch } from '@/components/ui/IOSSwitch';
import SkateboardingIcon from '@mui/icons-material/Skateboarding';

const Ministry = () => {
    const { students, loading, error } = useStudentsBy('ministry');

    const [list, setList] = useState<boolean>(false);

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setList(event.target.checked);
    };

    return (
        <Box>
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
                    // variant='solid'
                    sx={{
                        py: 1,
                        textAlign: 'center',
                        background: 'none',
                    }}
                >
                    My Ministry Team
                </Typography>
                <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography>Swipe</Typography>
                    <IOSSwitch onChange={handleSwitchChange} />
                    <Typography>List</Typography>
                </Stack>
            </Box>

            {/* Loading State */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress color='primary' />
                </Box>
            )}

            {/* Error State */}
            {error && (
                <Alert variant='soft' color='danger' sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}
            {!loading && !error && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingTop: 1,
                    }}
                >
                    {list ? (
                        // List style
                        <Stack spacing={2}>
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <Card
                                        variant='soft'
                                        orientation='horizontal'
                                        sx={{ height: '100%', marginBottom: '30px' }}
                                        key={student.id}
                                    >
                                        <AspectRatio
                                            flex
                                            ratio='1'
                                            maxHeight={150}
                                            sx={{ minWidth: 150, borderRadius: '100%' }}
                                        >
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
                                        <CardContent>
                                            <Typography level='body-lg' color='primary'>
                                                {capitalizeFirstLetter(student.name)}
                                            </Typography>
                                            <Typography level='body-sm' color='neutral'>
                                                Ministry: {student.ministry}
                                            </Typography>
                                            <Typography level='body-sm' color='neutral'>
                                                Lifegroup: {student['lifegroup(23-24)']}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography level='body-lg'>No students found </Typography>
                            )}
                        </Stack>
                    ) : (
                        // Swipe style
                        <Carousel className='w-full max-w-sm'>
                            <CarouselContent>
                                {students.map((student) => (
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
        </Box>
    );
};

export default Ministry;
