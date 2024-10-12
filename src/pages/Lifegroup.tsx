import useStudentsBy from '@/hooks/useStudentsBy';
import { Typography, Box, CircularProgress, Alert, Stack } from '@mui/joy';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import HomeCard from '@/components/ui/HomeCard';
import { IOSSwitch } from '@/components/ui/IOSSwitch';
import { useState } from 'react';

const Lifegroup = () => {
    const { students, loading, error } = useStudentsBy('lifegroup');
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

            {/* Students List */}
            {/* {!loading && !error && (
                <Box sx={{ p: 2 }}>
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
                                        <img src={student.photo || anonymous} loading='lazy' alt='' />
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
                </Box>
            )} */}
            {/* HomeCard Carousel */}
            {!loading && !error && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    pt={1}
                >
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
                </Box>
            )}
        </Box>
    );
};

export default Lifegroup;
