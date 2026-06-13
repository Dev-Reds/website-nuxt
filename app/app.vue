<template>
  <div>
    <NavBar/>
    <OnlineDisplay/>
    <div class="page-wrap">
      <NuxtPage/>
    </div>
  </div>
</template>

<style>
body {
  background-color: rgb(0, 0, 0);
  background-image: url('/background.png');
  background-size: cover;
  margin: 0;
}
.page-wrap {
  min-height: 100vh;
  padding-top: 60px;
  box-sizing: border-box;
}
</style>