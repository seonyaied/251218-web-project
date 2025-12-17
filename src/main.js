import './style.css'

const jobs = [
  { id: 'movie director', korean: '영화 감독', icon: '🎬', hints: ['create great movies', 'tell stories', 'lead the team'] },
  { id: 'pilot', korean: '조종사', icon: '✈️', hints: ['fly safely', 'travel the world', 'help passengers'] },
  { id: 'singer', korean: '가수', icon: '🎤', hints: ['sing songs', 'make people happy', 'perform on stage'] },
  { id: 'engineer', korean: '엔지니어', icon: '🛠️', hints: ['build cool things', 'solve problems', 'design machines'] },
  { id: 'designer', korean: '디자이너', icon: '🎨', hints: ['draw ideas', 'make things pretty', 'create new styles'] },
  { id: 'cook', korean: '요리사', icon: '👩‍🍳', hints: ['cook yummy food', 'try new recipes', 'serve customers'] },
  { id: 'traveler', korean: '여행가', icon: '🌍', hints: ['see new places', 'learn cultures', 'share stories'] },
  { id: 'scientist', korean: '과학자', icon: '🔬', hints: ['do experiments', 'find answers', 'help the world'] },
  { id: 'doctor', korean: '의사', icon: '🩺', hints: ['help patients', 'study medicine', 'save lives'] },
  { id: 'baker', korean: '제빵사', icon: '🥐', hints: ['bake bread', 'make sweets', 'share warm food'] },
  { id: 'firefighter', korean: '소방관', icon: '🚒', hints: ['put out fires', 'protect people', 'stay brave'] },
  { id: 'police officer', korean: '경찰관', icon: '👮‍♀️', hints: ['keep people safe', 'help others', 'catch bad guys'] },
]

const apiKey = import.meta.env.VITE_OPENAI_API_KEY
const systemPrompt =
  "너는 친절한 초등학교 진로 상담사야. 학생이 한국어로 말하면 'Oh, you want to be a [영어단어]!'라고 호응하며 영어를 섞어 대답해줘. 질문은 한 번에 하나씩(What do you want to be? / Why?)만 해줘."

let activeTab = 'tab-word'
let selectedJob = jobs[0]?.id ?? ''
let chatHistory = []
let waiting = false
let hintVisible = false

const maskKey = (key) => {
  if (!key) return '❌ API Key가 설정되지 않았어요'
  const tail = key.slice(-4)
  return `✅ API Key 연결됨 (...${tail})`
}

const renderWordCards = () =>
  jobs
    .map(
      (job) => `
    <div class="word-card" data-word="${job.id}">
      <div class="card-inner">
        <div class="card-face card-front">
          <span class="word-emoji">${job.icon}</span>
          <div class="word-text">${job.id}</div>
          <div class="word-sub">Tap to flip</div>
        </div>
        <div class="card-face card-back">
          <div class="word-emoji">${job.icon}</div>
          <div class="word-ko">${job.korean}</div>
          <div class="word-en">${job.id}</div>
        </div>
      </div>
    </div>`
    )
    .join('')

const renderChat = () =>
  chatHistory
    .map(
      (m) => `
    <div class="chat-row ${m.role === 'user' ? 'me' : 'bot'}">
      <div class="chat-bubble">
        ${m.content.replace(/\n/g, '<br/>')}
      </div>
    </div>`
    )
    .join('') + (waiting ? '<div class="chat-row bot"><div class="chat-bubble typing">🤖 생각 중...</div></div>' : '')

const renderHintButtons = () => {
  const job = jobs.find((j) => j.id === selectedJob)
  if (!job) return ''
  return job.hints
    .map(
      (h) => `<button class="hint-chip" data-hint="${h}">${h}</button>`
    )
    .join('')
}

