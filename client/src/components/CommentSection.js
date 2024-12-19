import "semantic-ui-css/components/comment.min.css"
import "semantic-ui-css/components/form.min.css"
import "semantic-ui-css/components/button.min.css"
import "semantic-ui-css/components/icon.min.css"

import axios from 'axios';
import { Grid } from "@material-ui/core";
import { StarBorder, Star } from '@material-ui/icons';
import { Comment, Form, Button } from "semantic-ui-react"
import {toast} from 'react-toastify';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const CommentSection = ({c, recipe_id, setUpdate, update}) => {

  const token = localStorage.getItem('token')
  const uid = localStorage.getItem('u_id')
  const isOwner = (uid===c.uid.toString())
  const [hideReply , setHideReply] = useState(true)
  const [comment, setComment] = useState("")
  const [stars, setStars] = useState(c.stars)
  const navigate = useNavigate()

  function handleDelete() {
    const comment_id = c.comment_id
    axios.delete(`/comment/delete`, {data:{token, recipe_id, comment_id}})
    .then((response) => {
        setUpdate(update?false:true)
    })
    .catch(err => {
        console.log(err.message);
    })
  }

  const StarList = ({count}) => {
      return (
          Array.from({length: (count)}).map((item, index) => <Star key={index}/>)
  )}

  const StarBorderList = ({count}) => {
      return (
          Array.from({length: (5-count)}).map((item, index) => <StarBorder key={index}/>)
  )}

  return (
      <Comment>
      <Comment.Avatar href={`/other_profile/${c.uid}`} src={c.profile_images?c.profile_images: 'https://react.semantic-ui.com/images/avatar/small/matt.jpg'}/>
      <Comment.Content>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Comment.Author as='a'>{c.username}</Comment.Author>
          </Grid>
          <Grid item>
            <Comment.Metadata>
              <div>{c.time_created}</div>
            </Comment.Metadata>
          </Grid>
          {stars !== 0 && <Grid item>
            <StarList count={stars} />
            <StarBorderList count={stars} />
          </Grid>}
        </Grid>
        {(c.comment_images) && 
          <img src={c.comment_images} alt="comment_pic" 
          style= {{flex:1 , maxHeight: 200, minHeight: 150}}/>}
        <Comment.Text>{c.comment}</Comment.Text>
        <Comment.Actions>
          <Comment.Action onClick = {()=>{setHideReply(!hideReply)}}>Reply</Comment.Action>
          {isOwner && <Comment.Action onClick = {()=>{handleDelete()}}>Delete</Comment.Action>}
          <Form reply hidden = {hideReply} onSubmit={()=>{
              if(!comment || comment === "") 
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
              const image = null
              const comment_id = c.comment_id
              axios.post(`/comment/add`, {token, stars:0, comment_id, comment, image, recipe_id})
              .then((response) => {
                  if (token === null) return navigate('/login')
                  setUpdate(update?false:true)
                  setComment("")
                  setHideReply(true)
              })
              .catch(err => {
                  console.log(err.message);
              })
          }}>
            <Form.TextArea value={comment} onChange={(e => setComment(e.target.value))}/>
            <Button type="submit" content='Add Reply' labelPosition='left' icon='edit' primary />
        </Form>
        </Comment.Actions>
        <Comment.Group> 
          {c.children && c.children.length > 0 && (c.children.map((e, i)=>{
              return <CommentSection key = {i} c = {e} recipe_id = {recipe_id} setUpdate = {setUpdate} update = {update}/>
          }))}
        </Comment.Group>
      </Comment.Content>
    </Comment>
   )
}
export default CommentSection;