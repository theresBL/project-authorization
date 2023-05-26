import React, { useEffect } from 'react'
import styled from 'styled-components/macro'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { welcome } from 'reducers/welcome'
import { API_URL } from 'utils/urls'
import { user } from 'reducers/user'
import { SquareButton } from 'lib/SquareBtn'
import { Header } from 'lib/Header'

const StyledLogoutBtn = styled.button`
background: #A53860;
justify-content:center;
width: 30%; 
border-radius: 10px; 
`

const StyledBtnGroup = styled.div`
display: flex; 
gap: 50px; 
justify-content: center; 
margin-top: 5rem; 
`

export const Welcome = () => {
  const welcomeItems = useSelector((store) => store.welcome.items)
  const dispatch = useDispatch()
  const accessToken = useSelector(store => store.user.accessToken)
  const username = useSelector(store => store.user.username)
  const navigate = useNavigate()
  useEffect(() => {
    if (!accessToken) {
      navigate("/login")
    }
  }, [accessToken])

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": accessToken
      }
    }
    fetch(API_URL("welcome"), options)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispatch(welcome.actions.setError(null))
          dispatch(welcome.actions.setItems(data.response))
        } else {
          dispatch(welcome.actions.setError(response))
          dispatch(welcome.actions.setItems([]))
        }
      })
  })

  const onLogoutButtonClick = () => {
    dispatch(user.actions.setAccessToken(null))
    dispatch(user.actions.setUsername(null))
    dispatch(user.actions.setUserId(null))
    dispatch(user.actions.setError(null))
    dispatch(welcome.actions.setItems([]))
  }
  return (
    <>
    <Header headerTitle="Welcome back! What do you want to do today?"></Header>
    <StyledBtnGroup>
      <SquareButton buttonText="Recent"></SquareButton>
      <SquareButton buttonText="Favorites"></SquareButton>
    </StyledBtnGroup>
    <StyledLogoutBtn type="button" onClick={onLogoutButtonClick}>LOGOUT</StyledLogoutBtn>

    </>
  )      
}
