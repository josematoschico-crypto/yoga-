export const P = {
  cel:"#87CEEB", celD:"#4A9CC8",
  brn:"#6B3F2A", brnL:"#A0632A",
  lil:"#C8A2C8", lilD:"#9B72CF",
  trq:"#2EC4B6", trqD:"#1A9E92",
  grn:"#22C55E", red:"#E5534B", gld:"#D4A843",
  blue: "#00AEEF",
};

export const TH = {
  light:{ bg:"#F8FAFC",
    card:"#fff", cardAlt:"#F8F4FE", text:"#1A0A00", sec:"#64748B",
    brd:"#E2E8F0", shd:"0 4px 24px rgba(0,0,0,.06)",
    nav:"rgba(255,255,255,.98)", inp:"#F8F5FF" },
  dark:{ bg:"#0F172A",
    card:"#1E293B", cardAlt:"#334155", text:"#F1F5F9", sec:"#94A3B8",
    brd:"#334155", shd:"0 4px 24px rgba(0,0,0,.3)",
    nav:"rgba(15,23,42,.98)", inp:"#1E293B" },
};

export const POSES = [
  { 
    id: 1, 
    name: "Tadasana", 
    emoji: "🏔️", 
    title: "Postura da Montanha", 
    desc: "A base de todas as posturas em pé. Melhora a postura e o equilíbrio.", 
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    level: "Iniciante",
    time: "1 - 2 min",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/24/audio_7740671196.mp3",
    instructions: [
      "Fique em pé com os pés juntos ou levemente afastados.",
      "Distribua o peso igualmente em ambas as solas dos pés.",
      "Mantenha as coxas firmes e os joelhos levemente soltos.",
      "Alongue a coluna e relaxe os ombros para baixo e para trás.",
      "Mantenha os braços ao lado do corpo com as palmas voltadas para frente.",
      "Respire profundamente e sinta a estabilidade como uma montanha."
    ],
    benefits: ["Melhora a postura", "Fortalece coxas e joelhos", "Alivia a ciática", "Reduz o pé chato"]
  },
  { 
    id: 2, 
    name: "Adho Mukha Svanasana", 
    emoji: "🐕", 
    title: "Cachorro Olhando para Baixo", 
    desc: "Alonga a coluna e fortalece os braços e pernas.", 
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    level: "Iniciante",
    time: "1 - 3 min",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/21/audio_31743c5868.mp3",
    instructions: [
      "Comece em quatro apoios, com as mãos sob os ombros e joelhos sob os quadris.",
      "Expire e levante os joelhos do chão, empurrando o quadril para cima.",
      "Mantenha os braços esticados e a cabeça entre os braços.",
      "Tente encostar os calcanhares no chão, se possível.",
      "Mantenha as pernas firmes e a coluna bem alongada.",
      "Olhe em direção ao seu umbigo ou entre as pernas."
    ],
    benefits: ["Energiza o corpo", "Alonga ombros e pernas", "Fortalece braços", "Melhora a digestão"]
  },
  { 
    id: 3, 
    name: "Virabhadrasana I", 
    emoji: "⚔️", 
    title: "Guerreiro I", 
    desc: "Fortalece as pernas e abre o peito e os quadris.", 
    img: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800",
    level: "Iniciante",
    time: "30s - 1 min cada lado",
    audioUrl: "https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02f9.mp3",
    instructions: [
      "Dê um grande passo à frente com o pé direito.",
      "O pé traseiro fica a 45 graus para fora.",
      "Dobre o joelho da frente formando 90 graus.",
      "Eleve os braços acima da cabeça, palmas se tocando.",
      "Olhe para cima em direção às mãos.",
      "Mantenha o quadril voltado para frente."
    ],
    benefits: ["Fortalece pernas e glúteos", "Abre ombros e peito", "Melhora equilíbrio", "Aumenta foco"]
  },
  { 
    id: 4, 
    name: "Vrikshasana", 
    emoji: "🌳", 
    title: "Postura da Árvore", 
    desc: "Desenvolve equilíbrio físico e mental.", 
    img: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800",
    level: "Iniciante",
    time: "1 min cada lado",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6ff1bab.mp3",
    instructions: [
      "Fique em pé na postura da montanha (Tadasana).",
      "Transfira o peso para o pé esquerdo.",
      "Coloque a sola do pé direito na parte interna da coxa esquerda.",
      "Evite colocar o pé diretamente sobre o joelho.",
      "Junte as mãos em frente ao peito em posição de prece.",
      "Fixe o olhar em um ponto à sua frente para manter o equilíbrio."
    ],
    benefits: ["Melhora o equilíbrio", "Fortalece pernas e tornozelos", "Alonga a parte interna da coxa", "Aumenta a concentração"]
  },
  { 
    id: 5, 
    name: "Balasana", 
    emoji: "👶", 
    title: "Postura da Criança", 
    desc: "Uma postura de descanso que acalma a mente e relaxa as costas.", 
    img: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800",
    level: "Iniciante",
    time: "1 - 5 min",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a7315b.mp3",
    instructions: [
      "Ajoelhe-se no chão com os dedões dos pés se tocando.",
      "Sente-se sobre os calcanhares e afaste os joelhos na largura do quadril.",
      "Expire e incline o tronco para frente entre as coxas.",
      "Descanse a testa no chão.",
      "Estenda os braços para frente ou coloque-os ao lado do corpo.",
      "Sinta o alongamento suave nas costas e relaxe completamente."
    ],
    benefits: ["Alivia o estresse e fadiga", "Alonga suavemente quadris e coxas", "Acalma o cérebro", "Alivia dores nas costas"]
  },
  { 
    id: 6, 
    name: "Bhujangasana", 
    emoji: "🐍", 
    title: "Postura da Cobra", 
    desc: "Fortalece a coluna e abre o peito.", 
    img: "https://images.unsplash.com/photo-1510894347713-fc3ad6cb0d4d?w=800",
    level: "Iniciante",
    time: "15 - 30s",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030c.mp3",
    instructions: [
      "Deite-se de bruços com as pernas esticadas.",
      "Coloque as mãos no chão sob os ombros.",
      "Mantenha os cotovelos próximos ao corpo.",
      "Inspire e comece a endireitar os braços para levantar o peito.",
      "Mantenha o osso púbico em contato com o chão.",
      "Olhe levemente para cima sem forçar o pescoço."
    ],
    benefits: ["Fortalece a coluna", "Abre o peito e pulmões", "Estimula órgãos abdominais", "Ajuda a aliviar o estresse"]
  },
  { 
    id: 7, 
    name: "Sukhasana", 
    emoji: "🧘", 
    title: "Postura Fácil", 
    desc: "Ideal para meditação e exercícios de respiração.", 
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    level: "Iniciante",
    time: "Indeterminado",
    audioUrl: "https://cdn.pixabay.com/audio/2022/07/25/audio_3266b4779b.mp3",
    instructions: [
      "Sente-se no chão com as pernas cruzadas.",
      "Mantenha a coluna ereta e o topo da cabeça voltado para o teto.",
      "Descanse as mãos sobre os joelhos, palmas para cima ou para baixo.",
      "Relaxe os ombros e o rosto.",
      "Feche os olhos e foque na sua respiração.",
      "Mantenha a postura o tempo que for confortável."
    ],
    benefits: ["Acalma a mente", "Fortalece as costas", "Alonga joelhos e tornozelos", "Promove paz interior"]
  },
  { 
    id: 8, 
    name: "Shavasana", 
    emoji: "💤", 
    title: "Postura do Cadáver", 
    desc: "Relaxamento total do corpo e da mente.", 
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
    level: "Iniciante",
    time: "5 - 10 min",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/02/audio_8845896057.mp3",
    instructions: [
      "Deite-se de costas no chão.",
      "Afaste levemente as pernas e deixe os pés caírem para os lados.",
      "Coloque os braços ao lado do corpo, palmas voltadas para cima.",
      "Feche os olhos e relaxe cada músculo do corpo.",
      "Deixe a respiração fluir naturalmente, sem controle.",
      "Permaneça em silêncio e imobilidade total."
    ],
    benefits: ["Acalma o sistema nervoso", "Reduz a pressão arterial", "Alivia dores de cabeça", "Combate a insônia"]
  },
  { 
    id: 9, 
    name: "Utkatasana", 
    emoji: "🪑", 
    title: "Postura da Cadeira", 
    desc: "Fortalece as pernas e o core, gerando calor interno.", 
    img: "https://images.unsplash.com/photo-1573590330099-d6c7355ec595?w=800",
    level: "Iniciante",
    time: "30s - 1 min",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6ff1bab.mp3",
    instructions: [
      "Fique em pé com os pés juntos.",
      "Inspire e eleve os braços acima da cabeça.",
      "Expire e dobre os joelhos, como se fosse sentar em uma cadeira invisível.",
      "Mantenha o peso nos calcanhares.",
      "Alongue a coluna e mantenha o peito aberto.",
      "Mantenha as coxas o mais paralelo possível ao chão."
    ],
    benefits: ["Fortalece coxas e tornozelos", "Tonifica ombros e costas", "Estimula o coração", "Reduz o pé chato"]
  },
  { 
    id: 10, 
    name: "Virabhadrasana II", 
    emoji: "🏹", 
    title: "Guerreiro II", 
    desc: "Aumenta a resistência e o foco, abrindo os quadris.", 
    img: "https://images.unsplash.com/photo-1510894347713-fc3ad6cb0d4d?w=800",
    level: "Iniciante",
    time: "1 min cada lado",
    audioUrl: "https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02f9.mp3",
    instructions: [
      "Afaste as pernas lateralmente (cerca de 1,20m).",
      "Gire o pé direito 90 graus para fora e o esquerdo levemente para dentro.",
      "Dobre o joelho direito sobre o tornozelo direito.",
      "Estenda os braços lateralmente na altura dos ombros.",
      "Olhe por cima da mão direita.",
      "Mantenha o tronco centralizado, sem inclinar para frente."
    ],
    benefits: ["Fortalece pernas e braços", "Alonga coxas e virilhas", "Aumenta a resistência", "Alivia dores nas costas"]
  },
  { 
    id: 11, 
    name: "Trikonasana", 
    emoji: "📐", 
    title: "Postura do Triângulo", 
    desc: "Alonga todo o corpo e melhora a flexibilidade lateral.", 
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    level: "Iniciante",
    time: "45s cada lado",
    audioUrl: "https://cdn.pixabay.com/audio/2022/07/25/audio_3266b4779b.mp3",
    instructions: [
      "Afaste as pernas e posicione os pés como no Guerreiro II.",
      "Mantenha ambas as pernas esticadas.",
      "Incline o tronco para a direita, alcançando a canela ou o chão.",
      "Estenda o braço esquerdo em direção ao teto.",
      "Olhe para a mão esquerda se for confortável para o pescoço.",
      "Mantenha o corpo em um único plano, como se estivesse entre duas paredes."
    ],
    benefits: ["Alonga quadris e coluna", "Melhora a digestão", "Reduz a ansiedade", "Fortalece as pernas"]
  },
  { 
    id: 12, 
    name: "Uttanasana", 
    emoji: "🧘‍♂️", 
    title: "Flexão para Frente", 
    desc: "Acalma o sistema nervoso e alonga os isquiotibiais.", 
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    level: "Iniciante",
    time: "1 - 2 min",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/21/audio_31743c5868.mp3",
    instructions: [
      "Fique em pé em Tadasana.",
      "Expire e dobre-se para frente a partir dos quadris.",
      "Mantenha os joelhos levemente dobrados se necessário.",
      "Tente tocar o chão com as mãos ou segure os cotovelos opostos.",
      "Deixe a cabeça pendurar pesada, relaxando o pescoço.",
      "Sinta o alongamento em toda a parte posterior das pernas."
    ],
    benefits: ["Acalma o cérebro", "Alivia o estresse", "Estimula fígado e rins", "Alonga panturrilhas e quadris"]
  },
  { 
    id: 13, 
    name: "Setu Bandhasana", 
    emoji: "🌉", 
    title: "Postura da Ponte", 
    desc: "Abre o peito e fortalece as costas e glúteos.", 
    img: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800",
    level: "Iniciante",
    time: "30s - 1 min",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a7315b.mp3",
    instructions: [
      "Deite-se de costas com os joelhos dobrados e pés no chão.",
      "Mantenha os pés na largura do quadril e próximos aos glúteos.",
      "Expire e levante o quadril em direção ao teto.",
      "Entrelace as mãos sob as costas e role os ombros para dentro.",
      "Mantenha as coxas paralelas entre si.",
      "Respire profundamente, expandindo o peito."
    ],
    benefits: ["Alonga o peito e pescoço", "Fortalece a coluna", "Melhora a digestão", "Reduz a fadiga"]
  },
  { 
    id: 14, 
    name: "Anjaneyasana", 
    emoji: "🌙", 
    title: "Estocada Baixa", 
    desc: "Alonga profundamente os flexores do quadril.", 
    img: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800",
    level: "Iniciante",
    time: "1 min cada lado",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/24/audio_7740671196.mp3",
    instructions: [
      "A partir do Cachorro Olhando para Baixo, dê um passo à frente com o pé direito.",
      "Abaixe o joelho esquerdo no chão.",
      "Inspire e eleve o tronco, levando os braços para cima.",
      "Incline o quadril para frente suavemente.",
      "Mantenha o joelho da frente alinhado com o tornozelo.",
      "Olhe para cima ou para frente, abrindo o coração."
    ],
    benefits: ["Alonga flexores do quadril", "Fortalece pernas", "Aumenta a energia", "Melhora o equilíbrio"]
  },
  { 
    id: 15, 
    name: "Marjaryasana-Bitilasana", 
    emoji: "🐈", 
    title: "Gato-Vaca", 
    desc: "Mobiliza a coluna e sincroniza movimento com respiração.", 
    img: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800",
    level: "Iniciante",
    time: "1 - 2 min",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030c.mp3",
    instructions: [
      "Comece em quatro apoios (mãos e joelhos).",
      "Inspire, arqueie as costas e olhe para cima (Vaca).",
      "Expire, arredonde as costas e olhe para o umbigo (Gato).",
      "Mova-se no ritmo da sua respiração.",
      "Sinta cada vértebra se movendo.",
      "Mantenha os braços esticados durante todo o movimento."
    ],
    benefits: ["Aumenta a flexibilidade da coluna", "Acalma a mente", "Massageia órgãos abdominais", "Alivia dores nas costas"]
  },
  { 
    id: 16, 
    name: "Paschimottanasana", 
    emoji: "🧘‍♀️", 
    title: "Flexão Sentada", 
    desc: "Alonga intensamente a parte posterior do corpo.", 
    img: "https://images.unsplash.com/photo-1510894347713-fc3ad6cb0d4d?w=800",
    level: "Iniciante",
    time: "2 - 3 min",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/02/audio_8845896057.mp3",
    instructions: [
      "Sente-se com as pernas esticadas à frente.",
      "Inspire e alongue a coluna, elevando os braços.",
      "Expire e incline-se para frente a partir dos quadris.",
      "Segure os pés, canelas ou use uma faixa.",
      "Mantenha o pescoço relaxado e os ombros longe das orelhas.",
      "A cada expiração, tente descer um pouco mais."
    ],
    benefits: ["Alonga isquiotibiais e coluna", "Acalma o sistema nervoso", "Melhora a digestão", "Alivia sintomas de estresse"]
  },
  { 
    id: 17, 
    name: "Chaturanga Dandasana", 
    emoji: "🐊", 
    title: "Prancha Baixa", 
    desc: "Fortalece braços, ombros e core. Essencial para a Saudação ao Sol.", 
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    level: "Intermediário",
    time: "10 - 30s",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/24/audio_7740671196.mp3",
    instructions: [
      "Comece em uma prancha alta.",
      "Desça o corpo em linha reta, dobrando os cotovelos.",
      "Mantenha os cotovelos colados às costelas.",
      "Não deixe o quadril cair ou subir demais.",
      "Mantenha o olhar levemente à frente no chão.",
      "O corpo deve ficar paralelo ao chão."
    ],
    benefits: ["Fortalece braços e pulsos", "Tonifica o abdômen", "Prepara para equilíbrios de braço", "Melhora a postura"]
  },
  { 
    id: 18, 
    name: "Baddha Konasana", 
    emoji: "🦋", 
    title: "Postura da Borboleta", 
    desc: "Abre os quadris e melhora a flexibilidade da virilha.", 
    img: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800",
    level: "Iniciante",
    time: "2 - 5 min",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030c.mp3",
    instructions: [
      "Sente-se com as pernas esticadas.",
      "Dobre os joelhos e junte as solas dos pés.",
      "Traga os calcanhares o mais próximo possível da pelve.",
      "Segure os pés ou tornozelos.",
      "Mantenha a coluna ereta e os ombros relaxados.",
      "Deixe os joelhos caírem suavemente para os lados."
    ],
    benefits: ["Abre quadris e virilhas", "Estimula órgãos abdominais", "Alivia o estresse", "Melhora a circulação pélvica"]
  },
  { 
    id: 19, 
    name: "Malasana", 
    emoji: "🧘", 
    title: "Agachamento Yoga", 
    desc: "Um agachamento profundo que abre os quadris e alonga a lombar.", 
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    level: "Iniciante",
    time: "1 - 3 min",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/21/audio_31743c5868.mp3",
    instructions: [
      "Fique em pé com os pés um pouco mais largos que os quadris.",
      "Aponte os dedos dos pés levemente para fora.",
      "Agache-se profundamente, mantendo os calcanhares no chão.",
      "Traga os cotovelos para dentro dos joelhos.",
      "Junte as mãos em prece no centro do peito.",
      "Alongue a coluna e abra o peito."
    ],
    benefits: ["Alonga tornozelos e virilhas", "Melhora a digestão", "Tonifica o abdômen", "Alivia dores lombares"]
  },
  { 
    id: 20, 
    name: "Navasana", 
    emoji: "🛶", 
    title: "Postura do Barco", 
    desc: "Fortalece intensamente o abdômen e os flexores do quadril.", 
    img: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800",
    level: "Intermediário",
    time: "30s - 1 min",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6ff1bab.mp3",
    instructions: [
      "Sente-se com os joelhos dobrados e pés no chão.",
      "Incline o tronco levemente para trás.",
      "Levante os pés do chão, equilibrando-se nos ísquios.",
      "Estique as pernas se possível, formando um 'V'.",
      "Estenda os braços para frente, paralelos ao chão.",
      "Mantenha o peito aberto e a coluna reta."
    ],
    benefits: ["Fortalece o core", "Melhora o equilíbrio", "Estimula rins e intestinos", "Aumenta a confiança"]
  },
];

