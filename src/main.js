import './style.css'

// 직업/힌트/키워드 JobData
const jobData = {
  'movie director': {
    id: 'movie director',
    korean: '영화 감독',
    icon: '🎬',
    hints: ['create great movies', 'tell stories', 'lead the team'],
    keywords: ['movie director', 'director', '영화감독', '영화 감독'],
  },
  pilot: {
    id: 'pilot',
    korean: '비행기 조종사',
    icon: '✈️',
    hints: ['fly safely', 'travel the world', 'help passengers'],
    keywords: ['pilot', '비행기 조종사', '비행기', '파일럿'],
  },
  singer: {
    id: 'singer',
    korean: '가수',
    icon: '🎤',
    hints: ['sing songs', 'make people happy', 'perform on stage'],
    keywords: ['singer', '가수', '노래', '노래부르기'],
  },
  engineer: {
    id: 'engineer',
    korean: '기술자',
    icon: '🛠️',
    hints: ['build cool things', 'solve problems', 'design machines'],
    keywords: ['engineer', '기술자', '엔지니어', 'computer', 'coding'],
  },
  designer: {
    id: 'designer',
    korean: '디자이너',
    icon: '🎨',
    hints: ['draw ideas', 'make things pretty', 'create new styles'],
    keywords: ['designer', '디자이너', 'design', 'drawing', '그림'],
  },
  cook: {
    id: 'cook',
    korean: '요리사',
    icon: '👩‍🍳',
    hints: ['cook yummy food', 'try new recipes', 'serve customers'],
    keywords: ['cook', 'chef', '요리사', '요리', 'cooking'],
  },
  traveler: {
    id: 'traveler',
    korean: '여행가',
    icon: '🌍',
    hints: ['see new places', 'learn cultures', 'share stories'],
    keywords: ['traveler', '여행가', '여행', 'travel'],
  },
  scientist: {
    id: 'scientist',
    korean: '과학자',
    icon: '🔬',
    hints: ['do experiments', 'find answers', 'help the world'],
    keywords: ['scientist', '과학자', 'science', '실험'],
  },
  doctor: {
    id: 'doctor',
    korean: '의사',
    icon: '🩺',
    hints: ['help patients', 'study medicine', 'save lives'],
    keywords: ['doctor', '의사', '병원', 'hospital'],
  },
  baker: {
    id: 'baker',
    korean: '제빵사',
    icon: '🥐',
    hints: ['bake bread', 'make sweets', 'share warm food'],
    keywords: ['baker', '제빵사', 'bread', '빵', '베이커'],
  },
  firefighter: {
    id: 'firefighter',
    korean: '소방관',
    icon: '🚒',
    hints: ['put out fires', 'protect people', 'stay brave'],
    keywords: ['firefighter', '소방관', '불끄기', 'fire'],
  },
  'police officer': {
    id: 'police officer',
    korean: '경찰관',
    icon: '👮‍♀️',
    hints: ['keep people safe', 'help others', 'catch bad guys'],
    keywords: ['police officer', 'police', '경찰', '경찰관'],
  },
  painter: {
    id: 'painter',
    korean: '화가',
    icon: '🎨',
    hints: ['paint pictures', 'use colors', 'show feelings'],
    keywords: ['painter', '화가', '그림', 'painting'],
  },
  writer: {
    id: 'writer',
    korean: '작가',
    icon: '📚',
    hints: ['write stories', 'create characters', 'share ideas'],
    keywords: ['writer', '작가', '글쓰기', 'story'],
  },
  comedian: {
    id: 'comedian',
    korean: '코미디언',
    icon: '🤡',
    hints: ['make people laugh', 'tell funny jokes', 'perform on stage'],
    keywords: ['comedian', '코미디언', '개그맨', '웃기기'],
  },
  teacher: {
    id: 'teacher',
    korean: '선생님',
    icon: '📖',
    hints: ['teach students', 'work at school', 'give homework'],
    keywords: ['teacher', '선생님', '교사', '학교선생님', '학교'],
  },
}

// 관심사 기반 직업 추천 매핑
const careerRecommendations = {
  drawing: {
    job: 'designer',
    hints: ['draw pictures', 'make logos', 'use colors'],
    keywords: ['drawing', '그림', '그림 그리기', 'paint'],
  },
  game: {
    job: 'engineer',
    hints: ['make games', 'coding', 'fix computers'],
    keywords: ['game', '게임', 'gaming'],
  },
  helping: {
    job: 'doctor',
    hints: ['help sick people', 'work at hospital', 'save lives'],
    keywords: ['helping', '돕기', '도와주', '도움을 주고'],
  },
  animals: {
    job: 'scientist',
    hints: ['study animals', 'protect nature', 'do experiments'],
    keywords: ['animal', '동물', '강아지', '고양이'],
  },
}

