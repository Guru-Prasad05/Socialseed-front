import React from 'react'
import styled from 'styled-components'
import BottomBox from '../components/Auth/BottomBox'
import image from "../resources/socialseed_404.gif"


const Container=styled.div``
const HeadingTxt=styled.div``
const Gif=styled.div`
  background-image:url(image);
`
const Msg=styled.div``
const Text=styled.p``

export default function Notfound() {
  return (
    <Container>
      <HeadingTxt>404</HeadingTxt>
      <Gif/>
      <Msg>
        <Text>Look like you're lost</Text>
        <Text>The page you are looking for not available</Text>
      </Msg>
      <BottomBox cta="xxx" link="/" linkText="Go to Home"/>
    </Container>
  )
}
