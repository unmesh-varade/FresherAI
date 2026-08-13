import React from 'react'

export function Dashboard({user, setUser}) {
  return (
    <div className='text-9xl text-amber-200'>
      {user.name}
    </div>
  )
}
