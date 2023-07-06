<script setup>
import axios from 'axios'
async function handleClick() {
    const data = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
    console.log(data)
  }

</script>

<template>
  <el-button @click="handleClick">发送网络请求</el-button>
</template>