export const MEDITATIONS = [
  { 
    id: 1, 
    title: "Respiração Consciente", 
    desc: "A técnica mais fundamental da meditação. Foca toda a atenção no ciclo natural da respiração para ancorar a mente no momento presente.", 
    min: 5, 
    level: "Iniciante", 
    category: "Respiração",
    audioInfo: "Silêncio ou sons da natureza",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/24/audio_7740671196.mp3", 
    emoji: "🌬️",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    instructions: [
      "Sente-se confortavelmente com a coluna ereta.",
      "Feche os olhos suavemente e relaxe os ombros.",
      "Leve sua atenção para a entrada e saída do ar pelas narinas.",
      "Não tente controlar a respiração, apenas observe seu ritmo natural.",
      "Quando a mente divagar, gentilmente traga-a de volta para a respiração.",
      "Sinta o abdômen expandir na inspiração e contrair na expiração."
    ],
    benefits: ["Reduz ansiedade imediata", "Melhora o foco", "Acalma o sistema nervoso", "Aumenta a consciência corporal"]
  },
  { 
    id: 2, 
    title: "Escaneamento Corporal", 
    desc: "Técnica de relaxamento profundo que percorre cada parte do corpo progressivamente, liberando tensão física e mental acumulada.", 
    min: 15, 
    level: "Iniciante", 
    category: "Relaxamento",
    audioInfo: "Música suave ou binaurais delta",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030c.mp3", 
    emoji: "🧘",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    instructions: [
      "Deite-se de costas em uma superfície confortável.",
      "Feche os olhos e sinta o peso do seu corpo no chão.",
      "Comece focando nos dedos dos pés, notando qualquer sensação.",
      "Suba lentamente a atenção pelas pernas, quadris, tronco e braços.",
      "Termine no topo da cabeça, sentindo o corpo como um todo.",
      "Imagine a tensão derretendo a cada expiração."
    ],
    benefits: ["Relaxamento muscular profundo", "Melhora a qualidade do sono", "Reduz dores crônicas", "Promove paz mental"]
  },
  { 
    id: 3, 
    title: "Meditação Loving-Kindness", 
    desc: "Prática budista (Metta) que cultiva sentimentos de amor, compaixão e benevolência — primeiro por si mesmo e depois por todos os seres.", 
    min: 10, 
    level: "Iniciante", 
    category: "Compaixão",
    audioInfo: "Tigela tibetana ou silêncio",
    audioUrl: "https://cdn.pixabay.com/audio/2022/07/25/audio_3266b4779b.mp3", 
    emoji: "💖",
    img: "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?w=800",
    instructions: [
      "Sente-se em uma postura digna e relaxada.",
      "Traga à mente a imagem de si mesmo e deseje: 'Que eu seja feliz'.",
      "Pense em alguém querido e repita: 'Que você esteja em paz'.",
      "Pense em alguém neutro e envie o mesmo desejo.",
      "Pense em alguém com quem tenha dificuldades e pratique o perdão.",
      "Expanda esse amor para todos os seres do universo."
    ],
    benefits: ["Aumenta a empatia", "Reduz autocrítica", "Melhora relacionamentos", "Fortalece a resiliência emocional"]
  },
  { 
    id: 4, 
    title: "Meditação Vipassana", 
    desc: "Uma das técnicas de meditação mais antigas do mundo. Observa pensamentos, sensações e emoções como eles realmente são, sem julgamento.", 
    min: 20, 
    level: "Intermediário", 
    category: "Mindfulness",
    audioInfo: "Silêncio total",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/03/audio_54ca0ce5cf.mp3", 
    emoji: "👁️",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    instructions: [
      "Mantenha a imobilidade total durante a prática.",
      "Observe as sensações físicas em todo o corpo.",
      "Não reaja a dores ou coceiras, apenas observe sua natureza impermanente.",
      "Note como os pensamentos surgem e desaparecem como nuvens.",
      "Mantenha a equanimidade diante de sensações agradáveis ou desagradáveis.",
      "Desenvolva a compreensão profunda da realidade interna."
    ],
    benefits: ["Claridade mental profunda", "Desapego emocional", "Autoconhecimento", "Paz inabalável"]
  },
  { 
    id: 5, 
    title: "Respiração 4-7-8", 
    desc: "Técnica de pranayama popularizada pelo Dr. Andrew Weil. Considerada um tranquilizante natural do sistema nervoso.", 
    min: 5, 
    level: "Iniciante", 
    category: "Respiração",
    audioInfo: "Silêncio",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/21/audio_31743c5868.mp3", 
    emoji: "4️⃣",
    img: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800",
    instructions: [
      "Expire completamente pela boca com um som de sopro.",
      "Feche a boca e inspire pelo nariz contando até 4.",
      "Prenda a respiração contando até 7.",
      "Expire completamente pela boca contando até 8.",
      "Este é um ciclo. Repita por 4 vezes no início.",
      "Pratique duas vezes ao dia para melhores resultados."
    ],
    benefits: ["Redução drástica do estresse", "Ajuda a adormecer rápido", "Controla ataques de pânico", "Melhora a digestão"]
  },
  { 
    id: 6, 
    title: "Meditação com Mantra", 
    desc: "Uso de sons sagrados ou palavras afirmativas como foco para aquietar a mente e elevar a vibração interna.", 
    min: 15, 
    level: "Iniciante", 
    category: "Mantra",
    audioInfo: "Canto de mantras ou tigela tibetana",
    audioUrl: "https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02f9.mp3", 
    emoji: "🕉️",
    img: "https://images.unsplash.com/photo-1528319725582-ddc0b610113c?w=800",
    instructions: [
      "Escolha um mantra (ex: 'Om', 'So Hum' ou 'Eu sou paz').",
      "Repita o mantra silenciosamente ou em voz baixa.",
      "Sincronize o mantra com sua respiração se desejar.",
      "Sinta a vibração do som ressoando em seu peito.",
      "Quando a mente se distrair, retorne suavemente ao som.",
      "Termine em silêncio por alguns minutos."
    ],
    benefits: ["Acalma pensamentos repetitivos", "Eleva o estado de espírito", "Melhora a concentração", "Conexão espiritual"]
  },
  { 
    id: 7, 
    title: "Visualização Criativa", 
    desc: "Técnica poderosa que usa a imaginação guiada para criar estados emocionais positivos e manifestar intenções.", 
    min: 10, 
    level: "Iniciante", 
    category: "Visualização",
    audioInfo: "Música inspiradora e suave",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/02/audio_8845896057.mp3", 
    emoji: "🌈",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
    instructions: [
      "Imagine um lugar onde você se sente totalmente seguro e feliz.",
      "Envolva todos os seus sentidos: o que você vê, ouve e cheira?",
      "Visualize-se alcançando um objetivo ou estado de ser desejado.",
      "Sinta a emoção de já ter conquistado o que deseja.",
      "Mantenha essa imagem vívida em sua mente.",
      "Traga essa sensação de realização para o seu dia."
    ],
    benefits: ["Aumenta a autoconfiança", "Reduz o medo do futuro", "Estimula a criatividade", "Melhora o humor"]
  },
  { 
    id: 8, 
    title: "Atenção Plena no Dia a Dia", 
    desc: "A meditação não precisa ser só no tapete. Pratique presença plena nas atividades cotidianas para transformar o dia inteiro em prática.", 
    min: 0, 
    level: "Todos os níveis", 
    category: "Mindfulness",
    audioInfo: "Sons do ambiente real",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3", 
    emoji: "🌸",
    img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800",
    instructions: [
      "Escolha uma tarefa simples (lavar louça, caminhar, comer).",
      "Foque 100% nas sensações táteis e movimentos envolvidos.",
      "Se começar a pensar no passado ou futuro, volte ao 'agora'.",
      "Observe as cores, texturas e sons ao seu redor.",
      "Respire conscientemente enquanto realiza a tarefa.",
      "Sinta a gratidão pela simplicidade do momento."
    ],
    benefits: ["Reduz o estresse diário", "Aumenta a gratidão", "Melhora a eficiência", "Traz alegria ao comum"]
  },
  { 
    id: 9, 
    title: "Nidra Yoga (Sono Lúcido)", 
    desc: "Estado entre o sono e a vigília. Uma sessão de 30 min equivale a 4 horas de sono profundo. Profundamente restaurativa.", 
    min: 30, 
    level: "Todos os níveis", 
    category: "Restaurativa",
    audioInfo: "Voz relaxante e silêncio",
    audioUrl: "https://cdn.pixabay.com/audio/2021/11/24/audio_8378cf463f.mp3", 
    emoji: "💤",
    img: "https://images.unsplash.com/photo-1511295742364-917e703b5ca0?w=800",
    instructions: [
      "Deite-se em Shavasana e cubra-se se necessário.",
      "Siga a voz que guia sua consciência por diferentes partes do corpo.",
      "Mantenha-se acordado, mas em relaxamento profundo.",
      "Defina um 'Sankalpa' (resolução positiva) no início e fim.",
      "Sinta o corpo pesado e a mente leve.",
      "Retorne lentamente movendo extremidades."
    ],
    benefits: ["Recuperação física rápida", "Equilíbrio emocional", "Melhora a memória", "Reduz traumas e fobias"]
  }
];

