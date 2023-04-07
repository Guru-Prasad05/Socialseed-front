import React from 'react'
import PageTitle from '../components/PageTitle'

export default function Post() {
  return (
    <form>
        <PageTitle title={}/>
        <input type='file' name='file'placeholder='Upload post...'/>
        <input type='text' name='caption'/>
    </form>
  )
}
