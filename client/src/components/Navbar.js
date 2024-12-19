import { Typography, AppBar, Button, ButtonGroup, Toolbar, makeStyles, Paper, InputBase
    } from "@material-ui/core";
import {MenuBook, Search} from '@material-ui/icons';
import { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        flexGrow: 1,
        alignItems: 'center',
        width: 400,
        marginLeft: '50px',
        marginRight: "100px"
    },
    input: {
        flexGrow: 1,
    },
    iconButton: {
        padding: 10,
    },
    AppBar: {
        color: "primary",
    },
    buttonGroup: {
        marginLeft: "50px",
    },
    menuBook: {
        marginRight: "10px"
    },
    button: {
        padding: "5px",
    }
}));

const Navbar = ({setRecipes}) => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [queryStr, setQueryStr] = useState("")
    const [tags, setTags] = useState("")

    useEffect(() => {
        if (tags === 'home' || (tags.length === 0 && queryStr.length === 0)) {
            axios.get(`/search/newsfeed`, {params: {token}} )
            .then((response) => {
                const res = response.data;
                setRecipes(res)
            })
            .catch(err => {
                console.log(err.message);
        })
        } else if (queryStr.length !== 0 || tags.length !== 0) {
            axios.get(`/search/search_recipes`, {'params': {token, queryStr, tags}})
            .then((response) => {
                const res = response.data;
                console.log(res)
                setRecipes(res)
            })
            .catch(err => {
                console.log(err.message);
        })
        }
    }, [tags, queryStr]);


    function handleClick(tag) {
        setQueryStr("")
        setTags(tag)
    }

    function handleChangeQuery(event) {
        setTags("")
        setQueryStr(event.target.value)
    }

    function handleNavigate(link) {
        return navigate(link)
    }

    const classes = useStyles();

    return (
        <AppBar position="relative">
            <Toolbar>
                <MenuBook className={classes.menuBook} color="secondary"/>
                <Typography variant='h6' color="secondary">
                    Octopes
                </Typography>
                <ButtonGroup variant="text" className={classes.buttonGroup} color="secondary" size="small" aria-label="text primary button group">
                    <Button onClick={() => handleClick('home')}>Home</Button>
                    <Button onClick={() => handleClick('breakfast')}>Breakfast</Button>
                    <Button onClick={() => handleClick('lunch')}>Lunch</Button>
                    <Button onClick={() => handleClick('dinner')}>Dinner</Button>
                    <Button onClick={() => handleClick('dessert')}>Dessert</Button>
                </ButtonGroup>
                <Paper component='form' className={classes.root}>
                    <InputBase
                        className={classes.input}
                        placeholder="Search recipes"
                        inputProps={{ 'aria-label': 'Search recipes'}}
                        name="queryStr"
                        type="queryStr"
                        id="queryStr"
                        value={queryStr}
                        onChange={(event) => handleChangeQuery(event)}
                    />
                    <Search className={classes.iconButton}/>
                </Paper>
                <Typography className={classes.space}> </Typography>
                {token
                    ? <Button variant="outlined" className={classes.button} color="secondary" size="small"
                        onClick={()=>handleNavigate('/own_profile')}>profile</Button>
                    : <Button variant="outlined" className={classes.button} color="secondary" size="small"
                        onClick={()=>handleNavigate('/login')}>login</Button>
                }   
            </Toolbar>
        </AppBar>
    )
}
 
export default Navbar;