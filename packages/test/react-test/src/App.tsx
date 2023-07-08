/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-08 15:43:03
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-08 16:09:55
 */
'use client'

import { Button, Form, Input } from 'antd'
import axios from 'axios'
export default function App() {
  const sendRequest = async (url: string) => {
    const data = await axios.get(url)
    console.log(data)
  }

  function onSubmit(values: any) {
    sendRequest(values.url)
  }

  return (
    <>
      <Button onClick={()=> sendRequest('https://jsonplaceholder.typicode.com/todos/1')}>发送网络请求</Button>
      <Form
        name="basic"
        wrapperCol={{ span: 24 }}
        onFinish={onSubmit}
      >
        <Form.Item label="网络请求" name="url" wrapperCol={{ span: 24 }}>
          <Input placeholder="输入url"/>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 8 }}>
          <Button type="primary" htmlType="submit">
            发送
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
