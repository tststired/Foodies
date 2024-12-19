import { Typography, ButtonGroup, AppBar, Button, Toolbar, Container, makeStyles
} from "@material-ui/core";
import {MenuBook} from '@material-ui/icons';
import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import RecipeList from "../components/RecipeList";
import Profile from "../components/Profile"
import useFetchProfile from "../useFetchProfile";

const useStyles = makeStyles(theme => ({

AppBar: {
    color: "primary",
},
menuBook: {
    marginRight: "10px"
},
text: {
    marginTop: "100px"
},
avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    padding: "10px"
},
buttonGroup: {
    marginLeft: "20px",
    flexGrow: 1
},
grid: {
    padding: "10px"
},
button: {
    float: "right"
},
container: {
    marginBottom: '96px',
    marginTop: '48px'
}
}));

const OtherProfilePage = () => {
    const { user_id } = useParams()
    const token = localStorage.getItem('token')
    const own_id = localStorage.getItem('u_id')
    const classes = useStyles();
    const navigate = useNavigate()
    const profileDetails = useFetchProfile(user_id)
    const [recipes, setRecipes] = useState([])
    const [isSub, setIsSub] = useState(false)

    useEffect(() => {
        axios.get(`/search/list_user_recipes`, {params: {token, user_id}})
        .then((response) => {
            const res = response.data;
            console.log(res)
            setRecipes(res)
        })
        .catch(err => {
            console.log(err.message);
        })
    }, [user_id, token]);

    useEffect(() => {
        if (user_id === own_id) {
            return navigate('/own_profile')
        }
    }, [user_id]);

    useEffect(() => {
        if (token) {
            axios.post(`/profile/is_subscribed`, {token, user_id})
            .then((response) => {
                const res = response.data;
                setIsSub(res)
            })
            .catch(err => {
                console.log(err.message);
            })
        }
    }, [token, user_id]);


    function handleHome() {
        return navigate('/')
    }

    function handleSubscribe() {
        if (token === null) {
            return navigate('/login')
        }
        axios.post(`/profile/subscribe`, {token, user_id})
        .then((response) => {
            const res = response.data;
            console.log(res)
            setIsSub(true)
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    function handleUnsubscribe() {
        if (token === null) {
            return navigate('/login')
        }
        axios.post(`/profile/unsubscribe`, {token, user_id})
        .then((response) => {
            const res = response.data;
            console.log(res)
            setIsSub(false)
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    return ( 
        <div className="OtherProfilePage">
            <AppBar position="relative" className={classes.AppBar}>
                <Toolbar>
                    <MenuBook className={classes.menuBook} color="secondary"/>
                    <Typography variant='h6' color="secondary">
                        {profileDetails.username}'s profile
                    </Typography>
                    <ButtonGroup variant="text" className={classes.buttonGroup} color="secondary" size="small" aria-label="text primary button group">
                        <Button onClick={() => handleHome()}>Home</Button>
                    </ButtonGroup>
                </Toolbar>
            </AppBar>
            <Container fixed maxWidth="md" className={classes.container}>
                { !isSub && <Profile profileDetails={profileDetails} sub={handleSubscribe}/>}
                { isSub && <Profile profileDetails={profileDetails} unSub={handleUnsubscribe}/>}
                <RecipeList recipes={recipes}/>
            </Container>
        </div>
    );
}

export default OtherProfilePage;