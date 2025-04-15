import HeroSection from '@/components/HeroSection'
import Navbar from '@/components/Navbar'
import React from 'react'
import Footer from '@/components/Footer'
import Articles from '@/components/Articles'

function Home() {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <Articles/>
    <Footer/>
    </>
  )
}

export default Home