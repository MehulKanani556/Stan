// Utility function to test loader functionality
export const testLoaderFunctionality = () => {
  // Clear localStorage to simulate first visit
  localStorage.removeItem('hasVisited');
  console.log('✅ localStorage cleared - next visit will be treated as first visit');
  
  // Reload the page to test first visit behavior
  window.location.reload();
};

export const resetLoaderState = () => {
  localStorage.removeItem('hasVisited');
  console.log('✅ Loader state reset - next home page visit will show loader');
};

// Add to window for easy testing in browser console
if (typeof window !== 'undefined') {
  window.testLoader = testLoaderFunctionality;
  window.resetLoader = resetLoaderState;
}
