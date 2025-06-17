const quotes = [
"Don’t drink and derive.",
"Marge, I agree with you in theory. IN THEORY communism works. In theory. — Homer Simpson",
"Stay hungry. Stay foolish. — Steve Jobs",
"If gravity sucks — go flying",
"STAY FOCUSED — Get It Done",
"Be alone, that is the secret of invention; be alone, that is when ideas are born. – Nikola Tesla",
"I don't care that they stole my idea... I care that they don't have any of their own. – Nikola Tesla",
"If you want to find the secrets of the universe, think in terms of energy, frequency and vibration. – Nikola Tesla",
"Make things as simple as possible, but not simpler. – Albert Einstein",
"Two things are infinite: the universe and human stupidity; and I'm not sure about the universe. – Albert Einstein",
"So many books, so little time. – Frank Zappa",
"Life begins at the end of your comfort zone. – Neale Donald Walsch",
"People will come to love their oppression, to adore the technologies that undo their capacities to think. – Aldous Huxley",
"I have not failed. I've just found 10,000 ways that won't work. – Thomas Edison",
"Young man, in mathematics you don't understand things. You just get used to them. – John von Neumann",
"If people do not believe that mathematics is simple, it is only because they do not realize how complicated life is. – John von Neumann",
"All models are wrong, but some are useful. – George E. P. Box",
"The scientist does not study nature because it is useful to do so. He studies it because he takes pleasure in it, and he takes pleasure in it because it is beautiful. – Henri Poincaré",
// "The mathematician plays a game in which he himself invents the rules while the physicist plays a game in which the rules are provided by nature, but as time goes on it becomes increasingly evident that the rules which the mathematician finds interesting are the same as those which nature has chosen. – Paul A.M. Dirac", //good one but too long
];

function getQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}
