<template>
  <div>
    
    <h1>Meine Projekte</h1>
    <h2>Scratch</h2>


<!-- Dieser Container sorgt dafür, dass das Bild auf der Webseite genau in der Mitte steht -->
<div style="display: flex; justify-content: center; width: 100%; margin: 20px 0;">

  <!-- Das ist dein zugeschnittenes Scratch-Bild (ohne Flagge und Leiste) -->
  <div style="width: 480px; height: 360px; overflow: hidden; position: relative; pointer-events: none;">
    <iframe src="https://turbowarp.org/1152235971/embed" 
            width="540" 
            height="460" 
            style="border: none; position: absolute; top: -56px; left: -30px;" 
            scrolling="no">
    </iframe>
  </div>

</div>

<nav>
    <ul>
        <li><NuxtLink to="scratch/cube-leveler/">Cube Leveler</NuxtLink></li>
    </ul>
</nav>

<!-- Dieser Container sorgt dafür, dass das Bild auf der Webseite genau in der Mitte steht -->
<div style="display: flex; justify-content: center; width: 100%; margin: 20px 0;">

  <!-- Das ist dein zugeschnittenes Scratch-Bild (ohne Flagge und Leiste) -->
  <div style="width: 480px; height: 360px; overflow: hidden; position: relative; pointer-events: none;">
    <iframe src="https://turbowarp.org/1264348465/embed" 
            width="540" 
            height="460" 
            style="border: none; position: absolute; top: -56px; left: -30px;" 
            scrolling="no">
    </iframe>
  </div>

</div>

<nav>
    <ul>
        <li><NuxtLink to="scratch/project-presentation/">Project Präsentation</NuxtLink></li>
    </ul>
</nav>


<!-- Dieser Container sorgt dafür, dass das Bild auf der Webseite genau in der Mitte steht -->
<div style="display: flex; justify-content: center; width: 100%; margin: 20px 0;">

  <!-- Das ist dein zugeschnittenes Scratch-Bild (ohne Flagge und Leiste) -->
  <div style="width: 480px; height: 360px; overflow: hidden; position: relative; pointer-events: none;">
    <iframe src="https://turbowarp.org/1269546899/embed" 
            width="540" 
            height="460" 
            style="border: none; position: absolute; top: -56px; left: -30px;" 
            scrolling="no">
    </iframe>
  </div>

</div>

<nav>
    <ul>
        <li><NuxtLink to="scratch/baloons-tower-defence/">Baloons Tower Defence</NuxtLink></li>
    </ul>
</nav>

<!-- Dieser Container sorgt dafür, dass das Bild auf der Webseite genau in der Mitte steht -->
<div style="display: flex; justify-content: center; width: 100%; margin: 20px 0;">

  <!-- Das ist dein zugeschnittenes Scratch-Bild (ohne Flagge und Leiste) -->
  <div style="width: 480px; height: 360px; overflow: hidden; position: relative; pointer-events: none;">
    <iframe src="https://turbowarp.org/1134135118/embed" 
            width="540" 
            height="460" 
            style="border: none; position: absolute; top: -56px; left: -30px;" 
            scrolling="no">
    </iframe>
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
h1 {
  color: rgb(188, 0, 0);
  font-size: 30px;
  text-align: center;
}

h2 {
  color: rgb(188, 0, 0);
  font-size: 30px;
  text-align: center;
}

h3 {
  color: rgb(188, 0, 0);
  font-size: 30px;
  text-align: center;
}

a {
color: rgb(188, 0, 0);
  font-size: 20px;
  border: 2px solid rgb(188, 0, 0);
  border-radius: 10px;
  padding: 10px;
  width: fit-content;
  display: block;
  margin: 0px auto;
  text-decoration: none;
  }

  a:hover {
color: rgb(255, 0, 0);
  font-size: 20px;
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

