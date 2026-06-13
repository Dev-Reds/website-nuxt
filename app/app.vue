<template>
  <div>
    <NavBar/>
    <OnlineDisplay/>
    <AccountButton/>
    <div class="page-wrap">
      <NuxtPage/>
    </div>
  </div>
</template>

<style>
body {
  background: #000 url('/background.png') center/cover no-repeat fixed;
  margin: 0;
  min-height: 100vh;
}
.page-wrap {
  min-height: 100vh;
  padding-top: 60px;
  box-sizing: border-box;
}
</style>