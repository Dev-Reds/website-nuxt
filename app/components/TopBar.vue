<template>
  <div class="top-bar">
    <NavBar inTopBar />
    <OnlineDisplay inTopBar />
    <AccountButton inTopBar />
  </div>
</template>

<style scoped>
.top-bar {
  position: fixed;
  top: 8px;
  left: 8px;
  right: 8px;
  z-index: 9999;
  background: #2a2a2a;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 56px;
  box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}
</style>
