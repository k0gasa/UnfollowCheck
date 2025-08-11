(() => {
  const $userCell = '[data-testid="UserCell"]';
  const $followIndicator = '[data-testid="userFollowIndicator"]';

  const state = {
    nonFollowers: new Set(),
    processedUsers: new Set(),
    lastScrollHeight: 0,
    consecutiveStops: 0,
    stopScrolling: false,
  };

  const collectNonFollowers = () => {
    const userCells = document.querySelectorAll($userCell);

    if (userCells.length === 0 && state.processedUsers.size === 0) {
      console.error("Error: Could not find any user cells. The script's selectors might need an update due to a Twitter/X layout change.");
      state.stopScrolling = true;
      return;
    }

    userCells.forEach(cell => {
      // This is the new, more robust logic for finding the username.
      // It finds all links, then finds all spans inside them, and correctly identifies
      // the last one that starts with '@', which is always the username handle.
      const allSpansInLinks = cell.querySelectorAll('a[href] span');
      let usernameElement = null;

      // Iterate backwards to find the last valid handle first
      for (let i = allSpansInLinks.length - 1; i >= 0; i--) {
        if (allSpansInLinks[i].innerText.startsWith('@')) {
          usernameElement = allSpansInLinks[i];
          break;
        }
      }

      // If we couldn't find a valid username element, skip this cell.
      if (!usernameElement) {
        return;
      }
      
      const screenName = usernameElement.innerText.trim();

      if (state.processedUsers.has(screenName)) {
        return;
      }

      state.processedUsers.add(screenName);

      const followsYou = cell.querySelector($followIndicator);
      
      if (!followsYou) {
        state.nonFollowers.add(screenName);
        console.log(`Added to list: ${screenName}`);
      }
    });
  };

  const downloadList = () => {
    if (state.nonFollowers.size === 0) {
      alert("Script finished. No non-followers were found on your list.");
      console.log("Process complete. It seems everyone you follow also follows you back!");
      return;
    }

    const userList = Array.from(state.nonFollowers).join('\n');
    const blob = new Blob([userList], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'non_followers.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`Download complete! Found ${state.nonFollowers.size} users who don't follow you back.`);
    alert(`Download complete! Found ${state.nonFollowers.size} users who don't follow you back.`);
  };

  const scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  const runScript = () => {
    console.log("Starting script... This may take a few moments as it scrolls through your full 'Following' list.");
    
    const scrollInterval = setInterval(() => {
      if (state.stopScrolling) {
        clearInterval(scrollInterval);
        downloadList();
        return;
      }

      collectNonFollowers();
      scrollToBottom();

      if (document.documentElement.scrollHeight === state.lastScrollHeight) {
        state.consecutiveStops++;
      } else {
        state.consecutiveStops = 0;
      }

      state.lastScrollHeight = document.documentElement.scrollHeight;

      if (state.consecutiveStops >= 3) {
        clearInterval(scrollInterval);
        console.log("Reached the end of the list. Finalizing and preparing download...");
        // One final collection to be sure
        collectNonFollowers(); 
        downloadList();
      }
    }, 2000); 
  };

  runScript();
})();