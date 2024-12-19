import { Typography, Avatar, Divider, Grid, Button, makeStyles, Chip
} from "@material-ui/core";
import { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";

const useStyles = makeStyles(theme => ({

    avatar: {
        width: theme.spacing(20),
        height: theme.spacing(20),
    },
    grid: {
        padding: "10px"
    },
    space: {
        flex: 1
    }
}));

const Profile = ({profileDetails, add, sub, unSub}) => {
    const id = localStorage.getItem("u_id")
    const [isOwn,setIsOwn] = useState(false) 
    const classes = useStyles();
    const [missions, setMissions] = useState([])
    
    useEffect(()=>{
        if (Object.keys(profileDetails).length !== 0) {
            const arr = []
            arr.push({title:"influencer", description: "gain 5 subscribers", complete: Math.min((profileDetails.subscribers/5)*100, 100)},)
            arr.push({title:"explorer", description: "subscribe to 5 contributors", complete: Math.min((profileDetails.subscribing/5)*100, 100)})
            arr.push({title:"contributor", description: "post 5 recipes", complete: Math.min((profileDetails.recipes/5)*100, 100)})
            setMissions(arr)
            setIsOwn(id===profileDetails.u_id.toString())
        }
    },[profileDetails])
    
    return (
        <>
            <Grid container direction="row" alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Grid container direction="row" alignItems="center">
                        <Grid item className={classes.grid}>
                            <Avatar className={classes.avatar} color="primary"
                                src={profileDetails.profile_pic} alt={profileDetails.username} />
                        </Grid>
                        <Grid item className={classes.grid}>
                            <Grid container direction="column">
                                <Typography variant='subtitle1'>Username: {profileDetails.username}</Typography>
                                <Typography variant='subtitle1'>Email: {profileDetails.email}</Typography>
                                <Typography variant='subtitle1'>User ID: {profileDetails.u_id}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item className={classes.grid}>
                    {(isOwn) && <Grid container direction="column" alignItems="center" >
                        {missions.map((mission, index) => (
                            <div className='missions' key={index}>
                                <Grid item>
                                    <Typography>{mission.description}</Typography>
                                </Grid>
                                <Grid item>
                                    <ProgressBar completed={mission.complete} />
                                </Grid>
                            </div>
                        ))}
                    </Grid> }
                </Grid>
            </Grid>
            {(missions.length !== 0) && <Grid container>{missions.map((mission, index) => (
                (mission.complete===100) &&
                    <Grid item className={classes.grid} key={index}>
                        <Chip variant="outlined" color="primary" label={mission.title} />
                    </Grid>
                ))}
            </Grid>}
            <Grid container alignItems="center">
                <Grid item className={classes.grid}>
                    <Typography variant='body1'>Subscribers: {profileDetails.subscribers}</Typography>
                </Grid>
                <Grid item className={classes.grid}>
                    <Typography variant='body1'>Subscriptions: {profileDetails.subscribing}</Typography>
                </Grid>
                <Grid item className={classes.grid}>
                    <Typography variant='body1'>Recipes: {profileDetails.recipes}</Typography>
                </Grid>
                <Grid item className={classes.grid}>
                    <Typography variant='body1'>Reviews: {profileDetails.reviews}</Typography>
                </Grid>
                <Typography className={classes.space}> </Typography>
                <Grid item className={classes.grid}>
                    {sub && <Button variant="contained" color="primary" size="small" className={classes.button}
                            onClick={sub}>Subscribe</Button>}
                    {unSub && <Button variant="contained" size="small" className={classes.button}
                            onClick={unSub}>UnSubscribe</Button>}
                    {add && <Button variant="contained" color="primary" size="small" className={classes.button}
                            onClick={add}>Add recipe</Button>}
                </Grid>
            </Grid>
            <br/>
            <Divider variant="middle" />
        </>
    )
}

export default Profile;