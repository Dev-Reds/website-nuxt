<script setup>
const { t } = useLanguage()
useHead({ title: t('index.launcher') })
</script>

<template>
  <div>

<h1>
    {{ t('index.launcherTitle') }}
</h1>

 
    <div class="download-box">

        <a href="https://github.com/Dev-Reds/website-nuxt/releases/latest/download/launcher.zip" class="download-btn">
            {{ t('launcher.download') }}</a>
            
    </div>

    <div class="code-panels-row">
        <CodePanel title="HTML" :code="HTML_SNIPPET"/>

        <CodePanel title="JavaScript" :code="JS_SNIPPET"/>
    </div>





  </div>
</template>

<style scoped>
h1 {
  color: rgb(188, 0, 0);
  font-size: clamp(20px, 5vw, 30px);
  text-align: center;
}


        .download-box {
            margin: 25px 0px;
            width: 100%;
            display: flex;
            justify-content: center;
        }

        .download-btn {
            display: block;
            margin: 0px auto;
            background-color: #b50000;
            color: #bbbbbb;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background-color 0.2s;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .download-btn:hover {
            display: block;
            margin: 0px auto;
            background-color: #ff0000;
        }

        .code-panels-row {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 20px;
            padding: 0 10px;
            box-sizing: border-box;
        }
</style>

