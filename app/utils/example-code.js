export const HTML_SNIPPET = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Crux Client</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{width:100%;height:100%;overflow:hidden;}
body{font-family:Arial,sans-serif;background:#0a0a0a;color:#fff;font-size:2vw;}
:root{--tb:8vh;--acc:#0088ff;--acc2:#005bb5;--r:.5em;}


/* ── Launcher ── */
.hidden{display:none;}
#launcher-screen{width:100%;height:100vh;flex-direction:column;overflow:hidden;}
.toolbar{flex-shrink:0;display:flex;align-items:center;gap:.3em;padding:0 .8em;background:rgba(6,6,6,.98);border-bottom:1px solid #1e1e1e;flex-wrap:nowrap;min-height:var(--tb);}
.toolbar::-webkit-scrollbar{height:3px;}
.toolbar::-webkit-scrollbar-thumb{background:#333;border-radius:999px;}
.tb-btn{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;gap:.25em;padding:.3em .5em;border:1px solid #2a2a2a;border-radius:var(--r);background:#111;color:#888;cursor:pointer;font-size:clamp(.55em,.9vw,.85em);transition:all .2s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.tb-btn:hover{background:#1a1a1a;color:#ccc;}
.tb-btn.active{background:var(--acc);border-color:var(--acc);color:#fff;}
.tb-btn .tb-head{width:1.2em;height:1.2em;border-radius:.15em;image-rendering:pixelated;display:none;}
#toolbar-theme{padding:.35em .6em;}
#toolbar-theme svg{vertical-align:middle;}

/* ── Pages ── */
.pages{flex:1;overflow:hidden;position:relative;}
.page{position:absolute;inset:0;overflow-y:auto;padding:2.5vh 2.5vw;display:none;}
.page.active{display:block;}
.page h1{font-size:1.6em;margin-bottom:1em;}

/* ── Common form ── */
.form-row{margin-bottom:1em;display:flex;flex-direction:column;gap:.35em;max-width:30em;}
label{color:#999;font-size:.82em;}
select,.btn{padding:.5em .85em;border:1px solid #2a2a2a;border-radius:var(--r);background:#111;color:#fff;font-size:.85em;cursor:pointer;transition:all .2s;width:100%;}
.btn{text-align:center;}
.btn:hover{background:#1a1a1a;}
.btn-primary{background:linear-gradient(90deg,var(--acc2),var(--acc));border-color:var(--acc);}
.btn-primary:hover{filter:brightness(1.15);}
input[type=range]{-webkit-appearance:none;width:100%;height:5px;border-radius:999px;background:#222;border:none;outline:none;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:1.3em;height:1.3em;border-radius:50%;background:var(--acc);border:2px solid #fff3;cursor:pointer;}
.status-text{color:#666;font-size:.82em;margin-top:.5em;}

/* ── Launch progress ── */
.lp-wrap{width:100%;max-width:30em;margin-top:.7em;display:none;}
.lp-wrap.vis{display:block;}
.lp-bg{width:100%;height:.6em;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:999px;overflow:hidden;margin-bottom:.25em;}
.lp-fill{height:100%;background:linear-gradient(90deg,var(--acc2),var(--acc));transition:width .3s;width:0%;border-radius:999px;}
.lp-label{font-size:.72em;color:#555;}

/* ── Light ── */
body.light{background:#f0f0f0;color:#111;}
body.light .toolbar{background:rgba(240,240,240,.98);border-bottom-color:#ddd;}
body.light .tb-btn{background:#fff;color:#555;border-color:#ddd;}
body.light .tb-btn:hover{background:#eee;}
body.light .tb-btn.active{background:var(--acc);color:#fff;border-color:var(--acc);}
body.light .page{background:#f0f0f0;}
body.light label{color:#666;}
body.light select, body.light .btn, body.light input, body.light textarea{background:#fff;color:#111;border-color:#ccc;}
body.light input::placeholder{color:#777;}
body.light .skin-change-label{color:#666;}
body.light .skin-name-display, body.light .skin-version-display{color:#111;}
body.light #skin-url-input{background:#fff!important;color:#111!important;border-color:#ccc!important;}
body.light #skin-url-input::placeholder{color:#777!important;}
body.light .btn:hover{background:#eee;}
body.light h1{color:#111;}
body.light input[type=range]{background:#ccc;}
body.light .status-text{color:#888;}
body.light .lp-bg{background:#ddd;border-color:#ccc;}
body.light .lp-label{color:#888;}
body.light #stop-bar{background:#e8e8e8!important;border-bottom-color:#ddd!important;}
body.light #stop-bar span{color:#888!important;}
body.light .modal{background:#f8f8f8;border-color:#ddd;}
body.light .modal-header{border-bottom-color:#ddd;}
body.light .modal-header h2{color:#111;}
body.light .modal-close{border-color:#ccc;color:#666;}
body.light .modal-close:hover{color:#111;border-color:#888;}
body.light .modal-tab-row{border-bottom-color:#ddd;}
body.light .modal-tab{background:#fff;border-color:#ccc;color:#666;}
body.light .pack-section h3{color:#888;}
body.light .pack-tag{background:#eee;border-color:#ccc;color:#333;}
body.light .pack-tag .rt{color:#888;}
body.light .pack-tag .rt:hover{color:#f44;}
body.light .mod-result-desc{color:#888;}
body.light .mod-icon{background:#ddd;}
body.light .settings-section h2{color:#888;border-bottom-color:#ddd;}
body.light .color-btn.sel{border-color:#111;}
body.light #auto-rp-toggle{background:#ccc!important;border-color:#bbb!important;}
body.light #auto-rp-knob{background:#666!important;}
body.light .profile-item:hover{background:#eee;}
body.light .profile-item.sel{background:#ddeeff;}
body.light .instance-item:hover{background:#eee;}
body.light .instance-item.sel{background:#ddeeff;}
body.light .account-item:hover{background:#eee;}
body.light .mod-list-empty{color:#888;}
body.light .mod-toggle{border-color:#ccc;color:#888;}
body.light .mod-remove{border-color:#ccc;color:#888;}
body.light #client-rp-input{background:#fff!important;color:#111!important;border-color:#ccc!important;}
body.light #client-rp-input::placeholder{color:#777!important;}
body.light #profile-version-select{background:#fff!important;color:#111!important;border-color:#ccc!important;}
body.light #cape-preview{background:#ddd!important;border-color:#ccc!important;}
body.light .modal-overlay{background:rgba(200,200,200,.82)!important;}
body.light #profile-version-display{color:#111!important;}
body.light label[style*="color:#ccc"]{color:#555!important;}
body.light strong[style*="color:#ccc"]{color:#555!important;}
body.light h2[style*="color:#ccc"]{color:#333!important;}

/* ── Launch page ── */
#launch-page{padding:0;overflow:hidden;}
.launch-layout{display:flex;height:100%;}
.launch-left{flex:1;min-width:0;padding:2.5vh 2vw;overflow-y:auto;display:flex;flex-direction:column;}
.launch-left h1{font-size:1.5em;margin-bottom:.8em;}
.launch-right{width:28vw;background:#0d0d0d;border-left:1px solid #1a1a1a;display:flex;flex-direction:column;align-items:center;padding:1.5vh 1.2vw;gap:1em;overflow-y:auto;}
body.light .launch-right{background:#e8e8e8;border-left-color:#ddd;}
body.light .launch-left{background:#f0f0f0;}

/* 3D skin canvas */
.skin3d-wrap{width:50%;max-width:14vw;aspect-ratio:.7;background:#0a0a0a;border-radius:var(--r);overflow:hidden;position:relative;cursor:grab;margin:0 auto;}
body.light .skin3d-wrap{background:#e0e0e0;}
.skin3d-wrap:active{cursor:grabbing;}
.skin3d-canvas{width:100%;height:100%;display:block;}
.skin-name-display{font-size:.9em;font-weight:bold;text-align:center;}
.skin-version-display{font-size:.7em;color:#555;text-align:center;}
.skin-change-label{font-size:.72em;color:#666;margin-bottom:.25em;}
.skin-file-btn{width:100%;padding:.4em .6em;font-size:.76em;}

/* ── Mod list ── */
.mods-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.8em;flex-wrap:wrap;gap:.4em;}
.mods-header h1{margin:0;}
.mods-actions{display:flex;gap:.4em;}
.btn-sm{width:auto;padding:.35em .8em;font-size:.78em;white-space:nowrap;}
.btn-modrinth{border-color:#1bd96a55;color:#1bd96a;background:#1bd96a0a;}
.btn-modrinth:hover{background:#1bd96a18;}
.btn-curseforge{border-color:#f1642255;color:#f16422;background:#f164220a;}
.btn-curseforge:hover{background:#f1642218;}
body.light .btn-modrinth{background:#f0fff6;color:#0a6b34;border-color:#1bd96a;}
body.light .btn-curseforge{background:#fff5f0;color:#a83500;border-color:#f16422;}

.mod-list{width:100%;border:1px solid #1a1a1a;border-radius:var(--r);background:#0d0d0d;overflow:hidden;}
.mod-list-empty{padding:2em;text-align:center;color:#444;font-size:.82em;}
.mod-item{display:flex;align-items:center;gap:.7em;padding:.6em .9em;border-bottom:1px solid #141414;font-size:.82em;}
.mod-item:last-child{border-bottom:none;}
.mod-icon{width:2.2em;height:2.2em;border-radius:.25em;background:#222;object-fit:cover;flex-shrink:0;}
.mod-info{flex:1;min-width:0;}
.mod-name{font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.mod-meta{color:#555;font-size:.76em;margin-top:.1em;}
.mod-btns{display:flex;gap:.35em;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end;}
.mod-btn{width:auto;padding:.22em .65em;font-size:.7em;border-radius:.35em;background:transparent;}
.mod-toggle{border-color:#333;color:#777;}
.mod-toggle:hover{border-color:var(--acc);color:var(--acc);}
.mod-remove{border-color:#333;color:#666;}
.mod-remove:hover{border-color:#f44;color:#f44;}
.mod-dlall{border-color:#222;color:#555;}
.mod-dlall.on{border-color:#1bd96a66;color:#1bd96a;}
.mod-dlall:hover{border-color:#1bd96a;color:#1bd96a;}
body.light .mod-list{background:#fff;border-color:#ddd;}
body.light .mod-item{border-bottom-color:#eee;color:#111;}
body.light .mod-meta{color:#888;}

/* ── Modal ── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:2000;display:flex;align-items:center;justify-content:center;}
.profile-modal{z-index:1500;}
.login-modal{z-index:2100;}
.modal{background:#111;border:1px solid #2a2a2a;border-radius:.8em;width:min(88vw,660px);max-height:82vh;display:flex;flex-direction:column;overflow:hidden;}
.modal-header{display:flex;align-items:center;justify-content:space-between;padding:.9em 1.2em;border-bottom:1px solid #1e1e1e;}
.modal-header h2{font-size:.95em;}
.modal-close{width:auto;padding:.2em .55em;background:transparent;border:1px solid #333;color:#777;border-radius:.35em;font-size:.85em;cursor:pointer;}
.modal-close:hover{color:#fff;border-color:#666;}
.modal-body{padding:.9em 1.2em;overflow-y:auto;flex:1;}
.modal-tab-row{display:flex;gap:.4em;margin-bottom:.8em;border-bottom:1px solid #1e1e1e;padding-bottom:.6em;}
.modal-tab{width:auto;padding:.3em .8em;font-size:.78em;border-radius:.35em;background:transparent;border:1px solid #2a2a2a;color:#666;}
.modal-tab.active{background:var(--acc);border-color:var(--acc);color:#fff;}
.modal-search-row{display:flex;gap:.4em;margin-bottom:.8em;}
.mod-search-input{flex:1;padding:.5em .75em;border-radius:var(--r);border:1px solid #2a2a2a;background:#0d0d0d;color:#fff;font-size:.85em;outline:none;}
.mod-search-input:focus{border-color:var(--acc);}
body.light .mod-search-input{background:#fff;color:#111;border-color:#ccc;}
.mod-search-btn{width:auto;padding:.5em .9em;font-size:.82em;}
.mod-results{display:flex;flex-direction:column;}
.mod-result-item{display:flex;align-items:center;gap:.7em;padding:.6em .3em;border-bottom:1px solid #161616;}
.mod-result-item:last-child{border-bottom:none;}
.mod-result-item:hover{background:#161616;border-radius:.35em;}
.mod-result-icon{width:2.5em;height:2.5em;border-radius:.25em;background:#222;object-fit:cover;flex-shrink:0;}
.mod-result-info{flex:1;min-width:0;}
.mod-result-name{font-weight:bold;font-size:.82em;}
.mod-result-desc{color:#555;font-size:.72em;margin-top:.1em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
body.light .mod-result-item{border-bottom-color:#eee;}
body.light .mod-result-item:hover{background:#f5f5f5;}
body.light .mod-result-name{color:#111;}
.mod-result-actions{display:flex;gap:.35em;align-items:center;flex-shrink:0;}

.mod-install-btn{width:auto;padding:.28em .75em;font-size:.72em;border-radius:.35em;background:linear-gradient(90deg,var(--acc2),var(--acc));border-color:var(--acc);color:#fff;}

.modal-loading{text-align:center;color:#555;padding:1.5em;font-size:.82em;}

/* ── Profile page ── */
.profile-list{width:100%;border:1px solid #1a1a1a;border-radius:var(--r);background:#0d0d0d;overflow:hidden;margin-bottom:.8em;}
.profile-item{display:flex;align-items:center;gap:.7em;padding:.7em .9em;border-bottom:1px solid #141414;font-size:.82em;cursor:pointer;}
.profile-item:last-child{border-bottom:none;}
.profile-item:hover{background:#141414;}
.profile-item.sel{border-left:3px solid var(--acc);padding-left:calc(.9em - 3px);background:#0d1a2e;}
.profile-name{font-weight:bold;flex:1;}
.profile-meta{color:#555;font-size:.76em;}
.profile-edit-btn{width:auto;padding:.22em .65em;font-size:.72em;background:transparent;border-color:#2a2a2a;color:#666;border-radius:.35em;}
.profile-edit-btn:hover{border-color:var(--acc);color:var(--acc);}
body.light .profile-list{background:#fff;border-color:#ddd;}
body.light .profile-item{border-bottom-color:#eee;color:#111;}
body.light .profile-meta{color:#888;}

/* Profile modal */
.profile-modal .modal{width:min(90vw,720px);}
.pack-section{margin-bottom:1em;}
.pack-section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.5em;}
.pack-section h3{font-size:.8em;text-transform:uppercase;letter-spacing:.05em;color:#555;}
.pack-list{display:flex;flex-wrap:wrap;gap:.35em;margin-bottom:.4em;min-height:1.5em;}
.pack-tag{padding:.22em .55em;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:999px;font-size:.72em;color:#aaa;display:flex;align-items:center;gap:.35em;}
.pack-tag .rt{color:#555;cursor:pointer;line-height:1;}
.pack-tag .rt:hover{color:#f44;}
.pack-add-row{display:flex;gap:.4em;}
.pack-input{flex:1;padding:.38em .6em;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:var(--r);color:#fff;font-size:.78em;outline:none;}
.pack-input:focus{border-color:var(--acc);}
body.light .pack-input{background:#fff;color:#111;border-color:#ccc;}
.pack-add-btn{width:auto;padding:.38em .75em;font-size:.78em;}

/* ── Account page ── */
.account-panel{max-width:30em;}
.account-list{width:100%;border:1px solid #1a1a1a;border-radius:var(--r);background:#0d0d0d;overflow:hidden;margin-bottom:.8em;}
.account-item{display:flex;align-items:center;gap:.7em;padding:.6em .9em;border-bottom:1px solid #141414;font-size:.82em;cursor:pointer;background:#0d0d0d;transition:background .15s;}
.account-item:last-child{border-bottom:none;}
.account-item:hover{background:#141414;}
.account-item.sel{border:2px solid var(--acc);border-radius:var(--r);margin:.25em;padding:calc(.6em - 2px) calc(.9em - 2px);}
.account-head-sm{width:2.2em;height:2.2em;border-radius:.2em;image-rendering:pixelated;background:#222;flex-shrink:0;}
.account-name{flex:1;font-weight:bold;}
.account-type{font-size:.72em;color:#555;}
.account-del{width:auto;padding:.2em .55em;font-size:.7em;background:transparent;border-color:#2a2a2a;color:#555;border-radius:.35em;}
.account-del:hover{border-color:#f44;color:#f44;}
.account-add-btns{display:flex;gap:.5em;margin-top:.5em;}
.btn-ms{background:#0078d4;border-color:#0078d4;color:#fff;}
.btn-mojang{background:#b87333;border-color:#b87333;color:#fff;}
body.light .account-list{background:#fff;border-color:#ddd;}
body.light .account-item{background:#fff;border-bottom-color:#eee;color:#111;}
body.light .account-type{color:#888;}

/* ── Settings ── */
.settings-section{margin-bottom:1.8em;max-width:34em;}
.settings-section h2{font-size:.8em;text-transform:uppercase;letter-spacing:.06em;color:#444;margin-bottom:.7em;border-bottom:1px solid #1a1a1a;padding-bottom:.35em;}
.color-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.45em;max-width:18em;}
.color-btn{aspect-ratio:1;border-radius:.45em;cursor:pointer;border:2px solid transparent;transition:transform .15s,border-color .15s;}
.color-btn:hover{transform:scale(1.1);}
.color-btn.sel{border-color:#fff;transform:scale(1.08);}

/* ── Logs ── */
.logs-container{width:100%;flex:1;min-height:0;background:#060606;border:1px solid #1a1a1a;border-radius:var(--r);overflow-y:auto;font-family:monospace;font-size:.72em;padding:.5em .8em;line-height:1.4;}
#logs-page{display:flex;flex-direction:column;}
#logs-page h1,#logs-page .log-select-row,#logs-page .lp-wrap{flex-shrink:0;}
.log-line{white-space:pre-wrap;word-break:break-all;padding:.05em 0;border-bottom:1px solid #0d0d0d;}
.log-line.err{color:#ff6b6b;}
.log-line.warn{color:#f5a623;}
.log-line.info{color:#7ec8e3;}
.log-select-row{display:flex;align-items:center;gap:.6em;margin-bottom:.6em;flex-wrap:wrap;}
body.light .logs-container{background:#fff;border-color:#ddd;color:#111;}
body.light .log-line{border-bottom-color:#f0f0f0;}
body.light .log-line.err{color:#cc0000;}
body.light .log-line.warn{color:#cc7700;}
body.light .log-line.info{color:#0066aa;}

/* ── Instances ── */
.instance-list{width:100%;border:1px solid #1a1a1a;border-radius:var(--r);background:#0d0d0d;overflow:hidden;}
.instance-item{display:flex;align-items:center;gap:.7em;padding:.6em .9em;border-bottom:1px solid #141414;font-size:.82em;cursor:pointer;}
.instance-item:last-child{border-bottom:none;}
.instance-item:hover{background:#141414;}
.instance-item.sel{border-left:3px solid var(--acc);background:#0d1a2e;}
.instance-badge{padding:.15em .5em;border-radius:999px;font-size:.7em;}
.badge-running{background:#1bd96a22;color:#1bd96a;border:1px solid #1bd96a44;}
.badge-crashed{background:#f4444422;color:#f44;border:1px solid #f4444444;}
.badge-closed{background:#33333322;color:#666;border:1px solid #33333344;}
body.light .instance-list{background:#fff;border-color:#ddd;}
body.light .instance-item{border-bottom-color:#eee;color:#111;}

/* ── Mojang login modal ── */
.login-modal .modal{max-width:380px;}
</style>
</head>
<body>

</div>

<div id="launcher-screen" style="display:flex">
  <div class="toolbar">
    <button class="tb-btn active" data-page="launch-page" data-i18n="tab_launch">Launch</button>
    <button class="tb-btn" data-page="mods-page" data-i18n="tab_mods">Client Options</button>
    <button class="tb-btn" data-page="profiles-page" data-i18n="tab_profiles">Profiles</button>
    <button class="tb-btn" data-page="cape-page" data-i18n="tab_cape">Capes</button>
    <button class="tb-btn" data-page="settings-page" data-i18n="tab_settings">Settings</button>
    <button class="tb-btn" data-page="logs-page" data-i18n="tab_logs">Logs<span id="running-badge" style="display:none;margin-left:.3em;background:#1bd96a;color:#000;border-radius:999px;font-size:.7em;padding:.05em .45em;font-weight:bold"></span></button>
    <button class="tb-btn" data-page="instances-page" data-i18n="tab_instances">Instances</button>
    <button class="tb-btn" id="toolbar-theme" title="Toggle theme">
      <svg id="icon-moon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      <svg id="icon-sun" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    </button>
    <button class="tb-btn" data-page="account-page" id="tb-account-btn" data-i18n="tab_account">
      <canvas class="tb-head" id="tb-account-head" width="24" height="24"></canvas>
      MC-Account
    </button>
  </div>

  <div id="stop-bar" style="display:flex;gap:.5em;padding:.35em .8em;background:#0d0d0d;border-bottom:1px solid #1a1a1a;align-items:center;min-height:2em">
    <span style="font-size:.78em;color:#555;margin-right:.4em">Actions:</span>
    <button class="btn" id="stop-btn" style="width:auto;padding:.35em .7em;font-size:.78em;border-color:#f4444444;color:#f44;display:none;white-space:nowrap" title="Stop selected instance" data-i18n="btn_stop">■ Stop</button>
    <button class="btn" id="stop-all-btn" style="width:auto;padding:.35em .7em;font-size:.78em;border-color:#f4444444;color:#f44;display:none;white-space:nowrap" title="Stop all running instances">■ Stop All</button>
  </div>
  <div class="pages">

    <!-- ══ LAUNCH ══ -->
    <div id="launch-page" class="page active">
      <div class="launch-layout">
        <div class="launch-left">
          <h1 data-i18n="h_launch">Launch</h1>
          <div class="form-row">
            <label data-i18n="lbl_profile">Profile:</label>
            <select id="profileSelect"></select>
          </div>
            <div style="display:flex;align-items:center;gap:.4em;font-size:.85em;color:#999;margin-bottom:.8em">
              <span data-i18n="lbl_version">Version:</span>
              <span id="profile-version-display" style="color:#ccc;font-weight:bold">—</span>
            </div>
          <div style="display:flex;gap:.5em;max-width:24em">
            <button class="btn btn-primary" id="launch-btn" style="flex:1" data-i18n="btn_launch">▶ Launch Minecraft</button>
          
          </div>
          <div id="status" class="status-text">Ready.</div>
          <div class="lp-wrap" id="lp-wrap">
            <div class="lp-bg"><div class="lp-fill" id="lp-fill"></div></div>
            <div class="lp-label" id="lp-label"></div>
          </div>
        </div>
        <div class="launch-right">
          <div class="skin3d-wrap" id="skin3d-wrap">
            <canvas class="skin3d-canvas" id="skin3d-canvas"></canvas>
          </div>
          <div class="skin-name-display" id="skin-name-display">No account</div>
          <div class="skin-version-display" id="skin-version-display">—</div>
          <div style="width:100%;font-size:.78em">
            <div class="skin-change-label" style="color:#555;margin-bottom:.3em">Change Skin:</div>
            <div style="display:flex;gap:.3em;margin-bottom:.3em">
              <input type="text" id="skin-url-input" placeholder="Skin URL..." style="flex:1;padding:.3em .5em;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:var(--r);color:#fff;font-size:.85em;outline:none">
              <button class="btn btn-sm btn-primary" id="skin-url-apply-btn" style="width:auto;font-size:.78em">URL</button>
            </div>
            <label class="btn skin-file-btn" style="cursor:pointer;display:block;text-align:center;font-size:.82em;padding:.35em">
              📁 Choose PNG File
              <input type="file" id="skin-file-input" accept="image/png" style="display:none">
            </label>
            <div id="skin-upload-status" style="color:#1bd96a;font-size:.72em;margin-top:.25em;text-align:center;min-height:1em"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ CLIENT-MODS ══ -->
    <div id="mods-page" class="page">
      <div class="mods-header">
        <h1 data-i18n="h_mods">Client Options</h1>
        <div class="mods-actions">
          <button class="btn btn-sm btn-modrinth" id="btn-modrinth-global">Modrinth</button>
          <button class="btn btn-sm btn-curseforge" id="btn-curseforge-global">CurseForge</button>
        </div>

      </div>
      <div style="display:flex;gap:.4em;margin-bottom:.6em">
        <button class="btn btn-sm mod-filter-btn active" data-filter="all" id="filter-all">All</button>
        <button class="btn btn-sm mod-filter-btn" data-filter="fabric" id="filter-fabric" style="border-color:#1bd96a55;color:#1bd96a">Fabric</button>
        <button class="btn btn-sm mod-filter-btn" data-filter="forge" id="filter-forge" style="border-color:#f1642255;color:#f16422">Forge</button>
        <button class="btn btn-sm mod-filter-btn" data-filter="disabled" id="filter-disabled">Disabled</button>
      </div>
      <div class="mod-list" id="mod-list">
        <div class="mod-list-empty" id="mod-list-empty">No mods installed yet.</div>
      </div>

      <!-- ── Resource Packs Section ── -->
      <div style="margin-top:1.4em;border-top:1px solid #1e1e1e;padding-top:1em">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.6em;flex-wrap:wrap;gap:.4em">
          <h2 style="font-size:.95em;margin:0;color:#ccc">Client Resource Packs</h2>
          <div style="display:flex;gap:.4em;align-items:center">
            <button class="btn btn-sm btn-modrinth" id="btn-rp-modrinth-global">Modrinth</button>
            <button class="btn btn-sm btn-curseforge" id="btn-rp-curseforge-global">CurseForge</button>
            <label style="display:flex;align-items:center;gap:.5em;cursor:pointer;font-size:.82em;color:#ccc;user-select:none">
              <span>Auto-use</span>
              <div id="auto-rp-toggle" style="width:2.4em;height:1.3em;border-radius:999px;background:#333;border:1px solid #444;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0">
                <div id="auto-rp-knob" style="position:absolute;top:.15em;left:.15em;width:.95em;height:.95em;border-radius:50%;background:#888;transition:left .2s,background .2s"></div>
              </div>
            </label>
          </div>
        </div>
        <p style="color:#555;font-size:.75em;margin-bottom:.7em">When enabled, adds <strong style="color:#ccc">Open Loader</strong> to your client mods — it automatically loads all resource packs listed below without touching in-game settings.</p>
        <div style="display:flex;gap:.4em;margin-bottom:.5em;flex-wrap:wrap">
          <input type="text" id="client-rp-input" placeholder="Resource pack name or URL..." style="flex:1;min-width:10em;padding:.38em .6em;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:var(--r);color:#fff;font-size:.78em;outline:none">
          <button class="btn btn-sm btn-primary" id="client-rp-add-btn" style="width:auto">+ Add</button>
        </div>
        <div id="client-rp-list" style="display:flex;flex-wrap:wrap;gap:.35em;min-height:1.5em"></div>
      </div>
    </div>



    <!-- ══ PROFILES ══ -->
    <div id="profiles-page" class="page">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.8em;flex-wrap:wrap;gap:.4em">
        <h1 style="margin:0" data-i18n="h_profiles">Profiles</h1>
        <div style="display:flex;gap:.4em">
          <button class="btn btn-sm btn-modrinth" id="import-modpack-modrinth-btn">📦 Modrinth</button>
          <button class="btn btn-sm btn-curseforge" id="import-modpack-curseforge-btn">📦 CurseForge</button>
          <button class="btn btn-sm btn-primary" id="new-profile-btn" data-i18n="new_profile">+ New Profile</button>
        </div>
      </div>
      <div class="profile-list" id="profile-list"></div>
    </div>

    <!-- ══ CAPE & COSMETICS ══ -->
    <div id="cape-page" class="page" style="display:none">
      <h1 data-i18n="h_cape">Capes</h1>
      <div class="settings-section">
        <h2>Cape</h2>
        <p style="color:#666;font-size:.82em;margin-bottom:.8em">Cape is applied client-side via OptiFine/Fabric mods. Upload a cape PNG (64x32) to display it in-game with supported mods.</p>
        <div class="form-row" style="max-width:100%">
          <label>Cape URL:</label>
          <div style="display:flex;gap:.4em">
            <input type="text" class="pack-input" id="cape-url-input" placeholder="https://... or leave blank">
            <button class="btn btn-sm btn-primary" id="cape-save-btn" style="width:auto">Save</button>
          </div>
        </div>
        <div style="margin-top:.6em">
          <label class="btn btn-sm" style="cursor:pointer;display:inline-block;width:auto">
            Upload Cape PNG
            <input type="file" id="cape-file-input" accept="image/png" style="display:none">
          </label>
        </div>
        <canvas id="cape-preview" width="128" height="64" style="margin-top:.8em;border:1px solid #2a2a2a;border-radius:.35em;image-rendering:pixelated;width:min(16em,100%);height:auto;display:block;background:#111"></canvas>
      </div>
    </div>

    <!-- ══ SETTINGS ══ -->
    <div id="settings-page" class="page">
      <h1 data-i18n="h_settings">Settings</h1>
      <div class="settings-section">
        <h2 data-i18n="sec_java">Java Installation</h2>
        <div class="form-row" style="max-width:100%">
          <select id="javaSelect"><option>Detecting...</option></select>
        </div>
        <div style="display:flex;gap:.4em;flex-wrap:wrap;margin-top:.4em">
          <button class="btn btn-sm" id="rescan-java-btn" style="width:auto" data-i18n="btn_rescan">↻ Rescan Java</button>
        </div>
      </div>
      <div class="settings-section">
        <h2 data-i18n="sec_ram">RAM for Minecraft</h2>
        <div class="form-row" style="max-width:100%">
          <div style="display:flex;align-items:center;gap:.6em;margin-bottom:.4em">
            <label style="margin:0">RAM: <span id="ramValue">1</span> <span id="ramUnitLabel">GB</span></label>
            <button class="btn btn-sm" id="ram-unit-btn" style="width:auto;padding:.2em .6em;font-size:.72em">Switch to MB</button>
          </div>
          <input type="range" id="ramSlider" min="1" max="8" step="1" value="1">
        </div>
      </div>
      <div class="settings-section">
        <h2 data-i18n="sec_lang">Language</h2>
        <div class="form-row" style="max-width:20em">
          <select id="lang-select">
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
            <option value="nl">Nederlands</option>
            <option value="pl">Polski</option>
            <option value="ru">Русский</option>
            <option value="ja">日本語</option>
            <option value="zh">中文</option>
            <option value="ko">한국어</option>
          </select>
        </div>
      </div>
      <div class="settings-section">
        <h2 data-i18n="sec_color">Active Tab Color (16 colors)</h2>
        <div class="color-grid" id="color-grid"></div>
      </div>
      <div class="settings-section">
        <h2>Launch Mode</h2>
        <label style="display:flex;align-items:center;gap:.6em;cursor:pointer;font-size:.85em;color:#ccc">
          <input type="checkbox" id="use-original-launcher-toggle" style="width:1.1em;height:1.1em;cursor:pointer">
          Launch via original Minecraft Launcher
        </label>
        <p style="color:#555;font-size:.76em;margin-top:.3em">Opens the official Minecraft Launcher (Java Edition) instead of launching directly.</p>
      </div>
      <div class="settings-section">
        <h2>After Launch</h2>
        <label style="display:flex;align-items:center;gap:.6em;cursor:pointer;font-size:.85em;color:#ccc">
          <input type="checkbox" id="open-logs-toggle" style="width:1.1em;height:1.1em;cursor:pointer">
          Open logs after launch
        </label>
        <label style="display:flex;align-items:center;gap:.6em;cursor:pointer;font-size:.85em;color:#ccc;margin-top:.4em">
          <input type="checkbox" id="close-launcher-toggle" style="width:1.1em;height:1.1em;cursor:pointer">
          Close launcher while playing
        </label>
      </div>

      <div class="settings-section">
        <h2>Reset</h2>
        <button class="btn" id="reset-all-btn" style="border-color:#f4444444;color:#f44">Reset Launcher</button>
        <p style="color:#555;font-size:.76em;margin-top:.3em">Deletes all accounts, profiles, settings, and mods. Launcher will restart as if first opened.</p>
      </div>

      <div class="settings-section" style="border-top:1px solid #333;padding-top:1em">
        <h2 style="color:#f88">Uninstall</h2>
        <button class="btn" id="uninstall-btn" style="border-color:#f4444444;color:#f44">Uninstall Crux Client</button>
        <p style="color:#555;font-size:.76em;margin-top:.3em">Removes the launcher and all its data from your system.</p>
      </div>
    </div>

    <!-- ══ LOGS ══ -->
    <div id="logs-page" class="page" style="display:none">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5em;flex-wrap:wrap;gap:.4em">
        <h1 style="margin:0" data-i18n="h_logs">Logs</h1>
        <div style="display:flex;gap:.4em">
          <button class="btn btn-sm" id="copy-logs-btn">📋 Copy</button>
          <button class="btn btn-sm" id="clear-logs-btn" data-i18n="clear_logs">Clear</button>
        </div>
      </div>
      <div class="log-select-row">
        <label>Instance:</label>
        <select id="log-instance-select" style="width:auto;min-width:16em;padding:.3em .6em;font-size:.78em"></select>
      </div>
      <div class="lp-wrap" id="lp-wrap-logs" style="margin-bottom:.4em">
        <div class="lp-bg"><div class="lp-fill" id="lp-fill-logs"></div></div>
        <div class="lp-label" id="lp-label-logs"></div>
      </div>
      <div class="logs-container" id="logs-container"></div>
    </div>

    <!-- ══ INSTANCES ══ -->
    <div id="instances-page" class="page" style="display:none">
      <h1 data-i18n="h_instances">Instances</h1>
      <div class="instance-list" id="instance-list">
        <div class="mod-list-empty">No instances launched yet.</div>
      </div>
    </div>

    <!-- ══ ACCOUNT ══ -->
    <div id="account-page" class="page" style="display:none">
      <h1 data-i18n="h_account">MC Account</h1>
      <div class="account-panel">
        <div class="account-list" id="account-list">
          <div class="mod-list-empty">No accounts added yet.</div>
        </div>
        <div class="account-add-btns">
          <button class="btn btn-sm btn-ms" id="btn-add-ms" data-i18n="add_ms">+ Microsoft</button>
          <button class="btn btn-sm btn-mojang" id="btn-add-mojang" data-i18n="add_mojang">+ Mojang</button>
          <button class="btn btn-sm" id="btn-add-offline" data-i18n="add_offline">+ Offline</button>
        </div>
      </div>
    </div>

  </div>
</div>

<!-- ── Mod search modal ── -->
<div id="mod-modal" class="modal-overlay" style="display:none">
  <div class="modal">
    <div class="modal-header">
      <h2 id="modal-title">Search Mods</h2>
      <button class="btn modal-close" id="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-tab-row">
        <button class="btn modal-tab active" data-source="modrinth" id="tab-modrinth">Modrinth</button>
        <button class="btn modal-tab" data-source="curseforge" id="tab-curseforge">CurseForge</button>
      </div>
      <div class="modal-search-row">
        <input type="text" class="mod-search-input" id="mod-search-input" placeholder="Search...">
        <button class="btn mod-search-btn" id="mod-search-btn">Search</button>
      </div>
      <div id="mod-results" class="mod-results">
        <div class="modal-loading">Loading popular mods...</div>
      </div>
    </div>
  </div>
</div>

<!-- ── Profile editor modal ── -->
<div id="profile-modal" class="modal-overlay profile-modal" style="display:none">
  <div class="modal">
    <div class="modal-header">
      <h2>Edit Profile</h2>
      <button class="btn modal-close" id="profile-modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row" style="max-width:100%">
        <label>Name:</label>
        <input type="text" class="pack-input" id="profile-name-input" placeholder="My Profile">
      </div>
      <div class="form-row" style="max-width:100%">
        <label>Minecraft Version:</label>
        <select id="profile-version-select" style="padding:.5em .85em;border:1px solid #2a2a2a;border-radius:var(--r);background:#111;color:#fff;font-size:.85em;width:100%"></select>
      </div>
      <div class="form-row" style="max-width:100%">
        <label>Mod Loader:</label>
        <div style="display:flex;gap:.5em">
          <label style="display:flex;align-items:center;gap:.3em;cursor:pointer;color:#ccc;font-size:.85em"><input type="radio" name="modLoader" value="fabric" id="ml-fabric" checked> Fabric</label>
          <label style="display:flex;align-items:center;gap:.3em;cursor:pointer;color:#ccc;font-size:.85em"><input type="radio" name="modLoader" value="forge" id="ml-forge"> Forge</label>
          <label style="display:flex;align-items:center;gap:.3em;cursor:pointer;color:#ccc;font-size:.85em"><input type="radio" name="modLoader" value="vanilla" id="ml-vanilla"> Vanilla</label>
        </div>
      </div>
      <!-- Mods section: always visible at top -->
      <div class="pack-section" id="profile-mods-section">
        <div class="pack-section-header">
          <h3>Mods</h3>
          <div style="display:flex;gap:.35em">
            <button class="btn btn-sm btn-modrinth" id="profile-btn-modrinth">+ Modrinth</button>
            <button class="btn btn-sm btn-curseforge" id="profile-btn-curseforge">+ CurseForge</button>
          </div>
        </div>
        <div class="pack-list" id="profile-mods-list"></div>
      </div>
      <div class="pack-section">
        <div class="pack-section-header">
          <h3>Datapacks</h3>
          <div style="display:flex;gap:.35em">
            <button class="btn btn-sm btn-modrinth" id="profile-btn-dp-modrinth">+ Modrinth</button>
          </div>
        </div>
        <div class="pack-list" id="profile-datapacks"></div>
        <div class="pack-add-row">
          <input type="text" class="pack-input" id="dp-input" placeholder="Datapack name">
          <button class="btn btn-sm pack-add-btn" onclick="addPackTag('dp-input','profile-datapacks','datapacks')">+ Add</button>
        </div>
      </div>
      <div class="pack-section">
        <div class="pack-section-header">
          <h3>Resource Packs</h3>
          <div style="display:flex;gap:.35em">
            <button class="btn btn-sm btn-modrinth" id="profile-btn-rp-modrinth">+ Modrinth</button>
          </div>
        </div>
        <div class="pack-list" id="profile-resourcepacks"></div>
        <div class="pack-add-row">
          <input type="text" class="pack-input" id="rp-input" placeholder="Resource pack name">
          <button class="btn btn-sm pack-add-btn" onclick="addPackTag('rp-input','profile-resourcepacks','resourcePacks')">+ Add</button>
        </div>
      </div>
      <div class="pack-section">
        <div class="pack-section-header">
          <h3>Shader Packs</h3>
          <div style="display:flex;gap:.35em">
            <button class="btn btn-sm btn-modrinth" id="profile-btn-sp-modrinth">+ Modrinth</button>
          </div>
        </div>
        <div class="pack-list" id="profile-shaderpacks"></div>
        <div class="pack-add-row">
          <input type="text" class="pack-input" id="sp-input" placeholder="Shader pack name">
          <button class="btn btn-sm pack-add-btn" onclick="addPackTag('sp-input','profile-shaderpacks','shaderPacks')">+ Add</button>
        </div>
      </div>
      <div style="border-top:1px solid #1e1e1e;padding-top:.7em;margin-top:.4em">
        <label style="display:flex;align-items:center;gap:.5em;cursor:pointer;font-size:.82em;color:#ccc;margin-bottom:.4em">
          <input type="checkbox" id="profile-use-client-mods" checked>
          Use Client Mods (from Client Options tab)
        </label>
        <label style="display:flex;align-items:center;gap:.5em;cursor:pointer;font-size:.82em;color:#ccc">
          <input type="checkbox" id="profile-use-client-rps" checked>
          Use Client Resource Packs (from Client Options tab)
        </label>
      </div>
      <div style="display:flex;gap:.5em;margin-top:.8em">
        <button class="btn btn-primary btn-sm" id="save-profile-btn" style="width:auto">Save</button>
        <button class="btn btn-sm" id="delete-profile-btn" style="width:auto;border-color:#f4444444;color:#f44">Delete</button>
      </div>
    </div>
  </div>
</div>

<!-- ── Mojang login modal ── -->
<div id="mojang-modal" class="modal-overlay login-modal" style="display:none">
  <div class="modal">
    <div class="modal-header">
      <h2>Mojang Login</h2>
      <button class="btn modal-close" id="mojang-modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row" style="max-width:100%">
        <label>Email:</label>
        <input type="email" class="pack-input" id="mojang-email" placeholder="you@example.com">
      </div>
      <div class="form-row" style="max-width:100%">
        <label>Password:</label>
        <input type="password" class="pack-input" id="mojang-password" placeholder="••••••••">
      </div>
      <div id="mojang-error" style="color:#f44;font-size:.78em;margin-bottom:.5em;display:none"></div>
      <button class="btn btn-primary btn-sm" id="mojang-login-btn" style="width:auto">Login</button>
      <p style="color:#555;font-size:.72em;margin-top:.6em">Note: Mojang accounts migrated to Microsoft should use the Microsoft option.</p>
    </div>
  </div>
</div>

<!-- ── Offline login modal ── -->
<div id="offline-modal" class="modal-overlay login-modal" style="display:none">
  <div class="modal">
    <div class="modal-header">
      <h2>Add Offline Account</h2>
      <button class="btn modal-close" id="offline-modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row" style="max-width:100%">
        <label>Username:</label>
        <input type="text" class="pack-input" id="offline-username" placeholder="Player">
      </div>
      <button class="btn btn-primary btn-sm" id="offline-add-btn" style="width:auto;margin-top:.4em">Add</button>
    </div>
  </div>
</div>

<script>
const { ipcRenderer } = require('electron');
const path = require('path');

// ════════════════════════════════════════
// STATE
// ════════════════════════════════════════
let settings={}, accounts=[], profiles=[], installedMods=[], launchedVersions=[], mcVersionList=[];
let currentSource='modrinth', profileModMode=false, profilePackMode=null;
let editingProfileId=null, editingPackData={};
let currentAccentIdx=5;
let searchDebounce=null, modSearchOffset=0, modSearchQuery='', isLoadingMods=false;
let instances={}, selectedInstanceId=null;
const PAGE_SIZE=15;

// ════════════════════════════════════════
// ACCENTS
// ════════════════════════════════════════
const ACCENTS=['#e74c3c','#e67e22','#f39c12','#f1c40f','#2ecc71','#1abc9c','#00bcd4','#3498db','#2980b9','#5c6bc0','#9b59b6','#e91e63','#ff5722','#607d8b','#795548','#ffffff'];
const ACCENT_CSS=['#e74c3c','#e67e22','#f39c12','#f1c40f','#2ecc71','#1abc9c','#00bcd4','#3498db','#2980b9','#5c6bc0','#9b59b6','#e91e63','#ff5722','#607d8b','#795548','#ffffff'];

function applyAccent(idx){
  const col=ACCENTS[idx];
  document.documentElement.style.setProperty('--acc', col);
  document.documentElement.style.setProperty('--acc2', col+'bb');
  const lightText=[3,4,5,6,15].includes(idx);
  document.querySelectorAll('.tb-btn[data-page]').forEach(b=>{
    if(b.classList.contains('active')){
      b.style.background=col; b.style.borderColor=col;
      b.style.color=lightText?'#111':'#fff';
    } else { b.style.background=''; b.style.borderColor=''; b.style.color=''; }
  });
}

function buildColorGrid(){
  const g=document.getElementById('color-grid'); g.innerHTML='';
  ACCENTS.forEach((c,i)=>{
    const b=document.createElement('button'); b.className='color-btn'+(i===currentAccentIdx?' sel':'');
    b.style.background=c;
    if(i===15) b.style.border='2px solid #444'; // white needs a border
    b.addEventListener('click',()=>{ currentAccentIdx=i; applyAccent(i); buildColorGrid(); settings.accentIdx=i; saveSettings(); });
    g.appendChild(b);
  });
}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
window.onload = async()=>{
  [settings, accounts, profiles, installedMods, launchedVersions] = await Promise.all([
    ipcRenderer.invoke('load-settings')         .then(r=>r||{}),
    ipcRenderer.invoke('load-accounts')         .then(r=>r||[]),
    ipcRenderer.invoke('load-profiles')         .then(r=>r||[]),
    ipcRenderer.invoke('load-mods')             .then(r=>r||[]),
    ipcRenderer.invoke('load-launched-versions').then(r=>r||[]),
  ]);

  if (settings.ram === undefined || settings.ram === null) {
    const totalGB = await ipcRenderer.invoke('get-total-ram');
    settings.ram = Math.max(1, Math.min(8, Math.round(totalGB / 2)));
  }

  if(settings.theme==='light') applyTheme(true);
  if(typeof settings.accentIdx==='number'){currentAccentIdx=settings.accentIdx;}
  if(settings.ramUnit) { /* handled in bindSettings */ }

  buildColorGrid();
  applyAccent(currentAccentIdx);
  bindToolbar();
  bindSettings();
  ensureDefaultMods();
  // Apply saved toggle states
  document.getElementById('open-logs-toggle').checked = !!settings.openLogsAfterLaunch;
  document.getElementById('close-launcher-toggle').checked = !!settings.closeLauncherWhilePlaying;
  document.getElementById('use-original-launcher-toggle').checked = !!settings.useOriginalLauncher;
  renderModList();
  fetchMissingModIcons(); // fetch icons in background
  renderAccountList();
  renderProfileList();
  updateLaunchProfileSelect();
  updateSkinDisplay();
  init3DSkin();
  loadClientRPSettings();

  // Show launcher immediately
  document.getElementById('launcher-screen').style.display='flex';
  showPage(accounts.length ? 'launch-page' : 'account-page');

  document.getElementById('status').textContent='Loading versions...';
  loadVersions();
  // Java scan is triggered automatically by main process after load (see java-scan-result listener below)
};

// ════════════════════════════════════════
// SCREEN / NAV
// ════════════════════════════════════════
function updateStopButtons(){
  const hasRunning = Object.values(instances).some(i=>i.status==='running');
  const runningCount = Object.values(instances).filter(i=>i.status==='running').length;
  document.getElementById('stop-btn').style.display = hasRunning ? '' : 'none';
  document.getElementById('stop-all-btn').style.display = runningCount >= 2 ? '' : 'none';
}
function showLauncher(){
  document.getElementById('launcher-screen').style.display='flex';
}

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>{p.classList.remove('active');p.style.display='none';});
  const pg=document.getElementById(id); pg.classList.add('active'); pg.style.display='';
  document.querySelectorAll('.tb-btn[data-page]').forEach(b=>{
    const on=b.dataset.page===id; b.classList.toggle('active',on);
    if(on){ const col=ACCENTS[currentAccentIdx]; const lightText=[3,4,5,6,15].includes(currentAccentIdx);
      b.style.background=col; b.style.borderColor=col;
      b.style.color=lightText?'#111':'#fff';
    } else { b.style.background=''; b.style.borderColor=''; b.style.color=''; }
  });
  if(id==='logs-page'){ refreshLogSelect(); updateStopButtons(); }
  if(id==='instances-page') renderInstanceList();
  if(id==='launch-page'){ const wrap=document.getElementById('skin3d-wrap'); setTimeout(()=>{ if(wrap.clientWidth>0 && typeof threeRenderer !== 'undefined' && typeof threeCamera !== 'undefined'){ threeRenderer.setSize(wrap.clientWidth, wrap.clientHeight); threeCamera.aspect = wrap.clientWidth / wrap.clientHeight; threeCamera.updateProjectionMatrix(); } },50); updateStopButtons(); }
}

function bindToolbar(){
  document.querySelectorAll('.tb-btn[data-page]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
  document.getElementById('toolbar-theme').addEventListener('click',()=>{
    const l=document.body.classList.toggle('light');
    document.getElementById('icon-moon').style.display=l?'none':''; 
    document.getElementById('icon-sun').style.display=l?'':'none';
    settings.theme=l?'light':'dark'; saveSettings();
  });
}

function applyTheme(l){
  document.body.classList.toggle('light',l);
  document.getElementById('icon-moon').style.display=l?'none':'';
  document.getElementById('icon-sun').style.display=l?'':'none';
}

// ════════════════════════════════════════
// SETTINGS BINDINGS
// ════════════════════════════════════════
function bindSettings(){
  // RAM slider + unit toggle
  let ramUnit = settings.ramUnit || 'gb';
  const slider = document.getElementById('ramSlider');
  const unitBtn = document.getElementById('ram-unit-btn');
  const unitLabel = document.getElementById('ramUnitLabel');

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const toMb = gb => clamp(Math.round(gb * 1024), 512, 8192);
  const toGb = mb => clamp(Math.round(mb / 1024), 1, 8);
  const getSavedRam = () => {
    const raw = parseInt(settings.ram, 10);
    if (Number.isNaN(raw)) return ramUnit === 'mb' ? 1024 : 1;
    if (ramUnit === 'mb') {
      return raw > 0 && raw <= 8 ? toMb(raw) : clamp(raw, 512, 8192);
    }
    return raw > 8 ? toGb(raw) : clamp(raw, 1, 8);
  };

  function updateRamSlider(){
    const savedRam = getSavedRam();
    if(ramUnit === 'mb'){
      slider.min = 512; slider.max = 8192; slider.step = 256;
      slider.value = savedRam;
      unitLabel.textContent='MB'; unitBtn.textContent='Switch to GB';
    } else {
      slider.min = 1; slider.max = 8; slider.step = 1;
      slider.value = savedRam;
      unitLabel.textContent='GB'; unitBtn.textContent='Switch to MB';
    }
    document.getElementById('ramValue').textContent = slider.value;
    settings.ram = parseInt(slider.value, 10);
    settings.ramUnit = ramUnit;
    saveSettings();
  }

  updateRamSlider();
  slider.addEventListener('input', e => {
    const value = parseInt(e.target.value, 10) || 0;
    document.getElementById('ramValue').textContent = value;
    settings.ram = value;
    settings.ramUnit = ramUnit;
    saveSettings();
  });
  unitBtn.addEventListener('click', () => {
    const oldUnit = ramUnit;
    const oldValue = parseInt(slider.value, 10) || (oldUnit === 'mb' ? 1024 : 1);
    ramUnit = oldUnit === 'gb' ? 'mb' : 'gb';
    const newValue = oldUnit === 'gb' ? toMb(oldValue) : toGb(oldValue);
    settings.ram = newValue;
    settings.ramUnit = ramUnit;
    saveSettings();
    updateRamSlider();
  });

  // Java rescan
  document.getElementById('rescan-java-btn').addEventListener('click',async()=>{
    document.getElementById('rescan-java-btn').textContent='Scanning...';
    await loadJava();
    document.getElementById('rescan-java-btn').textContent='↻ Rescan Java';
  });

  // Language
  if(settings.lang){ document.getElementById('lang-select').value=settings.lang; applyLanguage(settings.lang); }
  document.getElementById('lang-select').addEventListener('change',e=>{
    settings.lang=e.target.value; saveSettings();
    applyLanguage(e.target.value);
  });

  // Cape
  document.getElementById('cape-save-btn').addEventListener('click',()=>{
    settings.capeUrl=document.getElementById('cape-url-input').value.trim();
    saveSettings(); renderCapePreview(settings.capeUrl);
  });
  document.getElementById('cape-file-input').addEventListener('change',e=>{
    const f=e.target.files[0]; if(!f)return;
    const r=new FileReader(); r.onload=ev=>{settings.capeUrl=ev.target.result;saveSettings();renderCapePreview(settings.capeUrl);document.getElementById('cape-url-input').value='(file loaded)';};
    r.readAsDataURL(f);
  });
  if(settings.capeUrl){document.getElementById('cape-url-input').value=settings.capeUrl;renderCapePreview(settings.capeUrl);}

}

function renderCapePreview(url){
  if(!url)return;
  const canvas=document.getElementById('cape-preview');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const img=new Image(); img.crossOrigin='anonymous';
  img.onload=()=>{ctx.clearRect(0,0,128,64);ctx.imageSmoothingEnabled=false;ctx.drawImage(img,0,0,128,64);};
  img.src=url;
}

const LANGS={
  en:{
    tab_launch:'Launch', tab_mods:'Client Options', tab_profiles:'Profiles', tab_cape:'Capes',
    tab_settings:'Settings', tab_logs:'Logs', tab_instances:'Instances', tab_account:'MC-Account',
    h_launch:'Launch', h_mods:'Client Options', h_profiles:'Profiles', h_settings:'Settings',
    h_logs:'Logs', h_instances:'Instances', h_account:'MC Account', h_cape:'Capes',
    lbl_profile:'Profile:', lbl_version:'Version:',
    btn_launch:'▶ Launch Minecraft', btn_stop:'■ Stop',
    status_ready:'Ready.', status_loading:'Loading versions...',
    sec_java:'Java Installation', sec_ram:'RAM for Minecraft', sec_lang:'Language', sec_color:'Active Tab Color (16 colors)',
    btn_rescan:'↻ Rescan Java', btn_dl21:'Download Java 21', btn_dl17:'Download Java 17',
    new_profile:'+ New Profile', edit:'Edit', save:'Save', delete:'Delete',
    no_mods:'No mods installed yet.', no_profiles:'No profiles yet.', no_accounts:'No accounts added yet.', no_instances:'No instances launched yet.',
    add_ms:'+ Microsoft', add_mojang:'+ Mojang', add_offline:'+ Offline',
    ver_latest:'— Latest Release —', ver_latest_snap:'— Latest Snapshot —', ver_releases:'Releases', ver_snapshots:'Snapshots', ver_other:'Other',
    profile_name:'Name:', profile_version:'Minecraft Version:', profile_mods:'Mods', profile_datapacks:'Datapacks', profile_resourcepacks:'Resource Packs', profile_shaderpacks:'Shader Packs',
    clear_logs:'Clear',
  },
  de:{
    tab_launch:'Launch', tab_mods:'Client Options', tab_profiles:'Profile', tab_cape:'Capes',
    tab_settings:'Einstellungen', tab_logs:'Protokolle', tab_instances:'Instanzen', tab_account:'MC-Konto',
    h_launch:'Launch', h_mods:'Client Options', h_profiles:'Profile', h_settings:'Einstellungen',
    h_logs:'Protokolle', h_instances:'Instanzen', h_account:'MC-Konto', h_cape:'Capes',
    lbl_profile:'Profil:', lbl_version:'Version:',
    btn_launch:'▶ Minecraft starten', btn_stop:'■ Stoppen',
    status_ready:'Bereit.', status_loading:'Versionen laden...',
    sec_java:'Java-Installation', sec_ram:'RAM für Minecraft', sec_lang:'Sprache', sec_color:'Tab-Farbe (16 Farben)',
    btn_rescan:'↻ Java scannen', btn_dl21:'Java 21 herunterladen', btn_dl17:'Java 17 herunterladen',
    new_profile:'+ Neues Profil', edit:'Bearbeiten', save:'Speichern', delete:'Löschen',
    no_mods:'Keine Mods installiert.', no_profiles:'Keine Profile vorhanden.', no_accounts:'Keine Konten vorhanden.', no_instances:'Keine Instanzen gestartet.',
    add_ms:'+ Microsoft', add_mojang:'+ Mojang', add_offline:'+ Offline',
    ver_latest:'— Neueste Version —', ver_latest_snap:'— Neuester Snapshot —', ver_releases:'Vollversionen', ver_snapshots:'Snapshots', ver_other:'Sonstige',
    profile_name:'Name:', profile_version:'Minecraft-Version:', profile_mods:'Mods', profile_datapacks:'Datenpakete', profile_resourcepacks:'Ressourcenpakete', profile_shaderpacks:'Shaderpakete',
    clear_logs:'Leeren',
  },
  fr:{
    tab_launch:'Launch', tab_mods:'Client Options', tab_profiles:'Profils', tab_cape:'Capes',
    tab_settings:'Paramètres', tab_logs:'Journaux', tab_instances:'Instances', tab_account:'Compte MC',
    h_launch:'Launch', h_mods:'Client Options', h_profiles:'Profils', h_settings:'Paramètres',
    h_logs:'Journaux', h_instances:'Instances', h_account:'Compte MC', h_cape:'Capes',
    lbl_profile:'Profil :', lbl_version:'Version :',
    btn_launch:'▶ Lancer Minecraft', btn_stop:'■ Arrêter',
    status_ready:'Prêt.', status_loading:'Chargement des versions...',
    sec_java:'Installation Java', sec_ram:'RAM pour Minecraft', sec_lang:'Langue', sec_color:'Couleur de l\'onglet actif',
    btn_rescan:'↻ Analyser Java', btn_dl21:'Télécharger Java 21', btn_dl17:'Télécharger Java 17',
    new_profile:'+ Nouveau profil', edit:'Modifier', save:'Enregistrer', delete:'Supprimer',
    no_mods:'Aucun mod installé.', no_profiles:'Aucun profil.', no_accounts:'Aucun compte.', no_instances:'Aucune instance.',
    add_ms:'+ Microsoft', add_mojang:'+ Mojang', add_offline:'+ Hors ligne',
    ver_latest:'— Dernière version —', ver_latest_snap:'— Dernier instantané —', ver_releases:'Versions', ver_snapshots:'Instantanés', ver_other:'Autres',
    profile_name:'Nom :', profile_version:'Version Minecraft :', profile_mods:'Mods', profile_datapacks:'Datapacks', profile_resourcepacks:'Packs de ressources', profile_shaderpacks:'Packs de shaders',
    clear_logs:'Effacer',
  },
  es:{
    tab_launch:'Launch', tab_mods:'Client Options', tab_profiles:'Perfiles', tab_cape:'Capes',
    tab_settings:'Ajustes', tab_logs:'Registros', tab_instances:'Instancias', tab_account:'Cuenta MC',
    h_launch:'Launch', h_mods:'Client Options', h_profiles:'Perfiles', h_settings:'Ajustes',
    h_logs:'Registros', h_instances:'Instancias', h_account:'Cuenta MC', h_cape:'Capes',
    lbl_profile:'Perfil:', lbl_version:'Versión:',
    btn_launch:'▶ Iniciar Minecraft', btn_stop:'■ Detener',
    status_ready:'Listo.', status_loading:'Cargando versiones...',
    sec_java:'Instalación de Java', sec_ram:'RAM para Minecraft', sec_lang:'Idioma', sec_color:'Color de pestaña activa',
    btn_rescan:'↻ Buscar Java', btn_dl21:'Descargar Java 21', btn_dl17:'Descargar Java 17',
    new_profile:'+ Nuevo perfil', edit:'Editar', save:'Guardar', delete:'Eliminar',
    no_mods:'Sin mods instalados.', no_profiles:'Sin perfiles.', no_accounts:'Sin cuentas.', no_instances:'Sin instancias.',
    add_ms:'+ Microsoft', add_mojang:'+ Mojang', add_offline:'+ Sin conexión',
    ver_latest:'— Última versión —', ver_latest_snap:'— Último instantáneo —', ver_releases:'Versiones', ver_snapshots:'Instantáneas', ver_other:'Otras',
    profile_name:'Nombre:', profile_version:'Versión de Minecraft:', profile_mods:'Mods', profile_datapacks:'Datapacks', profile_resourcepacks:'Paquetes de recursos', profile_shaderpacks:'Paquetes de shaders',
    clear_logs:'Limpiar',
  },
};

let currentLang='en';
function t(key){ return (LANGS[currentLang]||LANGS.en)[key] || LANGS.en[key] || key; }

function applyLanguage(lang){
  currentLang=lang;
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.dataset.i18n;
    const val=t(key);
    if(!val)return;
    // Preserve child elements (like canvas inside tb-btn)
    if(el.children.length>0){
      const children=[...el.children];
      el.textContent=val;
      children.forEach(c=>el.prepend(c));
    } else {
      el.textContent=val;
    }
  });
  // Re-apply active button styling after text change
  applyAccent(currentAccentIdx);
}

function saveSettings(){ ipcRenderer.send('save-settings',settings); }

// ════════════════════════════════════════
// SCAN
// ════════════════════════════════════════
// Auto-update tokens when refreshed during launch
ipcRenderer.on('token-refreshed',(_,{uuid, accessToken, refreshToken})=>{
  const acc = accounts.find(a=>a.uuid===uuid||a.uuid===uuid.replace(/-/g,''));
  if(acc){
    acc.accessToken=accessToken;
    if(refreshToken) acc.refreshToken=refreshToken;
    ipcRenderer.send('save-accounts', accounts);
  }
});

// Main process auto-scans Java after window loads and sends result here
ipcRenderer.on('java-scan-result',(_,javas)=>{
  populateJava(javas);
  document.getElementById('status').textContent = javas.length ? 'Ready.' : 'No Java found — go to Settings → Rescan Java.';
});

function populateJava(javas){
  const sel=document.getElementById('javaSelect'); sel.innerHTML='';
  if(!javas||!javas.length){
    sel.innerHTML='<option value="">No Java found — click Download Java 21 in Settings</option>';
    document.getElementById('status').textContent='No Java found. Go to Settings → Download Java 21.';
    return; // don't auto-install, just let user proceed
  }
  const sorted=[...javas].sort((a,b)=>{ const va=parseInt(a.version)||0,vb=parseInt(b.version)||0; return Math.abs(vb-21)-Math.abs(va-21); });
  sorted.forEach(j=>{ const o=document.createElement('option'); o.value=j.path; o.textContent=`Java ${j.version}`; sel.appendChild(o); });
  settings.javaPath=sorted[0].path; saveSettings();
}
async function loadJava(){ try{ populateJava(await ipcRenderer.invoke('get-java-versions')); }catch{} }
async function loadVersions(){
  try {
    mcVersionList=await ipcRenderer.invoke('get-versions');
    const ps=document.getElementById('profile-version-select');
    ps.innerHTML='<option value="">— Latest Release —</option>';

    const releases  = mcVersionList.filter(v=>v.type==='release');
    const snapshots = mcVersionList.filter(v=>v.type==='snapshot');
    const others    = mcVersionList.filter(v=>v.type!=='release'&&v.type!=='snapshot');

    if(releases.length){
      const grp=document.createElement('optgroup'); grp.label='Releases';
      releases.forEach(v=>{ const o=document.createElement('option'); o.value=v.id; o.textContent=v.id; grp.appendChild(o); });
      ps.appendChild(grp);
    }
    if(snapshots.length){
      const grp=document.createElement('optgroup'); grp.label='Snapshots';
      snapshots.forEach(v=>{ const o=document.createElement('option'); o.value=v.id; o.textContent=v.id; grp.appendChild(o); });
      ps.appendChild(grp);
    }
    if(others.length){
      const grp=document.createElement('optgroup'); grp.label='Other';
      others.forEach(v=>{ const o=document.createElement('option'); o.value=v.id; o.textContent=`${v.id} (${v.type})`; grp.appendChild(o); });
      ps.appendChild(grp);
    }
    // jar version select removed
  } catch(e){ document.getElementById('status').textContent='Version load failed: '+e.message; }
}

// ════════════════════════════════════════
// LAUNCH
// ════════════════════════════════════════
let currentInstanceId=null;

// Shader → recommended mod mapping
const SHADER_MODS = {
  'iris': { name:'Iris Shaders', modrinthId:'YL57xq9U', source:'Modrinth' },
  'optifine': { name:'OptiFine', modrinthId:null, source:'External' },
  'sodium': { name:'Sodium', modrinthId:'AANobbMI', source:'Modrinth' },
};
const SHADER_PACK_SUGGESTIONS = {
  // shader pack name keywords → mod to install
  'complementary': 'iris', 'bsl': 'iris', 'sildurs': 'iris', 'seus': 'iris',
  'rethinking': 'iris', 'photon': 'iris', 'bliss': 'iris', 'chocapic': 'iris',
  'optifine': 'optifine',
};

document.getElementById('launch-btn').addEventListener('click',async()=>{
  const pid=document.getElementById('profileSelect').value;
  const profile=profiles.find(p=>p.id===pid)||profiles[0];
  let version = profile?.mcVersion || '';
  if (!version || version === '') version = mcVersionList.find(v=>v.type==='release')?.id || '';
  else if (version === '__latest_snapshot__') version = mcVersionList.find(v=>v.type==='snapshot')?.id || mcVersionList[0]?.id || '';
  const javaPath=document.getElementById('javaSelect').value;
  const ram=document.getElementById('ramSlider').value;
  const ramUnit=settings.ramUnit||'gb';
  const modLoader=profile?.modLoader||'fabric';

  if(!version){ document.getElementById('status').textContent='No version selected.'; return; }

  // Auto-add shader mod to PROFILE mods (not client mods)
  if(profile?.shaderPacks?.length && modLoader!=='vanilla'){
    const profileIdx = profiles.findIndex(p=>p.id===pid);
    if (profileIdx >= 0) {
      let profileModsChanged = false;
      for(const shader of profile.shaderPacks){
        const key=Object.keys(SHADER_PACK_SUGGESTIONS).find(k=>shader.toLowerCase().includes(k));
        if(key){
          const modDef=SHADER_MODS[SHADER_PACK_SUGGESTIONS[key]];
          if(modDef&&modDef.modrinthId&&!profiles[profileIdx].mods?.some(m=>m.modrinthId===modDef.modrinthId)){
            if (!profiles[profileIdx].mods) profiles[profileIdx].mods = [];
            profiles[profileIdx].mods.push({name:modDef.name,version:'latest',mcVersion:version,source:modDef.source,iconUrl:'',modrinthId:modDef.modrinthId,downloadAllVersions:false,disabled:false,autoInstalled:true});
            profileModsChanged = true;
          }
        }
      }
      if (profileModsChanged) ipcRenderer.send('save-profiles', profiles);
    }
  }

  const lpWrap=document.getElementById('lp-wrap'), lpFill=document.getElementById('lp-fill'), lpLabel=document.getElementById('lp-label');
  lpWrap.classList.add('vis'); lpFill.style.width='1%'; lpLabel.textContent='Starting...';
  updateStopButtons();
  if(!launchedVersions.includes(version)){
    launchedVersions.push(version); ipcRenderer.send('save-launched-versions',launchedVersions);
    autoDownloadForVersion(version);
  }

  const acc=getSelectedAccount();
  ipcRenderer.send('launch-minecraft',{
    version, javaPath, ram, ramUnit, modLoader,
    profileId: pid,
    profileName: profile?.name||'',
    clientMods: installedMods,
    clientResourcePacks: clientResourcePacks,
    useClientMods: profile?.useClientMods !== false,
    useClientRPs:  profile?.useClientRPs  !== false,
    profileMods: profile?.mods||[],
    accessToken: acc?.accessToken||null,
    uuid: acc?.uuid||null,
    playerName: acc?.name||'Player',
    refreshToken: acc?.refreshToken||null,
    useOriginalLauncher: settings.useOriginalLauncher||false
  });
});

// No Java found — redirect to settings and auto-scan
ipcRenderer.on('no-java-found',(_,neededVersion)=>{
  document.getElementById('status').textContent=`Java ${neededVersion} required. Scanning for Java...`;
  updateStopButtons();
  document.getElementById('launch-btn').disabled=false;
  showPage('settings-page');
  setTimeout(async()=>{
    document.getElementById('rescan-java-btn').textContent='Scanning...';
    await loadJava();
    document.getElementById('rescan-java-btn').textContent='↻ Rescan Java';
    if(!document.getElementById('javaSelect').value){
      document.getElementById('status').textContent=`No Java found. Download Java ${neededVersion} from adoptium.net`;
    }
  }, 300);
});

document.getElementById('stop-btn').addEventListener('click',()=>{
  const toStop = selectedInstanceId || currentInstanceId;
  if(toStop) ipcRenderer.send('stop-minecraft', toStop);
});
document.getElementById('stop-all-btn').addEventListener('click',()=>{
  const running = Object.values(instances).filter(i=>i.status==='running');
  running.forEach(inst => ipcRenderer.send('stop-minecraft', inst.id));
});

ipcRenderer.on('launch-status',(_,s)=>{ document.getElementById('status').textContent=s; });
ipcRenderer.on('launch-progress',(_,d)=>{
  const lpWrap=document.getElementById('lp-wrap'),lpFill=document.getElementById('lp-fill'),lpLabel=document.getElementById('lp-label');
  const lpWrapL=document.getElementById('lp-wrap-logs'),lpFillL=document.getElementById('lp-fill-logs'),lpLabelL=document.getElementById('lp-label-logs');
  if(d.done){
    setTimeout(()=>{lpWrap.classList.remove('vis'); if(lpWrapL)lpWrapL.classList.remove('vis');},2000);
    return;
  }
  lpWrap.classList.add('vis'); lpFill.style.width=(d.percent||0)+'%'; lpLabel.textContent=d.message||'';
  if(lpWrapL){ lpWrapL.classList.add('vis'); lpFillL.style.width=(d.percent||0)+'%'; lpLabelL.textContent=d.message||''; }
});
// Switch to logs tab when MC actually starts
ipcRenderer.on('mc-launched',(_,instanceId)=>{
  if(settings.openLogsAfterLaunch) showPage('logs-page');
});
ipcRenderer.on('instance-started',(_,inst)=>{
  instances[inst.id]={...inst, logs:[], status:'running'};
  currentInstanceId=inst.id;
  selectedInstanceId=inst.id;
  updateStopButtons();
  renderInstanceList();
  refreshLogSelect();
  updateRunningBadge();
  const sel=document.getElementById('log-instance-select');
  if(sel) sel.value=inst.id;
  document.getElementById('logs-container').innerHTML='';
  if(settings.openLogsAfterLaunch) showPage('logs-page');
  if(settings.closeLauncherWhilePlaying) ipcRenderer.send('close-launcher');
});
ipcRenderer.on('instance-log',(_,{instanceId,line})=>{
  if(!instances[instanceId])return;
  if(!instances[instanceId].logs)instances[instanceId].logs=[];
  instances[instanceId].logs.push(line);
  if(selectedInstanceId===instanceId){ appendLogLine(line); }
});
ipcRenderer.on('instance-closed',(_,{instanceId,code})=>{
  if(instances[instanceId]){instances[instanceId].status=code===0?'closed':'crashed';}
  if(currentInstanceId===instanceId){ currentInstanceId=null; }
  updateStopButtons();
  document.getElementById('launch-btn').disabled=false;
  updateRunningBadge();
  renderInstanceList();
  refreshLogSelect();
  if(settings.closeLauncherWhilePlaying) ipcRenderer.send('show-launcher');
});
ipcRenderer.on('instance-crashed',(_,{instanceId})=>{
  if(instances[instanceId])instances[instanceId].status='crashed';
  updateStopButtons();
  updateRunningBadge();
  renderInstanceList();
  refreshLogSelect();
});
async function autoDownloadForVersion(mcVersion){
  for(const mod of installedMods){
    if(!mod.downloadAllVersions||mod.disabled||!mod.modrinthId)continue;
    if(installedMods.some(m=>m.modrinthId===mod.modrinthId&&m.mcVersion===mcVersion))continue;
    try{
      const vd=await(await fetch(`https://api.modrinth.com/v2/project/${mod.modrinthId}/version`)).json();
      if(vd.some(v=>v.game_versions.includes(mcVersion))){
        installedMods.push({...mod,mcVersion,autoInstalled:true}); saveMods(); renderModList();
      }
    }catch{}
  }
}

// ════════════════════════════════════════
// INSTANCES & LOGS
// ════════════════════════════════════════
function updateRunningBadge(){
  const running = Object.values(instances).filter(i=>i.status==='running').length;
  const badge = document.getElementById('running-badge');
  if(badge){ if(running>0){badge.textContent=running;badge.style.display='inline';}else{badge.style.display='none';} }
  updateStopButtons();
}

function renderInstanceList(){
  const el=document.getElementById('instance-list'); el.innerHTML='';
  const list=Object.values(instances);
  if(!list.length){el.innerHTML='<div class="mod-list-empty">No instances launched yet.</div>';return;}
  list.forEach(inst=>{
    const item=document.createElement('div');
    item.className='instance-item'+(inst.id===selectedInstanceId?' sel':'');
    const badge=inst.status==='running'?'<span class="instance-badge badge-running">Running</span>':inst.status==='crashed'?'<span class="instance-badge badge-crashed">Crashed</span>':'<span class="instance-badge badge-closed">Closed</span>';
    const t=new Date(inst.startTime).toLocaleTimeString();
    item.innerHTML=`<div style="flex:1"><div style="font-weight:bold;font-size:.85em">${inst.version}</div><div style="color:#555;font-size:.72em">${t}</div></div>${badge}`;
    item.addEventListener('click',()=>{ selectedInstanceId=inst.id; renderInstanceList(); refreshLogSelect(); document.getElementById('log-instance-select').value=inst.id; renderLogsForInstance(inst.id); });
    el.appendChild(item);
  });
}

function refreshLogSelect(){
  const sel=document.getElementById('log-instance-select');
  sel.innerHTML='<option value="">— Select instance —</option>';
  const list = Object.values(instances);
  list.forEach((inst, idx)=>{
    const o=document.createElement('option');
    o.value=inst.id;
    const profileName = inst.profileName ? ` · ${inst.profileName}` : '';
    const status = inst.status==='running' ? ' ▶' : inst.status==='crashed' ? ' ✗' : ' ■';
    o.textContent=`#${idx+1} ${inst.version}${profileName} (${new Date(inst.startTime).toLocaleTimeString()})${status}`;
    if(inst.id===selectedInstanceId) o.selected=true;
    sel.appendChild(o);
  });
}

document.getElementById('log-instance-select').addEventListener('change',e=>{
  selectedInstanceId=e.target.value||null;
  if(selectedInstanceId) renderLogsForInstance(selectedInstanceId);
  else document.getElementById('logs-container').innerHTML='';
  updateStopButtons();
});

function renderLogsForInstance(instanceId){
  const c=document.getElementById('logs-container'); c.innerHTML='';
  const inst=instances[instanceId]; if(!inst)return;
  (inst.logs||[]).forEach(l=>appendLogLine(l));
  c.scrollTop=c.scrollHeight;
}

function appendLogLine(line){
  const c=document.getElementById('logs-container');
  const d=document.createElement('div');
  const l=line.toLowerCase();
  d.className='log-line'+(l.includes('error')||l.includes('exception')||l.includes('crash')?' err':l.includes('warn')?' warn':l.includes('info')||l.includes('[main/')?' info':'');
  d.textContent=line;
  c.appendChild(d);
  if(c.scrollTop+c.clientHeight>c.scrollHeight-80)c.scrollTop=c.scrollHeight;
}

document.getElementById('clear-logs-btn').addEventListener('click',()=>{ document.getElementById('logs-container').innerHTML=''; });

// ════════════════════════════════════════
// PROFILES
// ════════════════════════════════════════
function renderProfileList(){
  const el=document.getElementById('profile-list'); el.innerHTML='';
  if(!profiles.length){el.innerHTML='<div class="mod-list-empty">No profiles yet.</div>';return;}
  profiles.forEach(p=>{
    const item=document.createElement('div');
    item.className='profile-item'+(p.id===settings.selectedProfile?' sel':'');
    item.innerHTML=`<span class="profile-name">${p.name}${p.isModpack?'<span style="font-size:.7em;margin-left:.4em;padding:.1em .35em;border-radius:999px;background:#1bd96a22;color:#1bd96a;border:1px solid #1bd96a44">modpack</span>':''}</span><span class="profile-meta">${p.mcVersion||'Latest'} · ${p.modLoader||'fabric'} · ${(p.mods||[]).length} mods</span><button class="btn profile-edit-btn">Edit</button>`;
    item.addEventListener('click',e=>{ if(e.target.classList.contains('profile-edit-btn'))return; settings.selectedProfile=p.id; saveSettings(); renderProfileList(); updateLaunchProfileSelect(); });
    item.querySelector('.profile-edit-btn').addEventListener('click',()=>openProfileModal(p.id));
    el.appendChild(item);
  });
}

function updateLaunchProfileSelect(){
  const sel=document.getElementById('profileSelect'); sel.innerHTML='';
  profiles.forEach(p=>{ const o=document.createElement('option'); o.value=p.id; o.textContent=p.name; if(p.id===settings.selectedProfile)o.selected=true; sel.appendChild(o); });
  updateVersionDisplay();
}

document.getElementById('profileSelect').addEventListener('change',updateVersionDisplay);
function updateVersionDisplay(){
  const p=profiles.find(x=>x.id===document.getElementById('profileSelect').value);
  document.getElementById('profile-version-display').textContent=p?(p.mcVersion||'Latest'):'';
  document.getElementById('skin-version-display').textContent=p?(p.mcVersion||'Latest'):'—';
}

document.getElementById('new-profile-btn').addEventListener('click',()=>{
  const np={id:'p_'+Date.now(),name:'New Profile',mcVersion:'',mods:[],datapacks:[],resourcePacks:[],shaderPacks:[]};
  profiles.push(np); ipcRenderer.send('save-profiles',profiles); renderProfileList(); updateLaunchProfileSelect(); openProfileModal(np.id);
});

function updateModLoaderVisibility(){
  const loader=document.querySelector('input[name="modLoader"]:checked')?.value||'fabric';
  const modsSection=document.getElementById('profile-mods-section');
  if(modsSection) modsSection.style.opacity=loader==='vanilla'?'0.4':'1';
  if(modsSection) modsSection.style.pointerEvents=loader==='vanilla'?'none':'';
}

async function checkLoaderAvailability(mcVersion){
  const fabricBtn=document.getElementById('ml-fabric');
  const forgeBtn =document.getElementById('ml-forge');
  if(!mcVersion){ fabricBtn.disabled=false; forgeBtn.disabled=false; return; }

  // Check Fabric
  try {
    const res=await fetch(`https://meta.fabricmc.net/v2/versions/loader/${mcVersion}`);
    if(!res.ok) throw new Error('Not found');
    const data=await res.json();
    fabricBtn.disabled=!(Array.isArray(data)&&data.length>0);
    fabricBtn.title=fabricBtn.disabled?`Fabric not available for MC ${mcVersion}`:'';
  } catch { fabricBtn.disabled=false; fabricBtn.title=''; }

  // Check Forge
  try {
    const res=await fetch('https://files.minecraftforge.net/net/minecraftforge/forge/promotions_slim.json');
    if(!res.ok) throw new Error('Not found');
    const data=await res.json();
    forgeBtn.disabled=!(data.promos&&(data.promos[`${mcVersion}-recommended`]||data.promos[`${mcVersion}-latest`]));
    forgeBtn.title=forgeBtn.disabled?`Forge not available for MC ${mcVersion}`:'';
  } catch { forgeBtn.disabled=false; forgeBtn.title=''; }

  // If current selection no longer available, switch to a valid option
  const checked=document.querySelector('input[name="modLoader"]:checked');
  if(checked&&checked.disabled){
    const vanilla=document.getElementById('ml-vanilla');
    if(vanilla&&!vanilla.disabled) vanilla.checked=true;
    updateModLoaderVisibility();
  }
}

function openProfileModal(profileId){
  editingProfileId=profileId;
  const p=profiles.find(x=>x.id===profileId); if(!p)return;
  editingPackData={ mods:[...(p.mods||[])], datapacks:[...(p.datapacks||[])], resourcePacks:[...(p.resourcePacks||[])], shaderPacks:[...(p.shaderPacks||[])] };
  document.getElementById('profile-name-input').value=p.name;

  // Set modLoader
  const ml=p.modLoader||'fabric';
  const mlEl=document.querySelector(`input[name="modLoader"][value="${ml}"]`);
  if(mlEl) mlEl.checked=true;
  updateModLoaderVisibility();
  document.querySelectorAll('input[name="modLoader"]').forEach(r=>r.addEventListener('change',updateModLoaderVisibility));

  document.getElementById('profile-use-client-mods').checked = p.useClientMods !== false;
  document.getElementById('profile-use-client-rps').checked  = p.useClientRPs  !== false;

  // Always rebuild version select fresh
  const sel=document.getElementById('profile-version-select');
  sel.innerHTML=`<option value="">${t('ver_latest')}</option><option value="__latest_snapshot__">${t('ver_latest_snap')}</option>`;
  if(mcVersionList.length>0){
    const releases  = mcVersionList.filter(v=>v.type==='release');
    const snapshots = mcVersionList.filter(v=>v.type==='snapshot');
    const others    = mcVersionList.filter(v=>v.type!=='release'&&v.type!=='snapshot');
    if(releases.length){ const g=document.createElement('optgroup'); g.label=t('ver_releases'); releases.forEach(v=>{const o=document.createElement('option');o.value=v.id;o.textContent=v.id;g.appendChild(o);}); sel.appendChild(g); }
    if(snapshots.length){ const g=document.createElement('optgroup'); g.label=t('ver_snapshots'); snapshots.forEach(v=>{const o=document.createElement('option');o.value=v.id;o.textContent=v.id;g.appendChild(o);}); sel.appendChild(g); }
    if(others.length){ const g=document.createElement('optgroup'); g.label=t('ver_other'); others.forEach(v=>{const o=document.createElement('option');o.value=v.id;o.textContent=`${v.id} (${v.type})`;g.appendChild(o);}); sel.appendChild(g); }
  } else {
    loadVersions().then(()=>openProfileModal(profileId));
    return;
  }
  sel.value=p.mcVersion||'';

  // Check loader availability for selected version
  let checkVer = sel.value;
  if (!checkVer) checkVer = mcVersionList.find(v=>v.type==='release')?.id || '';
  else if (checkVer === '__latest_snapshot__') checkVer = mcVersionList.find(v=>v.type==='snapshot')?.id || '';
  if (checkVer) checkLoaderAvailability(checkVer);

  sel.addEventListener('change', () => {
    let v = sel.value;
    if (!v) v = mcVersionList.find(x=>x.type==='release')?.id || '';
    else if (v === '__latest_snapshot__') v = mcVersionList.find(x=>x.type==='snapshot')?.id || '';
    checkLoaderAvailability(v || '');
  });

  renderProfilePackList('profile-mods-list','mods',true);
  renderPackTags('profile-datapacks','datapacks');
  renderPackTags('profile-resourcepacks','resourcePacks');
  renderPackTags('profile-shaderpacks','shaderPacks');
  document.getElementById('profile-modal').style.display='flex';
}

document.getElementById('profile-modal-close').addEventListener('click',()=>{ document.getElementById('profile-modal').style.display='none'; profileModMode=false; profilePackMode=null; });
document.getElementById('profile-modal').addEventListener('click',e=>{ if(e.target===document.getElementById('profile-modal')){ document.getElementById('profile-modal').style.display='none'; profileModMode=false; profilePackMode=null; } });

document.getElementById('save-profile-btn').addEventListener('click',()=>{
  const idx=profiles.findIndex(p=>p.id===editingProfileId); if(idx<0)return;
  profiles[idx].name=document.getElementById('profile-name-input').value||'Profile';
  profiles[idx].mcVersion=document.getElementById('profile-version-select').value;
  profiles[idx].modLoader=document.querySelector('input[name="modLoader"]:checked')?.value||'fabric';
  profiles[idx].useClientMods = document.getElementById('profile-use-client-mods').checked;
  profiles[idx].useClientRPs  = document.getElementById('profile-use-client-rps').checked;
  profiles[idx].mods=editingPackData.mods; profiles[idx].datapacks=editingPackData.datapacks;
  profiles[idx].resourcePacks=editingPackData.resourcePacks; profiles[idx].shaderPacks=editingPackData.shaderPacks;
  ipcRenderer.send('save-profiles',profiles); renderProfileList(); updateLaunchProfileSelect();
  document.getElementById('profile-modal').style.display='none';
});
document.getElementById('delete-profile-btn').addEventListener('click',()=>{
  if(profiles.length<=1)return;
  profiles=profiles.filter(p=>p.id!==editingProfileId); ipcRenderer.send('save-profiles',profiles); renderProfileList(); updateLaunchProfileSelect();
  document.getElementById('profile-modal').style.display='none';
});

// Profile pack buttons
document.getElementById('profile-btn-modrinth').addEventListener('click',()=>{ profileModMode=true; profilePackMode='mods'; openModModal('modrinth'); });
document.getElementById('profile-btn-curseforge').addEventListener('click',()=>{ profileModMode=true; profilePackMode='mods'; openModModal('curseforge'); });
document.getElementById('profile-btn-dp-modrinth').addEventListener('click',()=>{ profileModMode=true; profilePackMode='datapacks'; openModModal('modrinth'); });
document.getElementById('profile-btn-rp-modrinth').addEventListener('click',()=>{ profileModMode=true; profilePackMode='resourcePacks'; openModModal('modrinth'); });
document.getElementById('profile-btn-sp-modrinth').addEventListener('click',()=>{ profileModMode=true; profilePackMode='shaderPacks'; openModModal('modrinth'); });

function renderProfilePackList(containerId, key, isMods=false){
  const el=document.getElementById(containerId); el.innerHTML='';
  (editingPackData[key]||[]).forEach((item,i)=>{
    const tag=document.createElement('span'); tag.className='pack-tag';
    if(isMods&&item.iconUrl) tag.innerHTML=`<img src="${item.iconUrl}" style="width:1.1em;height:1.1em;border-radius:.15em;vertical-align:middle"> `;
    const name=isMods?(item.name||item):item;
    const ver=isMods&&item.mcVersion?` <span style="color:#555;font-weight:normal;font-size:.78em">MC ${item.mcVersion}</span>`:'';
    tag.innerHTML+=`${name}${ver} <span class="rt" data-i="${i}">✕</span>`;
    tag.querySelector('.rt').addEventListener('click',()=>{ editingPackData[key].splice(i,1); renderProfilePackList(containerId,key,isMods); });
    el.appendChild(tag);
  });
}
function renderPackTags(containerId,key){ renderProfilePackList(containerId,key,false); }
window.addPackTag=(inputId,containerId,key)=>{
  const input=document.getElementById(inputId),val=input.value.trim(); if(!val)return;
  editingPackData[key].push(val); input.value=''; renderPackTags(containerId,key);
};

// ════════════════════════════════════════
// ACCOUNTS
// ════════════════════════════════════════
function renderAccountList(){
  const el=document.getElementById('account-list'); el.innerHTML='';
  if(!accounts.length){el.innerHTML='<div class="mod-list-empty">No accounts.</div>';return;}
  const sorted=[...accounts].sort((a,b)=>(b.id===settings.selectedAccount?1:0)-(a.id===settings.selectedAccount?1:0));
  sorted.forEach(acc=>{
    const item=document.createElement('div');
    item.className='account-item'+(acc.id===settings.selectedAccount?' sel':'');
    item.innerHTML=`<canvas class="account-head-sm" width="32" height="32"></canvas><span class="account-name">${acc.name}</span><span class="account-type">${acc.type}</span><button class="btn account-del" data-id="${acc.id}">✕</button>`;
    item.addEventListener('click',e=>{ if(e.target.classList.contains('account-del'))return; settings.selectedAccount=acc.id; saveSettings(); renderAccountList(); updateSkinDisplay(); updateAccountTabHead(); });
    item.querySelector('.account-del').addEventListener('click',()=>{ accounts=accounts.filter(a=>a.id!==acc.id); if(settings.selectedAccount===acc.id)settings.selectedAccount=accounts[0]?.id||null; ipcRenderer.send('save-accounts',accounts); saveSettings(); renderAccountList(); updateSkinDisplay(); updateAccountTabHead(); });
    drawHead2D(item.querySelector('canvas'),acc.skinUrl);
    el.appendChild(item);
  });
  updateAccountTabHead();
}

function updateAccountTabHead(){
  const acc=getSelectedAccount();
  const canvas=document.getElementById('tb-account-head');
  if(acc&&acc.skinUrl){ canvas.style.display='inline-block'; drawHead2D(canvas,acc.skinUrl); }
  else{ canvas.style.display='none'; }
}

function updateSkinDisplay(){
  const acc = getSelectedAccount();
  const label = document.getElementById('skin-name-display');
  if(acc){
    label.textContent = acc.name || 'No account';
    if(acc.skinUrl){
      loadSkinTexture(acc.skinUrl);
    } else {
      buildSkinMesh(null);
    }
  } else {
    label.textContent = 'No account';
    buildSkinMesh(null);
  }
}

function drawHead2D(canvas,skinUrl){
  const ctx=canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#555'; ctx.fillRect(0,0,canvas.width,canvas.height);
  if(!skinUrl)return;
  const img=new Image(); img.crossOrigin='anonymous';
  img.onload=()=>{ ctx.imageSmoothingEnabled=false; ctx.drawImage(img,8,8,8,8,0,0,canvas.width,canvas.height); ctx.drawImage(img,40,8,8,8,0,0,canvas.width,canvas.height); };
  img.src=skinUrl;
}

// Microsoft login
document.getElementById('btn-add-ms').addEventListener('click',async()=>{
  const btn=document.getElementById('btn-add-ms');
  btn.textContent='Opening login...'; btn.disabled=true;
  document.getElementById('status').textContent='Opening Microsoft login...';
  try {
    const result=await ipcRenderer.invoke('login-microsoft');
    if(result.error){
      const msg='Login failed: '+result.error;
      document.getElementById('status').textContent=msg;
      alert(msg);
      btn.textContent='+ Microsoft'; btn.disabled=false;
      return;
    }
    const id='acc_'+Date.now();
    accounts.push({id,name:result.name,uuid:result.uuid,type:'Microsoft',accessToken:result.accessToken,refreshToken:result.refreshToken,skinUrl:result.skinUrl});
    if(!settings.selectedAccount)settings.selectedAccount=id;
    ipcRenderer.send('save-accounts',accounts); saveSettings(); renderAccountList(); updateSkinDisplay();
    document.getElementById('status').textContent='✓ Logged in as '+result.name;
  } catch(e) {
    document.getElementById('status').textContent='Login error: '+e.message;
  }
  btn.textContent='+ Microsoft'; btn.disabled=false;
});

// Mojang login
document.getElementById('btn-add-mojang').addEventListener('click',()=>{
  document.getElementById('mojang-email').value=''; document.getElementById('mojang-password').value='';
  document.getElementById('mojang-error').style.display='none';
  document.getElementById('mojang-modal').style.display='flex';
});
document.getElementById('mojang-modal-close').addEventListener('click',()=>{ document.getElementById('mojang-modal').style.display='none'; });
document.getElementById('mojang-modal').addEventListener('click',e=>{ if(e.target===document.getElementById('mojang-modal'))document.getElementById('mojang-modal').style.display='none'; });
document.getElementById('mojang-login-btn').addEventListener('click',async()=>{
  const email=document.getElementById('mojang-email').value.trim();
  const pass=document.getElementById('mojang-password').value;
  if(!email||!pass)return;
  document.getElementById('mojang-login-btn').textContent='Logging in...';
  const result=await ipcRenderer.invoke('login-mojang',{email,password:pass});
  document.getElementById('mojang-login-btn').textContent='Login';
  if(result.error){ document.getElementById('mojang-error').textContent=result.error; document.getElementById('mojang-error').style.display='block'; return; }
  const id='acc_'+Date.now();
  accounts.push({id,name:result.name,uuid:result.uuid,type:'Mojang',accessToken:result.accessToken,clientToken:result.clientToken,skinUrl:result.skinUrl});
  if(!settings.selectedAccount)settings.selectedAccount=id;
  ipcRenderer.send('save-accounts',accounts); saveSettings(); renderAccountList(); updateSkinDisplay();
  document.getElementById('mojang-modal').style.display='none';
  document.getElementById('status').textContent='Logged in as '+result.name;
});

// Offline
document.getElementById('btn-add-offline').addEventListener('click',()=>{ document.getElementById('offline-username').value=''; document.getElementById('offline-modal').style.display='flex'; });
document.getElementById('offline-modal-close').addEventListener('click',()=>{ document.getElementById('offline-modal').style.display='none'; });
document.getElementById('offline-modal').addEventListener('click',e=>{ if(e.target===document.getElementById('offline-modal'))document.getElementById('offline-modal').style.display='none'; });
document.getElementById('offline-add-btn').addEventListener('click',()=>{
  const name=document.getElementById('offline-username').value.trim(); if(!name)return;
  const id='acc_'+Date.now(), uuid=crypto.randomUUID();
  accounts.push({id,name,uuid,type:'Offline',accessToken:null,skinUrl:null});
  if(!settings.selectedAccount)settings.selectedAccount=id;
  ipcRenderer.send('save-accounts',accounts); saveSettings(); renderAccountList(); updateSkinDisplay();
  document.getElementById('offline-modal').style.display='none';
});

function getSelectedAccount(){ return accounts.find(a=>a.id===settings.selectedAccount)||accounts[0]||null; }

// ════════════════════════════════════════
// SKIN 3D
// ════════════════════════════════════════
let skinTexture=null, threeScene=null, threeRenderer=null, threeCamera=null, skinMeshGroup=null;
let skin3DDrag={active:false,startX:0,startY:0,rotY:0,rotX:0};
let currentRotY=30, currentRotX=10;

function init3DSkin(){
  const wrap=document.getElementById('skin3d-wrap');
  if(!wrap||!window.THREE){setTimeout(init3DSkin,200);return;}
  const W=wrap.clientWidth||200, H=wrap.clientHeight||300;
  threeScene=new THREE.Scene();
  threeCamera=new THREE.PerspectiveCamera(35,W/H,0.1,100);
  threeCamera.position.set(0,1.3,11);
  threeCamera.lookAt(0,0,0);
  threeRenderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  threeRenderer.setSize(W,H);
  threeRenderer.setClearColor(0x000000,0);
  threeRenderer.setPixelRatio(window.devicePixelRatio||1);
  wrap.innerHTML='';
  wrap.appendChild(threeRenderer.domElement);
  threeRenderer.domElement.style.width='100%';
  threeRenderer.domElement.style.height='100%';
  threeScene.add(new THREE.AmbientLight(0xffffff,0.7));
  const d1=new THREE.DirectionalLight(0xffffff,0.8); d1.position.set(2,4,3); threeScene.add(d1);
  const d2=new THREE.DirectionalLight(0xaabbff,0.3); d2.position.set(-2,-1,-2); threeScene.add(d2);
  skinMeshGroup=new THREE.Group(); threeScene.add(skinMeshGroup); buildSkinMesh(null);
  wrap.addEventListener('mousedown',e=>{skin3DDrag.active=true;skin3DDrag.startX=e.clientX;skin3DDrag.startY=e.clientY;skin3DDrag.rotY=currentRotY;skin3DDrag.rotX=currentRotX;wrap.style.cursor='grabbing';});
  document.addEventListener('mousemove',e=>{if(!skin3DDrag.active)return;currentRotY=skin3DDrag.rotY+(e.clientX-skin3DDrag.startX)*0.6;currentRotX=Math.max(-35,Math.min(35,skin3DDrag.rotX+(e.clientY-skin3DDrag.startY)*0.3));});
  document.addEventListener('mouseup',()=>{skin3DDrag.active=false;wrap.style.cursor='grab';});
  wrap.addEventListener('wheel',e=>{e.preventDefault();threeCamera.position.z=Math.max(5,Math.min(25,threeCamera.position.z+e.deltaY*0.01));},{passive:false});
  wrap.addEventListener('touchstart',e=>{const t=e.touches[0];skin3DDrag.active=true;skin3DDrag.startX=t.clientX;skin3DDrag.startY=t.clientY;skin3DDrag.rotY=currentRotY;skin3DDrag.rotX=currentRotX;});
  wrap.addEventListener('touchmove',e=>{const t=e.touches[0];if(!skin3DDrag.active)return;currentRotY=skin3DDrag.rotY+(t.clientX-skin3DDrag.startX)*0.6;currentRotX=Math.max(-35,Math.min(35,skin3DDrag.rotX+(t.clientY-skin3DDrag.startY)*0.3));e.preventDefault();},{passive:false});
  wrap.addEventListener('touchend',()=>{skin3DDrag.active=false;});
  const ro=new ResizeObserver(()=>{const w=wrap.clientWidth,h=wrap.clientHeight;if(w>0&&h>0){threeRenderer.setSize(w,h);threeCamera.aspect=w/h;threeCamera.updateProjectionMatrix();}});
  ro.observe(wrap);
  (function loop(){requestAnimationFrame(loop);if(skinMeshGroup){skinMeshGroup.rotation.y=currentRotY*Math.PI/180;skinMeshGroup.rotation.x=currentRotX*Math.PI/180;}threeRenderer.render(threeScene,threeCamera);})();
}

function makeUV(sx,sy,sw,sh){const u0=sx/64,u1=(sx+sw)/64,v0=1-sy/64,v1=1-(sy+sh)/64;return{u0,u1,v0,v1};}

function applyFaceUV(geo,faces){
  const uv=geo.attributes.uv;
  for(let fi=0;fi<6;fi++){const f=faces[fi],i=fi*4;uv.setXY(i,f.u0,f.v0);uv.setXY(i+1,f.u1,f.v0);uv.setXY(i+2,f.u0,f.v1);uv.setXY(i+3,f.u1,f.v1);}
  uv.needsUpdate=true;
}

function skinBox(gw,gh,gd,px,py,pz,tex,fFront,fBack,fTop,fBottom,fLeft,fRight){
  const geo=new THREE.BoxGeometry(gw,gh,gd);
  if(tex){
    const mat=new THREE.MeshLambertMaterial({map:tex,transparent:true,alphaTest:0.05});
    applyFaceUV(geo,[fRight,fLeft,fTop,fBottom,fFront,fBack]);
    const m=new THREE.Mesh(geo,mat); m.position.set(px,py,pz); return m;
  }
  const m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:0x888888})); m.position.set(px,py,pz); return m;
}

function uv(sx,sy,sw,sh){return makeUV(sx,sy,sw,sh);}

function buildSkinMesh(tex){
  if(!skinMeshGroup)return;
  while(skinMeshGroup.children.length)skinMeshGroup.remove(skinMeshGroup.children[0]);
  const U=0.25;
  // HEAD — centered at Y=22px (5.5 units), flush against body top
  const hg=new THREE.Group(); hg.position.set(0,U*22,0);
  hg.add(skinBox(U*8,U*8,U*8,0,0,0,tex,uv(8,8,8,8),uv(24,8,8,8),uv(8,0,8,8),uv(16,0,8,8),uv(16,8,8,8),uv(0,8,8,8)));
  if(tex){{const ov=skinBox(U*9,U*9,U*9,0,0,0,tex,uv(40,8,8,8),uv(56,8,8,8),uv(40,0,8,8),uv(48,0,8,8),uv(48,8,8,8),uv(32,8,8,8));ov.renderOrder=1;hg.add(ov);}}
  skinMeshGroup.add(hg);
  // BODY — centered at Y=12px (3 units)
  skinMeshGroup.add(skinBox(U*8,U*12,U*4,0,U*12,0,tex,uv(20,20,8,12),uv(32,20,8,12),uv(20,16,8,4),uv(28,16,8,4),uv(28,20,4,12),uv(16,20,4,12)));
  // JACKET (body outer layer)
  if(tex){{const j=skinBox(U*8.5,U*12.5,U*4.5,0,U*12,0,tex,uv(20,36,8,12),uv(32,36,8,12),uv(20,32,8,4),uv(28,32,8,4),uv(28,36,4,12),uv(16,36,4,12));j.renderOrder=1;skinMeshGroup.add(j);}}
  // RIGHT ARM — centered at Y=12px (3 units), X=6px (1.5 units)
  skinMeshGroup.add(skinBox(U*4,U*12,U*4,U*6,U*12,0,tex,uv(44,20,4,12),uv(52,20,4,12),uv(44,16,4,4),uv(48,16,4,4),uv(48,20,4,12),uv(40,20,4,12)));
  // RIGHT SLEEVE (right arm outer layer)
  if(tex){{const s=skinBox(U*4.5,U*12.5,U*4.5,U*6,U*12,0,tex,uv(44,36,4,12),uv(52,36,4,12),uv(44,32,4,4),uv(48,32,4,4),uv(48,36,4,12),uv(40,36,4,12));s.renderOrder=1;skinMeshGroup.add(s);}}
  // LEFT ARM — centered at Y=12px (3 units), X=-6px (-1.5 units)
  skinMeshGroup.add(skinBox(U*4,U*12,U*4,-U*6,U*12,0,tex,uv(36,52,4,12),uv(44,52,4,12),uv(36,48,4,4),uv(40,48,4,4),uv(40,52,4,12),uv(32,52,4,12)));
  // LEFT SLEEVE (left arm outer layer)
  if(tex){{const s=skinBox(U*4.5,U*12.5,U*4.5,-U*6,U*12,0,tex,uv(52,52,4,12),uv(60,52,4,12),uv(52,48,4,4),uv(56,48,4,4),uv(56,52,4,12),uv(48,52,4,12));s.renderOrder=1;skinMeshGroup.add(s);}}
  // RIGHT LEG — centered at Y=0px (0 units), X=2px (0.5 units)
  skinMeshGroup.add(skinBox(U*4,U*12,U*4,U*2,0,0,tex,uv(4,20,4,12),uv(12,20,4,12),uv(4,16,4,4),uv(8,16,4,4),uv(8,20,4,12),uv(0,20,4,12)));
  // RIGHT PANTS (right leg outer layer)
  if(tex){{const p=skinBox(U*4.5,U*12.5,U*4.5,U*2,0,0,tex,uv(4,36,4,12),uv(12,36,4,12),uv(4,32,4,4),uv(8,32,4,4),uv(8,36,4,12),uv(0,36,4,12));p.renderOrder=1;skinMeshGroup.add(p);}}
  // LEFT LEG — centered at Y=0px (0 units), X=-2px (-0.5 units)
  skinMeshGroup.add(skinBox(U*4,U*12,U*4,-U*2,0,0,tex,uv(20,52,4,12),uv(28,52,4,12),uv(20,48,4,4),uv(24,48,4,4),uv(24,52,4,12),uv(16,52,4,12)));
  // LEFT PANTS (left leg outer layer)
  if(tex){{const p=skinBox(U*4.5,U*12.5,U*4.5,-U*2,0,0,tex,uv(4,52,4,12),uv(12,52,4,12),uv(4,48,4,4),uv(8,48,4,4),uv(8,52,4,12),uv(0,52,4,12));p.renderOrder=1;skinMeshGroup.add(p);}}
  // Center the whole model vertically (body center at origin)
  skinMeshGroup.position.set(0,-U*12,0);
}

function loadSkinTexture(url){
  if(!window.THREE)return;
  if(url.startsWith('data:')){
    const img=new Image();
    img.onload=()=>{const c=document.createElement('canvas');c.width=img.width;c.height=img.height;c.getContext('2d').drawImage(img,0,0);const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;skinTexture=t;buildSkinMesh(t);};
    img.src=url;
  } else {
    new THREE.TextureLoader().load(url,t=>{t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;skinTexture=t;buildSkinMesh(t);},undefined,()=>{});
  }
}

function drawDefaultAvatar(){}
function drawSkin3D(){}


function saveMods(){ ipcRenderer.send('save-mods',installedMods); }

// Copy logs
document.getElementById('copy-logs-btn').addEventListener('click',()=>{
  const lines=[...document.getElementById('logs-container').querySelectorAll('.log-line')].map(l=>l.textContent).join('\n');
  navigator.clipboard.writeText(lines).then(()=>{
    const btn=document.getElementById('copy-logs-btn'); btn.textContent='✓ Copied!';
    setTimeout(()=>btn.textContent='📋 Copy',2000);
  });
});

// Client RP search buttons
document.getElementById('btn-modrinth-global').addEventListener('click',()=>{ profileModMode=false; profilePackMode=null; openModModal('modrinth'); });
document.getElementById('btn-curseforge-global').addEventListener('click',()=>{ profileModMode=false; profilePackMode=null; openModModal('curseforge'); });
document.getElementById('btn-rp-modrinth-global').addEventListener('click',()=>{ profileModMode=false; profilePackMode='clientRP'; openModModal('modrinth'); });
document.getElementById('btn-rp-curseforge-global').addEventListener('click',()=>{ profileModMode=false; profilePackMode='clientRP'; openModModal('curseforge'); });
// Client JAR upload handlers removed

// ── Mod Modal ────────────────────────────────────────
function openModModal(source){
  currentSource=source;
  document.getElementById('tab-modrinth').classList.toggle('active',source==='modrinth');
  document.getElementById('tab-curseforge').classList.toggle('active',source==='curseforge');
  const title = profilePackMode==='modpack' ? '📦 Search Modpacks'
    : profileModMode ? (profilePackMode||'mods')+' search'
    : 'Search '+(source==='modrinth'?'Modrinth':'CurseForge');
  document.getElementById('modal-title').textContent=title;
  document.getElementById('mod-search-input').value='';
  document.getElementById('mod-modal').style.display='flex';
  modSearchOffset=0; modSearchQuery='';
  loadPopularMods();
  setTimeout(()=>document.getElementById('mod-search-input').focus(),40);
}
function closeModModal(){
  document.getElementById('mod-modal').style.display='none';
  modpackMode=false;
}

document.getElementById('modal-close').addEventListener('click',closeModModal);
document.getElementById('mod-modal').addEventListener('click',e=>{ if(e.target===document.getElementById('mod-modal'))closeModModal(); });
document.getElementById('tab-modrinth').addEventListener('click',()=>openModModal('modrinth'));
document.getElementById('tab-curseforge').addEventListener('click',()=>openModModal('curseforge'));

document.getElementById('mod-search-input').addEventListener('input',e=>{
  clearTimeout(searchDebounce);
  const q=e.target.value.trim();
  searchDebounce=setTimeout(()=>{ q?searchMods(q):loadPopularMods(); },350);
});
document.getElementById('mod-search-btn').addEventListener('click',()=>{
  const q=document.getElementById('mod-search-input').value.trim(); q?searchMods(q):loadPopularMods();
});
document.getElementById('mod-search-input').addEventListener('keydown',e=>{
  if(e.key==='Enter'){ clearTimeout(searchDebounce); const q=e.target.value.trim(); q?searchMods(q):loadPopularMods(); }
});
// Infinite scroll
document.querySelector('.modal-body').addEventListener('scroll',function(){
  if(this.scrollTop+this.clientHeight>=this.scrollHeight-100)loadMoreMods();
});

async function loadPopularMods(){
  modSearchQuery=''; modSearchOffset=0; isLoadingMods=false;
  document.getElementById('mod-results').innerHTML='<div class="modal-loading">Loading popular mods...</div>';
  const results=await fetchModrinthPage('',0);
  document.getElementById('mod-results').innerHTML='';
  await appendModResults(results); modSearchOffset=results.length;
}
async function searchMods(q){
  modSearchQuery=q; modSearchOffset=0; isLoadingMods=false;
  document.getElementById('mod-results').innerHTML='<div class="modal-loading">Searching...</div>';
  const results=await fetchModrinthPage(q,0);
  if(!results.length){document.getElementById('mod-results').innerHTML='<div class="modal-loading">No results found.</div>';return;}
  document.getElementById('mod-results').innerHTML=''; await appendModResults(results); modSearchOffset=results.length;
}
async function loadMoreMods(){
  if(isLoadingMods)return; isLoadingMods=true;
  const s=document.createElement('div'); s.className='modal-loading'; s.textContent='Loading more...';
  document.getElementById('mod-results').appendChild(s);
  const r=await fetchModrinthPage(modSearchQuery,modSearchOffset);
  s.remove(); if(r.length){await appendModResults(r); modSearchOffset+=r.length;}
  isLoadingMods=false;
}
async function fetchModrinthPage(q,offset){
  try{
    const facetType = profilePackMode==='modpack' ? 'modpack'
      : profilePackMode==='datapacks'?'datapack'
      : profilePackMode==='resourcePacks'||profilePackMode==='clientRP'?'resourcepack'
      : profilePackMode==='shaderPacks'?'shader':'mod';
    const facet=`[["project_type:${facetType}"]]`;
    const url=q
      ?`https://api.modrinth.com/v2/search?query=${encodeURIComponent(q)}&facets=${encodeURIComponent(facet)}&limit=${PAGE_SIZE}&offset=${offset}`
      :`https://api.modrinth.com/v2/search?facets=${encodeURIComponent(facet)}&limit=${PAGE_SIZE}&offset=${offset}&index=downloads`;
    const d=await(await fetch(url)).json();
    return(d.hits||[]).map(h=>({id:h.project_id,name:h.title,description:h.description,iconUrl:h.icon_url||'',latestVersion:h.latest_version||'latest',downloads:h.downloads}));
  }catch{return[];}
}
async function appendModResults(results){
  const el=document.getElementById('mod-results');
  for(const mod of results){
    let mcVersions=['latest'];
    try{
      const vd=await(await fetch(`https://api.modrinth.com/v2/project/${mod.id}/version`)).json();
      const seen=new Set(); mcVersions=vd.flatMap(v=>v.game_versions).filter(v=>{if(seen.has(v))return false;seen.add(v);return true;}).slice(0,25);
      if(!mcVersions.length)mcVersions=['latest'];
    }catch{}
    const item=document.createElement('div'); item.className='mod-result-item';
    const dl=mod.downloads?` · ${(mod.downloads/1000).toFixed(0)}k ↓`:'';
    const profileMC=profileModMode&&editingProfileId?profiles.find(p=>p.id===editingProfileId)?.mcVersion:null;
    const defaultV=profileMC||mcVersions[0]||'latest';
    item.innerHTML=`
      ${mod.iconUrl?`<img class="mod-result-icon" src="${mod.iconUrl}">`:'<div class="mod-result-icon"></div>'}
      <div class="mod-result-info">
        <div class="mod-result-name">${mod.name} ${mod.latestVersion!==mod.name?`<span style="color:#888;font-weight:normal;font-size:.78em">${mod.latestVersion}</span>`:''}<span style="color:#555;font-weight:normal;font-size:.8em">${dl}</span></div>
        <div class="mod-result-desc">${mod.description||''}</div>
      </div>
      <div class="mod-result-actions">
        <button class="btn mod-install-btn">${profilePackMode==='modpack'?'Import':'Install'}</button>
      </div>`;
    // Disable button if already installed
    const alreadyInstalled=profileModMode&&profilePackMode
      ? editingPackData.mods?.some(m=>m.modrinthId===mod.id)
      : installedMods.some(m=>m.modrinthId===mod.id);
    if(alreadyInstalled){const ib=item.querySelector('.mod-install-btn');ib.textContent='Installed ✓';ib.disabled=true;ib.style.opacity='.55';}
    item.querySelector('.mod-install-btn').addEventListener('click',async e=>{
      const btn=e.currentTarget; btn.disabled=true;
      if(profilePackMode==='modpack'){
        closeModModal();
        modpackMode=false; profilePackMode=null;
        importModpackFromModrinth(mod.id, mod.name);
        return;
      }
      if(profileModMode&&profilePackMode){
        const key=profilePackMode;
        if(key==='mods'&&!editingPackData.mods.some(m=>m.modrinthId===mod.id)){
          editingPackData.mods.push({name:mod.name,version:mod.latestVersion,mcVersion:profileMC||'latest',source:currentSource==='modrinth'?'Modrinth':'CurseForge',iconUrl:mod.iconUrl,modrinthId:mod.id,downloadAllVersions:false,disabled:false});
          renderProfilePackList('profile-mods-list','mods',true);
        }else if(key!=='mods'&&!editingPackData[key].includes(mod.name)){
          editingPackData[key].push(mod.name);renderPackTags('profile-'+key.toLowerCase(),key);
        }
        btn.textContent='Added ✓';btn.style.opacity='.55';return;
      }
      if(profilePackMode==='clientRP'){
        if(!clientResourcePacks.some(r=>(typeof r==='object'?r.modrinthId===mod.id:r===mod.name))){
          clientResourcePacks.push({name:mod.name,modrinthId:mod.id,latestVersion:mod.latestVersion});
          settings.clientResourcePacks=clientResourcePacks;saveSettings();renderClientRPList();
        }
        btn.textContent='Added ✓';btn.style.opacity='.55';return;
      }
      // Client mod: install for all launched versions
      btn.textContent='Installing...';
      const vers=launchedVersions.length?launchedVersions:[defaultV];
      let n=0; const src=currentSource==='modrinth'?'Modrinth':'CurseForge';
      for(const v of vers){
        if(!mcVersions.includes(v))continue;
        if(!installedMods.some(m=>m.modrinthId===mod.id&&m.mcVersion===v)){
          installedMods.push({name:mod.name,version:mod.latestVersion,mcVersion:v,source:src,iconUrl:mod.iconUrl,modrinthId:mod.id,downloadAllVersions:true,disabled:false,autoInstalled:n>0});n++;
        }
      }
      if(!n){if(!installedMods.some(m=>m.modrinthId===mod.id&&m.mcVersion===defaultV)){installedMods.push({name:mod.name,version:mod.latestVersion,mcVersion:defaultV,source:src,iconUrl:mod.iconUrl,modrinthId:mod.id,downloadAllVersions:true,disabled:false});n++;}}
      saveMods();renderModList();fetchMissingModIcons();
      btn.textContent=`Added ✓ (${n})`;btn.style.opacity='.55';
    });
    el.appendChild(item);
  }
}
// ════════════════════════════════════════
// CLIENT RESOURCE PACKS + AUTO-USE TOGGLE
// ════════════════════════════════════════
// ════════════════════════════════════════
// MODPACK IMPORT
// ════════════════════════════════════════
let modpackMode = false;

document.getElementById('import-modpack-modrinth-btn').addEventListener('click',()=>{
  modpackMode=true; profileModMode=false; profilePackMode='modpack';
  openModModal('modrinth');
});
document.getElementById('import-modpack-curseforge-btn').addEventListener('click',()=>{
  modpackMode=true; profileModMode=false; profilePackMode='modpack';
  openModModal('curseforge');
});

async function importModpackFromModrinth(projectId, projectName) {
  try {
    document.getElementById('status').textContent=`Importing modpack: ${projectName}...`;

    // Get latest version
    const versions = await (await fetch(`https://api.modrinth.com/v2/project/${projectId}/version`)).json();
    if(!versions||!versions.length) throw new Error('No versions found');
    const latest = versions[0];

    // Get project details for MC version and loader
    const project = await (await fetch(`https://api.modrinth.com/v2/project/${projectId}`)).json();
    const mcVersion = latest.game_versions?.[0] || '';
    const loader = latest.loaders?.find(l=>['fabric','forge','quilt'].includes(l)) || 'fabric';

    // Get mods from the modpack (mrpack format)
    const mrpackFile = latest.files?.find(f=>f.filename?.endsWith('.mrpack')) || latest.files?.[0];
    let mods = [];
    if(mrpackFile) {
      try {
        // Download mrpack index to get mod list
        const resp = await fetch(mrpackFile.url);
        const buf  = await resp.arrayBuffer();
        // mrpack is a zip — we can't easily unzip in browser JS without a library
        // Instead, get dependency list from Modrinth API
        const deps = await (await fetch(`https://api.modrinth.com/v2/project/${projectId}/dependencies`)).json();
        mods = (deps.projects||[]).map(p=>({
          name: p.title, modrinthId: p.id, version:'latest',
          mcVersion, source:'Modrinth', iconUrl: p.icon_url||'',
          downloadAllVersions:false, disabled:false, loader
        }));
      } catch {}
    }

    // Create profile from modpack
    const np = {
      id: 'p_'+Date.now(),
      name: projectName,
      mcVersion,
      modLoader: loader,
      mods,
      datapacks:[], resourcePacks:[], shaderPacks:[],
      useClientMods: false, // modpacks usually manage their own mods
      useClientRPs: false,
      isModpack: true,
      modrinthId: projectId
    };
    profiles.push(np);
    ipcRenderer.send('save-profiles', profiles);
    renderProfileList();
    updateLaunchProfileSelect();
    document.getElementById('status').textContent=`✓ Imported: ${projectName} (${mods.length} mods, MC ${mcVersion})`;
    showPage('profiles-page');
  } catch(e) {
    document.getElementById('status').textContent=`Modpack import failed: ${e.message}`;
  }
}
async function fetchMissingModIcons(){
  const missing = installedMods.filter(m => m.modrinthId && !m.iconUrl);
  if(!missing.length) return;
  const ids = [...new Set(missing.map(m=>m.modrinthId))];
  // Batch in chunks of 100 to stay within API limits
  for(let i=0; i<ids.length; i+=100){
    const chunk = ids.slice(i, i+100);
    try {
      const url = `https://api.modrinth.com/v2/projects?ids=${encodeURIComponent(JSON.stringify(chunk))}`;
      const projects = await (await fetch(url)).json();
      if(!Array.isArray(projects)) continue;
      let changed = false;
      projects.forEach(p => {
        installedMods.forEach(m => {
          if(m.modrinthId === p.id && p.icon_url && m.iconUrl !== p.icon_url){
            m.iconUrl = p.icon_url; changed = true;
          }
        });
      });
      if(changed){ saveMods(); renderModList(); }
    } catch {}
  }
}

const OPEN_LOADER_MOD = { name:'Open Loader', modrinthId:'bVRpDYoZ', loader:'fabric', source:'Modrinth' };

let clientResourcePacks = [];
let autoUseResourcePacks = false;

function loadClientRPSettings(){
  clientResourcePacks = settings.clientResourcePacks || [];
  autoUseResourcePacks = settings.autoUseResourcePacks || false;
  renderClientRPToggle();
  renderClientRPList();
  applyOpenLoaderMod();
}

function renderClientRPToggle(){
  const toggle = document.getElementById('auto-rp-toggle');
  const knob   = document.getElementById('auto-rp-knob');
  if(!toggle||!knob) return;
  if(autoUseResourcePacks){
    toggle.style.background = 'var(--acc)';
    knob.style.left = 'calc(100% - 1.1em)';
    knob.style.background = '#fff';
  } else {
    toggle.style.background = '#333';
    knob.style.left = '.15em';
    knob.style.background = '#888';
  }
}

function renderClientRPList(){
  const el = document.getElementById('client-rp-list');
  if(!el) return;
  el.innerHTML = '';
  clientResourcePacks.forEach((rp, i) => {
    const tag = document.createElement('span');
    tag.className = 'pack-tag';
    const label = typeof rp === 'object' ? rp.name : rp;
    tag.innerHTML = `${label} <span class="rt" style="cursor:pointer;color:#555;margin-left:.3em" data-i="${i}">✕</span>`;
    tag.querySelector('.rt').addEventListener('click', () => {
      clientResourcePacks.splice(i, 1);
      settings.clientResourcePacks = clientResourcePacks;
      saveSettings();
      renderClientRPList();
    });
    el.appendChild(tag);
  });
}

function applyOpenLoaderMod(){
  // Add Open Loader to client mods (enabled) if auto-use is on, or disable/remove if off
  const exists = installedMods.findIndex(m => m.modrinthId === OPEN_LOADER_MOD.modrinthId);
  if(autoUseResourcePacks){
    if(exists === -1){
      installedMods.push({ name:OPEN_LOADER_MOD.name, version:'latest', mcVersion:'all',
        source:'Modrinth', iconUrl:'', modrinthId:OPEN_LOADER_MOD.modrinthId,
        downloadAllVersions:true, disabled:false, loader:OPEN_LOADER_MOD.loader, autoInstalled:true });
      saveMods(); renderModList();
    } else {
      installedMods[exists].disabled = false;
      saveMods(); renderModList();
    }
  } else {
    if(exists !== -1 && installedMods[exists].autoInstalled){
      installedMods[exists].disabled = true;
      saveMods(); renderModList();
    }
  }
}

// Wire up toggle click
document.getElementById('auto-rp-toggle').addEventListener('click', () => {
  autoUseResourcePacks = !autoUseResourcePacks;
  settings.autoUseResourcePacks = autoUseResourcePacks;
  saveSettings();
  renderClientRPToggle();
  applyOpenLoaderMod();
});

// Wire up add button
document.getElementById('client-rp-add-btn').addEventListener('click', () => {
  const input = document.getElementById('client-rp-input');
  const val = input.value.trim();
  if(!val) return;
  if(!clientResourcePacks.includes(val)) {
    clientResourcePacks.push(val);
    settings.clientResourcePacks = clientResourcePacks;
    saveSettings();
    renderClientRPList();
  }
  input.value = '';
});
document.getElementById('client-rp-input').addEventListener('keydown', e => {
  if(e.key === 'Enter') document.getElementById('client-rp-add-btn').click();
});

const DEFAULT_CLIENT_MODS = [
  // Fabric defaults
  { name:'ModMenu',                  modrinthId:'mOgUt4GM', loader:'fabric' },
  { name:'Sodium',                   modrinthId:'AANobbMI', loader:'fabric' },
  { name:'Entity Culling',           modrinthId:'NNAgCjsB', loader:'fabric' },
  { name:'Lithium',                  modrinthId:'gvQqBUqZ', loader:'fabric' },
  { name:'Sodium Extra',             modrinthId:'PtjYWJkn', loader:'fabric' },
  { name:"Reese's Sodium Options",   modrinthId:'Bh37bMuy', loader:'fabric' },
  { name:'3D Skin Layers',           modrinthId:'zV5r3pPn', loader:'fabric' },
  { name:'Zoomify',                  modrinthId:'w7ThoJFB', loader:'fabric' },
  { name:'Simple Voice Chat',        modrinthId:'9eGKb6K1', loader:'fabric' },
  { name:'Mouse Tweaks',             modrinthId:'u58R1TMW', loader:'fabric' },
  { name:'Chat Heads',               modrinthId:'Wb5oqrBJ', loader:'fabric' },
  { name:'Shulker Box Tooltip',      modrinthId:'2M01OLQq', loader:'fabric' },
  { name:'Capes',                    modrinthId:'89Wsn8GD', loader:'fabric' },
  { name:'More Chat History',        modrinthId:'8qkXwOnk', loader:'fabric' },
  { name:'Cubes Without Borders',    modrinthId:'ETlFGEpQ', loader:'fabric' },
  { name:'Remove Reloading Screen',  modrinthId:'t89TPBM0', loader:'fabric' },
  { name:'Bobby',                    modrinthId:'M08ruV16', loader:'fabric' },
  { name:'Fast IP Ping',             modrinthId:'g9Ic0TTW', loader:'fabric' },
  { name:'Better Statistics Screen', modrinthId:'n6PXGAoM', loader:'fabric' },
  { name:'Chunky',                   modrinthId:'fALzjamp', loader:'fabric' },
  { name:'Better Ping Display',      modrinthId:'MS1ZFoKX', loader:'fabric' },
  // Optimisation mods (Fabric)
  { name:'FerriteCore',              modrinthId:'uXXizFIs', loader:'fabric' },
  { name:'ModernFix',                modrinthId:'nmDcB62a', loader:'fabric' },
  { name:'ImmediatelyFast',          modrinthId:'5ZwdcRci', loader:'fabric' },
  { name:'MemoryLeakFix',            modrinthId:'NRjRiSSD', loader:'fabric' },
  { name:'Clumps',                   modrinthId:'Wnxd13zP', loader:'fabric' },
  { name:'Krypton',                  modrinthId:'fQEb0iXm', loader:'fabric' },
  { name:'LazyDFU',                  modrinthId:'hvFnDODi', loader:'fabric' },
  { name:'C2ME',                     modrinthId:'VSNURh3q', loader:'fabric' },
  // Forge defaults
  { name:'JEI',                      modrinthId:'u6dRKJwZ', loader:'forge' },
  { name:'Jade',                     modrinthId:'nvQzSEkH', loader:'forge' },
  { name:'Embeddium',                modrinthId:'sk9rgfiA', loader:'forge' },
  { name:'Oculus',                   modrinthId:'GchcoXML', loader:'forge' },
  { name:'Curios API',               modrinthId:'vvuO3ImH', loader:'forge' },
  // Optimisation mods (Forge)
  { name:'FerriteCore',              modrinthId:'uXXizFIs', loader:'forge' },
  { name:'ModernFix',                modrinthId:'nmDcB62a', loader:'forge' },
  { name:'ImmediatelyFast',          modrinthId:'5ZwdcRci', loader:'forge' },
  { name:'MemoryLeakFix',            modrinthId:'NRjRiSSD', loader:'forge' },
  { name:'Clumps',                   modrinthId:'Wnxd13zP', loader:'forge' },
];

function ensureDefaultMods() {
  let changed = false;
  for (const def of DEFAULT_CLIENT_MODS) {
    if (!installedMods.some(m => m.modrinthId === def.modrinthId && m.loader === def.loader)) {
      installedMods.push({
        name: def.name, version: 'latest', mcVersion: 'all',
        source: 'Modrinth', iconUrl: '', modrinthId: def.modrinthId,
        downloadAllVersions: true, disabled: false, // pre-installed and ENABLED
        loader: def.loader, isDefault: true
      });
      changed = true;
    }
  }
  if (changed) saveMods();
}

// ════════════════════════════════════════
// MOD FILTER
// ════════════════════════════════════════
let modFilter = 'all';
document.querySelectorAll('.mod-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    modFilter = btn.dataset.filter;
    document.querySelectorAll('.mod-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderModList();
  });
});

function renderModList() {
  const list  = document.getElementById('mod-list');
  const empty = document.getElementById('mod-list-empty');
  list.querySelectorAll('.mod-item').forEach(e=>e.remove());

  let filtered = installedMods;
  if (modFilter === 'fabric')   filtered = installedMods.filter(m => !m.loader || m.loader === 'fabric' || m.loader === 'any');
  if (modFilter === 'forge')    filtered = installedMods.filter(m => m.loader === 'forge' || m.loader === 'any');
  if (modFilter === 'disabled') filtered = installedMods.filter(m => m.disabled);

  if (!filtered.length) { empty.style.display=''; return; }
  empty.style.display = 'none';

  // Deduplicate by modrinthId for display (show "all versions" mods once)
  const seen = new Set();
  const displayMods = [];
  filtered.forEach((mod, realIdx) => {
    if (mod.downloadAllVersions && mod.modrinthId) {
      if (seen.has(mod.modrinthId)) return;
      seen.add(mod.modrinthId);
    }
    displayMods.push({ mod, realIdx });
  });

  displayMods.forEach(({ mod, realIdx }) => {
    const item = document.createElement('div');
    item.className = 'mod-item';
    const op = mod.disabled ? 'opacity:0.45' : '';
    const versionDisplay = mod.mcVersion === 'all' ? 'All versions' : `MC ${mod.mcVersion}`;
    const modVer = mod.version && mod.version !== 'latest' ? ` · ${mod.version}` : '';
    const typeLabel = '';
    const loaderBadge = mod.loader ? `<span style="font-size:.7em;padding:.1em .35em;border-radius:999px;border:1px solid ${mod.loader==='forge'?'#f1642255':'#1bd96a44'};color:${mod.loader==='forge'?'#f16422':'#1bd96a'};margin-left:.3em">${mod.loader==='any'?'Any':mod.loader||'Fabric'}</span>` : '';
    item.innerHTML = `
      ${mod.iconUrl ? `<img class="mod-icon" src="${mod.iconUrl}" style="${op}">` : `<div class="mod-icon" style="${op}"></div>`}
      <div class="mod-info" style="${op}">
        <div class="mod-name">${mod.name}${typeLabel}${loaderBadge}${mod.disabled?'<span style="color:#555;font-weight:normal;font-size:.76em"> (disabled)</span>':''}${mod.autoInstalled?'<span style="color:var(--acc);font-weight:normal;font-size:.76em"> (auto)</span>':''}</div>
        <div class="mod-meta">${versionDisplay}${modVer} · ${mod.source || 'Client Mod'}</div>
      </div>
      <div class="mod-btns">
        <button class="btn mod-btn mod-toggle" data-idx="${realIdx}">${mod.disabled?'Enable':'Disable'}</button>
        <button class="btn mod-btn mod-remove" data-idx="${realIdx}">Remove</button>
      </div>`;
    list.appendChild(item);
  });
  list.querySelectorAll('.mod-toggle').forEach(btn => btn.addEventListener('click', () => {
    installedMods[parseInt(btn.dataset.idx)].disabled ^= true; saveMods(); renderModList();
  }));
  list.querySelectorAll('.mod-remove').forEach(btn => btn.addEventListener('click', () => {
    installedMods.splice(parseInt(btn.dataset.idx), 1); saveMods(); renderModList();
  }));
}

// ════════════════════════════════════════
// SKIN UPLOAD (real API)
// ════════════════════════════════════════
function setSkinUploadStatus(msg, color='#1bd96a') {
  const el = document.getElementById('skin-upload-status');
  if (el) { el.textContent = msg; el.style.color = color; }
}

async function applySkinFromDataUrl(dataUrl) {
  const acc = getSelectedAccount();
  if (!acc) { setSkinUploadStatus('No account selected', '#f44'); return; }
  acc.skinUrl = dataUrl;
  ipcRenderer.send('save-accounts', accounts);
  loadSkinTexture(dataUrl);
  updateSkinDisplay();
  renderAccountList();

  // Upload to Mojang API if logged in
  if (acc.accessToken) {
    setSkinUploadStatus('Uploading skin...');
    const result = await ipcRenderer.invoke('upload-skin', { accessToken: acc.accessToken, skinDataUrl: dataUrl, variant: 'classic' });
    if (result.success) setSkinUploadStatus('✓ Skin updated!');
    else setSkinUploadStatus('Local updated, upload failed: ' + result.error, '#f5a623');
  } else {
    setSkinUploadStatus('✓ Skin set locally (offline account)');
  }
}

// File picker
document.getElementById('skin-file-input').addEventListener('change', e => {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => applySkinFromDataUrl(ev.target.result);
  reader.readAsDataURL(file);
});

// URL apply
document.getElementById('skin-url-apply-btn').addEventListener('click', async () => {
  const url = document.getElementById('skin-url-input').value.trim();
  if (!url) return;
  setSkinUploadStatus('Loading skin...');
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const reader = new FileReader();
    reader.onload = ev => applySkinFromDataUrl(ev.target.result);
    reader.readAsDataURL(blob);
  } catch(e) { setSkinUploadStatus('Failed to load URL: ' + e.message, '#f44'); }
});

// ════════════════════════════════════════
// UNINSTALL
// ════════════════════════════════════════
document.getElementById('uninstall-btn').addEventListener('click', () => {
  if (!confirm('Uninstall Crux Client?\n\nThis will remove the launcher and all its data from your system.')) return;
  ipcRenderer.send('close-launcher');
  ipcRenderer.invoke('uninstall-app');
});

// ════════════════════════════════════════
// RESET ALL DATA
// ════════════════════════════════════════
document.getElementById('reset-all-btn').addEventListener('click', () => {
  if (!confirm('Reset ALL launcher data?\n\nThis will delete all accounts, profiles, settings, and mods.\nThe launcher will restart as if first opened.')) return;
  settings = {};
  accounts = [];
  profiles = [{ id:'default', name:'Default', mcVersion:'', modLoader:'fabric', mods:[], datapacks:[], resourcePacks:[], shaderPacks:[] }];
  installedMods = [];
  launchedVersions = [];
  clientResourcePacks = [];
  autoUseResourcePacks = false;
  currentAccentIdx = 5;
  ipcRenderer.send('save-settings', settings);
  ipcRenderer.send('save-accounts', accounts);
  ipcRenderer.send('save-profiles', profiles);
  ipcRenderer.send('save-mods', installedMods);
  ipcRenderer.send('save-launched-versions', launchedVersions);
  location.reload();
});

// ════════════════════════════════════════
// SETTINGS TOGGLES
// ════════════════════════════════════════
document.getElementById('open-logs-toggle').addEventListener('change', e => {
  settings.openLogsAfterLaunch = e.target.checked;
  saveSettings();
});
document.getElementById('close-launcher-toggle').addEventListener('change', e => {
  settings.closeLauncherWhilePlaying = e.target.checked;
  saveSettings();
});
document.getElementById('use-original-launcher-toggle').addEventListener('change', e => {
  settings.useOriginalLauncher = e.target.checked;
  saveSettings();
});


// ════════════════════════════════════════
// BINDsettings extra bindings
// ════════════════════════════════════════
// (RAM display is initialized in bindSettings)
</script>
</body>
</html>`;


export const JS_SNIPPET = `const { app, BrowserWindow, ipcMain, shell } = require('electron');
const https = require('https');
const http  = require('http');
const { exec, execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');
const { URL } = require('url');

let mainWindow;
let authWindow = null;

// ── Paths ──────────────────────────────────────────────────────────────────────
const base = path.join(process.env.APPDATA || process.env.LOCALAPPDATA || '', 'MC Launcher');
['Cache','javaInstallations','client-mods','minecraft'].forEach(d => fs.mkdirSync(path.join(base, d), { recursive: true }));
const P = {
  settings: path.join(base,'settings.json'),
  accounts: path.join(base,'accounts.json'),
  profiles: path.join(base,'profiles.json'),
  mods:     path.join(base,'mods.json'),
  launched: path.join(base,'launched-versions.json'),
  clientMods: path.join(base,'client-mods'),
  java: path.join(base,'javaInstallations'),
  mc:   path.join(base,'minecraft'),
};
app.setPath('userData', base);
app.setPath('cache', path.join(base,'Cache'));

// ── Window ─────────────────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width:1200, height:800, minWidth:900, minHeight:600,
    autoHideMenuBar:true,
    webPreferences:{ nodeIntegration:true, contextIsolation:false }
  });
  mainWindow.setMenu(null);
  mainWindow.loadFile('index.html');
}
app.whenReady().then(async () => {
  createWindow();
  // Auto-scan Java in background after window loads
  mainWindow.webContents.on('did-finish-load', async () => {
    try {
      const javas = await findInstalledJavas();
      mainWindow.webContents.send('java-scan-result', javas);
    } catch {}
  });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// ── Persist ────────────────────────────────────────────────────────────────────
const load = (file, def) => { try { return JSON.parse(fs.readFileSync(file,'utf8')); } catch { return def; } };
const save = (file, data) => { try { fs.writeFileSync(file, JSON.stringify(data,null,2)); } catch {} };

ipcMain.handle('load-settings',          () => load(P.settings, {}));
ipcMain.handle('load-accounts',          () => load(P.accounts, []));
ipcMain.handle('load-profiles',          () => load(P.profiles, [{ id:'default', name:'Default', mcVersion:'', modLoader:'fabric', mods:[], datapacks:[], resourcePacks:[], shaderPacks:[] }]));
ipcMain.handle('load-mods',              () => load(P.mods, []));
ipcMain.handle('load-launched-versions', () => load(P.launched, []));
ipcMain.on('save-settings',          (e,d) => save(P.settings, d));
ipcMain.on('save-accounts',          (e,d) => save(P.accounts, d));
ipcMain.on('save-profiles',          (e,d) => save(P.profiles, d));
ipcMain.on('save-launched-versions', (e,d) => save(P.launched, d));
ipcMain.on('save-mods', (e, data) => {
  save(P.mods, data);
  const byVer = {};
  for (const m of data) { if (!byVer[m.mcVersion]) byVer[m.mcVersion]=[]; byVer[m.mcVersion].push(m); }
  for (const [ver,mods] of Object.entries(byVer)) {
    const dir = path.join(P.clientMods, ver); fs.mkdirSync(dir, { recursive:true });
    for (const m of mods) { const safe = m.name.replace(/[^a-zA-Z0-9_\-. ]/g,'_'); save(path.join(dir,\`$\{safe}.json\`), m); }
  }
});

let mcVersionList = [];

// ── MC Versions ────────────────────────────────────────────────────────────────
ipcMain.handle('get-versions', async () => {
  return new Promise((res, rej) => {
    https.get('https://launchermeta.mojang.com/mc/game/version_manifest.json', r => {
      let d=''; r.on('data',c=>d+=c); r.on('end',()=>{
        try {
          const versions = JSON.parse(d).versions.map(v=>({id:v.id,type:v.type}));
          mcVersionList = versions;
          res(versions);
        } catch(e){rej(e);}
      });
    }).on('error',rej);
  });
});

// ── Java ───────────────────────────────────────────────────────────────────────
async function findInstalledJavas(cb) {
  const found = []; const seenPaths = new Set(); let n=0;
  function addJava(p, v) {
    const resolved = path.resolve(p);
    if (seenPaths.has(resolved)) return;
    seenPaths.add(resolved);
    found.push({ path: p, version: v }); n++;
  }
  try {
    const out = await new Promise((r,rj)=>exec('where java',(e,o)=>e?rj(e):r(o)));
    for (const p of out.trim().split('\n').map(s=>s.trim()).filter(Boolean)) {
      if(cb)cb(10, \`Scanning $\{path.basename(p)}\`);
      const v=await getJavaVersion(p); if(v) addJava(p, v);
    }
  } catch { if(cb)cb(10,'No Java on PATH'); }

  const commonDirs=[
    'C:\\Program Files\\Java',
    'C:\\Program Files (x86)\\Java',
    'C:\\Program Files\\Eclipse Adoptium',
    'C:\\Program Files\\Eclipse Foundation',
    'C:\\Program Files\\Microsoft',
    'C:\\Program Files\\OpenJDK',
    'C:\\Program Files\\Zulu',
    'C:\\Program Files\\BellSoft',
    'C:\\Program Files\\Semeru',
    path.join(process.env.LOCALAPPDATA||'','Programs','Eclipse Adoptium'),
    path.join(process.env.LOCALAPPDATA||'','Programs','Microsoft','jdk'),
    path.join(process.env.USERPROFILE||'','.jdks'),
    path.join(process.env.USERPROFILE||'','.gradle','jdks'),
    path.join(process.env.USERPROFILE||'','.sdkman','candidates','java'),
    path.join(process.env.USERPROFILE||'','scoop','apps','openjdk','current'),
    path.join(process.env.USERPROFILE||'','scoop','apps','openjdk17','current'),
    path.join(process.env.USERPROFILE||'','scoop','apps','openjdk21','current'),
    path.join(process.env.APPDATA||'','\.minecraft','runtime'),
    P.java,
  ];
  for (const dir of commonDirs) {
    if (!fs.existsSync(dir)) continue;
    if(cb)cb(Math.min(90, 20 + n*10), \`Checking $\{path.basename(dir)}\`);
    const st = fs.statSync(dir);
    if (st.isFile() && dir.toLowerCase().endsWith('java.exe')) {
      const v=await getJavaVersion(dir); if(v) addJava(dir, v);
    } else if (st.isDirectory()) {
      const direct = path.join(dir, 'bin', 'java.exe');
      if (fs.existsSync(direct)) { const v=await getJavaVersion(direct); if(v) addJava(direct, v); }
      try {
        for (const item of fs.readdirSync(dir)) {
          const jp = path.join(dir, item, 'bin', 'java.exe');
          if (fs.existsSync(jp)) { const v=await getJavaVersion(jp); if(v) addJava(jp, v); }
        }
      } catch {}
    }
  }
  if(cb)cb(100,'Scan complete');
  return found;
}

async function getJavaVersion(p) {
  try {
    const o = await new Promise((r,rj)=>exec(\`"$\{p}" -version\`,(e,o,se)=>e?rj(e):r(se)));
    const m = o.match(/version "([^"]+)"/);
    if (!m) return null;
    const ver = m[1];
    // Parse: "21.0.2" -> "21", "1.8.0_291" -> "8"
    const parts = ver.split('.');
    if (parts[0] === '1') return parts[1]; // old format
    return parts[0];
  } catch { return null; }
}

ipcMain.handle('get-java-versions', () => findInstalledJavas());
ipcMain.handle('scan-java', async () => {
  if (!mainWindow) return findInstalledJavas();
  mainWindow.webContents.send('scan-progress', { progress:5, message:'Starting scan...' });
  const r = await findInstalledJavas((p,m) => mainWindow.webContents.send('scan-progress', { progress:p, message:m }));
  mainWindow.webContents.send('scan-progress', { progress:100, message:'Done' });
  return r;
});

// ── Microsoft OAuth ────────────────────────────────────────────────────────────
const MS_CLIENT_ID = '00000000402b5328';
const MS_REDIRECT  = 'https://login.microsoftonline.com/common/oauth2/nativeclient';

ipcMain.handle('login-microsoft', async () => {
  return new Promise((resolve) => {
    if (authWindow) { try { authWindow.close(); } catch {} authWindow = null; }
    const authUrl = \`https://login.live.com/oauth20_authorize.srf?client_id=$\{MS_CLIENT_ID}&response_type=code&redirect_uri=$\{encodeURIComponent(MS_REDIRECT)}&scope=XboxLive.signin%20offline_access&prompt=select_account\`;
    authWindow = new BrowserWindow({ width:520, height:680, title:'Microsoft Login', webPreferences:{ nodeIntegration:false, contextIsolation:true } });
    authWindow.setMenu(null);
    authWindow.loadURL(authUrl);
    let resolved = false;
    function tryResolve(url) {
      if (resolved) return;
      try {
        const u = new URL(url);
        if (u.origin + u.pathname === MS_REDIRECT || url.startsWith(MS_REDIRECT)) {
          const code = u.searchParams.get('code'), error = u.searchParams.get('error');
          resolved = true;
          try { authWindow.close(); } catch {} authWindow = null;
          if (error) { resolve({ error: 'OAuth error: ' + error }); return; }
          if (!code)  { resolve({ error: 'No code received' }); return; }
          exchangeMicrosoftCode(code).then(resolve).catch(err => resolve({ error: err.message }));
        }
      } catch {}
    }
    authWindow.webContents.on('will-redirect',            (e,url) => tryResolve(url));
    authWindow.webContents.on('will-navigate',            (e,url) => tryResolve(url));
    authWindow.webContents.on('did-navigate',             (e,url) => tryResolve(url));
    authWindow.webContents.on('did-get-redirect-request', (e,o,newUrl) => tryResolve(newUrl));
    authWindow.on('closed', () => { authWindow = null; if (!resolved) { resolved = true; resolve({ error: 'Login window closed' }); } });
  });
});

async function exchangeMicrosoftCode(code) {
  const msToken = await postForm('https://login.live.com/oauth20_token.srf', {
    client_id: MS_CLIENT_ID, code, grant_type: 'authorization_code',
    redirect_uri: MS_REDIRECT, scope: 'XboxLive.signin offline_access'
  });
  if (msToken.error) throw new Error(msToken.error_description || msToken.error);
  const xblRes = await postJson('https://user.auth.xboxlive.com/user/authenticate', {
    Properties: { AuthMethod:'RPS', SiteName:'user.auth.xboxlive.com', RpsTicket:\`d=$\{msToken.access_token}\` },
    RelyingParty: 'http://auth.xboxlive.com', TokenType:'JWT'
  });
  const xblToken = xblRes.Token, userHash = xblRes.DisplayClaims.xui[0].uhs;
  const xstsRes = await postJson('https://xsts.auth.xboxlive.com/xsts/authorize', {
    Properties: { SandboxId:'RETAIL', UserTokens:[xblToken] },
    RelyingParty: 'rp://api.minecraftservices.com/', TokenType:'JWT'
  });
  if (xstsRes.XErr) throw new Error(xstsRes.XErr===2148916238?'No Xbox Live account.':xstsRes.XErr===2148916233?'Xbox Live not available in your region.':\`XSTS error: $\{xstsRes.XErr}\`);
  const mcRes = await postJson('https://api.minecraftservices.com/authentication/login_with_xbox', { identityToken:\`XBL3.0 x=$\{userHash};$\{xstsRes.Token}\` });
  const mcToken = mcRes.access_token;
  const profile = await getJson('https://api.minecraftservices.com/minecraft/profile', mcToken);
  if (profile.error) throw new Error('No Minecraft profile. Make sure you own Java Edition.');
  return {
    name:         profile.name,
    uuid:         profile.id,
    type:         'Microsoft',
    accessToken:  mcToken,
    skinUrl:      profile.skins?.find(s=>s.state==='ACTIVE')?.url || null,
    refreshToken: msToken.refresh_token,
    xuid:         xstsRes.DisplayClaims?.xui?.[0]?.xid || '',
  };
}

// ── Mojang ─────────────────────────────────────────────────────────────────────
ipcMain.handle('login-mojang', async (e, { email, password }) => {
  try {
    const res = await postJson('https://authserver.mojang.com/authenticate', {
      agent:{ name:'Minecraft', version:1 }, username:email, password,
      clientToken:require('crypto').randomBytes(16).toString('hex'), requestUser:true
    });
    const profile = res.selectedProfile;
    return { name:profile.name, uuid:profile.id, type:'Mojang', accessToken:res.accessToken, clientToken:res.clientToken, skinUrl:null };
  } catch(err) { return { error: err.message }; }
});

// ── Skin upload ────────────────────────────────────────────────────────────────
ipcMain.handle('upload-skin', async (e, { accessToken, skinDataUrl, variant }) => {
  try {
    const skinBuffer = Buffer.from(skinDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
    const boundary = '----WebKitFormBoundary' + require('crypto').randomBytes(8).toString('hex');
    const CRLF = '\r\n';

    // Build multipart body correctly
    const parts = [
      // variant field
      \`--$\{boundary}$\{CRLF}\`,
      \`Content-Disposition: form-data; name="variant"$\{CRLF}$\{CRLF}\`,
      \`$\{variant || 'classic'}$\{CRLF}\`,
      // file field
      \`--$\{boundary}$\{CRLF}\`,
      \`Content-Disposition: form-data; name="file"; filename="skin.png"$\{CRLF}\`,
      \`Content-Type: image/png$\{CRLF}$\{CRLF}\`,
    ];

    const body = Buffer.concat([
      Buffer.from(parts.join('')),
      skinBuffer,
      Buffer.from(\`$\{CRLF}--$\{boundary}--$\{CRLF}\`)
    ]);

    return await new Promise((resolve) => {
      const req = https.request({
        hostname: 'api.minecraftservices.com',
        path: '/minecraft/profile/skins',
        method: 'POST',
        headers: {
          'Authorization': \`Bearer $\{accessToken}\`,
          'Content-Type': \`multipart/form-data; boundary=$\{boundary}\`,
          'Content-Length': body.length
        }
      }, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true });
          } else {
            resolve({ success: false, error: \`HTTP $\{res.statusCode}: $\{d}\` });
          }
        });
      });
      req.on('error', err => resolve({ success: false, error: err.message }));
      req.write(body);
      req.end();
    });
  } catch(err) { return { success: false, error: err.message }; }
});

// ── Instances ──────────────────────────────────────────────────────────────────
const instances = {};
let instanceCounter = 0;

ipcMain.handle('get-instance-logs', (e, instanceId) => instances[instanceId]?.logs || []);
ipcMain.handle('get-instances', () => Object.values(instances).map(i=>({id:i.id,version:i.version,startTime:i.startTime,crashed:i.crashed})));

ipcMain.on('stop-minecraft', (e, instanceId) => {
  const inst = instances[instanceId];
  if (!inst) return;
  if (inst.process) {
    try { inst.process.kill('SIGTERM'); } catch {}
    setTimeout(() => { try { inst.process.kill('SIGKILL'); } catch {} }, 2000);
  }
  // Only use taskkill as absolute last resort — it kills ALL java instances
  // so we avoid it when multiple instances may be running
});

// ── Launch ─────────────────────────────────────────────────────────────────────
ipcMain.on('launch-minecraft', async (event, data) => {
  const { version, javaPath, ram, ramUnit, profileMods, clientMods, clientResourcePacks, useClientMods, useClientRPs, accessToken, uuid, playerName, modLoader, useOriginalLauncher, profileId, profileName } = data;

  // RAM
  let maxRam, minRam;
  if (ramUnit === 'mb') {
    const mb = Math.max(512, Math.min(8192, parseInt(ram)||1024));
    maxRam=\`$\{mb}M\`; minRam=\`$\{Math.max(512,Math.floor(mb/2))}M\`;
  } else {
    const gb = Math.max(1, Math.min(8, parseInt(ram)||1));
    maxRam=\`$\{gb}G\`; minRam=\`$\{Math.max(1,Math.floor(gb/2))}G\`;
  }

  const instanceId = \`inst_$\{++instanceCounter}\`;
  instances[instanceId] = { id:instanceId, version, startTime:Date.now(), logs:[], crashed:false, process:null };
  mainWindow.webContents.send('instance-started', { id:instanceId, version, profileId, profileName, startTime:instances[instanceId].startTime });

  const send = (ch,...a) => { try { mainWindow.webContents.send(ch,...a); } catch {} };

  try {
    // ── Find Java ──────────────────────────────────────────────────────────────
    let resolvedJava = (javaPath && !javaPath.startsWith('No Java')) ? path.resolve(javaPath) : null;
    const verParts = version.split('.');
    const minor = parseInt(verParts[1]) || 0;
    const versionType = mcVersionList.find(v=>v.id===version)?.type || (version.match(/^\d+w/)? 'snapshot':'release');
    const needed = (minor >= 21 || versionType === 'snapshot') ? 21 : minor >= 17 ? 17 : 8;

    // ── Resolve Java ───────────────────────────────────────────────────────────
    const effectiveNeeded = modLoader === 'forge' ? Math.max(needed, 21) : needed;

    // For Forge: ALWAYS ignore dropdown and scan fresh — the installer needs Java 21+
    // For others: check selected first, scan only if insufficient
    const javaVer = resolvedJava ? (parseInt(await getJavaVersion(resolvedJava).catch(()=>'0')) || 0) : 0;
    send('instance-log', { instanceId, line: \`[JAVA] Selected: $\{resolvedJava||'none'} → Java $\{javaVer}, need $\{effectiveNeeded}+\` });

    if (modLoader === 'forge' || !resolvedJava || javaVer < effectiveNeeded) {
      send('launch-progress', { instanceId, percent:2, message:\`Scanning for Java $\{effectiveNeeded}+...\` });
      const javas = await findInstalledJavas();
      send('instance-log', { instanceId, line: \`[JAVA] Scan found: $\{javas.map(j=>\`Java$\{j.version}@$\{j.path}\`).join(' | ')||'none'}\` });
      let valid = javas.filter(j => (parseInt(j.version)||0) >= effectiveNeeded);

      // Auto-download Java 21 from Adoptium if none found
      if (!valid.length) {
        send('launch-progress', { instanceId, percent:3, message:\`No Java $\{effectiveNeeded}+ found. Downloading Java 21 from Adoptium...\` });
        try {
          const assets = await fetchJson(\`https://api.adoptium.net/v3/assets/latest/21/hotspot?os=windows&arch=x64&image_type=jre&heap_size=normal&vendor=eclipse\`);
          if (!assets || !assets.length) throw new Error('No Adoptium assets');
          const asset = assets.find(a=>a.binary.package.link.endsWith('.zip')) || assets[0];
          const url = asset.binary.package.link;
          const fn  = path.basename(url.split('?')[0]);
          const fp  = path.join(base, fn);
          if (!fs.existsSync(fp)) await downloadFile(url, fp);
          const AdmZip = require('adm-zip');
          const extractTo = path.join(P.java, 'jre-21');
          fs.mkdirSync(extractTo, {recursive:true});
          new AdmZip(fp).extractAllTo(extractTo, true);
          const javaExeFound = findJavaExe(extractTo);
          if (javaExeFound) {
            valid = [{ path: javaExeFound, version: '21' }];
            send('launch-progress', { instanceId, percent:10, message:'Java 21 downloaded and ready.' });
          }
        } catch(dlErr) {
          send('launch-status', \`Need Java $\{effectiveNeeded}+, none found and auto-download failed: $\{dlErr.message}\`);
          send('launch-progress', { instanceId, percent:0, message:'', done:true });
          send('no-java-found', effectiveNeeded);
          return;
        }
      }

      if (!valid.length) {
        send('launch-status', \`Need Java $\{effectiveNeeded}+. None found. Install Java $\{effectiveNeeded} and rescan in Settings.\`);
        send('launch-progress', { instanceId, percent:0, message:'', done:true });
        send('no-java-found', effectiveNeeded);
        return;
      }

      valid.sort((a,b) => (parseInt(a.version)||0) - (parseInt(b.version)||0));
      resolvedJava = path.resolve(valid[0].path);
      send('instance-log', { instanceId, line: \`[JAVA] Using Java $\{valid[0].version} @ $\{resolvedJava}\` });
      send('launch-progress', { instanceId, percent:11, message:\`Using Java $\{valid[0].version}: $\{path.basename(path.dirname(path.dirname(resolvedJava)))}\` });
    }

    // Use original launcher if selected
    if (useOriginalLauncher) {
      const exePaths = [
        'C:\\Program Files (x86)\\Minecraft Launcher\\MinecraftLauncher.exe',
        'C:\\Program Files\\Minecraft Launcher\\MinecraftLauncher.exe',
        path.join(process.env.APPDATA||'','.minecraft','launcher','launcher.exe'),
      ];
      const exe = exePaths.find(p => fs.existsSync(p));
      exec(exe ? \`"$\{exe}"\` : 'start minecraft:');
      send('launch-status', 'Opening Minecraft Launcher...');
      send('launch-progress', { instanceId, percent:100, message:'Original launcher opened', done:true });
      return;
    }

    // ── Auth ───────────────────────────────────────────────────────────────────
    let Client;
    try {
      ({ Client } = require('minecraft-launcher-core'));
    } catch(e) {
      send('launch-status', \`ERROR: minecraft-launcher-core not installed. Run "npm install" in the launcher folder.\`);
      send('launch-progress', { instanceId, percent:0, message:'', done:true });
      return;
    }

    let auth;
    if (accessToken && uuid) {
      // Try to refresh the token first to ensure it's valid
      let validToken = accessToken;
      try {
        // Verify token is still valid by calling MC profile endpoint
        const profileCheck = await getJson('https://api.minecraftservices.com/minecraft/profile', accessToken);
        if (profileCheck.error === 'Unauthorized') {
          // Token expired — try refresh if we have refreshToken
          if (data.refreshToken) {
            send('launch-progress', { instanceId, percent:1, message:'Refreshing login token...' });
            const refreshed = await postForm('https://login.live.com/oauth20_token.srf', {
              client_id: '00000000402b5328',
              refresh_token: data.refreshToken,
              grant_type: 'refresh_token',
              scope: 'XboxLive.signin offline_access'
            });
            if (!refreshed.error && refreshed.access_token) {
              // Re-do Xbox/MC auth chain
              const xblRes = await postJson('https://user.auth.xboxlive.com/user/authenticate', {
                Properties: { AuthMethod:'RPS', SiteName:'user.auth.xboxlive.com', RpsTicket:\`d=$\{refreshed.access_token}\` },
                RelyingParty: 'http://auth.xboxlive.com', TokenType:'JWT'
              });
              const xstsRes = await postJson('https://xsts.auth.xboxlive.com/xsts/authorize', {
                Properties: { SandboxId:'RETAIL', UserTokens:[xblRes.Token] },
                RelyingParty: 'rp://api.minecraftservices.com/', TokenType:'JWT'
              });
              const mcRes = await postJson('https://api.minecraftservices.com/authentication/login_with_xbox', {
                identityToken: \`XBL3.0 x=$\{xblRes.DisplayClaims.xui[0].uhs};$\{xstsRes.Token}\`
              });
              validToken = mcRes.access_token;
              send('launch-progress', { instanceId, percent:2, message:'Login token refreshed.' });
              // Notify renderer to update stored token
              mainWindow.webContents.send('token-refreshed', { uuid, accessToken: validToken, refreshToken: refreshed.refresh_token });
            }
          }
        }
      } catch(authErr) {
        send('instance-log', { instanceId, line: \`[AUTH] Token check failed: $\{authErr.message} — attempting launch anyway\` });
      }

      // Build proper MCLC auth object for online mode
      auth = {
        access_token:    validToken,
        client_token:    require('crypto').randomBytes(16).toString('hex'),
        uuid:            uuid.replace(/-/g, ''),
        name:            playerName || 'Player',
        user_properties: '{}',
        meta: {
          type:     'msa',
          demo:     false,
          xuid:     '',
          clientId: '00000000402b5328',
        }
      };
    } else {
      // Offline mode — no server access, default skin
      const { Authenticator } = require('minecraft-launcher-core');
      auth = Authenticator.getAuth(playerName || 'Player');
      send('instance-log', { instanceId, line: '[AUTH] Offline mode — skin and multiplayer not available. Add a Microsoft account in MC-Account tab.' });
    }

    // ── Fabric installer ───────────────────────────────────────────────────────
    let versionObj = { number: version, type: versionType };

    // Always resolve to absolute path and always quote — paths may have spaces or start relative
    const quoteJava = (p) => \`"$\{path.resolve(p)}"\`;

    if (modLoader === 'fabric') {
      // Fabric installer creates: fabric-loader-{loaderVer}-{mcVer}
      // Find any existing fabric version for this MC version
      const versionsDir = path.join(P.mc, 'versions');
      let fabricId = null;

      if (fs.existsSync(versionsDir)) {
        const dirs = fs.readdirSync(versionsDir);
        // Match pattern: fabric-loader-*-{mcVersion}
        fabricId = dirs.find(d => {
          const lower = d.toLowerCase();
          return lower.startsWith('fabric-loader-') && (d.endsWith(\`-$\{version}\`) || d.endsWith(version));
        }) || null;
      }

      if (fabricId && fs.existsSync(path.join(versionsDir, fabricId, \`$\{fabricId}.json\`))) {
        versionObj.custom = fabricId;
        send('launch-progress', { instanceId, percent:5, message:\`Using Fabric: $\{fabricId}\` });
      } else {
        send('launch-progress', { instanceId, percent:5, message:'Downloading Fabric installer...' });
        try {
          const loaders = await fetchJson(\`https://meta.fabricmc.net/v2/versions/loader/$\{version}\`);
          if (!loaders || !loaders.length) throw new Error('No Fabric loader for ' + version);

          const loaderVer = loaders[0].loader.version;

          // Get installer version from separate endpoint (more reliable)
          let instVer = loaders[0].installer?.version;
          if (!instVer) {
            try {
              const installerMeta = await fetchJson('https://meta.fabricmc.net/v2/versions/installer');
              instVer = installerMeta[0]?.version;
            } catch {}
          }
          if (!instVer) {
            // Hardcode a known-good installer version as last resort
            instVer = '0.11.2';
          }

          const expectedFabricId = \`fabric-loader-$\{loaderVer}-$\{version}\`;
          const instUrl  = \`https://maven.fabricmc.net/net/fabricmc/fabric-installer/$\{instVer}/fabric-installer-$\{instVer}.jar\`;
          const instPath = path.join(base, \`fabric-installer-$\{instVer}.jar\`);

          if (!fs.existsSync(instPath)) {
            send('launch-progress', { instanceId, percent:8, message:\`Downloading fabric-installer-$\{instVer}.jar...\` });
            await downloadFile(instUrl, instPath);
          }

          send('launch-progress', { instanceId, percent:12, message:'Running Fabric installer...' });
          const javaExe = quoteJava(resolvedJava);
          await new Promise((res,rej) => exec(
            \`$\{javaExe} -jar "$\{path.resolve(instPath)}" client -dir "$\{path.resolve(P.mc)}" -mcversion $\{version} -loader $\{loaderVer} -noprofile\`,
            { timeout: 120000 },
            (e,o,se) => {
              console.log('Fabric installer stdout:', o);
              console.log('Fabric installer stderr:', se);
              if(e) rej(new Error(se||e.message||String(e))); else res(o);
            }
          ));

          // Find the newly created fabric version dir
          if (fs.existsSync(versionsDir)) {
            const newDirs = fs.readdirSync(versionsDir);
            fabricId = newDirs.find(d => d.toLowerCase().startsWith('fabric-loader-') && d.includes(version)) || null;
          }

          if (fabricId && fs.existsSync(path.join(versionsDir, fabricId, \`$\{fabricId}.json\`))) {
            versionObj.custom = fabricId;
            send('launch-progress', { instanceId, percent:18, message:\`Fabric installed: $\{fabricId}\` });
          } else {
            throw new Error(\`Fabric installer ran but version dir not found (expected: $\{expectedFabricId})\`);
          }
        } catch(fe) {
          console.error('Fabric install error:', fe);
          send('instance-log', { instanceId, line:\`[FABRIC ERROR] $\{fe.message}\` });
          send('launch-progress', { instanceId, percent:5, message:\`Fabric failed: $\{fe.message.slice(0,60)}\` });
          versionObj = { number: version, type: versionType };
        }
      }
    }

    // ── Forge ─────────────────────────────────────────────────────────────────
    if (modLoader === 'forge') {
      const versionsDir = path.join(P.mc, 'versions');
      let forgeId = null;

      if (fs.existsSync(versionsDir)) {
        const dirs = fs.readdirSync(versionsDir);
        forgeId = dirs.find(d => d.toLowerCase().includes('forge') && d.includes(version)) || null;
        if (forgeId && !fs.existsSync(path.join(versionsDir, forgeId, \`$\{forgeId}.json\`))) forgeId = null;
      }

      if (forgeId) {
        versionObj.custom = forgeId;
        send('launch-progress', { instanceId, percent:5, message:\`Using Forge: $\{forgeId}\` });
      } else {
        send('launch-progress', { instanceId, percent:5, message:'Finding Forge version...' });
        try {
          // promotions_slim.json is the correct JSON endpoint for Forge versions
          const promos = await fetchJson('https://files.minecraftforge.net/net/minecraftforge/forge/promotions_slim.json');
          const forgeShort = promos.promos[\`$\{version}-recommended\`] || promos.promos[\`$\{version}-latest\`];
          if (!forgeShort) throw new Error(\`No Forge available for MC $\{version}. Try a different MC version.\`);

          const forgeFullVer = \`$\{version}-$\{forgeShort}\`;
          const mavenBase = 'https://maven.minecraftforge.net/net/minecraftforge/forge';
          const installerUrl = \`$\{mavenBase}/$\{forgeFullVer}/forge-$\{forgeFullVer}-installer.jar\`;
          const installerPath = path.join(base, \`forge-installer-$\{forgeFullVer}.jar\`);

          if (!fs.existsSync(installerPath)) {
            send('launch-progress', { instanceId, percent:8, message:\`Downloading Forge $\{forgeFullVer}...\` });
            await downloadFile(installerUrl, installerPath);
          }

          send('launch-progress', { instanceId, percent:15, message:'Installing Forge (this may take a minute)...' });
          const javaExe = quoteJava(resolvedJava);
          const absJava = path.resolve(resolvedJava);
          const absInstaller = path.resolve(installerPath);
          const absMc = path.resolve(P.mc);
          // Forge installs to {cwd}/.minecraft/ — but our mc dir IS the .minecraft equivalent
          // So we set cwd to the parent of P.mc and rename if needed, OR
          // use the explicit path argument which Forge 1.17+ supports as the first positional arg
          let forgeInstallErr = null;
          const attempts = [
            // Modern Forge: first positional arg is the game dir
            { cmd: \`$\{javaExe} -jar "$\{absInstaller}" --installClient "$\{absMc}"\`, cwd: absMc },
            // Older style: no path arg, cwd is parent so Forge creates .minecraft there
            { cmd: \`$\{javaExe} -jar "$\{absInstaller}" --installClient\`, cwd: path.dirname(absMc) },
            // Fallback: cwd = absMc itself
            { cmd: \`$\{javaExe} -jar "$\{absInstaller}" --installClient\`, cwd: absMc },
          ];

          for (const attempt of attempts) {
            try {
              await new Promise((res,rej) => exec(attempt.cmd, {
                timeout: 300000,
                cwd: attempt.cwd,
                env: { ...process.env, JAVA_HOME: path.dirname(path.dirname(absJava)) }
              }, (e,o,se) => {
                const out = ((o||'')+(se||'')).trim();
                if (out) send('instance-log', { instanceId, line:\`[FORGE OUT] $\{out.slice(0,800)}\` });
                if(e) rej(new Error(out.slice(0,400)||e.message)); else res(o);
              }));
              forgeInstallErr = null;
              break;
            } catch(tryErr) { forgeInstallErr = tryErr; }
          }

          // Also check if Forge installed into parent/.minecraft instead
          if (!forgeId || !fs.existsSync(path.join(versionsDir, forgeId||'', \`$\{forgeId||''}.json\`))) {
            const parentMcDir = path.join(path.dirname(absMc), '.minecraft');
            if (fs.existsSync(parentMcDir)) {
              const parentVersions = path.join(parentMcDir, 'versions');
              if (fs.existsSync(parentVersions)) {
                const pDirs = fs.readdirSync(parentVersions);
                const foundInParent = pDirs.find(d => d.toLowerCase().includes('forge') && d.includes(version));
                if (foundInParent) {
                  // Move from parent/.minecraft to our mc dir
                  send('instance-log', { instanceId, line:\`[FORGE] Moving installed version from $\{parentMcDir} to $\{absMc}\` });
                  try {
                    const src = path.join(parentVersions, foundInParent);
                    const dst = path.join(versionsDir, foundInParent);
                    fs.mkdirSync(dst, {recursive:true});
                    for (const f of fs.readdirSync(src)) fs.renameSync(path.join(src,f), path.join(dst,f));
                    forgeId = foundInParent;
                  } catch(mvErr) { send('instance-log', {instanceId, line:\`[FORGE] Move failed: $\{mvErr.message}\`}); }
                }
              }
            }
          }

          if (forgeInstallErr) throw forgeInstallErr;

          if (fs.existsSync(versionsDir)) {
            const newDirs = fs.readdirSync(versionsDir);
            forgeId = newDirs.find(d => d.toLowerCase().includes('forge') && d.includes(version)) || null;
            if (forgeId && !fs.existsSync(path.join(versionsDir, forgeId, \`$\{forgeId}.json\`))) forgeId = null;
          }

          if (forgeId) {
            versionObj.custom = forgeId;
            send('launch-progress', { instanceId, percent:20, message:\`Forge installed: $\{forgeId}\` });
          } else {
            throw new Error('Forge installer ran but version directory not found');
          }
        } catch(fe) {
          console.error('Forge error:', fe);
          send('instance-log', { instanceId, line:\`[FORGE ERROR] $\{fe.message}\` });
          send('instance-log', { instanceId, line:\`[FORGE] Falling back to vanilla launch\` });
          send('launch-progress', { instanceId, percent:5, message:\`Forge failed — launching vanilla\` });
          versionObj = { number: version, type: versionType };
        }
      }
    }

    // ── Deploy mods ────────────────────────────────────────────────────────────
    if (modLoader === 'fabric' || modLoader === 'forge') {
      send('launch-progress', { instanceId, percent:22, message:'Preparing mods...' });

      const modsDir = path.join(P.mc, 'mods');
      fs.mkdirSync(modsDir, { recursive: true });

      const clientModsRaw  = (data.useClientMods !== false) ? (data.clientMods || []) : [];
      const profileModsRaw = data.profileMods || [];

      const toDeploy = [];
      for (const mod of clientModsRaw) {
        if (mod.disabled) continue;
        if (mod.loader && mod.loader !== modLoader) continue;
        const vm = mod.downloadAllVersions || mod.mcVersion === version || mod.mcVersion === 'all' || mod.mcVersion === 'latest';
        if (!vm) continue;
        toDeploy.push(mod);
      }
      for (const mod of profileModsRaw) {
        if (mod.disabled) continue;
        if (!toDeploy.some(m => m.modrinthId && m.modrinthId === mod.modrinthId)) toDeploy.push(mod);
      }

      // Auto-add required Fabric dependencies when using Fabric
      if (modLoader === 'fabric') {
        const fabricDeps = [
          { name:'Fabric API',               modrinthId:'P7dR8mSH', loader:'fabric' },
          { name:'Cloth Config',             modrinthId:'9s6osm5g', loader:'fabric' },
          { name:'Fabric Language Kotlin',   modrinthId:'Ha28R6CL', loader:'fabric' },
          { name:'YetAnotherConfigLib',      modrinthId:'1eAoo2KR', loader:'fabric' },
          { name:'TCDCommons',               modrinthId:'Eldc1g37', loader:'fabric' },
        ];
        for (const dep of fabricDeps) {
          if (!toDeploy.some(m => m.modrinthId === dep.modrinthId)) toDeploy.push(dep);
        }
      }

      // ── Clean mods folder: remove JARs not in toDeploy ──────────────────────
      const deployIds = new Set(toDeploy.map(m => m.modrinthId).filter(Boolean));
      const existingJars = fs.readdirSync(modsDir).filter(f => f.endsWith('.jar'));
      for (const jar of existingJars) {
        // Our JARs are named {modrinthId}-{filename}.jar
        const idMatch = jar.match(/^([^-]+)-/);
        if (idMatch && !deployIds.has(idMatch[1])) {
          try { fs.unlinkSync(path.join(modsDir, jar)); } catch {}
        }
      }

      send('launch-progress', { instanceId, percent:23, message:\`Deploying $\{toDeploy.length} mods...\` });

      let deployed = 0;
      for (const mod of toDeploy) {
        if (!mod.modrinthId) continue;
        try {
          const existingFiles = fs.readdirSync(modsDir);
          const alreadyThere  = existingFiles.some(f => f.startsWith(mod.modrinthId + '-'));
          if (alreadyThere) { deployed++; continue; }

          // Fetch with loader filter first, then without
          const gv = encodeURIComponent(\`["$\{version}"]\`);
          const ld = encodeURIComponent(\`["$\{modLoader}"]\`);
          let versions = await fetchJson(\`https://api.modrinth.com/v2/project/$\{mod.modrinthId}/version?game_versions=$\{gv}&loaders=$\{ld}\`);
          if (!versions || !versions.length) versions = await fetchJson(\`https://api.modrinth.com/v2/project/$\{mod.modrinthId}/version?game_versions=$\{gv}\`);
          // Last fallback: any version at all
          if (!versions || !versions.length) versions = await fetchJson(\`https://api.modrinth.com/v2/project/$\{mod.modrinthId}/version\`);
          if (!versions || !versions.length) {
            send('instance-log', { instanceId, line:\`[MODS] No build for $\{mod.name} on $\{version}\` });
            continue;
          }

          const file = versions[0].files.find(f => f.primary) || versions[0].files[0];
          if (!file) continue;

          const jarPath = path.join(modsDir, \`$\{mod.modrinthId}-$\{file.filename}\`);
          if (!fs.existsSync(jarPath)) await downloadFile(file.url, jarPath);
          deployed++;
          send('launch-progress', { instanceId, percent:Math.min(45,23+Math.round(deployed/toDeploy.length*22)), message:\`Downloaded: $\{mod.name}\` });
        } catch(e) {
          send('instance-log', { instanceId, line:\`[MODS] Failed $\{mod.name}: $\{e.message}\` });
        }
      }
      send('launch-progress', { instanceId, percent:45, message:\`$\{deployed} mods ready.\` });

      // ── Deploy resource packs ──────────────────────────────────────────────
      const rpList = (data.useClientRPs !== false) ? (data.clientResourcePacks || []) : [];
      if (rpList.length) {
        const rpDir = path.join(P.mc, 'resourcepacks');
        fs.mkdirSync(rpDir, { recursive: true });

        const deployedRpNames = [];

        for (const rp of rpList) {
          try {
            if (rp.startsWith('http://') || rp.startsWith('https://')) {
              const fname = path.basename(rp.split('?')[0]) || \`rp-$\{Date.now()}.zip\`;
              const dest  = path.join(rpDir, fname);
              if (!fs.existsSync(dest)) {
                send('launch-progress', { instanceId, percent:47, message:\`Downloading RP: $\{fname}\` });
                await downloadFile(rp, dest);
              }
              deployedRpNames.push(fname);
            } else {
              // Plain name — check if file exists in resourcepacks folder
              const candidates = fs.readdirSync(rpDir).filter(f =>
                f.toLowerCase().startsWith(rp.toLowerCase().replace(/\.zip$/i,''))
              );
              if (candidates.length) {
                deployedRpNames.push(candidates[0]);
              } else {
                // Add as-is (user may have placed it manually)
                deployedRpNames.push(rp.endsWith('.zip') ? rp : rp + '.zip');
              }
            }
          } catch(e) { send('instance-log', { instanceId, line:\`[RP] Failed: $\{e.message}\` }); }
        }

        // Write resource packs into options.txt so MC loads them automatically
        if (deployedRpNames.length) {
          const optionsPath = path.join(P.mc, 'options.txt');
          let options = '';
          if (fs.existsSync(optionsPath)) options = fs.readFileSync(optionsPath, 'utf8');

          // MC format: resourcePacks:["vanilla","file/pack.zip"]
          // "file/" prefix is required for local packs
          const rpEntries = deployedRpNames.map(n => {
            // Don't double-add "file/" prefix
            if (n.startsWith('file/') || n === 'vanilla') return \`"$\{n}"\`;
            return \`"file/$\{n}"\`;
          });
          const rpEntry = \`["vanilla",$\{rpEntries.join(',')}]\`;

          // Log what options.txt currently has
          const existingLine = options.match(/^resourcePacks:(.*)$/m)?.[1] || '(none)';
          send('instance-log', { instanceId, line: \`[RP] options.txt existing: resourcePacks:$\{existingLine}\` });

          if (options.match(/^resourcePacks:/m)) {
            options = options.replace(/^resourcePacks:.*$/m, \`resourcePacks:$\{rpEntry}\`);
          } else {
            options += \`\nresourcePacks:$\{rpEntry}\`;
          }
          if (options.match(/^incompatibleResourcePacks:/m)) {
            options = options.replace(/^incompatibleResourcePacks:.*$/m, \`incompatibleResourcePacks:[]\`);
          } else {
            options += \`\nincompatibleResourcePacks:[]\`;
          }

          fs.writeFileSync(optionsPath, options);
          send('instance-log', { instanceId, line: \`[RP] Written to $\{optionsPath}: resourcePacks:$\{rpEntry}\` });
        }

        send('launch-progress', { instanceId, percent:50, message:\`$\{deployedRpNames.length} resource pack(s) activated.\` });
      } else {
        // If no RPs configured, don't clear user's existing options.txt RP settings
      }
    }

    // ── Launch ─────────────────────────────────────────────────────────────────
    const launcher = new Client();
    const opts = {
      clientPackage: null,
      authorization: auth,
      root:    P.mc,
      version: versionObj,
      memory:  { max: maxRam, min: minRam },
      javaPath: resolvedJava,
      overrides: {
        detached: false,
      }
    };

    send('launch-status', 'Preparing Minecraft...');
    send('launch-progress', { instanceId, percent:20, message:'Starting Minecraft...' });

    launcher.on('download-status', s => {
      const pct = s.total>0 ? Math.round(s.current/s.total*100) : 0;
      send('launch-progress', { instanceId, percent:Math.min(90,pct+20), message:\`Downloading: $\{s.name} ($\{s.current}/$\{s.total})\` });
    });
    launcher.on('progress', e => {
      const pct = e.total>0 ? Math.round(e.task/e.total*90) : 0;
      send('launch-progress', { instanceId, percent:Math.min(90,pct+20), message:\`$\{e.type}: $\{e.task}/$\{e.total}\` });
    });
    launcher.on('data', line => {
      const s = String(line).trim(); if (!s) return;
      instances[instanceId].logs.push(s);
      send('instance-log', { instanceId, line: s });
      if (s.toLowerCase().includes('setting user')) {
        send('launch-progress', { instanceId, percent:100, message:'Minecraft running!' });
        send('mc-launched', instanceId);
      }
    });
    launcher.on('close', code => {
      send('instance-log', { instanceId, line:\`--- Process exited (code $\{code}) ---\` });
      send('launch-progress', { instanceId, percent:0, message:'', done:true });
      send('instance-closed', { instanceId, code });
      if (code !== 0 && code !== null) {
        instances[instanceId].crashed = true;
        showCrashWindow(instanceId, code, instances[instanceId].logs.slice(-80).join('\n'));
        send('instance-crashed', { instanceId, code });
      }
    });
    launcher.on('error', err => {
      const msg = err.message || String(err);
      instances[instanceId].logs.push('[ERROR] ' + msg);
      send('instance-log', { instanceId, line:'[ERROR] '+msg });
      send('launch-progress', { instanceId, percent:0, message:'', done:true });
    });

    // launcher.launch() returns a Promise<ChildProcess>
    const proc = await launcher.launch(opts);
    if (proc) instances[instanceId].process = proc;

  } catch(err) {
    send('launch-status', 'Launch error: ' + err.message);
    send('launch-progress', { instanceId, percent:0, message:'', done:true });
    console.error('Launch error:', err);
  }
});

// ── Crash window ───────────────────────────────────────────────────────────────
function showCrashWindow(instanceId, code, log) {
  const cw = new BrowserWindow({ width:700, height:500, title:'Minecraft Crashed', parent:mainWindow, webPreferences:{ nodeIntegration:true, contextIsolation:false } });
  cw.setMenu(null);
  const html = \`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
    body{margin:0;background:#1a0000;color:#ff6b6b;font-family:monospace;font-size:12px;display:flex;flex-direction:column;height:100vh;overflow:hidden;}
    .header{padding:16px;background:#2a0000;border-bottom:1px solid #550000;flex-shrink:0;}
    .header h2{margin:0;color:#ff4444;} .header p{margin:4px 0 0;color:#cc4444;font-size:12px;}
    pre{flex:1;overflow:auto;padding:16px;margin:0;white-space:pre-wrap;word-break:break-all;line-height:1.4;}
    .close-btn{padding:8px 20px;background:#550000;border:1px solid #880000;color:#ff6b6b;cursor:pointer;margin:12px;border-radius:4px;}
  </style></head><body>
    <div class="header"><h2>💥 Minecraft Crashed</h2><p>Exit code: $\{code} · Instance: $\{instanceId}</p></div>
    <pre>$\{log.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
    <button class="close-btn" onclick="window.close()">Close</button>
  </body></html>\`;
  cw.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
}

// ── HTTP helpers ───────────────────────────────────────────────────────────────
function postForm(url, params) {
  return new Promise((resolve, reject) => {
    const body = Object.entries(params).map(([k,v])=>\`$\{encodeURIComponent(k)}=$\{encodeURIComponent(v)}\`).join('&');
    const u = new URL(url);
    const req = https.request({ hostname:u.hostname, path:u.pathname, method:'POST',
      headers:{ 'Content-Type':'application/x-www-form-urlencoded', 'Content-Length':Buffer.byteLength(body) }
    }, r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>{ try{resolve(JSON.parse(d));}catch(e){reject(e);} }); });
    req.on('error', reject); req.write(body); req.end();
  });
}
function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const b = JSON.stringify(body), u = new URL(url);
    const req = https.request({ hostname:u.hostname, path:u.pathname, method:'POST',
      headers:{ 'Content-Type':'application/json', 'Content-Length':Buffer.byteLength(b) }
    }, r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>{ try{resolve(JSON.parse(d));}catch(e){reject(e);} }); });
    req.on('error', reject); req.write(b); req.end();
  });
}
function getJson(url, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https.request({ hostname:u.hostname, path:u.pathname, method:'GET',
      headers:{ 'Authorization':\`Bearer $\{token}\` }
    }, r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>{ try{resolve(JSON.parse(d));}catch(e){reject(e);} }); }).on('error',reject).end();
  });
}
function fetchJson(url) {
  return new Promise((r,rj) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, res => {
      let d='';
      res.on('data',c=>d+=c);
      res.on('end',()=>{
        if(!d.trim()){ rj(new Error('Empty response from '+url.slice(0,80))); return; }
        try{r(JSON.parse(d));}catch(e){rj(new Error('JSON parse error: '+e.message+' body: '+d.slice(0,100)));}
      });
    }).on('error',rj);
  });
}
function fetchText(url) {
  return new Promise((r,rj) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchText(res.headers.location).then(r).catch(rj); return;
      }
      let d=''; res.on('data',c=>d+=c); res.on('end',()=>r(d));
    }).on('error',rj);
  });
}
function downloadFile(url, dest) {
  return new Promise((r,rj) => {
    const go=(u,hops=0)=>{
      if(hops>5)return rj(new Error('Too many redirects'));
      const lib=u.startsWith('https')?https:http;
      lib.get(u, res=>{
        if(res.statusCode>=300&&res.statusCode<400&&res.headers.location){go(res.headers.location,hops+1);return;}
        if(res.statusCode!==200)return rj(new Error('Download failed: '+res.statusCode));
        const f=fs.createWriteStream(dest); res.pipe(f); f.on('finish',()=>f.close(r)); f.on('error',rj);
      }).on('error',rj);
    };
    go(url);
  });
}
function findJavaExe(dir) {
  for(const i of fs.readdirSync(dir)){
    const f=path.join(dir,i);
    if(fs.statSync(f).isDirectory()){
      const jp=path.join(f,'bin','java.exe'); if(fs.existsSync(jp)) return jp;
      const found=findJavaExe(f); if(found) return found;
    }
  }
  return null;
}`;