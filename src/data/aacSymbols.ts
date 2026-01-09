export interface AACSymbol {
  id: string;
  label: string;
  emoji: string;
  category: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export const categories: Category[] = [
  { id: "home", name: "Kryefaqja", emoji: "🏠", color: "bg-primary" },
  { id: "emotions", name: "Emocionet", emoji: "😊", color: "bg-category-emotions" },
  { id: "food", name: "Ushqimi", emoji: "🍎", color: "bg-category-food" },
  { id: "actions", name: "Veprimet", emoji: "🏃", color: "bg-category-actions" },
  { id: "colors", name: "Ngjyrat", emoji: "🎨", color: "bg-category-colors" },
  { id: "family", name: "Familja", emoji: "👨‍👩‍👧", color: "bg-category-family" },
  { id: "questions", name: "Pyetjet", emoji: "❓", color: "bg-category-questions" },
  { id: "places", name: "Vendet", emoji: "🏫", color: "bg-category-places" },
  { id: "objects", name: "Objektet", emoji: "🎒", color: "bg-category-objects" },
  { id: "school", name: "Shkolla", emoji: "📚", color: "bg-aac-blue" },
  { id: "health", name: "Mjekësia", emoji: "🏥", color: "bg-aac-green" },
  { id: "games", name: "Lojërat", emoji: "🎮", color: "bg-aac-purple" },
];

export const aacSymbols: AACSymbol[] = [
  // Quick Access / Home
  { id: "yes", label: "Po", emoji: "✅", category: "home" },
  { id: "no", label: "Jo", emoji: "❌", category: "home" },
  { id: "help", label: "Ndihmë", emoji: "🆘", category: "home" },
  { id: "please", label: "Të lutem", emoji: "🙏", category: "home" },
  { id: "thanks", label: "Faleminderit", emoji: "💝", category: "home" },
  { id: "sorry", label: "Më fal", emoji: "😔", category: "home" },
  { id: "want", label: "Dua", emoji: "👉", category: "home" },
  { id: "dont-want", label: "Nuk dua", emoji: "🚫", category: "home" },
  { id: "more", label: "Më shumë", emoji: "➕", category: "home" },
  { id: "finished", label: "Mbarova", emoji: "🏁", category: "home" },
  { id: "wait", label: "Prit", emoji: "✋", category: "home" },
  { id: "stop", label: "Ndalo", emoji: "🛑", category: "home" },

  // Emotions
  { id: "happy", label: "I/E lumtur", emoji: "😊", category: "emotions" },
  { id: "sad", label: "I/E trishtuar", emoji: "😢", category: "emotions" },
  { id: "angry", label: "I/E zemëruar", emoji: "😠", category: "emotions" },
  { id: "scared", label: "I/E frikësuar", emoji: "😨", category: "emotions" },
  { id: "tired", label: "I/E lodhur", emoji: "😴", category: "emotions" },
  { id: "excited", label: "I/E emocionuar", emoji: "🤩", category: "emotions" },
  { id: "love", label: "Dashuri", emoji: "❤️", category: "emotions" },
  { id: "confused", label: "I/E hutuar", emoji: "😕", category: "emotions" },
  { id: "sick", label: "I/E sëmurë", emoji: "🤒", category: "emotions" },
  { id: "hungry", label: "I/E uritur", emoji: "😋", category: "emotions" },
  { id: "thirsty", label: "I/E etur", emoji: "🥤", category: "emotions" },
  { id: "bored", label: "I/E mërzitur", emoji: "😑", category: "emotions" },
  { id: "surprised", label: "I/E befasuar", emoji: "😲", category: "emotions" },
  { id: "proud", label: "Krenar/e", emoji: "😌", category: "emotions" },
  { id: "nervous", label: "Nervoz/e", emoji: "😰", category: "emotions" },

  // Food
  { id: "water", label: "Ujë", emoji: "💧", category: "food" },
  { id: "milk", label: "Qumësht", emoji: "🥛", category: "food" },
  { id: "juice", label: "Lëng", emoji: "🧃", category: "food" },
  { id: "bread", label: "Bukë", emoji: "🍞", category: "food" },
  { id: "apple", label: "Mollë", emoji: "🍎", category: "food" },
  { id: "banana", label: "Banane", emoji: "🍌", category: "food" },
  { id: "cookie", label: "Biskotë", emoji: "🍪", category: "food" },
  { id: "cake", label: "Tortë", emoji: "🎂", category: "food" },
  { id: "pizza", label: "Pica", emoji: "🍕", category: "food" },
  { id: "pasta", label: "Makarona", emoji: "🍝", category: "food" },
  { id: "chicken", label: "Pulë", emoji: "🍗", category: "food" },
  { id: "egg", label: "Vezë", emoji: "🥚", category: "food" },
  { id: "cheese", label: "Djathë", emoji: "🧀", category: "food" },
  { id: "icecream", label: "Akullore", emoji: "🍦", category: "food" },
  { id: "soup", label: "Supë", emoji: "🍲", category: "food" },
  { id: "rice", label: "Oriz", emoji: "🍚", category: "food" },

  // Actions
  { id: "eat", label: "Ha", emoji: "🍴", category: "actions" },
  { id: "drink", label: "Pi", emoji: "🥤", category: "actions" },
  { id: "play", label: "Luaj", emoji: "🎮", category: "actions" },
  { id: "sleep", label: "Fle", emoji: "😴", category: "actions" },
  { id: "walk", label: "Eci", emoji: "🚶", category: "actions" },
  { id: "run", label: "Vrapoj", emoji: "🏃", category: "actions" },
  { id: "sit", label: "Ulu", emoji: "🪑", category: "actions" },
  { id: "stand", label: "Ngrihu", emoji: "🧍", category: "actions" },
  { id: "read", label: "Lexo", emoji: "📖", category: "actions" },
  { id: "write", label: "Shkruaj", emoji: "✏️", category: "actions" },
  { id: "draw", label: "Vizato", emoji: "🎨", category: "actions" },
  { id: "sing", label: "Këndo", emoji: "🎤", category: "actions" },
  { id: "dance", label: "Kërce", emoji: "💃", category: "actions" },
  { id: "wash", label: "Lahu", emoji: "🚿", category: "actions" },
  { id: "brush", label: "Laj dhëmbët", emoji: "🪥", category: "actions" },
  { id: "dress", label: "Vishu", emoji: "👕", category: "actions" },
  { id: "toilet", label: "Tualet", emoji: "🚽", category: "actions" },
  { id: "hug", label: "Përqafo", emoji: "🤗", category: "actions" },
  { id: "look", label: "Shiko", emoji: "👀", category: "actions" },
  { id: "listen", label: "Dëgjo", emoji: "👂", category: "actions" },

  // Colors
  { id: "red", label: "E kuqe", emoji: "🔴", category: "colors" },
  { id: "blue", label: "Blu", emoji: "🔵", category: "colors" },
  { id: "green", label: "E gjelbër", emoji: "🟢", category: "colors" },
  { id: "yellow", label: "E verdhë", emoji: "🟡", category: "colors" },
  { id: "orange", label: "Portokalli", emoji: "🟠", category: "colors" },
  { id: "purple", label: "Vjollcë", emoji: "🟣", category: "colors" },
  { id: "pink", label: "Rozë", emoji: "💗", category: "colors" },
  { id: "black", label: "E zezë", emoji: "⚫", category: "colors" },
  { id: "white", label: "E bardhë", emoji: "⚪", category: "colors" },
  { id: "brown", label: "Kafe", emoji: "🟤", category: "colors" },

  // Family
  { id: "mom", label: "Mami", emoji: "👩", category: "family" },
  { id: "dad", label: "Babi", emoji: "👨", category: "family" },
  { id: "sister", label: "Motër", emoji: "👧", category: "family" },
  { id: "brother", label: "Vëlla", emoji: "👦", category: "family" },
  { id: "grandma", label: "Gjyshja", emoji: "👵", category: "family" },
  { id: "grandpa", label: "Gjyshi", emoji: "👴", category: "family" },
  { id: "baby", label: "Foshnjë", emoji: "👶", category: "family" },
  { id: "friend", label: "Mik/e", emoji: "🧑‍🤝‍🧑", category: "family" },
  { id: "teacher", label: "Mësues/e", emoji: "👩‍🏫", category: "family" },
  { id: "doctor", label: "Doktor/e", emoji: "👨‍⚕️", category: "family" },
  { id: "me", label: "Unë", emoji: "🙋", category: "family" },
  { id: "you", label: "Ti", emoji: "👤", category: "family" },

  // Questions
  { id: "what", label: "Çfarë?", emoji: "❓", category: "questions" },
  { id: "where", label: "Ku?", emoji: "📍", category: "questions" },
  { id: "when", label: "Kur?", emoji: "⏰", category: "questions" },
  { id: "who", label: "Kush?", emoji: "👤", category: "questions" },
  { id: "why", label: "Pse?", emoji: "🤔", category: "questions" },
  { id: "how", label: "Si?", emoji: "💭", category: "questions" },
  { id: "how-many", label: "Sa?", emoji: "🔢", category: "questions" },
  { id: "which", label: "Cili/a?", emoji: "👆", category: "questions" },

  // Places
  { id: "home-place", label: "Shtëpia", emoji: "🏠", category: "places" },
  { id: "school", label: "Shkolla", emoji: "🏫", category: "places" },
  { id: "park", label: "Parku", emoji: "🌳", category: "places" },
  { id: "hospital", label: "Spitali", emoji: "🏥", category: "places" },
  { id: "store", label: "Dyqani", emoji: "🏪", category: "places" },
  { id: "bathroom", label: "Banjo", emoji: "🚽", category: "places" },
  { id: "bedroom", label: "Dhoma e gjumit", emoji: "🛏️", category: "places" },
  { id: "kitchen", label: "Kuzhina", emoji: "🍳", category: "places" },
  { id: "outside", label: "Jashtë", emoji: "🌤️", category: "places" },
  { id: "car", label: "Makina", emoji: "🚗", category: "places" },
  { id: "playground", label: "Këndi i lojërave", emoji: "🎠", category: "places" },
  { id: "restaurant", label: "Restoranti", emoji: "🍽️", category: "places" },

  // Objects
  { id: "toy", label: "Lodër", emoji: "🧸", category: "objects" },
  { id: "ball", label: "Top", emoji: "⚽", category: "objects" },
  { id: "book", label: "Libër", emoji: "📚", category: "objects" },
  { id: "phone", label: "Telefon", emoji: "📱", category: "objects" },
  { id: "tv", label: "Televizor", emoji: "📺", category: "objects" },
  { id: "tablet", label: "Tablet", emoji: "📲", category: "objects" },
  { id: "pencil", label: "Laps", emoji: "✏️", category: "objects" },
  { id: "bag", label: "Çantë", emoji: "🎒", category: "objects" },
  { id: "clothes", label: "Rroba", emoji: "👔", category: "objects" },
  { id: "shoes", label: "Këpucë", emoji: "👟", category: "objects" },
  { id: "blanket", label: "Batanije", emoji: "🛏️", category: "objects" },
  { id: "cup", label: "Gotë", emoji: "🥤", category: "objects" },

  // School - Shkolla
  { id: "classroom", label: "Klasa", emoji: "🏫", category: "school" },
  { id: "desk", label: "Banka", emoji: "🪑", category: "school" },
  { id: "homework", label: "Detyra", emoji: "📝", category: "school" },
  { id: "test", label: "Provimi", emoji: "📋", category: "school" },
  { id: "break", label: "Pushimi", emoji: "⏰", category: "school" },
  { id: "sport", label: "Sporti", emoji: "⚽", category: "school" },
  { id: "music", label: "Muzika", emoji: "🎵", category: "school" },
  { id: "art", label: "Arti", emoji: "🎨", category: "school" },
  { id: "math", label: "Matematika", emoji: "🔢", category: "school" },
  { id: "reading", label: "Leximi", emoji: "📖", category: "school" },
  { id: "computer", label: "Kompjuteri", emoji: "💻", category: "school" },
  { id: "backpack", label: "Çanta", emoji: "🎒", category: "school" },
  { id: "notebook", label: "Fletore", emoji: "📓", category: "school" },
  { id: "ruler", label: "Vizore", emoji: "📏", category: "school" },
  { id: "scissors", label: "Gërshërë", emoji: "✂️", category: "school" },
  { id: "glue", label: "Ngjitës", emoji: "🧴", category: "school" },
  { id: "classmate", label: "Shoku/shoqja", emoji: "👫", category: "school" },
  { id: "principal", label: "Drejtori", emoji: "👨‍💼", category: "school" },

  // Health - Mjekësia
  { id: "medicine", label: "Ilaçi", emoji: "💊", category: "health" },
  { id: "doctor-health", label: "Mjeku", emoji: "👨‍⚕️", category: "health" },
  { id: "nurse", label: "Infermierja", emoji: "👩‍⚕️", category: "health" },
  { id: "hospital-health", label: "Spitali", emoji: "🏥", category: "health" },
  { id: "pain", label: "Dhimbje", emoji: "🤕", category: "health" },
  { id: "headache", label: "Dhimbje koke", emoji: "🤯", category: "health" },
  { id: "stomach", label: "Barku", emoji: "🫃", category: "health" },
  { id: "tooth", label: "Dhëmbi", emoji: "🦷", category: "health" },
  { id: "bandage", label: "Fashë", emoji: "🩹", category: "health" },
  { id: "thermometer", label: "Termometri", emoji: "🌡️", category: "health" },
  { id: "injection", label: "Gjilpëra", emoji: "💉", category: "health" },
  { id: "fever", label: "Temperaturë", emoji: "🤒", category: "health" },
  { id: "cough", label: "Kollë", emoji: "🤧", category: "health" },
  { id: "sneeze", label: "Teshtimë", emoji: "🤧", category: "health" },
  { id: "allergy", label: "Alergjia", emoji: "🤧", category: "health" },
  { id: "vitamins", label: "Vitamina", emoji: "💪", category: "health" },
  { id: "wheelchair", label: "Karrocë", emoji: "🦽", category: "health" },
  { id: "glasses", label: "Syze", emoji: "👓", category: "health" },

  // Games - Lojërat
  { id: "play-game", label: "Loz", emoji: "🎮", category: "games" },
  { id: "puzzle", label: "Puzzle", emoji: "🧩", category: "games" },
  { id: "blocks", label: "Kuba", emoji: "🧱", category: "games" },
  { id: "doll", label: "Kukull", emoji: "🪆", category: "games" },
  { id: "car-toy", label: "Makinë", emoji: "🚗", category: "games" },
  { id: "train", label: "Tren", emoji: "🚂", category: "games" },
  { id: "bicycle", label: "Biçikletë", emoji: "🚲", category: "games" },
  { id: "swing", label: "Lëkundje", emoji: "🎢", category: "games" },
  { id: "slide", label: "Rrëshqitje", emoji: "🛝", category: "games" },
  { id: "sandbox", label: "Rërë", emoji: "🏖️", category: "games" },
  { id: "bubbles", label: "Flluskë", emoji: "🫧", category: "games" },
  { id: "balloon", label: "Tullumbace", emoji: "🎈", category: "games" },
  { id: "kite", label: "Balonë", emoji: "🪁", category: "games" },
  { id: "hide-seek", label: "Fshihu", emoji: "🙈", category: "games" },
  { id: "tag", label: "Kap", emoji: "🏃", category: "games" },
  { id: "jump-rope", label: "Kërcim litar", emoji: "🪢", category: "games" },
  { id: "coloring", label: "Ngjyros", emoji: "🖍️", category: "games" },
  { id: "stickers", label: "Stiker", emoji: "⭐", category: "games" },
];

export const getSymbolsByCategory = (categoryId: string): AACSymbol[] => {
  return aacSymbols.filter((symbol) => symbol.category === categoryId);
};

export const getCategoryById = (categoryId: string): Category | undefined => {
  return categories.find((cat) => cat.id === categoryId);
};
