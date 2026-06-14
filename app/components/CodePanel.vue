<template>
<div class="code-container">
        <div class="code-header">
            <span>{{ title }}</span>
            <button class="copy-btn" @click="copyCode">Code kopieren</button>
        </div>
        <pre class="code-body"><code id="html-code">

{{ code }}
            
</code></pre>
    </div>
</template>

<script setup>

defineProps({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
})

const copyCode = () => {
    const codeElement = document.getElementById('html-code');
    const text = codeElement.textContent;
    navigator.clipboard.writeText(text);
};

</script>

<style scoped>

        /* Container für die Code-Boxen */
        .code-container {
            background-color: #0d1117;
            border-radius: 8px;
            color: #bbbbbb;
            font-family: ui-monospace, SFMono-Regular, SF Pro Text, monospace;
            margin-bottom: 20px;
            overflow: hidden;
            flex: 1 1 45%;
            min-width: 260px;
            max-width: 100%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        @media (max-width: 900px) {
          .code-container {
            flex: 1 1 100%;
            width: 100%;
          }
        }

        /* Obere Kopfzeile */
        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #161b22;
            padding: 10px 16px;
            font-size: 12px;
            color: #d00000;
            border-bottom: 1px solid #21262d;
        }

        /* Kopieren-Button */
        .copy-btn {
            background: none;
            border: none;
            color: #870000;
            cursor: pointer;
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 4px;
            transition: background 0.2s;
        }

        .copy-btn:hover {
            color: #ff0000;
            background-color: #21262d;
        }

        .copy-btn:active {
            color: #320000;
        }

        /* Code-Textbereich */
        .code-body {
            padding: 16px;
            margin: 0;
            overflow-x: auto;
            font-size: 14px;
            line-height: 1.5;
        }

        @media (max-width: 600px) {
          .code-body {
            display: none;
          }
        }
</style>