export const SEQUENCES = [
  { 
    id: 1, 
    title: "Saudação ao Sol", 
    desc: "Sequência clássica para energizar o corpo e aquecer os músculos pela manhã.", 
    classes: 5, 
    level: "Iniciante", 
    emoji: "☀️",
    time: "15 min",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/24/audio_7740671196.mp3",
    posesIncluded: ["Tadasana", "Urdhva Hastasana", "Uttanasana", "Adho Mukha Svanasana", "Chaturanga", "Bhujangasana"],
    instructions: [
      "Comece em Tadasana (Montanha) no topo do tapete.",
      "Inspire, eleve os braços (Urdhva Hastasana).",
      "Expire, incline-se para frente (Uttanasana).",
      "Inspire, olhe à frente, expire e pule ou caminhe para trás (Chaturanga).",
      "Inspire para a Cobra (Bhujangasana) ou Cachorro Olhando para Cima.",
      "Expire para o Cachorro Olhando para Baixo (Adho Mukha Svanasana).",
      "Permaneça por 5 respirações e retorne ao topo."
    ],
    benefits: ["Energia instantânea", "Flexibilidade da coluna", "Fortalecimento de braços", "Melhora a circulação"]
  },
  { 
    id: 2, 
    title: "Yoga Relaxante Noturno", 
    desc: "Sequência suave para relaxar corpo e mente antes de dormir.", 
    classes: 8, 
    level: "Todos os níveis", 
    emoji: "🌙",
    time: "20 min",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030c.mp3",
    posesIncluded: ["Balasana", "Supta Baddha Konasana", "Viparita Karani", "Savasana"],
    instructions: [
      "Inicie em Balasana (Criança) por 3 minutos.",
      "Passe para Supta Baddha Konasana (Deitado com solas dos pés juntas).",
      "Coloque as pernas na parede (Viparita Karani) para acalmar o sistema nervoso.",
      "Finalize com um Shavasana prolongado, focando na expiração lenta.",
      "Mantenha as luzes baixas e evite telas após a prática."
    ],
    benefits: ["Combate a insônia", "Reduz ansiedade", "Alivia tensão lombar", "Paz mental"]
  },
  { 
    id: 3, 
    title: "Força e Tonificação", 
    desc: "Trabalho de força para tonificar pernas, core e braços.", 
    classes: 6, 
    level: "Intermediário", 
    emoji: "💪",
    time: "30 min",
    img: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6ff1bab.mp3",
    posesIncluded: ["Virabhadrasana I", "Virabhadrasana II", "Utkatasana", "Navasana", "Plank"],
    instructions: [
      "Aqueça com 3 saudações ao sol.",
      "Mantenha o Guerreiro I e II por 10 respirações cada lado.",
      "Sustente a Postura da Cadeira (Utkatasana) até sentir o calor nas coxas.",
      "Pratique o Barco (Navasana) 3 vezes para fortalecer o abdômen.",
      "Finalize com Prancha (Plank) estática por 1 minuto."
    ],
    benefits: ["Definição muscular", "Aumento da resistência", "Melhora do metabolismo", "Postura firme"]
  },
  { 
    id: 4, 
    title: "Abertura de Quadril", 
    desc: "Foco em liberar tensões acumuladas na região do quadril.", 
    classes: 6, 
    level: "Todos os níveis", 
    emoji: "🦋",
    time: "25 min",
    img: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800",
    audioUrl: "https://cdn.pixabay.com/audio/2022/07/25/audio_3266b4779b.mp3",
    posesIncluded: ["Eka Pada Rajakapotasana", "Baddha Konasana", "Malasana", "Gomukhasana"],
    instructions: [
      "Inicie em Malasana (Agachamento) para abrir a base.",
      "Passe para a Postura do Pombo (Eka Pada Rajakapotasana) devagar.",
      "Mantenha Baddha Konasana (Borboleta) com a coluna ereta.",
      "Use Gomukhasana para liberar quadris e ombros simultaneamente.",
      "Respire profundamente nas áreas de maior resistência."
    ],
    benefits: ["Liberação emocional", "Alívio de dores ciáticas", "Melhora a mobilidade", "Reduz rigidez pélvica"]
  },
  { 
    id: 5, 
    title: "Yoga para Iniciantes", 
    desc: "Sequência suave e acessível para quem está começando a praticar yoga. Foco em posturas básicas e respiração.", 
    classes: 7, 
    level: "Iniciante", 
    emoji: "🌱",
    time: "20 min",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/21/audio_31743c5868.mp3",
    posesIncluded: ["Tadasana", "Marjaryasana-Bitilasana", "Balasana", "Bhujangasana", "Adho Mukha Svanasana", "Savasana"],
    instructions: [
      "Comece sentado em Sukhasana para centramento.",
      "Faça o Gato-Vaca (Marjaryasana-Bitilasana) para aquecer a coluna.",
      "Pratique Tadasana para consciência do alinhamento.",
      "Descanse em Balasana sempre que precisar.",
      "Finalize com 5 minutos de relaxamento em Savasana."
    ],
    benefits: ["Introdução segura ao Yoga", "Consciência corporal", "Redução de estresse", "Melhora da respiração"]
  },
  { 
    id: 6, 
    title: "Detox e Digestão", 
    desc: "Sequência com torções que massageiam os órgãos internos, estimulam a digestão e eliminam toxinas.", 
    classes: 4, 
    level: "Todos os níveis", 
    emoji: "🍃",
    time: "25 min",
    img: "https://images.unsplash.com/photo-1510894347713-fc3ad6cb0d4d?w=800",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/02/audio_8845896057.mp3",
    posesIncluded: ["Tadasana", "Uttanasana", "Ardha Matsyendrasana", "Marjaryasana-Bitilasana", "Navasana", "Supta Matsyendrasana", "Savasana"],
    instructions: [
      "Inicie com movimentos suaves de coluna.",
      "Foque em torções sentadas (Ardha Matsyendrasana) em ambos os lados.",
      "Mantenha cada torção por pelo menos 10 respirações profundas.",
      "Use Navasana para ativar o fogo digestivo (Agni).",
      "Finalize com torção deitada para relaxar os órgãos."
    ],
    benefits: ["Melhora a digestão", "Desintoxicação do fígado", "Alívio de inchaço", "Energia renovada"]
  },
];