const jobs = Object.values(jobData)

const apiKey = import.meta.env.VITE_OPENAI_API_KEY
const systemPrompt =
  [
    "너는 친절한 초등학교 진로 상담사야.",
    "항상 영어 문장 (한국어 번역) 형식으로 대답해. 예: 'What a cool dream! (정말 멋진 꿈이구나!)'.",
    "학생이 한국어로 말하면 'Oh, you want to be a [영어직업명]!'처럼 영어와 한국어를 자연스럽게 섞어서 반응해줘.",
    "질문은 한 번에 하나씩만 해. 예: 'What do you want to be?', 'Why?', 'What do you like to do?', 'When do you feel happy?' 중에서 하나만.",
    "학생이 같은 내용의 질문에 이미 답했다면, 똑같은 질문을 반복하지 말고 다음 단계의 질문을 해.",
    "학생이 '모르겠어', '몰라요', 'I don't know', 'idk'처럼 꿈을 모르겠다고 하면, 먼저 'That's totally fine! You have plenty of time to find your dream. (괜찮아! 꿈을 찾을 시간은 충분하단다.)'라고 따뜻하게 말해줘.",
    "그리고 바로 'What do you like to do? (너는 무엇을 하는 걸 좋아하니?)' 또는 'When do you feel happy? (언제 즐겁다고 느끼니?)'와 같이 학생의 관심사를 묻는 질문을 해.",
    "학생이 좋아하는 활동(예: drawing, game, helping people, animals 등)을 말하면, 그 활동과 연결될 수 있는 2~3개의 직업을 영어로 제안하고 한국어로 짧게 설명해줘. 예: 'You could be a designer, painter, or animator. (너는 디자이너, 화가, 애니메이터가 될 수도 있어.)'.",
    "학생에게 직업을 제안할 때는 항상 2~3개 정도를 함께 제안하고, 왜 어울리는지 간단히 설명해줘.",
    "학생이 진로와 상관없는 이야기를 하더라도 먼저 공감해주고, 한 문장 안에서 다시 장래희망/꿈/좋아하는 활동에 대한 영어 질문으로 대화를 자연스럽게 돌아오게 해.",
    "대화 맥락을 잘 기억해서, 바로 앞 10개의 메시지를 보고 자연스럽게 이어지는 답변을 해.",
  ].join(' ')

let activeTab = 'tab-word'
let selectedJob = jobs[0]?.id ?? ''
let currentJob = '' // 대화 맥락에서 파악한 직업
let chatHistory = []
let waiting = false
let isSearching = false // 꿈을 찾는 중인지 여부

const getActiveJobId = () => currentJob || selectedJob || jobs[0]?.id || ''

