document.addEventListener("DOMContentLoaded", () => {
  const monsterList = document.getElementById("monsterList");
  const title = document.getElementById("title");

  // Function to load all hidden monsters from chrome.storage.local
  function loadHiddenMonsters() {
      // Clear the current list
      monsterList.innerHTML = "";

      // Get all the keys from chrome.storage.local
      chrome.storage.local.get(null, (items) => {
          // Iterate over all items in chrome.storage
          Object.keys(items).forEach(key => {
              // Check if the key indicates a hidden monster
              if (key.startsWith("hiddenMonster_") && items[key] === true) {
                  // Get the monster name from the key
                  const monsterName = key.replace("hiddenMonster_", "");

                  // Create a div to display the monster with a "Show again" button
                  const monsterItem = document.createElement("div");
                  monsterItem.className = "d-flex justify-content-between align-items-center mb-2";
                  
                  // Monster name
                  const nameElement = document.createElement("span");
                  nameElement.textContent = monsterName;

                  // "Show again" button
                  const showButton = document.createElement("button");
                  showButton.className = "btn btn-primary btn-sm";
                  showButton.textContent = "Show again";
                  showButton.addEventListener("click", () => {
                      // Remove the monster from chrome.storage.local
                      chrome.storage.local.remove(key, () => {
                        chrome.runtime.sendMessage({ action: "monsterShown", monster: monsterName });

                          // Reload the hidden monsters list
                          loadHiddenMonsters();
                      });
                  });

                  // Append name and button to the monster item div
                  monsterItem.appendChild(nameElement);
                  monsterItem.appendChild(showButton);

                  // Append the monster item to the list
                  monsterList.appendChild(monsterItem);
              }
          });

          // Display a message if no monsters are hidden
          if (monsterList.innerHTML === "") {
              monsterList.innerHTML = "<p>No hidden monsters.</p>";
          }
      });
  }

  // Initial load of hidden monsters
  loadHiddenMonsters();
});
