let table = document.querySelector("#regularBossTable");
let headerRow = table.querySelector("thead > tr");
let lines = table.querySelectorAll("tbody > tr");

// Add an empty header column
let ghostHeaderColumn = document.createElement("th");
headerRow.insertBefore(ghostHeaderColumn, headerRow.firstChild);

lines.forEach(line => {
  // Retrieve the monster name from the second column (updated to correct index)
  let monsterNameElement = line.querySelector("td:nth-child(2) a");
  let monsterName = monsterNameElement ? monsterNameElement.innerText.trim() : null;

  // Check chrome.storage to see if this monster is marked as hidden
  if (monsterName) {
    chrome.storage.local.get([`hiddenMonster_${monsterName}`], (result) => {
      if (result[`hiddenMonster_${monsterName}`] === true) {
        // Hide the row if the monster is hidden
        line.style.display = "none"; // Use `line.remove()` if you want to completely remove it
      } else {
        // Create a new <td> for the button if the monster is not hidden
        let newCell = document.createElement("td");
        newCell.className = "pl-2 align-middle text-center";

        // Create the "Hide" button
        let button1 = document.createElement("button");
        button1.innerText = "Hide";
        button1.type = "button";
        button1.className = "m-1 btn btn-danger btn-sm";
        button1.addEventListener("click", () => {
          // Save the monster name to chrome.storage as hidden
          if (monsterName) {
            chrome.storage.local.set({ [`hiddenMonster_${monsterName}`]: true }, () => {
              // Add the fade-out effect
              line.classList.add("fade-out");

              // After the transition ends, set display to none
              setTimeout(() => {
                line.style.display = "none";
              }, 500); // Match the CSS transition duration
            });
          } else {
            alert("Monster name not found.");
          }
        });

        // Add the button to the new <td>
        newCell.appendChild(button1);

        // Insert the new <td> as the first cell in the row
        line.insertBefore(newCell, line.firstChild);
      }
    });
  }
});
