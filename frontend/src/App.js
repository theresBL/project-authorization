import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotFound } from 'components/NotFound'
import { Welcome } from 'components/Welcome'
import { Login } from 'components/Login'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { user } from 'reducers/user'
import { welcome } from 'reducers/welcome'
import { Provider } from 'react-redux'

export const App = () => {

  const reducer = combineReducers({
    user: user.reducer,
    welcome: welcome.reducer
  })
  const store = configureStore({ reducer })

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}> </Route>
          <Route path='/' element={<Welcome />}> </Route>
          <Route path='*' element={<NotFound />}> </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

/// npm i react-redux
/// npm i @reduxjs/toolkit
/// npm i react-router-dom