const renderApp = () => {
  document.querySelector('#app').innerHTML = `
    <div class="app-shell">
      <header class="top-bar">
        <div>
          <div class="app-title">꿈나무 커리어 챗봇 ✨</div>
          <p class="app-sub">파스텔 톤으로 즐기는 단어 학습 & AI 진로 상담</p>
        </div>
        <div class="status-pill">${maskKey(apiKey)}</div>
      </header>

      <div class="tab-buttons">
        <button class="tab-btn active" data-tab="tab-word">1. 단어 학습</button>
        <button class="tab-btn" data-tab="tab-chat">2. AI 진로 상담</button>
        <button class="tab-btn" data-tab="tab-final">3. 나의 꿈 소개</button>
      </div>

      <section class="tab-panel show" id="tab-word">
        <div class="panel-head">
          <div>
            <h2>Word Cards 🎈</h2>
            <p>카드를 탭해 영어 단어와 뜻을 함께 외워요!</p>
          </div>
          <div class="mini-note">선택된 직업은 채팅 탭의 힌트에 활용돼요.</div>
        </div>
        <div class="card-grid">
          ${renderWordCards()}
        </div>
      </section>

      <section class="tab-panel" id="tab-chat">
        <div class="panel-head">
          <div>
            <h2>AI 진로 상담 🤖</h2>
            <p>친절한 상담사에게 영어+한국어로 꿈을 이야기해보세요.</p>
          </div>
          <div class="mini-note accent">마지막 질문에 "What do you want to do?"가 나오면 힌트 버튼을 눌러보세요!</div>
        </div>

        <div class="selector-box">
          <div class="selector-title">나의 꿈 선택하기</div>
          <div class="selector-chips">
            ${jobs
              .map(
                (job) => `<button class="job-chip ${job.id === selectedJob ? 'on' : ''}" data-job="${job.id}">${job.icon} ${job.id}</button>`
              )
              .join('')}
          </div>
        </div>

        <div class="chat-window">
          <div class="chat-log" id="chatLog">${renderChat()}</div>
          <div class="hint-box ${hintVisible ? 'show' : ''}" id="hintBox">
            <div class="hint-title">힌트 버튼 🎯</div>
            <div class="hint-desc">버튼을 눌러 짧은 영어 표현을 입력창에 넣어요.</div>
            <div class="hint-chips" id="hintButtons">${renderHintButtons()}</div>
          </div>
        </div>

        <div class="chat-input">
          <textarea id="chatInput" rows="2" placeholder="상담사에게 하고 싶은 말을 적어보세요. 영어/한국어 모두 좋아요!"></textarea>
          <div class="chat-actions">
            <button id="hintToggle" class="ghost-btn">힌트 보기</button>
            <button id="sendBtn" class="primary-btn">전송하기 🚀</button>
          </div>
          <div class="tiny-note">채팅 맥락이 유지돼요. API Key가 없으면 전송이 실패할 수 있어요.</div>
        </div>
      </section>

      <section class="tab-panel" id="tab-final">
        <div class="panel-head">
          <div>
            <h2>나의 꿈 소개 🌟</h2>
            <p>세 문장을 채워서 멋진 카드로 완성해요.</p>
          </div>
          <div class="mini-note">완성 후 PNG로 저장하거나 캡처해 보관해요.</div>
        </div>
        <form id="missionForm" class="mission-form">
          <label>1) I want to be a/an
            <input required name="dream" placeholder="doctor, designer, ...">
          </label>
          <label>2) Because I like
            <input required name="reason" placeholder="helping people, creating things, ...">
          </label>
          <label>3) I want to
            <input required name="goal" placeholder="keep people safe, make new games, ...">
          </label>
          <div class="mission-actions">
            <button type="submit" class="primary-btn">카드 완성 ✨</button>
            <button type="button" id="saveCard" class="ghost-btn">PNG로 저장 📸</button>
          </div>
        </form>
        <div class="mission-preview" id="missionPreview">
          <div class="preview-card" id="previewCard">
            <div class="preview-title">My Dream Card</div>
            <ul class="preview-lines">
              <li id="line1">I want to be a/an ______.</li>
              <li id="line2">Because I like ______.</li>
              <li id="line3">I want to ______.</li>
            </ul>
            <div class="preview-footer">You can do it! 💛</div>
          </div>
        </div>
      </section>
    </div>
  `
}

