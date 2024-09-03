import create from 'zustand';

// Create Zustand store
const useWordStore = create((set) => ({
  // Initial state with dummy data
  wordLists: {
    listA: ['apple', 'apricot', 'ant', 'banana', 'berry'],
    listB: ['cat', 'car', 'candy', 'dog', 'door'],
    listC: ['elephant', 'eagle', 'ear', 'fish', 'frog']
  },

  // Function to find words starting with a given prefix
  findWordsStartingWith: (prefix) => {
    const { wordLists } = useWordStore.getState();
    const results = [];

    // Iterate over each list
    for (const [listName, words] of Object.entries(wordLists)) {
      // Find words that start with the given prefix
      const matchedWords = words.filter(word => word.startsWith(prefix));
      
      // If there are matched words, add them to the results
      if (matchedWords.length > 0) {
        results.push({ listName, matchedWords });
      }
    }

    return results;
  }
}));

export default useWordStore;
