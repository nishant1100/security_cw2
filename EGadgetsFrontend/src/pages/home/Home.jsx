import React from 'react'
import Banner from './Banner'
import { TopSellers } from './TopSellers'
import Recommened from './Recommended'
import Newsmail from './Newsmail'

const Home = () => {
  return (
    <>
        <Banner/>
        <TopSellers/>
        <Recommened/>
        <Newsmail/>
    </>
  )
}

export default Home