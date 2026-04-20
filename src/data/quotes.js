export const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    length: "short"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    length: "short"
  },
  {
    text: "Life is what happens when you are busy making other plans.",
    author: "John Lennon",
    length: "short"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    length: "short"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    length: "short"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    length: "short"
  },
  {
    text: "Success is not final, failure is not fatal.",
    author: "Winston Churchill",
    length: "short"
  },
  {
    text: "Believe you can and you are halfway there.",
    author: "Theodore Roosevelt",
    length: "short"
  },
  {
    text: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    length: "short"
  },
  {
    text: "The best time to plant a tree was twenty years ago. The second best time is now.",
    author: "Chinese Proverb",
    length: "medium"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    length: "short"
  },
  {
    text: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
    length: "short"
  },
  {
    text: "Life is either a daring adventure or nothing at all.",
    author: "Helen Keller",
    length: "short"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    length: "short"
  },
  {
    text: "Opportunity is missed by most because it is dressed in overalls and looks like work.",
    author: "Thomas Edison",
    length: "medium"
  },
  {
    text: "I have not failed. I have just found ten thousand ways that will not work.",
    author: "Thomas Edison",
    length: "medium"
  },
  {
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    length: "medium"
  },
  {
    text: "Well done is better than well said.",
    author: "Benjamin Franklin",
    length: "short"
  },
  {
    text: "Don't watch the clock what it does. Do what it does. Keep going.",
    author: "Sam Levenson",
    length: "short"
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    length: "medium"
  },
  {
    text: "Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference.",
    author: "Robert Frost",
    length: "medium"
  },
  {
    text: "You miss one hundred percent of the shots you do not take.",
    author: "Wayne Gretzky",
    length: "short"
  },
  {
    text: "Whether you think you can, or you think you cannot, you are right.",
    author: "Henry Ford",
    length: "short"
  },
  {
    text: "The most common way people give up their power is by thinking they do not have any.",
    author: "Alice Walker",
    length: "medium"
  },
  {
    text: "I learned that courage was not the absence of fear, but the triumph over it.",
    author: "Nelson Mandela",
    length: "medium"
  },
  {
    text: "If you can dream it, you can do it.",
    author: "Walt Disney",
    length: "short"
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill",
    length: "short"
  },
  {
    text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    author: "Ralph Waldo Emerson",
    length: "medium"
  },
  {
    text: "The question is not whether we will be extremists, but what kind of extremists we will be.",
    author: "Martin Luther King Jr.",
    length: "medium"
  },
  {
    text: "Yesterday is history, tomorrow is a mystery, today is a gift of God we call today.",
    author: "Bill Keane",
    length: "medium"
  },
];

export const getRandomQuote = () => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const getQuotesByLength = (length) => {
  return quotes.filter(q => q.length === length);
};
