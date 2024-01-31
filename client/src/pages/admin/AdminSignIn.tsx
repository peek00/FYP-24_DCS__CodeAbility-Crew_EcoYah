import {
    Card,
    CardActionArea,
    Container,
    Grid,
    ThemeProvider,
    Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import RoundProfilePic from "../../components/RoundProfilePic";
import { theme } from "../../styles/Palette";
import { makeHttpRequest } from "../../utils/Utility";


// interface ProfileCardProps {
// displayName: string;
// username: string;
// }

// const ProfileCard: React.FC<ProfileCardProps> = ({
//     displayName,
//     username }) => {
//         return (
//             <Card sx={{maxWidth: "220px", textAlign: "center", borderRadius: "20%", backgroundColor: "#013B23"}}>
//                 <CardActionArea onMouseOver={()=> console.log("hovered")}>
//                     <RoundProfilePic altText={"test"} pictureSrc={profilePic}/>
//                     <Typography variant="h5" color={"white"} sx={{paddingBottom: 3}}>{displayName}</Typography>
//                 </CardActionArea>                
//             </Card>
//         )
//     }
// const useStyles = makeStyles({
//     root: {
//       maxWidth: 310,
//       transition: "transform 0.15s ease-in-out"
//     },
//     cardHovered: {
//       transform: "scale3d(1.05, 1.05, 1)"
//     }
//   });
const StyledCard = styled(Card)(({ theme }) => ({
    transition: "transform 0.15s ease-in-out",
    "&:hover": { transform: "scale3d(1.3, 1.3, 1)" },
  }))

function ProfileCard(props: { displayName: string, id: number, imgSrc: string }) {

    const [raised, setRaised] = useState(false);

    function hoverCard(){
        console.log("hovered");
        setRaised(true);
    }

    function outHoverCard(){
        console.log("hovered out");
        setRaised(false);
    }

    return (
        <StyledCard raised={raised} sx={{width: "220px", textAlign: "center", borderRadius: "20%", backgroundColor: "#013B23"}}>
            <CardActionArea onMouseOver={()=> hoverCard()} onMouseOut={() => outHoverCard()}>
                <RoundProfilePic altText={"test"} pictureSrc={props.imgSrc}/>
                <Typography variant="h4" color={"white"} sx={{paddingBottom: 3}}>{props.displayName}</Typography>
            </CardActionArea>                
        </StyledCard>
    )
}

interface ProfilesType {
    id: number;
    name: string;
    imageId: string;
    email: string;
  }

export default function AdminSignIn() {

    const [profiles, setProfiles] = useState<ProfilesType[]>([]);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const getAllAdminProfiles = async () => {
        const response: any = await makeHttpRequest('GET', BACKEND_URL + '/users/allAdmins');
        const data = response.adminUsers;
        console.log(data);
    
        setProfiles(data);
    }

    useEffect(() => {
        console.log("***IN useEffect()***")
        getAllAdminProfiles();
    }, []);
    
    return (
        <ThemeProvider theme={theme}>
            <Container sx={{textAlign: "center", marginY: 9}}>
                <Typography variant="h3" sx={{marginBottom: 3}}>Welcome Back, Admin.</Typography>
                <Typography variant="h4" sx={{marginBottom: 6}}>Choose your profile.</Typography>
            
                <Grid container>
                    {profiles.map(eachProfile => (
                        <Grid item md={4} display="flex" justifyContent="center" alignItems="center">

                            <ProfileCard
                                displayName={eachProfile.name}
                                id={eachProfile.id}
                                imgSrc={eachProfile.imageId}
                            />
                        </Grid>
                    ))}
                </Grid>

            </Container>

        </ThemeProvider>
    )
}