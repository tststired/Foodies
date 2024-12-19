import { Typography, AppBar, Button, Grid, Toolbar, Container, makeStyles, TextField,
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


const SignupPage = (props) => {

    const setAuth = props.setAuth;
    const navigate = useNavigate()

    function handleSubmit(event) {
        event.preventDefault();

        const username = event.target[0].value;
        const email = event.target[2].value;
        const password = event.target[4].value;

        // validating it is not empty field
        if (!email || !password || !username) 
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

        axios.post(`/auth/signup`, { username, email, password })
            .then((response) => {
            console.log(response);
            const res = response.data;
            console.log(res)
            if (res.code === 200) {
                setAuth(res.token, res.u_id);
                return navigate("/")
            }
        })
    }

    const classes = useStyles();

    return (
        <div className="SignupPage">
        <AppBar position="relative">
            <Toolbar>
                <MenuBook className={classes.menuBook} color="secondary"/>
                <Typography variant='h6' color="secondary">
                    Welcome to Octopes
                </Typography>
            </Toolbar>
        </AppBar>
        <Container fixed maxWidth="md" className={classes.container}>
            <Typography className={classes.text} component="h1" variant="h5">Signup for Octopes</Typography>
            <form noValidate onSubmit={handleSubmit}>
                <Grid container alignItems='center' direction='column'>
                    <Grid item className={classes.grid}>
                        <TextField 
                            variant="outlined"
                            id="username"
                            label="username"
                            name="username"
                            type="text"
                        />
                    </Grid>
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
                    {/* <Link href="/login" variant="body1" underline="always">Already have an account? Login</Link> */}
                    <Link to="/login" style={{color:"#689c35"}}>Already have an account? Login</Link>
                </Grid>
                <Grid container alignContent='flex-end' direction='column'>
                    <Grid item className={classes.grid}>
                        <Button type="submit" variant="contained" color="primary">Sign up</Button>
                    </Grid>
                    <Grid item className={classes.grid}>
                        {/* <Link href="/" variant="body1">continue without an account</Link> */}
                        <Link to="/" style={{color:"#689c35"}}>continue without an account</Link>
                    </Grid>
                </Grid>
            </form>
        </Container> 
        </div>
    )
}


export default SignupPage;