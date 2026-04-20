const commonWords = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'work', 'call', 'tell', 'ask', 'need', 'feel', 'try', 'leave', 'put', 'mean',
  'keep', 'let', 'begin', 'seem', 'help', 'talk', 'turn', 'start', 'show', 'hear',
  'play', 'run', 'move', 'like', 'live', 'believe', 'hold', 'bring', 'happen', 'write',
  'provide', 'sit', 'stand', 'lose', 'pay', 'meet', 'include', 'continue', 'set', 'learn',
  'change', 'lead', 'understand', 'watch', 'follow', 'stop', 'create', 'speak', 'read', 'allow',
  'add', 'spend', 'grow', 'open', 'walk', 'win', 'offer', 'remember', 'love', 'consider',
  'appear', 'buy', 'wait', 'serve', 'die', 'send', 'expect', 'build', 'stay', 'fall',
  'cut', 'reach', 'kill', 'remain', 'suggest', 'raise', 'pass', 'sell', 'require', 'report',
  'decide', 'pull', 'explain', 'develop', 'carry', 'break', 'receive', 'agree', 'support', 'hit',
  'produce', 'eat', 'cover', 'catch', 'draw', 'choose', 'cause', 'follow', 'drive', 'press',
  'close', 'check', 'concern', 'succeed', 'fight', 'achieve', 'release', 'deal', 'repeat', 'apply',
  'escape', 'introduce', 'realize', 'involve', 'raise', 'discuss', 'seek', 'handle', 'convince', 'claim',
  'employ', 'engage', 'measure', 'reduce', 'reveal', 'maintain', 'resolve', 'transform', 'recognize', 'adopt',
  'link', 'stretch', 'accumulate', 'assign', 'assume', 'battle', 'blend', 'bother', 'branch', 'broaden',
  'bundle', 'bury', 'cafeteria', 'calculate', 'calibrate', 'camouflage', 'campaign', 'capitalize', 'capture', 'carbon',
  'cargo', 'carnival', 'carpet', 'carriage', 'carrier', 'cart', 'carve', 'cascade', 'case', 'cash',
  'casual', 'catalyst', 'catastrophe', 'catch', 'category', 'cater', 'cattle', 'caution', 'cautious', 'cavalry',
  'cave', 'cavity', 'cease', 'ceiling', 'celebrate', 'celebrity', 'cement', 'cemetery', 'censure', 'census',
  'center', 'century', 'ceramic', 'cereal', 'ceremony', 'certain', 'certificate', 'certify', 'cessation', 'chafe',
  'chaff', 'chagrin', 'chain', 'chair', 'chalk', 'challenge', 'chamber', 'champ', 'champion', 'chance',
  'change', 'channel', 'chant', 'chaos', 'chapel', 'chaplain', 'chapter', 'char', 'character', 'charade',
  'charcoal', 'charge', 'chariot', 'charm', 'chart', 'charter', 'chase', 'chasm', 'chassis', 'chaste',
  'chasten', 'chat', 'chatter', 'chauffeur', 'cheap', 'cheat', 'check', 'cheek', 'cheer', 'cheese',
  'chef', 'chemical', 'cherish', 'cherry', 'cherub', 'chess', 'chest', 'chestnut', 'chew', 'chic',
  'chick', 'chicken', 'chicory', 'chide', 'chief', 'chiefly', 'child', 'chill', 'chilly', 'chime',
  'chimney', 'chimp', 'chin', 'china', 'chink', 'chintz', 'chip', 'chipmunk', 'chirp', 'chisel',
  'chit', 'chivalry', 'chive', 'chlorine', 'chocolate', 'choice', 'choir', 'choke', 'chomp', 'choose',
  'chop', 'chopper', 'choppy', 'choral', 'chord', 'chore', 'choreography', 'chortle', 'chorus', 'chose',
  'chosen', 'chow', 'chowder', 'christen', 'christian', 'christmas', 'chrome', 'chromosome', 'chronic', 'chronicle',
  'chronology', 'chrysalis', 'chrysanthemum', 'chubby', 'chuck', 'chuckle', 'chug', 'chum', 'chump', 'chunk',
  'chunky', 'church', 'churn', 'chute', 'cider', 'cigar', 'cigarette', 'cilantro', 'cinch', 'cinder',
  'cinema', 'cinnamon', 'cipher', 'circle', 'circuit', 'circular', 'circulate', 'circulation', 'circumcise', 'circumference',
  'circumscribe', 'circumstance', 'circumvent', 'circus', 'cistern', 'citadel', 'citation', 'cite', 'citizen', 'citizenship',
  'citric', 'citron', 'citrus', 'city', 'civet', 'civic', 'civil', 'civilian', 'civility', 'civilization',
  'civilize', 'clack', 'clad', 'claim', 'clam', 'clamber', 'clammy', 'clamor', 'clamp', 'clan',
  'clandestine', 'clang', 'clank', 'clap', 'claptrap', 'clarification', 'clarify', 'clarinet', 'clarity', 'clash',
  'clasp', 'class', 'classic', 'classification', 'classify', 'classmate', 'classroom', 'classy', 'clatter', 'clause',
  'claustrophobia', 'clave', 'clavicle', 'claw', 'clay', 'clean', 'cleanliness', 'cleanly', 'cleanse', 'clear',
  'clearance', 'clearly', 'cleat', 'cleavage', 'cleave', 'cleaver', 'clef', 'cleft', 'clemency', 'clement',
  'clench', 'clergy', 'clergyman', 'cleric', 'clerical', 'clerk', 'clever', 'clew', 'cliche', 'click',
  'client', 'clientele', 'cliff', 'climate', 'climax', 'climb', 'clime', 'clinch', 'cling', 'clinic',
  'clinical', 'clink', 'clinker', 'clip', 'clipper', 'clique', 'cloak', 'clobber', 'cloche', 'clock',
  'clockwise', 'clockwork', 'clod', 'clodhopper', 'clog', 'cloister', 'clomp', 'clone', 'clonk', 'clop',
  'close', 'closet', 'closure', 'clot', 'cloth', 'clothe', 'clothes', 'clothier', 'clothing', 'cloud',
  'cloudy', 'clout', 'clove', 'cloven', 'clover', 'clown', 'cloy', 'club', 'cluck', 'clue',
  'clump', 'clumpy', 'clumsy', 'clung', 'clunk', 'cluster', 'clutch', 'clutter', 'coach', 'coadjutor',
  'coagulate', 'coal', 'coalesce', 'coalescence', 'coalition', 'coarse', 'coarsen', 'coast', 'coastal', 'coaster',
  'coat', 'coating', 'coax', 'coaxial', 'cobalt', 'cobble', 'cobbler', 'cobblestone', 'cobra', 'cobweb',
  'cocaine', 'coccyx', 'cochlear', 'cock', 'cockatiel', 'cockatoo', 'cockle', 'cockney', 'cockpit', 'cockroach',
  'cocksure', 'cocktail', 'cocky', 'cocoa', 'coconut', 'cocoon', 'cod', 'coda', 'coddle', 'code',
  'codeine', 'codex', 'codger', 'codicil', 'codify', 'codling', 'coed', 'coeducation', 'coefficient', 'coelacinth',
  'coequal', 'coerce', 'coercion', 'coercive', 'coeval', 'coexist', 'coexistence', 'coffee', 'coffer', 'coffin',
  'cog', 'cogency', 'cogent', 'cogitate', 'cognac', 'cognate', 'cognition', 'cognitive', 'cognizable', 'cognizance',
  'cognizant', 'cognomen', 'cognoscenti', 'cogwheel', 'cohabit', 'cohabitation', 'coheir', 'cohere', 'coherence',
  'coherent', 'cohesion', 'cohesive', 'cohort', 'coif', 'coiffure', 'coil', 'coin', 'coinage', 'coincide',
  'coincidence', 'coincident', 'coincidental', 'coir', 'coke', 'colander', 'cold', 'coldness', 'cole', 'colic',
];

export const generateWords = (count = 50) => {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(commonWords[Math.floor(Math.random() * commonWords.length)]);
  }
  return words;
};

export const wordsToString = (words) => {
  return words.join(' ');
};

export const stringToWords = (str) => {
  return str.split(' ');
};
