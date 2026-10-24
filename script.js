// Анимации появления, мобильное меню и сохранение прогресса.
const checks = [...document.querySelectorAll("[data-course]")];
const progressFill = document.getElementById("progressFill");
const progressCount = document.getElementById("progressCount");
const saveNote = document.getElementById("saveNote");
const storageKey = "englishGardenAnimatedProgress";

function updateProgress() {
  const completed = checks.filter((item) => item.checked).length;
  progressCount.textContent = `${completed}/${checks.length}`;
  progressFill.style.width = `${checks.length ? completed / checks.length * 100 : 0}%`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(
      checks.filter((item) => item.checked).map((item) => item.dataset.course)
    ));
    saveNote.textContent = "✓ Прогресс сохранён в этом браузере.";
  } catch (error) {
    saveNote.textContent = "Прогресс работает до закрытия страницы, но браузер не разрешил его сохранить.";
  }
}

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  checks.forEach((item) => { item.checked = saved.includes(item.dataset.course); });
} catch (error) {
  // Если сохранённые данные повреждены, сайт всё равно продолжает работать.
}
checks.forEach((item) => item.addEventListener("change", updateProgress));
updateProgress();
document.getElementById("year").textContent = new Date().getFullYear();

// Плавное появление блоков по мере прокрутки.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Мобильная навигация.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const opened = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
  menuToggle.textContent = opened ? "✕" : "☰";
});
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));


// Поиск по учебным разделам.
const courseSearch = document.getElementById("courseSearch");
const courseCards = [...document.querySelectorAll(".course-card")];
const courseHint = document.getElementById("courseHint");
courseSearch.addEventListener("input", () => {
  const query = courseSearch.value.trim().toLocaleLowerCase("ru");
  let visible = 0;
  courseCards.forEach((card) => {
    const matches = card.textContent.toLocaleLowerCase("ru").includes(query);
    card.hidden = !matches;
    if (matches) visible++;
  });
  courseHint.textContent = query ? `Найдено разделов: ${visible}` : `${courseCards.length} разделов для изучения`;
});

// Сброс отметок по запросу пользователя.
document.getElementById("resetProgress").addEventListener("click", () => {
  if (!checks.some((item) => item.checked)) {
    saveNote.textContent = "Все разделы уже не отмечены.";
    return;
  }
  checks.forEach((item) => { item.checked = false; });
  updateProgress();
  saveNote.textContent = "Прогресс сброшен. Можешь начать заново!";
});


