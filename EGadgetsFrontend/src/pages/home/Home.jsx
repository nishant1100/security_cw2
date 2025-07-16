import React from 'react'
import Banner from './Banner'
import { TopSellers } from './TopSellers'
import Recommened from './Recommended'

const Home = () => {
  return (
    <>
        <Banner/>
        <TopSellers/>
        <Recommened/>
    </>
  )
}

export default Home