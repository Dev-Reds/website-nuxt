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
  background: #1a0a0a;
  margin: 0;
  min-height: 100vh;
}
.page-wrap {
  background: #1a0a0a;
  min-height: 100vh;
  padding-top: 60px;
  box-sizing: border-box;
}
</style>