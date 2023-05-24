import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { user } from 'reducers/user'
import { API_URL } from 'utils/urls'
import styled from 'styled-components'

export const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState("login")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const accessToken = useSelector(store => store.user.accessToken);
  useEffect(() => {
    if (accessToken) {
      navigate("/")
    }
  }, [accessToken])

  const onFormSubmit = (event) => {
    event.preventDefault()
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: username, password: password })
    }
    fetch(API_URL(mode), options)
      .then(lalalala => lalalala.json())
      .then(potato => {
        if (potato.success) {
          console.log(potato)
          dispatch(user.actions.setAccessToken(potato.response.accessToken))
          dispatch(user.actions.setUsername(potato.response.username))
          dispatch(user.actions.setUserId(potato.response.id))
          dispatch(user.actions.setError(null))
        } else {
          dispatch(user.actions.setAccessToken(null))
          dispatch(user.actions.setUsername(null))
          dispatch(user.actions.setUserId(null))
          dispatch(user.actions.setError(potato.response))
        }
      })
  }
  return (
    <StyledForm>
      <RadioDiv>
        <RadioDivSmall>
          <label htmlFor="signup">Sign up!</label>
          <input
            type="radio"
            id="signup"
            checked={mode === "signup"}
            onChange={() => setMode("signup")} />
        </RadioDivSmall>
        <RadioDivSmall>
          <label htmlFor="login">Login</label>
          <input
            type="radio"
            id="login"
            checked={mode === "login"}
            onChange={() => setMode("login")} />
        </RadioDivSmall>
      </RadioDiv>
      <form onSubmit={onFormSubmit}>
        <FormDiv>
          <label htmlFor="username" />
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)} />
          <label htmlFor="password" />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)} />
        </FormDiv>
        <StyledButton type="submit">Submit</StyledButton>
      </form>
    </StyledForm>

  )
}

const StyledForm = styled.div`
border: solid 2px blue;
width: 100vw; 
display: flex;
flex-direction: column;
align-items: center;
gap: 16px;
`

const RadioDiv = styled.div`
display: flex;
gap: 16px;
`

const RadioDivSmall = styled.div`
align-items:center;
`

const FormDiv = styled.div`
display: flex;
gap: 10px;
`

const SubmitForm = styled.div`
display: flex;
flex-direction: column;
align-items: center;
gap: 10px;
`

const StyledButton = styled.button`
border-radius: 6px;
border: none;
background-color: #A53860;
color: white;
padding: 2px 16px;
`