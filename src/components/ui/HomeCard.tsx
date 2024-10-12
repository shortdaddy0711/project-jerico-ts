import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary,
    AspectRatio,
    Box,
    Card,
    CardContent,
    CardOverflow,
    Divider,
    Typography,
} from '@mui/joy';
import { capitalizeFirstLetter, truncateString } from '../utils/commonUtils';
import { useState } from 'react';
import SkateboardingIcon from '@mui/icons-material/Skateboarding';
import { Student } from '@/hooks/useStudentsBy';

export default function PrayerCard({
    studentData,
}: {
    studentData: Student;
}) {
    const [index, setIndex] = useState<number | null>(null);
    // const samplePR: unknown[] = [
    //     {
    //         createdAt: Date.now(),
    //         content:
    //             'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //     },
    //     {
    //         createdAt: Date.now(),
    //         content:
    //             'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //     },
    //     {
    //         createdAt: Date.now(),
    //         content:
    //             'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //     },
    //     {
    //         createdAt: Date.now(),
    //         content:
    //             'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //     },
    //     {
    //         createdAt: Date.now(),
    //         content:
    //             'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //     },
    // ];
    return (
        <Card key={studentData.id} variant='outlined' sx={{ width: 384 }}>
            <CardOverflow variant='soft'>
                <AspectRatio variant='plain' ratio={1}>
                    {studentData.photo ? (
                        <img
                            src={studentData.photo}
                            loading='lazy'
                            alt={studentData.name}
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <Box>
                            <SkateboardingIcon fontSize='large' />
                        </Box>
                    )}
                </AspectRatio>
            </CardOverflow>
            <CardContent orientation='horizontal' sx={{ justifyContent: 'space-around' }}>
                <Typography level='title-md'>{capitalizeFirstLetter(studentData.name)}</Typography>
                <Typography level='body-sm'>
                    {studentData.school || 'N/A'} - {studentData.grade}
                </Typography>
            </CardContent>
            <CardOverflow sx={{ bgcolor: '#f9f8ff' }}>
                <Divider inset='context' />
                <CardContent orientation='vertical' sx={{ py: 1 }}>
                    {studentData.prayerRequests?.length > 0 &&
                        studentData.prayerRequests
                            .sort((a, b) => a.createdAt - b.createdAt)
                            .slice(0, 3)
                            .map((pr, keyIndex: number) => {
                                if (!pr.content) return null;
                                return (
                                    <AccordionGroup key={pr.createdAt + pr.content + keyIndex}>
                                        <Accordion
                                            expanded={index === keyIndex}
                                            onChange={(_, expanded) => {
                                                setIndex(expanded ? keyIndex : null);
                                            }}
                                        >
                                            <AccordionSummary>
                                                <Typography
                                                    level='title-md'
                                                    noWrap={true}
                                                    sx={{ color: '#73456f', fontWeight: '500' }}
                                                >
                                                    {truncateString(pr.content, 30)}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography level='body-sm'>{pr.content}</Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </AccordionGroup>
                                );
                            })}
                </CardContent>
            </CardOverflow>
        </Card>
    );
}
