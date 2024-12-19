import { Typography, Container, Grid, Divider, ButtonGroup, AppBar, Button, Toolbar, Chip, makeStyles,
    ImageList, ImageListItem, Avatar, IconButton } from "@material-ui/core";
import { MenuBook, AddAPhoto, FavoriteBorder, Favorite, StarBorder, Star } from '@material-ui/icons';
import {toast} from 'react-toastify';
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from 'axios';
import "semantic-ui-css/components/comment.min.css"
import "semantic-ui-css/components/form.min.css"
import { Comment, Form } from "semantic-ui-react"

import RecipeList from "../components/RecipeList";
import CommentSection from "../components/CommentSection"
import ConvertBase64 from "../ConvertBase64";

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
    space: {
        flexGrow: 1
    },
    image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: '20px'
    },
    commentImage: {
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    imageList: {
        flexWrap: "nowrap",
        width: 1200,
        height: 450,
        marginBottom: '20px'
    },
    paragraph: {
        whiteSpace: "pre-wrap"
    },
    avatar: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        padding: "5px"
    },
    paperbase: {
        marginTop: "12px",
        padding: "5px"
    },
    paper: {
        padding: "5px"
    },
    container: {
        marginTop: "48px",
        marginBottom: "96px"
    },
    date: {
        marginLeft: "15px"
    }
}));

