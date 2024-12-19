import AuthContext from "./AuthContext";
import { useState, useEffect, useContext } from 'react'
import axios from 'axios';

const useFetchRecipes = (queryStr, tags) => {
    const token = localStorage.getItem('token');
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        if (queryStr === null | tags === 'home') {
            axios.get(`/search/newsfeed`, {params: {token}} )
            .then((response) => {
                const res = response.data;
                setRecipes(res)
            })
            .catch(err => {
                console.log(err.message);
        })
        }
    });

    useEffect(() => {
        if (queryStr.length !== 0 | tags.length !== 0) {
            axios.get(`/search/search_recipes`, {params: {token, queryStr, tags}} )
            .then((response) => {
                const res = response.data;
                setRecipes(res)
            })
            .catch(err => {
                console.log(err.message);
        })
        }
    }, [tags]);

    return recipes
    
}
 
export default useFetchRecipes;