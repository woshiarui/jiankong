<script setup>
import axios from 'axios'
import { reactive } from 'vue'

const sendRequest = async (url) => {
  const data = await axios.get(url)
  console.log(data)
}

const form = reactive({
  url: '',
})

function onSubmit() {
  sendRequest(form.url)
}

</script>

<template>
  <el-button @click="sendRequest('https://jsonplaceholder.typicode.com/todos/1')">发送网络请求</el-button>
  <el-form :model="form">
    <el-form-item label="网络请求">
      <el-input v-model="form.url" placeholder="输入url" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">发送</el-button>
    </el-form-item>
  </el-form>
</template>