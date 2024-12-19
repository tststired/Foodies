import { Grid, Card, CardHeader, CardMedia, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom"
 

const useStyles = makeStyles((theme) => ({
    card: {
        height:300,
        width:400,
        marginTop: '70px',
        borderRadius: 20
    },
    media: {
        height: 0,
        paddingTop: '70%'
    },
    grid: {
        padding: '10px'
    }
}));

const RecipeList = ({recipes}) => {
    const classes = useStyles();
    return ( 
        <div className='RecipeList'>
            {recipes && <Grid container spacing={10} justifyContent="space-around">
                {recipes.map((recipe) => (
                <div className='recipeSummary' key={recipe.recipe_id}>
                    <Grid item className={classes.grid}>
                        <Card variant="outlined" className={classes.card}>
                            <CardHeader
                                title={ recipe.recipe_name }
                                subheader={ recipe.author }
                            />
                            <Link to={`/recipe/${recipe.recipe_id}`}>
                                <CardMedia
                                    className={classes.media}
                                    image={recipe.thumbnail}
                                    title="thumbnail"
                                />
                            </Link>
                        </Card>
                    </Grid>             
                </div>
                ))}
            </Grid>}
        </div>
     );
}
 
export default RecipeList;