import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import {Home} from './pages/Home'
import {Dashboard} from './pages/Dashboard'
import { getCurrentUser } from './apis/user.api'
import { getResume } from './apis/resume.api'
import Scorer from './pages/Scorer'
import { useDispatch } from 'react-redux'
import { setResume } from './redux/resumeSlice'

const App = () => {
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(()=>{
    const getUser = async ()=>{
      const data = await getCurrentUser();
      setUser(data?.user);
      setLoading(false);
    }
    getUser();
  },[])

  useEffect(()=>{
    const getResumeData = async ()=>{
      const result = await getResume();
      dispatch(setResume(result.data))
    }
    getResumeData();
  },[])

  if(loading){
    return (
      <div className='fixed top-0 left-0 w-full z-[9999]'>
        <div className='h-2 bg-black animate-pulse w-full'/>
      </div>
    )
  }

  return (
    <>
        <Routes>

            <Route path='/' element={ user? <Navigate to="/dashboard" replace/> :
              <Home setUser={setUser}/>}
            />

            <Route path='/dashboard' element={
              user? <Dashboard user={user} setUser={setUser} /> : 
              <Navigate to="/" replace/>}
            />

            <Route path='/scorer' element={
              user? <Scorer user={user} setUser={setUser} /> : 
              <Navigate to="/" replace/>}
            />

        </Routes>
    </>
  )
}

export default App