const activateTab = (tabId) => {
  activeTab = tabId
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabId)
  })
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('show', panel.id === tabId)
  })
}

const attachEvents = () => {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab))
  })

  document.querySelectorAll('.word-card').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped')
      selectedJob = card.dataset.word
      syncJobSelection()
    })
  })

  document.querySelectorAll('.job-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      selectedJob = chip.dataset.job
      syncJobSelection()
      refreshHints()
    })
  })

  document.getElementById('sendBtn').addEventListener('click', handleSend)
  document.getElementById('chatInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  })

  document.getElementById('hintToggle').addEventListener('click', () => {
    hintVisible = !hintVisible
    refreshHints()
  })

  document.getElementById('missionForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const form = e.target
    const dream = form.dream.value.trim()
    const reason = form.reason.value.trim()
    const goal = form.goal.value.trim()
    if (!dream || !reason || !goal) return
    document.getElementById('line1').textContent = `I want to be a/an ${dream}.`
    document.getElementById('line2').textContent = `Because I like ${reason}.`
    document.getElementById('line3').textContent = `I want to ${goal}.`
  })

  document.getElementById('saveCard').addEventListener('click', saveCardAsImage)

  bindHintClicks()
}

const syncJobSelection = () => {
  document.querySelectorAll('.job-chip').forEach((chip) => {
    chip.classList.toggle('on', chip.dataset.job === selectedJob)
  })
}

const refreshChatLog = () => {
  const chatLog = document.getElementById('chatLog')
  chatLog.innerHTML = renderChat()
  chatLog.scrollTop = chatLog.scrollHeight
}

const refreshHints = () => {
  const hintBox = document.getElementById('hintBox')
  const hintButtons = document.getElementById('hintButtons')
  if (!hintBox || !hintButtons) return
  hintBox.classList.toggle('show', hintVisible)
  hintButtons.innerHTML = renderHintButtons()
  bindHintClicks()
}

const bindHintClicks = () => {
  document.querySelectorAll('.hint-chip').forEach((btn) => {
    btn.onclick = () => {
      const input = document.getElementById('chatInput')
      const text = btn.dataset.hint
      input.value = input.value ? `${input.value} ${text}` : text
      input.focus()
    }
  })
}

const handleSend = async () => {
  const input = document.getElementById('chatInput')
  const text = input.value.trim()
  if (!text || waiting) return

  chatHistory.push({ role: 'user', content: text })
  input.value = ''
  waiting = true
  refreshChatLog()

  try {
    if (!apiKey) throw new Error('API Key가 설정되지 않았어요')
    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `${systemPrompt} 선택된 직업: ${selectedJob || '없음'}` },
        ...chatHistory,
      ],
      temperature: 0.7,
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || 'API 호출 실패')
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content?.trim() || '답변을 불러오지 못했어요.'
    chatHistory.push({ role: 'assistant', content: reply })
    hintVisible = /what do you want to do\??/i.test(reply)
  } catch (err) {
    chatHistory.push({ role: 'assistant', content: `⚠️ 오류: ${err.message}` })
  } finally {
    waiting = false
    refreshChatLog()
    refreshHints()
  }
}

const ensureHtml2Canvas = () =>
  new Promise((resolve, reject) => {
    if (window.html2canvas) return resolve(window.html2canvas)
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
    script.onload = () => resolve(window.html2canvas)
    script.onerror = () => reject(new Error('html2canvas를 불러오지 못했어요'))
    document.body.appendChild(script)
  })

const saveCardAsImage = async () => {
  const card = document.getElementById('previewCard')
  if (!card) return
  try {
    const html2canvas = await ensureHtml2Canvas()
    const canvas = await html2canvas(card, { backgroundColor: null })
    const link = document.createElement('a')
    link.download = 'my-dream-card.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    alert('이미지 저장 중 문제가 발생했어요. 다시 시도해 주세요.')
  }
}

renderApp()
attachEvents()
refreshChatLog()
refreshHints()
