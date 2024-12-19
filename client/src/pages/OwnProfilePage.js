import { Typography, ButtonGroup, AppBar, Button, Toolbar, Container, makeStyles
    } from "@material-ui/core";
import {MenuBook} from '@material-ui/icons';
import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Profile from "../components/Profile"
import RecipeList from "../components/RecipeList";
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
        marginTop: "40px"
    },
    container: {
        marginBottom: '96px',
        marginTop: '48px'
    }
}));

const OwnProfilePage = () => {
    const token = localStorage.getItem('token')
    const user_id = localStorage.getItem('u_id')
    const classes = useStyles();
    const navigate = useNavigate()
    const profileDetails = useFetchProfile(user_id)
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        axios.get(`/search/list_user_recipes`, {params: {token, user_id}})
        .then((response) => {
            const res = response.data;
            setRecipes(res)
        })
        .catch(err => {
            console.log(err.message);
        })
    }, [user_id, token]);

    function handleHome() {
        return navigate('/')
    }

    function handleEditProfile() {
        return navigate('/edit_profile')
    }

    function handleAddRecipe() {
        return navigate('/add_recipe')
    }

    const handleLogout = () => {
        axios.post(`/auth/logout`, { token })
            .then((response) => {
                console.log(response);
                const res = response.data;
                if (res.success) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('u_id');
                    return navigate("/")
                }
            })
            .catch((err) => {});
        }

    return ( 
        <div className="OwnProfilePage">
            <AppBar position="relative" className={classes.AppBar}>
                <Toolbar>
                    <MenuBook className={classes.menuBook} color="secondary"/>
                    <Typography variant='h6' color="secondary">
                        Your profile
                    </Typography>
                    <ButtonGroup variant="text" className={classes.buttonGroup} color="secondary" size="small" aria-label="text primary button group">
                        <Button onClick={() => handleHome()}>Home</Button>
                        <Button onClick={() => handleEditProfile()}>Edit profile</Button>
                    </ButtonGroup>
                    <Button variant="outlined" color="secondary" size="small"
                        onClick={()=>handleLogout()}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container fixed maxWidth="md" className={classes.container}>
                <Profile profileDetails={profileDetails} add={handleAddRecipe}/>
                <RecipeList recipes={recipes}/>
            </Container>
        </div>
     );
}
 
export default OwnProfilePage;