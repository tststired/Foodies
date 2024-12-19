
import { useState, useEffect } from 'react'
import axios from 'axios';

const useFetchProfile = (u_id) => {
  const token = localStorage.getItem('token');
  const [profileDetails, setProfileDetails] = useState({});

  useEffect(() => {
      axios.get(`/profile/detail`, {params: {token, u_id}} )
      .then((response) => {
        const res = response.data;
        setProfileDetails(res)
      })
      .catch(err => {
          console.log(err.message);
      })

  }, [token, u_id]);

  return profileDetails
  
}

export default useFetchProfile;