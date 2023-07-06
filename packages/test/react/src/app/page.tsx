'use client'

import { Button } from 'antd'
import axios from 'axios'
export default function Home() {
  async function handleClick() {
    const data = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
    console.log(data)
  }
  return (
    <Button onClick={handleClick}>发送网络请求</Button>
  )
}