// Переключение интерфейса на русский, казахский и английский.
const translations = {
ru: {lessons:'Занятия', progress:'Прогресс', community:'Сообщество', start:'Начать учиться', eyebrow:'ТВОЁ МЕСТО ДЛЯ АНГЛИЙСКОГО', title:'Английский|в своём темпе.', intro:'Все нужные материалы собраны в одном уютном месте. Выбирай занятие, открывай урок и постепенно двигайся к своей цели.', myLessons:'Мои занятия', myProgress:'Мой прогресс', note:'🌱 Регулярная практика важнее идеального старта.', shelf:'ТВОЯ УЧЕБНАЯ ПОЛКА', what:'Что будем изучать?', instructions:'Открой нужный раздел. После занятия отметь его выполненным — прогресс обновится автоматически.', search:'Найти занятие…', grammarDesc:'Изучай грамматику, разбирай правила и закрепляй знания на уроках.', listeningDesc:'Тренируй слух, слушай английскую речь и возвращайся к трудным моментам.', courseDesc:'Открывай материалы курса, смотри задания и выполняй работу в Google Classroom.', shadowDesc:'Повторяй за диктором, копируй произношение, ритм и интонацию английской речи.', telegramDesc:'Заглядывай в канал, чтобы оставаться на связи с материалами по английскому.', openLessons:'Открыть уроки', playlist1:'Плейлист 1', playlist2:'Открыть плейлист 2 →', classroom:'Открыть Classroom', openTelegram:'Открыть Telegram', done:'Готово', training:'Начать тренировку', practice:'Продолжить практику', materials:'Открыть новые материалы', markTraining:'Отметить тренировку выполненной', tip:'Как заниматься эффективно?', tipText:'Сначала прослушай фразу целиком. Затем включи её снова и повторяй вслух одновременно с диктором. Повтори сложные места 3–5 раз.', progressTitle:'Твой прогресс', progressDesc:'Отмечай разделы после занятия. Ты справляешься — продолжай!', completed:'разделов завершено', saved:'Прогресс сохраняется в этом браузере.', reset:'Сбросить прогресс', together:'Продолжим учиться вместе?', telegramInvite:'Открой канал Petrov English в Telegram.', footer:'Учись спокойно. Практикуйся регулярно. Замечай свой рост.'},
kk: {lessons:'Сабақтар', progress:'Прогресс', community:'Қауымдастық', start:'Оқуды бастау', eyebrow:'АҒЫЛШЫН ТІЛІН ҮЙРЕНУ ОРНЫ', title:'Ағылшын тілі|өз қарқыныңмен.', intro:'Барлық қажетті материал бір жерде жиналған. Сабақты таңдап, ашып, мақсатыңа қарай біртіндеп қадам жаса.', myLessons:'Менің сабақтарым', myProgress:'Менің прогресім', note:'🌱 Тұрақты жаттығу мінсіз бастаудан маңызды.', shelf:'СЕНІҢ ОҚУ СӨРЕҢ', what:'Нені үйренеміз?', instructions:'Қажетті бөлімді аш. Сабақтан кейін орындалды деп белгіле — прогресс автоматты түрде жаңарады.', search:'Сабақты іздеу…', grammarDesc:'Грамматиканы үйреніп, ережелерді түсініп, біліміңді бекіт.', listeningDesc:'Тыңдау қабілетіңді дамыт, ағылшын тілін тыңдап, қиын тұстарға қайта орал.', courseDesc:'Курс материалдарын ашып, тапсырмаларды қарап, Google Classroom жүйесінде орында.', shadowDesc:'Сөйлеушінің артынан қайталап, ағылшын тілінің айтылымын, ырғағы мен интонациясын меңгер.', telegramDesc:'Ағылшын тілі материалдарын алу үшін арнаға кіріп тұр.', openLessons:'Сабақтарды ашу', playlist1:'1-плейлист', playlist2:'2-плейлистті ашу →', classroom:'Classroom ашу', openTelegram:'Telegram ашу', done:'Дайын', training:'Жаттығуды бастау', practice:'Жаттығуды жалғастыру', materials:'Жаңа материалдар', markTraining:'Жаттығуды аяқталды деп белгілеу', tip:'Қалай тиімді жаттығуға болады?', tipText:'Алдымен сөйлемді толық тыңда. Содан кейін қайта қосып, диктормен бірге дауыстап қайтала. Қиын жерлерді 3–5 рет қайтала.', progressTitle:'Сенің прогресің', progressDesc:'Сабақтан кейін бөлімдерді белгіле. Жақсы келе жатырсың — жалғастыр!', completed:'бөлім аяқталды', saved:'Прогресс осы браузерде сақталады.', reset:'Прогресті тазарту', together:'Бірге оқуды жалғастырамыз ба?', telegramInvite:'Telegram-дағы Petrov English арнасын аш.', footer:'Асықпай үйрен. Үнемі жаттық. Өсуіңді байқа.'},
en: {lessons:'Lessons', progress:'Progress', community:'Community', start:'Start learning', eyebrow:'YOUR PLACE TO LEARN ENGLISH', title:'English|at your own pace.', intro:'All your learning materials in one cozy place. Choose a section, open a lesson, and move steadily toward your goal.', myLessons:'My lessons', myProgress:'My progress', note:'🌱 Regular practice matters more than a perfect start.', shelf:'YOUR LEARNING SHELF', what:'What shall we learn?', instructions:'Open a section. Mark it complete after studying and your progress will update automatically.', search:'Find a lesson…', grammarDesc:'Study grammar, understand the rules, and reinforce your knowledge.', listeningDesc:'Train your ear, listen to English, and revisit difficult parts.', courseDesc:'Open course materials, review tasks, and work in Google Classroom.', shadowDesc:'Repeat after the speaker and copy English pronunciation, rhythm, and intonation.', telegramDesc:'Visit the channel to keep up with English learning materials.', openLessons:'Open lessons', playlist1:'Playlist 1', playlist2:'Open playlist 2 →', classroom:'Open Classroom', openTelegram:'Open Telegram', done:'Done', training:'Start practice', practice:'Continue practicing', materials:'Explore materials', markTraining:'Mark practice as complete', tip:'How to practice effectively?', tipText:'Listen to the full phrase first. Play it again and speak along with the speaker. Repeat difficult parts 3–5 times.', progressTitle:'Your progress', progressDesc:'Mark sections after studying. You’re doing well — keep going!', completed:'sections completed', saved:'Progress is saved in this browser.', reset:'Reset progress', together:'Shall we keep learning together?', telegramInvite:'Open Petrov English on Telegram.', footer:'Learn calmly. Practice regularly. Notice your growth.'}
};
function setLanguage(lang) {
  const t = translations[lang] || translations.ru;
  document.documentElement.lang = lang === 'kk' ? 'kk' : lang;
  const put = (selector, value) => { const el = document.querySelector(selector); if (el && value) el.textContent = value; };
  const nav = document.querySelectorAll('#navLinks a'); ['lessons','progress','community'].forEach((k,i)=>{if(nav[i])nav[i].textContent=t[k]});
  put('.nav-cta',t.start+' ↗'); put('.eyebrow',t.eyebrow); put('.hero-copy h1',t.title.replace('|',' ')); put('.hero-copy > p',t.intro);
  const heroBtns=document.querySelectorAll('.hero-actions a'); if(heroBtns[0])heroBtns[0].textContent=t.myLessons+' ↓'; if(heroBtns[1])heroBtns[1].textContent=t.myProgress; put('.hero-note',t.note);
  put('.section-head .overline',t.shelf); put('.section-head h2',t.what); put('.section-head > p',t.instructions);
  const search=document.getElementById('courseSearch'); if(search)search.placeholder=t.search;
  const cards=document.querySelectorAll('.course-card');
  const descKeys=['grammarDesc','listeningDesc','courseDesc','shadowDesc','telegramDesc']; cards.forEach((c,i)=>{const p=c.querySelector('p');if(p)p.textContent=t[descKeys[i]]||p.textContent});
  const links=document.querySelectorAll('.course-card .course-bottom .text-link'); const labels=[t.openLessons,t.playlist1,t.classroom,t.openTelegram];
  links.forEach((a,i)=>{if(labels[i])a.textContent=labels[i]+' →'});
  document.querySelectorAll('.done').forEach(el=>{const input=el.querySelector('input'); if(input){el.lastChild.textContent=' '+t.done;}});
  const pl=document.querySelectorAll('.playlist-label strong'); pl.forEach((el,i)=>el.textContent=(lang==='kk'?`${i+1}-плейлист`:lang==='en'?`Playlist ${i+1}`:`Плейлист ${i+1}`));
  const small=document.querySelectorAll('.playlist-label small'); [t.training,t.practice,t.materials].forEach((s,i)=>{if(small[i])small[i].textContent=s});
  put('.shadowing-complete .done',t.markTraining); put('.study-tip summary',t.tip); put('.study-tip p',t.tipText);
  put('.progress-copy .overline',lang==='ru'?'МАЛЕНЬКИЕ ШАГИ — БОЛЬШОЙ РЕЗУЛЬТАТ':lang==='kk'?'КІШКЕНТАЙ ҚАДАМ — ҮЛКЕН НӘТИЖЕ':'SMALL STEPS — BIG RESULTS'); put('.progress-copy h2',t.progressTitle); put('.progress-copy p',t.progressDesc); put('.progress-count span',t.completed); put('.save-note',t.saved); put('.reset-progress',t.reset); put('.community h3',t.together); put('.community p',t.telegramInvite); put('.community .button',t.openTelegram+' ↗');
  const footer=document.querySelector('footer span:last-child'); if(footer)footer.textContent=t.footer;
  document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  try{localStorage.setItem('englishGardenLanguage',lang)}catch(e){}
}
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
try { setLanguage(localStorage.getItem('englishGardenLanguage') || 'ru'); } catch(e) { setLanguage('ru'); }
