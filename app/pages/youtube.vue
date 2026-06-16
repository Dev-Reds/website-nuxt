<script setup>
useHead({ title: 'YouTube' })
</script>

<template>
    <div>
        <h1>YouTube</h1>
        <NuxtLink to="https://www.youtube.com/@Sams2525" target="_blank">Mein Youtube (Klick)</NuxtLink>
        <img src="/channels4_profile.png" alt="YouTube Profile Image" />
    </div>
</template>

<style scoped>
h1 {
  color: rgb(188, 0, 0);
  font-size: clamp(22px, 6vw, 32px);
  text-align: center;
  margin-bottom: 24px;
}
a {
  color: rgb(188, 0, 0);
  font-size: clamp(18px, 5vw, 32px);
  text-align: center;
  margin-bottom: 24px;
  text-decoration: none;
  display: block;
  word-break: break-word;
}
img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
  width: min(200px, 80%);
}
</style>