const RecipePage = () => {
    const { recipe_id } = useParams()
    const token = localStorage.getItem('token')
    const [recipeDetails, setRecipeDetails] = useState({
        thumbnail: null,
        recipe_name: "",
        user_id: 0,
        username: "",
        profile_pic: "",
        likes: 0,
        stars: 0,
        comments: [],
        ingredients: [{ amount:0,
            unit:'',
            ingredient:''}],
        prep_time: 0,
        method: "",
        recipe_pic: [],
        tags: []
    });
    const [recommandRecipes, setRecommandRecipes] = useState([])
    const [isLiked, setIsLiked] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    const [update, setUpdate] = useState(false)
    const [stars, setStars] = useState(0)
    const [comment, setComment] = useState("")
    const [image, setImage] = useState("")
    const pics_col = (recipeDetails.recipe_pic.length > 3)? 3:recipeDetails.recipe_pic.length
    const pic_col = (recipeDetails.recipe_pic.length > 1)? 1:0.5
    const classes = useStyles();
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`/recipe/get_recipe`, {params: {token, recipe_id}})
        .then((response) => {
            const res = response.data;
            setRecipeDetails(res)
        })
        .catch(err => {
            console.log(err.message);
        })
    }, [recipe_id, token, update]);

    useEffect(() => {
        if (token) {
            axios.get(`/recipe/is_liked`, {params:{token, recipe_id}})
            .then((response) => {
                const res = response.data;
                setIsLiked(res)
            })
            .catch(err => {
                console.log(err.message);
            })
        }   
    }, [recipe_id, token]);

    useEffect(() => {
        if (token) {
            axios.get(`/recipe/is_owner`, {params:{token, recipe_id}})
            .then((response) => {
                const res = response.data;
                setIsOwner(res)
            })
            .catch(err => {
                console.log(err.message);
            })
        }   
    }, [recipe_id, token]);

    useEffect(() => {
        console.log(recipeDetails)
    },[recipeDetails])
    
    function handleHome() {
        return navigate('/')
    }

    function handleDelete() {
        if (token === null) {
            return navigate('/login')
        }
        axios.delete(`/recipe/delete_recipe`, {data:{token, recipe_id}})
        .then((response) => {
            return navigate('/')
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    useEffect(() => {
        axios.get(`/recipe/recommandation`, {params: {token, recipe_id}})
        .then((response) => {
            const res = response.data;
            setRecommandRecipes(res)
        })
        .catch(err => {
            console.log(err.message);
        })
    }, [recipe_id, token]);

    function handleEdit() {
        return navigate(`/edit_recipe/${recipe_id}`)
    }

    function handleLike() {
        if (token === null) {
            return navigate('/login')
        }
        axios.post(`/recipe/likes`, {token, recipe_id})
        .then((response) => {
            setIsLiked(true)
            setUpdate(update?false:true)
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    function handleUnlike() {
        if (token === null) {
            return navigate('/login')
        }
        axios.post(`/recipe/unlikes`, {token, recipe_id})
        .then((response) => {
            setIsLiked(false)
            setUpdate(update?false:true)
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    function handleSubmit() {
        if (token === null) return navigate('/login')
        if (comment === "" || !comment)
            return toast.error("comments must not be blank", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        const comment_id = null
        axios.post(`/comment/add`, {token, stars, comment_id, comment, image, recipe_id})
        .then((response) => {
            setUpdate(update?false:true)
            setStars(0)
            setImage("")
            setComment("")
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    function handleChange(event) {
        setComment(event.target.value)
    }

    function handleStarBorder({index}) {
        setStars(stars+index+1)   
    }

    function handleStar({index}) {
        setStars(index+1)   
    }

    async function handleFileUpload(event) {
        const file = event.target.files[0]
        const base64Image = await ConvertBase64(file)
        setImage(base64Image)
    }

    const StarList = ({count}) => {
        return (
            Array.from({length: (count)}).map((item, index) => <IconButton key={index} aria-label="star" onClick={()=> handleStar({index})}>
                                                            <Star />
                                                        </IconButton>
            )
    )}

    const StarBorderList = ({count}) => {
        return (
            Array.from({length: (5-count)}).map((item, index) => <IconButton key={index} aria-label="starBorder" onClick={()=> handleStarBorder({index})}>
                                                            <StarBorder />
                                                        </IconButton>
            )
    )}

    const StarListDisplay = ({count}) => {
        return (
            Array.from({length: (count)}).map((item, index) => <Star key={index}/>)
    )}
  
    const StarBorderListDisplay = ({count}) => {
        return (
            Array.from({length: (5-count)}).map((item, index) => <StarBorder key={index}/>)
    )}


    return ( 
        <div className="RecipePage">
            <AppBar position="relative" className={classes.AppBar}>
                <Toolbar>
                    <MenuBook className={classes.menuBook} color="secondary"/>
                    <Typography variant='h6' color="secondary">
                        Recipe page
                    </Typography>
                    <ButtonGroup variant="text" className={classes.buttonGroup} color="secondary" size="small" aria-label="text primary button group">
                        <Button onClick={() => handleHome()}>Home</Button>
                    </ButtonGroup>
                </Toolbar>
            </AppBar>
            <Container fixed className={classes.container}>
                <Grid container direction="column">
                    {(recipeDetails.recipe_pic.length >= 2) && 
                        <ImageList rowHeight={400} cols={pics_col} gap={5} className={classes.imageList}>
                            {recipeDetails.recipe_pic.map((p, index) => (
                                <ImageListItem key={index} cols={pic_col}>
                                    <img src={p} alt="recipe_pic" />                             
                                </ImageListItem>
                            ))}
                        </ImageList>}
                    {(recipeDetails.recipe_pic.length === 1) && 
                        <img src={recipeDetails.recipe_pic[0]} alt="recipe_pic" 
                        style= {{flex:1 , maxHeight: 500, minHeight: 450}} className={classes.image}/>}
                    <Grid container direction="row" alignItems="center">
                        <Grid item className={classes.grid}>
                            <Link to={`/other_profile/${recipeDetails.user_id}`}>
                                <Avatar className={classes.avatar} 
                                    src={recipeDetails.profile_pic} alt={recipeDetails.username} />
                            </Link>
                        </Grid>
                        <Grid item className={classes.grid}>
                            <Typography variant='h6'>{recipeDetails.username}</Typography>
                        </Grid>
                        {!isLiked && <IconButton aria-label="like" onClick={() => handleLike()}>
                            <FavoriteBorder />
                        </IconButton>}
                        {isLiked && <IconButton aria-label="liked" onClick={()=> handleUnlike()}>
                            <Favorite />
                        </IconButton>}
                        <Grid item className={classes.grid}>
                            <Typography variant='h6'>{recipeDetails.likes}</Typography>
                        </Grid>
                        <Typography variant='body1' className={classes.date}>Time Created: {recipeDetails.time_created}</Typography>
                        <Typography className={classes.space}> </Typography>
                        <Grid item className={classes.grid}>
                            {isOwner && <Button variant="contained" color="primary" size="small"
                            onClick={handleDelete}>Delete recipe</Button>}
                        </Grid>
                        <Grid item className={classes.grid}>
                            {isOwner && <Button variant="contained" color="primary" size="small"
                            onClick={handleEdit}>Edit recipe</Button>}
                        </Grid>
                    </Grid>
                    {recipeDetails.stars.volume && <Grid container direction="row" alignItems="center">
                        <StarListDisplay count={recipeDetails.stars.stars} />
                        <StarBorderListDisplay count={recipeDetails.stars.stars} />
                        <Grid item className={classes.grid}>
                            <Typography>rated by {recipeDetails.stars.volume} users</Typography>
                        </Grid>
                    </Grid>}
                    <Grid item className={classes.grid}>
                        <Divider variant="middle" />
                    </Grid>
                    <Grid container direction="row" alignItems="center">
                        <Grid item className={classes.grid}>
                            <Typography variant='h4'>{recipeDetails.recipe_name}</Typography>
                        </Grid>
                        <Grid item className={classes.grid}>
                            {(recipeDetails.tags.length !== 0) && <Grid container>
                            {recipeDetails.tags.map((tag, index) => (
                                <Grid item className={classes.grid} key={index}>
                                    <Chip variant="default" color="primary" label={tag} />
                                </Grid>
                            ))}
                            </Grid>}
                        </Grid>
                    </Grid>
                    <Grid container direction="row" alignItems="flex-start">
                        <Grid item className={classes.grid}>
                            <Typography variant='h6'>Ingredients:</Typography>
                        </Grid>
                        <Grid item className={classes.grid}>
                            {recipeDetails.ingredients.map((ing, index) => (
                                <Typography variant='h6' key={index}>{ing.ingredient}: {ing.amount} {ing.unit}</Typography>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid container direction="row" alignItems="center">
                        <Grid item className={classes.grid}>
                            <Typography variant='h6'>Prep time:</Typography>
                        </Grid>
                        <Grid item className={classes.grid}>
                            <Typography variant='h6'>{recipeDetails.prep_time} minutes</Typography>
                        </Grid>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Divider variant="middle" />
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Typography variant='h4'>Tutorial</Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Typography variant='h6' className={classes.paragraph}>{recipeDetails.method}</Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Divider variant="middle" />
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Typography variant='h4'>Comments</Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Comment.Group>
                            {recipeDetails.comments.length !== 0 && <>
                                {recipeDetails.comments.map((e, i)=>
                                <CommentSection key={i} recipe_id={recipe_id} c={e} setUpdate={setUpdate} update={update}/>)} </>}
                            <Form reply onSubmit={handleSubmit}>
                                <StarList count={stars} />
                                <StarBorderList count={stars} />
                                <Form.TextArea value={comment} onChange={handleChange}/>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item className={classes.grid}>
                                        <Button type="submit" variant="contained" color="primary">Comment</Button>
                                    </Grid>
                                    <Grid item className={classes.grid}>
                                        <input accept="image/*" id="icon-button-file" type="file" hidden 
                                        onChange={handleFileUpload}/>
                                        <label htmlFor="icon-button-file">
                                        <IconButton className={classes.iconButton} aria-label="AddAPhoto" component="span">
                                            <AddAPhoto />
                                        </IconButton>
                                        </label>
                                    </Grid>
                                    <Grid item className={classes.grid}>
                                        {image && 
                                        <img src={image} alt="comment_pic" 
                                        style= {{flex:1 , maxHeight: 30, minHeight: 30}} className={classes.commentImage}/>}
                                    </Grid>
                                </Grid>
                            </Form>
                        </Comment.Group> 
                    </Grid>
                    { recommandRecipes.length !== 0 && <>
                        <Grid item className={classes.grid}>
                            <Divider variant="middle" />
                        </Grid>
                        <Grid item className={classes.grid}>
                            <Typography variant='h4'>You might also like...</Typography>
                        </Grid>
                        <RecipeList recipes={recommandRecipes} />
                    </>}
                </Grid>
            </Container>
        </div>
     );
}
 
export default RecipePage;