const YOUTUBE_IDS = [
  "v7AYKMP6rOE", "inpok4MKVLM", "4vTJHUDB5ak", "9kOCY0KNByw", "Nnd5SloY2dE", "oX6I6f1_-FE", "UEEsdXn8oG8", "TSIz958S160", "kFhG4JJJbcM", "OQ6N_C_v9Ho",
  "7kgZnJqzNaU", "M-80T_V8Y_A", "b1H3xO3x_Js", "GLy2rYHwUqY", "dF7O6-QabIo", "3_97p_T9-3Y", "wPO5HQnOeKQ", "Eml2xnoLpYE", "sTANio_2E0Q", "8Vp54Y_R_vM"
];

const PIXABAY_AUDIO = [
  "https://cdn.pixabay.com/audio/2022/03/24/audio_7740671196.mp3",
  "https://cdn.pixabay.com/audio/2022/01/21/audio_31743c5868.mp3",
  "https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02f9.mp3",
  "https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6ff1bab.mp3",
  "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a7315b.mp3",
  "https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030c.mp3",
  "https://cdn.pixabay.com/audio/2022/07/25/audio_3266b4779b.mp3",
  "https://cdn.pixabay.com/audio/2022/08/02/audio_8845896057.mp3",
  "https://cdn.pixabay.com/audio/2022/08/03/audio_54ca0ce5cf.mp3",
  "https://cdn.pixabay.com/audio/2022/05/17/audio_816327c53d.mp3",
  "https://cdn.pixabay.com/audio/2021/11/24/audio_8378cf463f.mp3"
];

