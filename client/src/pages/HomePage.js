import { makeStyles } from "@material-ui/core";
import { Container } from "@material-ui/core";
import Navbar from "../components/Navbar";
import RecipeList from "../components/RecipeList";
import { useState } from "react";

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: "48px",
        marginBottom: "96px"
    },
}))

const HomePage = () => {
    const classes = useStyles();
    const [recipes, setRecipes] = useState([])

    return (
        <div className="HomePage">
            <Navbar setRecipes={setRecipes}/>
            <Container fixed className={classes.container}>
                <RecipeList recipes={recipes}/>
            </Container> 
        </div>
    );
}
 
export default HomePage;