import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import OwnProfilePage from './pages/OwnProfilePage'
import OtherProfilePage from './pages/OtherProfilePage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import RecipePage from './pages/RecipePage'
import EditProfilePage from './pages/EditProfilePage'
import AddRecipePage from './pages/AddRecipePage'
import EditRecipePage from './pages/EditRecipePage';
import ProtectedRoute from './ProtectedRoute'
import { AuthProvider } from './AuthContext';
import './axios'



function App() {
  const [authDetails, setAuthDetails] = useState(
    {token: localStorage.getItem('token'),
    id: localStorage.getItem('u_id')}
  );


  function setAuth(token, u_id) {
    localStorage.setItem('token', token);
    localStorage.setItem('u_id', u_id);
    setAuthDetails(token);
  }

  return (
    <AuthProvider value={authDetails}>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/login' element={
            <LoginPage setAuth={setAuth} />
          }/>
          <Route path='/signup' element={
            <SignupPage setAuth={setAuth} />
          }/>
          <Route path='/recipe/:recipe_id' element={<RecipePage/>} />
          <Route path='/other_profile/:user_id' element={<OtherProfilePage/>} />
          <Route path='/own_profile' 
            element={<ProtectedRoute Component={OwnProfilePage}/>}
          />
          <Route path='/edit_profile' 
            element={<ProtectedRoute Component={EditProfilePage} />}
          />
          <Route path='/add_recipe' 
            element={<ProtectedRoute Component={AddRecipePage} />}
          />
          <Route path='/edit_recipe/:recipe_id' 
            element={<ProtectedRoute Component={EditRecipePage} />}
          />
        </Routes>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
