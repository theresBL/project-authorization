import React from 'react'
import styled from 'styled-components/macro'

const StyledHeader = styled.div`
border: 2px solid orange;
height: 250px;
border-radius: 11px 20px 16rem 13rem;
background-color: #61C9A8;
`

const StyledHeaderTitle = styled.h2`
color: white; 
text-align: center;
margin: 80px 30px 10px 10px;
`

export const Header = ({ headerTitle, className }) => {
  return(
    <StyledHeader className={className}>
      {headerTitle && <StyledHeaderTitle>{headerTitle}</StyledHeaderTitle>}
    </StyledHeader>
  )
}