<template>
  <div>
    <lo><NuxtLink to="/">Projects</NuxtLink></lo>
    <lo><NuxtLink to="/youtube">YouTube</NuxtLink></lo>

    <lo><NuxtLink to="/todo-list">ToDo List</NuxtLink></lo>
    <lo><NuxtLink to="/time-calc">Life Calendar</NuxtLink></lo>
  </div>
</template>

//    chat muss auchnoch gemacht werden


<style scoped>
lo {
  display: inline-block;
  margin: 3px;
  margin-top: 10px;
}
a {
color: rgb(188, 0, 0);
  font-size: 20px;
  border: 2px solid rgb(188, 0, 0);
  border-radius: 10px;
  padding: 10px;
  width: fit-content;
  margin: 20px auto;
  text-decoration: none;
  }

  a:hover {
color: rgb(0, 0, 0);
  font-size: 20px;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 10px;
  padding: 10px;
  width: fit-content;
  margin: 20px auto;
  text-decoration: none;
  }

</style>