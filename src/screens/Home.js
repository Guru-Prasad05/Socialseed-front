import React from 'react'
import { logUserOut } from '../apollo'

export default function Home() {
  return (
    <div>
     <h1>Welcome</h1> 
     <button onClick={()=>logUserOut()}>Log out now!</button>
    </div>
  )
}