export const MODULES = [
  { id:1, emoji:"🌱", title:"Fundamentos do Yoga", sub:"Base para uma jornada transformadora",
    level:"Iniciante", color:P.cel, tc:"#1A4060", weeks:3,
    classes: Array.from({length:20}).map((_,i)=>{
      const vid = YOUTUBE_IDS[i % YOUTUBE_IDS.length];
      return {
        id:`c1_${i+1}`, title:`Fundamentos Aula ${i+1}`, min:20, level:"Iniciante", 
        isFree: i < 1, // Somente a primeira aula é grátis
        desc:"Aprofundamento nas técnicas de base e alinhamento postural com foco em respiração e presença.",
        videoId:vid, thumb:`https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
        music:`Yoga Flow Spirit Vol ${i+1} 🧘`, audioUrl: PIXABAY_AUDIO[i % PIXABAY_AUDIO.length],
        poses:[{name:"Tadasana", emoji:"🏔️", desc:"Postura da Montanha: Estabilidade e presença.", img:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"}],
        benefits:[{text:"Postura", icon:"⬆️", intensity:70}], img:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"
      }
    })
  },

  { id:2, emoji:"🔥", title:"Força e Equilíbrio", sub:"Construa poder interior e estabilidade",
    level:"Intermediário", color:P.lil, tc:"#3A1060", weeks:4,
    classes: Array.from({length:20}).map((_,i)=>{
      const vid = YOUTUBE_IDS[(i + 5) % YOUTUBE_IDS.length];
      return {
        id:`c2_${i+1}`, title:`Guerreiro Interior ${i+1}`, min:30, level:"Intermediário", 
        isFree: false, // Módulo privado
        desc:"Desenvolva força muscular, resiliência mental e equilíbrio através de sequências dinâmicas.",
        videoId:vid, thumb:`https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
        music:`Zen Power Beats Vol ${i+1} 🎧`, audioUrl: PIXABAY_AUDIO[(i + 3) % PIXABAY_AUDIO.length],
        poses:[{name:"Virabhadrasana", emoji:"⚔️", desc:"Postura do Guerreiro: Força nas pernas e determinação no olhar.", img:"https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400"}],
        benefits:[{text:"Força", icon:"💪", intensity:85}], img:"https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500"
      }
    })
  },

  { id:3, emoji:"🪷", title:"Yoga Restaurativo", sub:"Cura profunda e relaxamento total",
    level:"Avançado", color:P.trq, tc:"#003830", weeks:6,
    classes: Array.from({length:20}).map((_,i)=>{
      const vid = YOUTUBE_IDS[(i + 10) % YOUTUBE_IDS.length];
      return {
        id:`c3_${i+1}`, title:`Restauração Profunda ${i+1}`, min:45, level:"Avançado", 
        isFree: false, // Módulo privado
        desc:"Técnicas avançadas de relaxamento, meditação guiada e cura tecidual profunda.",
        videoId:vid, thumb:`https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
        music:`Nidra Healing Sounds Vol ${i+1} 🌌`, audioUrl: PIXABAY_AUDIO[(i + 7) % PIXABAY_AUDIO.length],
        poses:[{name:"Shavasana", emoji:"💤", desc:"Postura do Cadáver: Entrega total e absorção da prática.", img:"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400"}],
        benefits:[{text:"Cura", icon:"❤️", intensity:95}], img:"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500"
      }
    })
  }
];

export const COUNTRIES = ["Brasil","Portugal","Angola","Moçambique","Cabo Verde","Timor-Leste","Estados Unidos","Espanha","França","Alemanha","Itália","Argentina","México","Colômbia","Chile","Peru","Japão","China","Índia","Outros"];
export const LEVELS    = ["Iniciante","Intermediário","Avançado","Não sei ainda"];
export const GOALS     = ["Flexibilidade","Redução de estresse","Força muscular","Emagrecimento","Espiritualidade","Saúde geral","Meditação","Reabilitação"];
export const LANGS     = {"pt-BR":"🇧🇷 Português","en-US":"🇺🇸 English","es-ES":"🇪🇸 Español","fr-FR":"🇫🇷 Français","de-DE":"🇩🇪 Deutsch","it-IT":"🇮🇹 Italiano","ja-JP":"🇯🇵 日本語"};


