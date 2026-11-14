import{r as U,i as q,s as S,e as g,m as E,T as F,a as u,W as L,u as M,l as H}from"./index-CYJXsERU.js";import{c as N,f as A,m as T}from"./sync-Bzfpo5-a.js";const W=[["drums","Bit","perkusja"],["bass","Bas",""],["other","Melodia","reszta instrumentów"],["vocals","Wokal",""]],D=/\.(mp3|wav|ogg|flac)$/i,G=n=>{var $;let r=!1,f=!0;const t=U(n.root,`<div class="screen">
      <header class="topbar"><h1>Dodaj utwór</h1><button class="back" data-back>Wróć <kbd>Esc</kbd></button></header>
      <form class="settings" data-form novalidate>
        <section>
          <h2>Paczka od znajomego</h2>
          <div class="row"><label for="pack">Plik .victory</label><input id="pack" type="file"></div>
          <p class="hint" data-pack-status>Utwór z nutami i teledyskiem, zrobiony w grze na komputerze. Dodaje się w kilka sekund.</p>
        </section>
        <section>
          <h2>Utwór</h2>
          <div class="row"><label for="title">Tytuł</label><input id="title" type="text" maxlength="200" required></div>
          <div class="row"><label for="artist">Wykonawca</label><input id="artist" type="text" maxlength="200"></div>
          <div class="row"><label for="bpm">BPM</label><input id="bpm" type="number" min="20" max="400" placeholder="120"></div>
          <p class="hint">Jeśli nie znasz BPM, zostaw puste. Gra działa i bez niego.</p>
        </section>
        <section>
          <h2>Pliki</h2>
          <label class="choice" hidden><input type="radio" name="mode" value="one" checked>
            Jeden plik, Demucs podzieli go na 4 ścieżki</label>
          <label class="choice" hidden><input type="radio" name="mode" value="four">Mam gotowe ścieżki</label>
          <div data-one class="row"><label for="src">Plik utworu</label><input id="src" type="file" accept=".mp3,.wav,.ogg,.flac"></div>
          <div data-four class="stack" hidden>${W.map(([e,a,c])=>`<div class="row"><label for="f-${e}">${a}${c?` <span class="dim">(${c})</span>`:""}</label>
               <input id="f-${e}" type="file" accept=".mp3,.wav,.ogg,.flac"></div>`).join("")}
            <p class="hint">Ścieżka bez pliku będzie cicha.</p></div>
        </section>
        <section hidden>
          <h2>Dodatki</h2>
          <div class="row"><label for="video">Teledysk <span class="dim">(mp4, webm)</span></label><input id="video" type="file" accept=".mp4,.webm"></div>
          <div class="row"><label for="spotify">Link do utworu w Spotify</label><input id="spotify" type="text" placeholder="open.spotify.com/track/…"></div>
          <p class="hint">Tekst pochodzi z Spicy Lyrics. Najpierw puść ten utwór w Spotify z otwartym tekstem.</p>
        </section>
        <section>
          <div><button class="primary" type="submit" data-submit>Dodaj utwór</button></div>
          <div class="bar" hidden data-bar><i></i></div>
          <p class="hint" data-status></p>
        </section>
      </form>
      <footer class="footer">Utwór zostaje na tym urządzeniu. Nuty układają się z całego pliku, zwykle w kilkanaście sekund.</footer>
    </div>`),y=()=>n.root.querySelector("input[name=mode]:checked").value;n.root.querySelectorAll("input[name=mode]").forEach(e=>e.addEventListener("change",()=>{t("[data-one]").hidden=y()!=="one",t("[data-four]").hidden=y()!=="four"}));const l=(e,a=!1)=>{t("[data-status]").innerHTML=a?`<span class="err">${g(e)}</span>`:g(e)},m=e=>{t("[data-bar]").hidden=e===null,t("[data-bar] i").style.width=`${Math.round((e??0)*100)}%`},p=e=>{var a;return(a=t(e).files)==null?void 0:a[0]},k=e=>D.exec(e.name)[1].toLowerCase(),P=async e=>{if(e.preventDefault(),r)return;const a=t("#title").value.trim();if(!a)return l("Wpisz tytuł.",!0);const c=Number(t("#bpm").value)||120,d=y()==="one"?p("#src")?[["source",p("#src")]]:[]:W.flatMap(([s])=>p(`#f-${s}`)?[[s,p(`#f-${s}`)]]:[]);if(!d.length)return l(y()==="one"?"Wybierz plik utworu.":"Wybierz przynajmniej jedną ścieżkę.",!0);const b=d.find(([,s])=>!D.test(s.name));if(b)return l(`„${b[1].name}”: obsługuję mp3, wav, ogg i flac.`,!0);r=!0,t("[data-submit]").disabled=!0;let i="";try{i=(await u.createSong(a,t("#artist").value,c)).id;for(let o=0;o<d.length;o++){const[h,v]=d[o];l(`${L?"Zapisuję":"Wysyłam"} ${v.name}…`),await M(i,`${h}.${k(v)}`,v,C=>m((o+C)/d.length))}if(L&&await u.saveChart(i,{...await u.getChart(i),mix:`source.${k(d[0][1])}`}),!f)return;l("Układam nuty…"),m(null);const s=await H(n.engine.ctx,i);await new Promise(o=>setTimeout(o,30));const B=N(s.buffers,s.chart.bpm),j={...s.chart,...B},w=p("#video");if(w&&/\.(mp4|webm)$/i.test(w.name)){const o=k(w);l("Wysyłam teledysk…"),await M(i,`video.${o}`,w,v=>m(v)),m(null),l("Dopasowuję teledysk do muzyki…");let h=0;try{h=A(T(s.buffers),T([await n.engine.ctx.decodeAudioData(await w.arrayBuffer())]))}catch{}j.video={file:`video.${o}`,offsetMs:h}}await u.saveChart(i,j);const x=t("#spotify").value.trim();if(x)try{await u.lyricsFromSpotify(i,x)}catch(o){if(!f)return;r=!1,l(`Utwór dodany, ale bez tekstu: ${o.message} Tekst dodasz później w edytorze.`,!0);return}f&&n.go(S)}catch(s){i&&await u.deleteSong(i).catch(()=>{}),r=!1,m(null),t("[data-submit]").disabled=!1,l(s.message,!0)}};($=n.root.querySelector("#pack"))==null||$.addEventListener("change",async e=>{var b;const a=e.target,c=(b=a.files)==null?void 0:b[0];if(!c||r)return;const d=t("[data-pack-status]");r=!0,d.textContent="Dodaję utwór z paczki…";try{await q(c),f&&n.go(S)}catch(i){d.innerHTML=`<span class="err">${g(i.message)}</span>`,a.value=""}r=!1}),t("[data-form]").addEventListener("submit",e=>void P(e)),t("[data-back]").addEventListener("click",()=>!r&&n.go(E));const z=e=>e.code==="Escape"&&!r&&n.go(E);return window.addEventListener("keydown",z),F||t("#title").focus(),()=>{f=!1,window.removeEventListener("keydown",z)}};export{G as addSong};
