import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Greeting from './Greeting'
import Intro from './Intro'
import Loading from './Loading'
import Final from './Final'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Greeting />} />
      <Route path="/intro" element={<Intro />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/final" element={<Final />} />
    </Routes>
  )
}
