import { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from "../../components/AppBar";
import DonationEventCard from "../../components/DonationEvent/DonationEventCard";
import { fetchActiveDonationEvents } from '../../services/donationEventApi';
import { fetchEventTypes } from '../../services/eventTypesApi';
import { getDonationEventItemsByDonationId } from '../../services/donationEventItemApi';
import { retrieveDonationReqCountByEventId } from '../../services/donationRequestApi';
import SearchIcon from '@mui/icons-material/Search';

import {
    Box,
    Chip,
    Container,
    Grid,
    InputAdornment,
    TextField,
    Typography
  } from '@mui/material';

type itemType = {
    id: number,
    name: string,
    unit: string,
    eventType: {id: number}
}

type donationEventItemsType = {
    id: number,
    item: itemType,
    minQty: number,
    pointsPerUnit: number
}

type eventType = {
    id: number,
    donationEventItems: donationEventItemsType[],
    startDate: string,
    endDate: string,
    timeLeft: string,
    numDonors: number,
    imageId: string,
    isActive: boolean,
    name: string,
    createdAt: string,
    updatedAt: string
}

export type dataToDonationRequestFormType ={
    id: number,
    donationEventItems: donationEventItemsType[],
    startDate: string,
    endDate: string,
    timeLeft: string,
    imageId: string,
    name: string,
}

export default function DonationEvents() {
    const [search, setSearch] = useState('');
    const [eventOfTheWeek, setEventOfTheWeek] = useState<eventType>();
    
    const [events, setEvents] = useState<eventType[]>([]);
    const [errorFetchingEvents, setErrorFetchingEvents] = useState(false);
    const [fetchingEventsIsLoading, setFetchingEventsIsLoading] = useState(true);

    const [eventTypes, setEventTypes] = useState([]);
    const [errorFetchingEventTypes, setErrorFetchingEventTypes] = useState(false);
    const [filters, setFilters] = useState<number[]>([]);

    const getAllEvents = async () => {
        try {
            const response = await fetchActiveDonationEvents("");
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            setErrorFetchingEvents(true);
        }
    }

    const getAllEventTypes = async () => {
        try {
            const response = await fetchEventTypes();
            return response.data.eventTypes;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    const getDonationEventItems = async (donationEventId: number) => {
        try {
            const res = await getDonationEventItemsByDonationId(donationEventId);
            return res.data.donationEventItems;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    const getDonationReqCount = async (donationEventId: number) => {
        try {
            const res = await retrieveDonationReqCountByEventId(donationEventId);
            return res.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    const handleFilterClick = (eventTypeId: number) => {
        if(filters.includes(eventTypeId)){
            setFilters(filters.filter(filter => filter !== eventTypeId));
        } else {
            setFilters([...filters, eventTypeId]);
        }
          
    };

    const filteredEvents = useMemo(() => {
        if(filters.length === 0) return events;
        return events.filter((event: eventType) => {
            return event.donationEventItems.some((eachItem: donationEventItemsType) => {
                return filters.includes(eachItem.item.eventType.id);
            });
        });
    }, [filters, events]);


    const searchEvents = useMemo(() => {
        if(!search || search.trim() === '') return filteredEvents;

        return filteredEvents.filter((event: eventType) => {
            // Return events where searched text is in event name or items names
            return event.name.toLowerCase().includes(search.toLowerCase()) || event.donationEventItems.some((eachItem: donationEventItemsType) => {
                return eachItem.item.name.toLowerCase().includes(search.toLowerCase());
            })
        })
    }, [search, filteredEvents]);

    const calculateTimeLeft = (endDate: string) => {
        const endDateInMs = new Date(endDate).getTime();
        const currentDateInSGT = new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
        const currentDateInMs = new Date(currentDateInSGT).getTime();
        const timeLeftInHours = Math.floor((endDateInMs - currentDateInMs) / (1000 * 60 * 60));

        var toReturn: string = ''
        
        if(timeLeftInHours < 0){
            toReturn = 'Event Expired';
        } else if(timeLeftInHours < 24) {
            toReturn = timeLeftInHours + ' Hours Left';
        } else {
            const numDaysLeft = Math.floor(timeLeftInHours / 24);
            toReturn = numDaysLeft + ` Day${numDaysLeft > 1 ? 's' : ''} Left`;
        }

        return toReturn;
    }  

    const navigate = useNavigate();
    const handleDonateClick = (donationEvent: eventType) => {
        // Check if user is authenticated, if not, push to Sign In
        if(!isAuthenticated()){
            navigate('/sign-in');
        } else {
            // Redirect to donation request form page
            const dataToDonationRequestForm: dataToDonationRequestFormType = {
                id: donationEvent.id,
                donationEventItems: donationEvent.donationEventItems,
                startDate: donationEvent.startDate,
                endDate: donationEvent.endDate,
                timeLeft: donationEvent.timeLeft,
                imageId: donationEvent.imageId,
                name: donationEvent.name
            }
            navigate(`/donation-request-form?data=${encodeURIComponent(JSON.stringify(dataToDonationRequestForm))}`);
        }

    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllEvents();

                const updatedEventsPromises = res.map(async (eachEvent: eventType, index: number) => {
                    const donationEventItems = await getDonationEventItems(eachEvent.id);
                    const timeLeft = calculateTimeLeft(eachEvent.endDate.split('T')[0] + ' 11:59:59 PM');
                    const numDonors = await getDonationReqCount(eachEvent.id);
                    return { ...eachEvent, donationEventItems, timeLeft, numDonors};
                });
                const updatedEvents = await Promise.all(updatedEventsPromises);
                console.log(updatedEvents.length);
                
                var maxNumDonors = 0;
                const currDay = new Date().getDay(); // ** Sunday - Saturday: 0 - 6 **
                updatedEvents.forEach((updatedEvent: eventType) => {
                    if(updatedEvent.numDonors > maxNumDonors && (updatedEvent.timeLeft.includes('Hours') || parseInt(updatedEvent.timeLeft.split(' ')[0]) < 7) && new Date(updatedEvent.endDate).getDay() >= currDay){
                        maxNumDonors = updatedEvent.numDonors;
                        setEventOfTheWeek(updatedEvent);
                    }
                });
    
                setEvents(updatedEvents);
                setFetchingEventsIsLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setErrorFetchingEvents(true);
                setFetchingEventsIsLoading(false);
            }
        }
        fetchData();

        // *** For Filtering ***
        const fetchEventTypesData = async () => {
            try {
                const res = await getAllEventTypes();
                setEventTypes(res);
            } catch (error) {
                console.error('Error:', error);
                setErrorFetchingEventTypes(true);
            }
        }
        fetchEventTypesData();
    }, []);

    return (
        <Container sx={{marginTop: 3, marginX: 'auto'}}>
            {fetchingEventsIsLoading ? <Typography variant='h5' sx={{fontWeight: 'bold', marginTop: 5}}>Loading...</Typography> : 
            <>
                {errorFetchingEvents ? 
                    <Typography variant='h5' sx={{fontWeight: 'bold', marginTop: 3}}>Error fetching events, please try again later, sorry for the inconvenience!</Typography> 
                        : 

                <>
                    <TextField fullWidth variant="outlined" 
                        id="searchBar" 
                        color="success"
                        sx={{marginBottom: 2}}
                        placeholder="Search e.g. Cabbage, Bread" 
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                            ),
                        }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    
                    {eventOfTheWeek && 
                        <>
                            <Typography variant='h5' sx={{fontWeight: 'bold', marginBottom: 2}}>Donation of the Week</Typography>
                            
                            <DonationEventCard
                                name={eventOfTheWeek?.name || 'No Donation Event of The Week'}
                                description={`Take part in this donation by donating ${eventOfTheWeek?.donationEventItems.map(eachItem => eachItem.item.name.toLowerCase()).join(", ")}!`}
                                imgSrc={eventOfTheWeek?.imageId || 'https://picsum.photos/200/300'}
                                numJoined={eventOfTheWeek?.numDonors || 0}
                                timeLeft={eventOfTheWeek?.timeLeft || '0 Hours'}
                                handleDonateClick={() => handleDonateClick(eventOfTheWeek)}
                            />
                        </>
                    }

                    {errorFetchingEventTypes ?
                        <Typography variant='h6' sx={{fontWeight: 'bold', marginY: 2}}>Donation Events</Typography>
                        : 
                        <>
                            <Typography variant='h6' sx={{fontWeight: 'bold', marginY: 2}}>Donation Categories</Typography>

                            <Box sx={{marginBottom: 2}}>
                                {eventTypes.map((eventType: any) => (
                                    <Chip 
                                        key={eventType.id}
                                        label={eventType.name} 
                                        sx={{marginRight: 1, marginBottom: 1}}
                                        color="success"
                                        variant={filters.includes(eventType.id) ? "filled" : "outlined"}
                                        onClick={() => handleFilterClick(eventType.id)}
                                    />
                                ))}
                            </Box>
                        </>
                    }
                    
                    <Grid container spacing={3}>
                        {searchEvents.map((event: eventType) => (
                            <Grid item sx={{marginBottom: 2}} key={event.id}>
                                <DonationEventCard
                                    name={event.name}
                                    description={`Take part in this donation by donating ${event.donationEventItems.map(eachItem => eachItem.item.name.toLowerCase()).join(", ")}!`}
                                    imgSrc={event.imageId}
                                    numJoined={event.numDonors}
                                    timeLeft={event.timeLeft}
                                    handleDonateClick={() => handleDonateClick(event)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </>
            }
            </>}
        </Container>
    );
}