const unknownJobPatterns = [/모르겠/, /몰라/, /i don't know/i, /\bidk\b/i, /아이 돈 노/i]

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

const renderApp = () => {
  document.querySelector('#app').innerHTML = `
    <div class="app-shell">
      <header class="top-bar">
        <div>
          <div class="app-title">AI DREAM BOOTH ✨</div>
          <p class="app-sub">직업 영어 단어를 학습하고 AI 상담가와의 대화를 통해 나만의 드림 카드를 만들어봅시다.</p>
        </div>
        <div class="status-pill">${maskKey(apiKey)}</div>
      </header>

      <div class="tab-buttons">
        <button class="tab-btn active" data-tab="tab-word">1. Words</button>
        <button class="tab-btn" data-tab="tab-chat">2. Talk with AI</button>
        <button class="tab-btn" data-tab="tab-final">3. Make Dream Card</button>
      </div>

      <section class="tab-panel show" id="tab-word">
        <div class="panel-head">
          <div>
            <h2>Word Cards🎈</h2>
            <p>카드를 뒤집으며 여러가지 직업 관련 영어 단어와 한국어 뜻을 함께 알아봅시다!</p>
          </div>
        </div>
        <div class="card-grid">
          ${renderWordCards()}
        </div>
      </section>

      <section class="tab-panel" id="tab-chat">
        <div class="panel-head">
          <div>
            <h2>Let's Talk with AI🤖</h2>
            <p>AI 상담사에게 영어나 한국어로 꿈을 이야기해보세요!</p>
          </div>
        </div>

        <div class="chat-window">
          <div class="chat-log" id="chatLog">${renderChat()}</div>
        </div>

        <div class="chat-input">
          <textarea id="chatInput" rows="2" placeholder="AI 상담사와 대화를 시작해볼까요?"></textarea>
          <div class="chat-actions">
            <button id="sendBtn" class="primary-btn">전송하기 🚀</button>
          </div>
        </div>
      </section>

      <section class="tab-panel" id="tab-final">
        <div class="panel-head">
          <div>
            <h2>Make Your Dream Card🌟</h2>
            <p>영어 문장의 빈칸을 채워서 나만의 멋진 드림 카드를 만들어볼까요?</p>
          </div>
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
      currentJob = selectedJob
    })
  })

  document.getElementById('sendBtn').addEventListener('click', handleSend)
  document.getElementById('chatInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
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
}

const flashJobHighlight = (jobId) => {
  const chip = document.querySelector(`.job-chip[data-job="${jobId}"]`)
  const card = document.querySelector(`.word-card[data-word="${jobId}"]`)
  ;[chip, card].forEach((el) => {
    if (!el) return
    el.classList.add('flash-job')
    setTimeout(() => el.classList.remove('flash-job'), 1300)
  })
}

const detectJobFromText = (text) => {
  if (!text) return ''
  const lower = text.toLowerCase()

  // "Oh, you want to be a/an XXX!" 패턴 우선
  const ohMatch = lower.match(/oh[,! ]+\s*you\s+want\s+to\s+be\s+a?n?\s+([^!.?\n]+)/i)
  if (ohMatch && ohMatch[1]) {
    const raw = ohMatch[1].trim()
    const foundFromOh = Object.values(jobData).find((job) =>
      job.id.toLowerCase() === raw || job.keywords?.some((k) => raw.includes(k.toLowerCase())),
    )
    if (foundFromOh) return foundFromOh.id
  }

  // 일반 키워드 검사
  for (const job of Object.values(jobData)) {
    if (job.keywords?.some((k) => lower.includes(k.toLowerCase()))) {
      return job.id
    }
  }
  return ''
}

const detectInterestToJob = (text) => {
  if (!text) return ''
  const lower = text.toLowerCase()
  for (const key of Object.keys(careerRecommendations)) {
    const rec = careerRecommendations[key]
    if (rec.keywords?.some((k) => lower.includes(k.toLowerCase()))) {
      // 추천용 힌트로 덮어쓰기
      if (jobData[rec.job]) {
        jobData[rec.job].hints = rec.hints
      }
      return jobData[rec.job]?.id || ''
    }
  }
  return ''
}

const refreshChatLog = () => {
  const chatLog = document.getElementById('chatLog')
  chatLog.innerHTML = renderChat()
  chatLog.scrollTop = chatLog.scrollHeight
}

const handleSend = async () => {
  const input = document.getElementById('chatInput')
  const text = input.value.trim()
  if (!text || waiting) return

  const lowerText = text.toLowerCase()
  if (unknownJobPatterns.some((re) => re.test(lowerText))) {
    isSearching = true
    currentJob = ''
  } else {
    const fromUserJob = detectJobFromText(text)
    if (fromUserJob) {
      currentJob = fromUserJob
      selectedJob = fromUserJob
      flashJobHighlight(fromUserJob)
    } else if (isSearching && !currentJob) {
      const recJob = detectInterestToJob(text)
      if (recJob) {
        currentJob = recJob
        selectedJob = recJob
        flashJobHighlight(recJob)
      }
    }
  }

  // 전체 히스토리에 추가
  chatHistory.push({ role: 'user', content: text })
  input.value = ''
  waiting = true
  refreshChatLog()

  try {
    if (!apiKey) throw new Error('API Key가 설정되지 않았어요')

    // 최근 10개의 메시지만 사용해 컨텍스트 윈도우 구성
    const recentMessages = chatHistory.slice(-10)

    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `${systemPrompt} 현재 파악된 학생 직업: ${getActiveJobId() || '아직 없음'}. 학생이 꿈을 모르겠다고 한 상태인지(isSearching): ${
            isSearching ? 'yes' : 'no'
          }. 이 정보를 참고해서 대화를 이어가 주세요.`,
        },
        ...recentMessages,
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
    const fromAssistantJob = detectJobFromText(reply)
    if (fromAssistantJob) {
      currentJob = fromAssistantJob
      selectedJob = fromAssistantJob
      flashJobHighlight(fromAssistantJob)
    }
  } catch (err) {
    chatHistory.push({ role: 'assistant', content: `⚠️ 오류: ${err.message}` })
  } finally {
    waiting = false
    refreshChatLog()
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
