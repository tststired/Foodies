import { Typography, AppBar, Button, Grid, Toolbar, Container, makeStyles, TextField
    } from "@material-ui/core";
import {toast} from 'react-toastify';
import {MenuBook} from '@material-ui/icons';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
    grid: {
        padding: "10px"
    },
    container: {
        marginBottom: '96px',
        marginTop: '48px'
    }
}));

const LoginPage = (props) => {

    const setAuth = props.setAuth;
    const navigate = useNavigate()

    function handleSubmit(event) {
        event.preventDefault();

        const email = event.target[0].value;
        const password = event.target[2].value;

        // validating it is not empty field
        if (!email || !password)
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

        axios.post(`/auth/login`, { email, password })
            .then((response) => {
            console.log(response);
            const res = response.data;
            if (res.code === 200) {
                setAuth(res.token, res.u_id);
                return navigate("/")
            }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const classes = useStyles();

    return (
        <div className="LoginPage">
        <AppBar position="relative">
            <Toolbar>
                <MenuBook className={classes.menuBook} color="secondary"/>
                <Typography variant='h6' color="secondary">
                    Welcome to Octopes
                </Typography>
            </Toolbar>
        </AppBar>
        <Container fixed maxWidth="md" className={classes.container}>
            <Typography className={classes.text} component="h1" variant="h5">Login to Octopes</Typography>
            <form noValidate onSubmit={handleSubmit}>
                <Grid container alignItems='center' direction='column'>
                    <Grid item className={classes.grid}>
                        <TextField 
                            variant="outlined"
                            id="email"
                            label="Email"
                            name="email"
                            type="text"
                        />
                    </Grid>
                    <Grid item className={classes.grid}>
                        <TextField 
                            variant="outlined"
                            id="password"
                            label="Password"
                            name="password"
                            type="text"
                        />
                    </Grid>
                    <Link to="/signup" style={{color:"#689c35"}}>Not a member? Signup</Link>
                    {/* <Link href="/signup" variant="body1" underline="always">Not a member? Signup</Link> */}
                </Grid>
                <Grid container alignContent='flex-end' direction='column' >
                    <Grid item className={classes.grid}>
                        <Button type="submit" variant="contained" color="primary">Login</Button>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Link to="/" style={{color:"#689c35"}}>continue without an account</Link>
                        {/* <Link href="/" variant="body1">continue without an account</Link> */}
                    </Grid>
                </Grid>
            </form>
        </Container> 
        </div>
    )
}


export default LoginPage;