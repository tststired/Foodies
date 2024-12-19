import { Typography, TextField, Avatar, AppBar, Button, IconButton, Grid, Toolbar, Container, makeStyles
} from "@material-ui/core";
import {toast} from 'react-toastify';
import {MenuBook, AddAPhoto, DeleteForever} from '@material-ui/icons';
import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ConvertBase64 from "../ConvertBase64";
import useFetchProfile from "../useFetchProfile";

const useStyles = makeStyles(theme => ({

    AppBar: {
        color: "primary",
    },
    menuBook: {
        marginRight: "10px"
    },
    avatar: {
        width: theme.spacing(20),
        height: theme.spacing(20),
    },
    button: {
    },
    iconButton: {
        padding: 10,
    },
    container: {
        marginBottom: '48px',
        marginTop: '96px'
    }
}));

const EditProfilePage = () => {
    const classes = useStyles();
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const user_id = localStorage.getItem('u_id')
    const profileDetails = useFetchProfile(user_id)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState("")

    async function handleFileUpload(event) {
        const file = event.target.files[0]
        const base64Image = await ConvertBase64(file)
        setImage(base64Image)
    }

    function handleDelete() {
        setImage("")
    }

    function handleChangeUsername (event) {
        setUsername(event.target.value)
    }

    function handleChangeEmail (event) {
        setEmail(event.target.value)
    }

    function handleChangePassword (event) {
        setPassword(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (!password || !username || !email) 
        return toast.error("please input all the fields", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        axios.post(`/profile/edit_detail`, { token, password, username, email, image })
            .then((response) => {
            console.log(response);
            if (response.status === 200) {
                return navigate("/own_profile")
            }
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    function handleClick() {
        return navigate('/own_profile')
    }
    
    useEffect( () => {
        console.log(profileDetails)
        if (profileDetails.username) {
            setUsername(profileDetails.username)
        }
        if (profileDetails.email) {
            setEmail(profileDetails.email)
        }
        if (profileDetails.password) {
            setPassword(profileDetails.password)
        }
        if (profileDetails.profile_pic) {
            setImage(profileDetails.profile_pic)
        }
    },[profileDetails])

    return ( 
        <div className="EditProfilePage">
            <AppBar position="relative" className={classes.AppBar}>
                <Toolbar>
                    <MenuBook className={classes.menuBook} color="secondary"/>
                    <Typography variant='h6' color="secondary">
                        Edit profile
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container fixed maxWidth="md" className={classes.container}>
                <Avatar className={classes.avatar} color="primary" 
                    src={image} alt={profileDetails.username} />
                <input accept="image/*" id="icon-button-file" type="file" hidden 
                    onChange={handleFileUpload}/>
                <label htmlFor="icon-button-file">
                    <IconButton className={classes.iconButton} aria-label="AddAPhoto" component="span">
                        <AddAPhoto />
                    </IconButton>
                </label>
                {image && <IconButton aria-label="delete" onClick={() => handleDelete()}>
                                <DeleteForever />
                            </IconButton>}
                <form noValidate onSubmit={handleSubmit}>
                    <Grid container alignItems='center' direction='column'>
                        <Grid item>
                            <br />
                            <TextField 
                                variant="outlined"
                                id="username"
                                label="Username"
                                name="username"
                                type="text"
                                required
                                onChange={handleChangeUsername}
                                value={username}
                            />
                        </Grid>
                        <Grid item>
                            <br />
                            <TextField 
                                variant="outlined"
                                id="email"
                                label="Email"
                                name="email"
                                type="text"
                                onChange={handleChangeEmail}
                                value={email}
                                required
                            />
                        </Grid>
                        <Grid item>
                            <br />
                            <TextField 
                                variant="outlined"
                                id="password"
                                label="Password"
                                name="password"
                                type="text"
                                onChange={handleChangePassword}
                                value={password}
                                required
                            />
                        </Grid>
                    </Grid>
                    <Grid container alignContent='flex-end' direction='column'>
                        <Grid item>
                            <br />
                            <Button className={classes.button} type="submit" variant="contained" color="primary">Confirm</Button>
                        </Grid>
                        <Grid item>
                            <br />
                            <Button className={classes.button} variant="contained" onClick={handleClick}>Cancel</Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </div>
    );
}
 
export default EditProfilePage;