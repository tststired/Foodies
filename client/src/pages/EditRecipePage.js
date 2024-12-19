import { Typography, TextField, Select, MenuItem, Divider, AppBar, Card, CardMedia, CardContent, 
  ImageList, ImageListItem, Button, IconButton, Grid, Toolbar, Container, makeStyles
} from "@material-ui/core";
import {toast} from 'react-toastify';
import {MenuBook, AddAPhoto} from '@material-ui/icons';
import axios from 'axios';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import ConvertBase64 from "../ConvertBase64";

const useStyles = makeStyles(theme => ({

  AppBar: {
      color: "primary",
  },
  menuBook: {
      marginRight: "10px"
  },
  grid: {
      padding: "10px"
  }, 
  container: {
      marginTop: "48px",
      marginBottom: "96px"
  },
  card: {
      height:200,
      width:300,
      borderRadius: 20,
      textAlign: "center",
  },
  media: {
      height: 0,
      paddingTop: "70%"
  },
  imageList: {
      flexWrap: "nowrap",
      width: 800,
      height: 200
  }
}));

const EditRecipePage = () => {
  const { recipe_id } = useParams()
  const classes = useStyles();
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const [values, setValues] = useState({
      thumbnail: null,
      recipe_name:'',
      ingredients: [{ amount:0,
                  unit:'',
                  ingredient:''}],
      prep_time: 0,
      method:'',
      meal_type:'',
      recipe_pic: [],
      recipe_vid: null
  })
  const [ings, setIngs] = useState([])
  const [ing, setIng] = useState({amount:0,
                              unit:'',
                              ingredient:''})
  const [pics, setPics] = useState([])

  useEffect(() => {
    axios.get(`/recipe/get_recipe`, {params: {token, recipe_id}})
    .then((response) => {
        const res = response.data;
        console.log(res)
        setValues(res)
        setIngs(res.ingredients)
        setPics(res.recipe_pic)
    })
    .catch(err => {
        console.log(err.message);
    })
}, [recipe_id, token]);


  useEffect(() => {
      setIng({amount:0,
          unit:'',
          ingredient:''})
      setValues({ ...values, ['ingredients']:ings })
      console.log(ings)
  }, [ings])

  useEffect(() => {
      console.log(values.ingredients)
  }, [values.ingredients])

  useEffect(() => {
      setValues({ ...values, ['recipe_pic']:pics })
  }, [pics])

  useEffect(() => {
      console.log(values.recipe_pic.length)
  }, [values.recipe_pic])

  async function handleThumbnailUpload(event) {
      const file = event.target.files[0]
      const base64Image = await ConvertBase64(file)
      setValues({ ...values, ['thumbnail']:base64Image })
  }

  function handleRemove() {
      setValues({ ...values, ['thumbnail']: null })
  }

  async function handlePicUpload(event) {
      const file = event.target.files[0]
      const base64Image = await ConvertBase64(file)
      setPics([...pics, base64Image])
  }

  const handleChangeIng = name => event => {
      setIng({ ...ing, [name]: event.target.value })
  }

  function handleAddIng(){
      setIngs([...ings, ing])
  }

  function handleRemoveIng({index}) {
    const arr = [...ings]
    arr.splice(index,1)
    setIngs(arr)
}

  const handleChange = name => event => {
      setValues({ ...values, [name]:event.target.value })
  }

  function handleClick() {
      return navigate(`/recipe/${recipe_id}`)
  }

  function handleSubmit(event) {
      event.preventDefault();
      if (!values.recipe_name 
        || values.ingredients[0].amount === 0 
        || !values.ingredients[0].ingredient
        || !values.ingredients[0].unit
        || !values.prep_time 
        || !values.method 
        || !values.meal_type)
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
      console.log(values)
      axios.post(`/recipe/edit_recipe`, { token, 
        recipe_id: recipe_id,
          thumbnail: values.thumbnail,
          recipe_name: values.recipe_name, 
          ingredients: values.ingredients,
          prep_time: values.prep_time,
          method: values.method,
          meal_type: values.meal_type,
          recipe_pic: values.recipe_pic,
          recipe_vid: values.recipe_vid
          })
          .then((response) => {
          console.log(response);
          if (response.status === 200) {
              return navigate(`/recipe/${recipe_id}`)
          }
          })
          .catch(err => {
              console.log(err.message);
          })

  }
  
  return (
    <div className="EditRecipePage">
        <AppBar position="relative">
            <Toolbar>
                <MenuBook className={classes.menuBook} color="secondary"/>
                <Typography variant='h6' color="secondary">
                    Add a recipe
                </Typography>
            </Toolbar>
        </AppBar>
        <Container fixed maxWidth="lg" className={classes.container}>
            <Grid container>
                <form noValidate onSubmit={handleSubmit}>
                    <Grid item className={classes.grid}>
                        <Typography variant='h6'>Dish name</Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <TextField 
                            variant="outlined"
                            id="recipe_name"
                            name="recipe_name"
                            type="text"
                            value={values.recipe_name}
                            onChange={handleChange('recipe_name')}
                        />
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Typography variant='h6'>Thumbnail</Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Card className={classes.card}>
                            { !values.thumbnail && <CardContent>
                                <p>Upload a thumbnail photo</p>
                                <input accept="image/*" id="icon-button-file" type="file" hidden 
                                    onChange={handleThumbnailUpload}/>
                                <label htmlFor="icon-button-file">
                                    <IconButton className={classes.iconButton} aria-label="AddAPhoto" component="span">
                                        <AddAPhoto />
                                    </IconButton>
                                </label>
                            </CardContent>}
                            { values.thumbnail && <CardMedia
                                className={classes.media}
                                image={values.thumbnail}
                                title="thumbnail"
                            />}
                        </Card>
                        <br/>
                        { values.thumbnail && <Button variant='contained'
                            onClick={handleRemove}>remove photo</Button> }
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Typography variant='h6'>Add photos</Typography>
                    </Grid>
                    {(pics.length !== 0) && <Grid item className={classes.grid}>
                        <ImageList className={classes.imageList} cols={2.5}>
                            {pics.map((p, index) => (
                            <ImageListItem key={index}>
                                <img src={p} alt="recipe_pic" />                             
                            </ImageListItem>
                            ))}
                        </ImageList>
                    </Grid>}
                    <Grid item className={classes.grid}>
                        <input accept="image/*" id="icon-button-file2" type="file" hidden 
                            onChange={handlePicUpload}/>
                        <label htmlFor="icon-button-file2">
                            <IconButton className={classes.iconButton} aria-label="AddAPhoto" component="span">
                                <AddAPhoto />
                            </IconButton>
                        </label>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Typography variant='h6'>Meal type</Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Select
                            variant="outlined"
                            labelId="meal_type"
                            id="meal_type"
                            name="meal_type"
                            label="Meal_type"
                            value ={values.meal_type}
                            onChange={handleChange('meal_type')}
                        >
                            <MenuItem value='breakfast'>Breakfast</MenuItem>
                            <MenuItem value='lunch'>Lunch</MenuItem>
                            <MenuItem value='dinner'>Dinner</MenuItem>
                            <MenuItem value='dessert'>Dessert</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Typography variant='h6'>Prep time</Typography>
                    </Grid>
                    <Grid container alignItems="center">
                        <Grid item className={classes.grid}>
                            <TextField 
                                variant="outlined"
                                id="prep_time"
                                name="prep_time"
                                type="number"
                                value={values.prep_time}
                                onChange={handleChange('prep_time')}
                            />
                        </Grid>
                        <Grid item className={classes.grid}>
                            <Typography variant='h6'>Minutes</Typography>
                        </Grid>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Typography variant='h6'>Ingredient</Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        {values.ingredients.map((i, index) => (
                        <div className='listIngs' key={index}>
                            <Grid container direction="row" alignItems="center">
                                <Grid item className={classes.grid}>
                                    <Typography>{i.amount} {i.unit} {i.ingredient}</Typography>
                                </Grid>
                                <Grid item className={classes.grid}>
                                <Button variant='contained' size="small" onClick={()=>handleRemoveIng({index})}>remove</Button>     
                                </Grid>
                            </Grid>
                        </div>
                        ))}
                    </Grid>
                    <Divider variant="middle" />
                    <Grid container alignItems="center">
                        <Grid item className={classes.grid}>
                            <TextField 
                                variant="outlined"
                                id="amount"
                                name="amount"
                                type="number"
                                value={ing.amount}
                                onChange={handleChangeIng('amount')}
                            />
                        </Grid>
                        <Grid item className={classes.grid}>
                            <Typography variant='h6'>Amount</Typography>
                        </Grid>
                        <Grid item className={classes.grid}>
                            <Select
                                variant="outlined"
                                labelId="unit"
                                id="unit"
                                name="unit"
                                label="Unit"
                                value={ing.unit}
                                onChange={handleChangeIng('unit')}
                            >
                                <MenuItem value='mL'>mL</MenuItem>
                                <MenuItem value='L'>L</MenuItem>
                                <MenuItem value='mg'>mg</MenuItem>
                                <MenuItem value='g'>g</MenuItem>
                                <MenuItem value='kg'>kg</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item className={classes.grid}>
                            <Typography variant='h6'>Unit</Typography>
                        </Grid>
                        <Grid item className={classes.grid}>
                            <TextField 
                                variant="outlined"
                                id="ingredient"
                                label="Ingredient"
                                name="ingredient"
                                type="text"
                                value={ing.ingredient}
                                onChange={handleChangeIng('ingredient')}
                            />
                        </Grid>
                        <Grid item className={classes.grid}>
                            <Button variant="contained" color="primary" onClick={handleAddIng}>
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Typography variant='h6'>Method</Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <TextField 
                            variant="outlined"
                            id="method"
                            name="method"
                            type="text"
                            value={values.method}
                            onChange={handleChange('method')}
                            fullWidth
                            multiline
                            minRows={10}
                        />
                    </Grid>
                    <Grid container justifyContent="flex-end">
                        <Grid item className={classes.grid}>
                            <Button className={classes.button} variant="contained" onClick={handleClick}>Cancel</Button>
                        </Grid>
                        <Grid item className={classes.grid}>
                            <Button type="submit" variant="contained" color="primary">Submit</Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Container>
    </div>
  );
}

export default EditRecipePage;