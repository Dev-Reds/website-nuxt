<script setup>
useHead({ title: 'Projecte' })
</script>

<template>
  <div class="index-page">
    <h1>Meine Projekte</h1>
    <h2>Scratch</h2>

    <div class="iframe-wrap">
      <div class="iframe-crop">
        <iframe src="https://turbowarp.org/1152235971/embed" scrolling="no"></iframe>
      </div>
    </div>
    <nav>
      <ul>
        <li><NuxtLink to="scratch/cube-leveler/">Cube Leveler</NuxtLink></li>
      </ul>
    </nav>

    <div class="iframe-wrap">
      <div class="iframe-crop">
        <iframe src="https://turbowarp.org/1264348465/embed" scrolling="no"></iframe>
      </div>
    </div>
    <nav>
      <ul>
        <li><NuxtLink to="scratch/project-presentation/">Project Präsentation</NuxtLink></li>
      </ul>
    </nav>

    <div class="iframe-wrap">
      <div class="iframe-crop">
        <iframe src="https://turbowarp.org/1269546899/embed" scrolling="no"></iframe>
      </div>
    </div>
    <nav>
      <ul>
        <li><NuxtLink to="scratch/baloons-tower-defence/">Baloons Tower Defence</NuxtLink></li>
      </ul>
    </nav>

    <div class="iframe-wrap">
      <div class="iframe-crop">
        <iframe src="https://turbowarp.org/1134135118/embed" scrolling="no"></iframe>
      </div>
    </div>
    <nav>
      <ul>
        <li><NuxtLink to="scratch/minecraft-3d/">Minecraft 3D</NuxtLink></li>
      </ul>
    </nav>

    <h3>MC Launcher (still in development)</h3>
    <nav>
      <ul>
        <li><NuxtLink to="mc-launcher/">MC Launcher</NuxtLink></li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.index-page {
  max-width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}

h1 {
  color: rgb(188, 0, 0);
  font-size: clamp(20px, 5vw, 30px);
  text-align: center;
}

h2 {
  color: rgb(188, 0, 0);
  font-size: clamp(20px, 5vw, 30px);
  text-align: center;
}

h3 {
  color: rgb(188, 0, 0);
  font-size: clamp(20px, 5vw, 30px);
  text-align: center;
}

.iframe-wrap {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 20px 0;
}

.iframe-crop {
  width: min(480px, 100%);
  aspect-ratio: 4 / 3;
  overflow: hidden;
  position: relative;
  pointer-events: none;
}

.iframe-crop iframe {
  position: absolute;
  top: -15.56%;
  left: -6.25%;
  width: 112.5%;
  height: 127.78%;
  border: none;
  max-width: none;
}

a {
  color: rgb(188, 0, 0);
  font-size: clamp(16px, 4vw, 20px);
  border: 2px solid rgb(188, 0, 0);
  border-radius: 10px;
  padding: 10px;
  width: fit-content;
  display: block;
  margin: 0 auto;
  text-decoration: none;
}

a:hover {
  color: rgb(255, 0, 0);
  border: 2px solid rgb(0, 0, 0);
  border-radius: 10px;
  padding: 10px;
  width: fit-content;
  text-decoration: none;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>

