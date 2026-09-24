// Initialize empty global dataset
let dataset = [];
window.onload = async function() {
  try {
    // Fetch the JSON file
    const response = await fetch('dataset.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    dataset = await response.json();
  } catch (error) {
    console.error('Failed to load wheel dataset:', error);
    document.getElementById("display-count").innerHTML = "Error loading database.";
    return; // Stop initialization if data fails to load
  }

  // Initialize event listeners
  document.getElementById('wheel-details-close').addEventListener('click', () => closeDetails(false));
  document.getElementById('button-favorite').addEventListener('click', showFavoritesOnly);
  document.getElementById('button-random').addEventListener('click', randomWheel);
  document.getElementById('button-theme').addEventListener('click', toggleTheme);
  document.getElementById('input-search').addEventListener('change', () => applyFilter());
  document.getElementById('input-brand').addEventListener('change', () => applyFilter());
  document.getElementById('input-manufacturer').addEventListener('change', () => applyFilter());
  document.getElementById('input-construction').addEventListener('change', () => applyFilter());
  document.getElementById('input-style').addEventListener('change', () => applyFilter());
  document.getElementById('input-diameter').addEventListener('change', () => applyFilter());
  document.getElementById('input-pcd').addEventListener('change', () => applyFilter());
  document.getElementById('input-favorite').addEventListener('change', () => applyFilter());
  document.addEventListener('keydown', handleKeyboardShortcuts);
  window.addEventListener('popstate', () => updatePage(true));

  // Apply user preferences, populate UI, and load initial state
  applyPrefs();
  populateFilters();
  updatePage(); // updatePage handles the initial filtering, grid population, and counting
};

function applyPrefs() {
  // Apply the theme if a preference exists
  const theme = localStorage.getItem("theme");
  
  if (theme === 'theme-dark') {
    document.body.classList.add('theme-dark');
    document.body.classList.remove('theme-light');
    document.querySelector('#button-theme').innerHTML = 'light_mode';
  }
}

function applyFilter(skipHistory = false) {
  // Retrieve current filter values
  const filterSearch = document.getElementById('input-search').value.toUpperCase();
  const filterBrand = document.getElementById('input-brand').value;
  const filterManufacturer = document.getElementById('input-manufacturer').value;
  const filterConstruction = document.getElementById('input-construction').value;
  const filterStyle = document.getElementById('input-style').value;
  const filterDiameter = document.getElementById('input-diameter').value;
  const filterPCD = document.getElementById('input-pcd').value;
  const filterFavorite = document.getElementById('input-favorite').checked;

  const favorites = getFavorites(); 
    
  // Filter the dataset using modern array methods
  const filteredIndexes = dataset.reduce((acc, wheel, i) => {
    // Check search term across multiple fields
    let matchSearch = true;
    if (filterSearch) {
      const wheelName = `${wheel.brand} ${wheel.model}`.toUpperCase();
      matchSearch = wheelName.includes(filterSearch) || 
                    wheel.description.toUpperCase().includes(filterSearch) ||
                    wheel.tags.some(tag => tag.toUpperCase().includes(filterSearch)) ||
                    wheel.construction.some(c => c.toUpperCase().includes(filterSearch));
    }
    
    // Check exact matches for dropdowns
    const matchBrand = !filterBrand || wheel.brand === filterBrand;
    const matchManufacturer = !filterManufacturer || wheel.manufacturer === filterManufacturer;
    const matchConstruction = !filterConstruction || wheel.construction.includes(filterConstruction);
    const matchStyle = !filterStyle || wheel.style === filterStyle;

    // Check sizes array for diameter and PCD matches
    const matchDiameter = !filterDiameter || wheel.sizes.some(size => size.diameter == filterDiameter);
    const matchPCD = !filterPCD || wheel.sizes.some(size => size.pcd == filterPCD);
    
    // Check if the wheel is in the favorites array (only if the checkbox is checked)
    const matchFavorite = !filterFavorite || favorites.includes(wheel.id);
    
    // If all conditions are met, save the index
    if (matchSearch && matchBrand && matchManufacturer && matchConstruction && matchStyle && matchDiameter && matchPCD && matchFavorite) {
      acc.push(i);
    }
    return acc;
  }, []);
  
  // Clear and repopulate the wheel list
  const listContainer = document.querySelector('#wheel-list > div');
  listContainer.innerHTML = '';
  filteredIndexes.forEach(index => populateGrid(index, listContainer));

  // Scroll to top of results
  document.querySelector('main').scrollTo(0,0);
  document.getElementById('wheel-select').scrollTo(0,0);

  updateCount(filteredIndexes.length);

  if (!skipHistory) {
    updateHistory();
  }
}

function closeDetails(skipHistory = false) {
  document.getElementById('wheel-details').classList.remove('open');
  if (!skipHistory) {
    updateHistory();
  }
}

function getDetails(id) {
  // Find the index of the wheel by its ID and open details
  const index = dataset.findIndex(wheel => wheel.id == id);
  if (index !== -1) {
    populateDetails(index, false);
  }
  document.getElementById('wheel-details').scrollTo(0,0);
}

function getFavorites() {
  const storedFavs = localStorage.getItem("favorites");
  return storedFavs ? JSON.parse(storedFavs) : [];
}

function handleKeyboardShortcuts(event) {
  const detailsModal = document.getElementById('wheel-details');
  const isOpen = detailsModal.classList.contains('open');

  // 1. Escape Key: Close details
  if (event.key === 'Escape' && isOpen) {
    closeDetails(); // No need to pass skipHistory; let it default to false
    return;
  }

  // 2. Left/Right Arrow Keys: Navigate previous/next
  if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && isOpen) {
    event.preventDefault(); // Prevent horizontal page scrolling

    const displayedFigures = Array.from(document.querySelectorAll('#wheel-list > div > figure'));
    if (displayedFigures.length === 0) return;

    const currentId = document.getElementById('wheel-id').textContent;
    const currentIndex = displayedFigures.findIndex(fig => fig.id === currentId);

    if (currentIndex === -1) return;

    let newIndex;
    if (event.key === 'ArrowLeft') {
      newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = displayedFigures.length - 1;
    } else if (event.key === 'ArrowRight') {
      newIndex = currentIndex + 1;
      if (newIndex >= displayedFigures.length) newIndex = 0;
    }

    const targetId = displayedFigures[newIndex].id;
    const globalDatasetIndex = dataset.findIndex(wheel => wheel.id == targetId);

    if (globalDatasetIndex !== -1) {
      populateDetails(globalDatasetIndex);
    }
    return;
  }

  // 3. Search Shortcut: Ctrl+K / Cmd+K OR forward slash (/)
  // We check if the user is ALREADY typing in an input field to prevent interrupting them
  const isTyping = document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA';

  if (!isTyping) {
    // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
    const isCmdK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
    // Check for forward slash
    const isSlash = event.key === '/';

    if (isCmdK || isSlash) {
      event.preventDefault(); // Prevents the browser's default search bar or typing the '/' character
      
      if (isOpen) {
        closeDetails(); // Close the modal if it's open
      }
      
      const searchInput = document.getElementById('input-search');
      searchInput.focus();
      searchInput.select(); // Highlights existing text so they can instantly type over it
    }
  }
}

function openDetails(skipHistory = false) {
  document.getElementById('wheel-details').classList.add('open');
  if (!skipHistory) {
    updateHistory();
  }
}

function populateDetails(i, skipHistory = false) {
  const wheel = dataset[i];
  
  // Scroll to top
  document.getElementById('wheel-details').scrollTo(0,0);

  // Clear existing detail information safely
  const heroHero = document.querySelector('#wheel-details-hero img');
  if (heroHero) heroHero.remove();
  
  document.getElementById('wheel-header-tags').innerHTML = "";
  document.getElementById('wheel-info-construction').innerHTML = "";
  document.getElementById('wheel-info-colors').innerHTML = "";
  document.getElementById('wheel-images').innerHTML = "";
  document.getElementById('wheel-related').innerHTML = '';
  document.getElementById('wheel-links').innerHTML = "";
  
  // Remove all but the first table row (headers)
  document.querySelectorAll('#wheel-specs tr:not(:first-of-type)').forEach(row => row.remove());

  // Load basic wheel information
  document.getElementById('wheel-id').innerHTML = wheel.id;
  
  const heroTarget = document.getElementById('wheel-details-hero');
  const heroImage = document.createElement('img');
  heroImage.src = `images/${wheel.id}/00.png`;
  heroTarget.appendChild(heroImage);

  document.getElementById('wheel-header-brand').innerHTML = wheel.brand;
  document.getElementById('wheel-header-model').innerHTML = wheel.model;
  
  // Load favorite button
  const favorites = getFavorites();
  const isFavorite = favorites.includes(wheel.id);
  const favClass = isFavorite ? 'material-symbols-favorite-true' : 'material-symbols-favorite-false';
  const favClass2 = isFavorite ? 'btn-primary' : 'btn-secondary';
  
  document.getElementById('wheel-header-favorite').innerHTML = `
    <span id="wheel-header-favorite-button" class="${favClass2}">
      <span style="margin-top:2px;" class="favorite-icon-btn material-symbols-rounded ${favClass}" data-wheel-id="${wheel.id}" onclick="toggleFavorite('${wheel.id}', event)">favorite</span>
      <span class="favorite-text-btn" data-wheel-id="${wheel.id}" onclick="toggleFavorite('${wheel.id}', event)">Favorite</span>
    </span>
  `;

  // Load tags
  let tagsHTML = `<span class="clickable-tag" onclick="searchByTag('input-brand', '${wheel.brand}')">${wheel.brand}</span>\n`;
  
  if (wheel.manufacturer && wheel.manufacturer !== 'Unverified') {
    tagsHTML += `<span class="clickable-tag" onclick="searchByTag('input-manufacturer', '${wheel.manufacturer}')">${wheel.manufacturer}</span>\n`;
  }

  tagsHTML += wheel.construction.map(c => 
    `<span class="clickable-tag" onclick="searchByTag('input-construction', '${c}')">${c}</span>\n`
  ).join('');
  
  tagsHTML += `<span class="clickable-tag" onclick="searchByTag('input-style', '${wheel.style}')">${wheel.style}</span>\n`;
  
  tagsHTML += wheel.tags.map(t => 
    `<span class="clickable-tag" onclick="searchByTag('input-search', '${t}')">${t}</span>\n`
  ).join('');
  
  document.getElementById('wheel-header-tags').innerHTML = tagsHTML;

  // Populate details fields
  document.getElementById('wheel-header-description').innerHTML = wheel.description;
  document.getElementById('wheel-info-brand').innerHTML = `<span>${wheel.brand}</span>`;
  document.getElementById('wheel-info-model').innerHTML = wheel.model;
  document.getElementById('wheel-info-manufacturer').innerHTML = `<span>${wheel.manufacturer}</span>`;
  
  // Format years
  document.getElementById('wheel-info-years').innerHTML = (wheel.year_start === wheel.year_end) 
    ? wheel.year_start 
    : `${wheel.year_start} - ${wheel.year_end}`;
    
  document.getElementById('wheel-info-origin').innerHTML = wheel.origin;
  
  // Format construction and colors
  document.getElementById('wheel-info-construction').innerHTML = wheel.construction.map(c => `<span>${c}</span>`).join(', ');
  document.getElementById('wheel-info-colors').innerHTML = wheel.colors.map(c => `<span>${c}</span>\n`).join('');

  // Load size specifications table
  const tableBody = document.querySelector('#wheel-specs tbody');
  wheel.sizes.forEach(size => {
    const row = document.createElement('tr');
    Object.values(size).forEach(val => {
      const cell = document.createElement('td');
      cell.textContent = val;
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });

  // Load gallery images
  const imagesTarget = document.getElementById('wheel-images');
  const minSlots = 12;

  // 1. Append all actual images
  wheel.images.forEach(imgName => {
    const link = document.createElement('a');
    link.href = `images/${wheel.id}/${imgName}`;
    link.target = '_blank';
    
    const image = document.createElement('img');
    image.src = `images/${wheel.id}/${imgName}`;
    
    link.appendChild(image);
    imagesTarget.appendChild(link);
  });

  // 2. Calculate how many placeholders are needed
  const placeholdersNeeded = minSlots - wheel.images.length;

  // 3. Append placeholder divs if we have fewer than 12 images
  for (let i = 0; i < placeholdersNeeded; i++) {
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder'); // Use classList.add for safety
    imagesTarget.appendChild(placeholder);
  }

  // Load related wheels
  const relatedContainer = document.getElementById('wheel-related-container');
  if (wheel.related && wheel.related.length > 0) {
    relatedContainer.classList.remove('hidden');
    const target = document.getElementById('wheel-related');
    
    wheel.related.forEach(relatedId => {
      const relatedWheel = dataset.find(w => w.id == relatedId);
      if (relatedWheel) {
        const figure = document.createElement('figure');
        figure.onclick = () => getDetails(relatedId);
        
        figure.innerHTML = `
          <img src="images/${relatedId}/00.png" alt="${relatedWheel.brand} ${relatedWheel.model}">
          <figcaption>
            <p>${relatedWheel.brand}</p>
            <p>${relatedWheel.model}</p>
          </figcaption>
        `;
        target.appendChild(figure);
      }
    });
  } else {
    relatedContainer.classList.add('hidden');
  }

  // Load external links
  const linksContainer = document.getElementById('wheel-links-container');
  if (wheel.links && wheel.links.length > 0) {
    linksContainer.classList.remove('hidden');
    const linksTarget = document.getElementById('wheel-links');
    linksTarget.innerHTML = wheel.links.map(link => `<a href="${link}" target="_blank">${link}</a>`).join('');
  } else {
    linksContainer.classList.add('hidden');
  }

  openDetails(skipHistory);
}

function populateFilters() {
  // Use Set to automatically filter out duplicate brands, then sort alphabetically
  const brandArray = [...new Set(dataset.map(wheel => wheel.brand))].sort();
  const brandInput = document.getElementById('input-brand');
  
  brandArray.forEach(brand => {
    const option = document.createElement('option');
    option.value = brand;
    option.textContent = brand;
    brandInput.appendChild(option);
  });

  // Use Set to filter out duplicate manufacturers, excluding 'Unverified', then sort
  const manufacturerArray = [...new Set(
    dataset.map(wheel => wheel.manufacturer).filter(m => m !== 'Unverified')
  )].sort();
  const manufacturerInput = document.getElementById('input-manufacturer');
  
  manufacturerArray.forEach(manufacturer => {
    const option = document.createElement('option');
    option.value = manufacturer;
    option.textContent = manufacturer;
    manufacturerInput.appendChild(option);
  });
}

function populateGrid(i, container = document.querySelector('#wheel-list > div')) {
  const wheel = dataset[i];
  const figure = document.createElement('figure');
  figure.id = wheel.id;
  figure.onclick = () => populateDetails(i, false);
  
  // Check the current favorite status to render the correct class on load
  const favorites = getFavorites();
  const isFavorite = favorites.includes(wheel.id);
  const favClass = isFavorite ? 'material-symbols-favorite-true' : 'material-symbols-favorite-false';
  const tooltipText = isFavorite ? 'Remove favorite' : 'Add favorite';
  
  // Note: Removed id="button-code" from the span. 
  // IDs must be unique, so looping them in a grid creates invalid HTML. 
  // Replaced with a class if you need to target it via CSS.
  figure.innerHTML = `
    <span class="favorite-btn material-symbols-rounded ${favClass}" data-wheel-id="${wheel.id}" tooltip="${tooltipText}" onclick="toggleFavorite('${wheel.id}', event)">favorite</span>
    <img src="images/${wheel.id}/00.png" alt="${wheel.brand} ${wheel.model}">
    <figcaption>
      <p>${wheel.brand}</p>
      <p>${wheel.model}</p>
    </figcaption>
  `;
  container.appendChild(figure);
}

function randomWheel() {
    min = 0;
    max = dataset.length;
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    i = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    populateDetails(i)
}

function resetFilter(skipHistory = false) {
  // Reset the form inputs
  document.getElementById('wheel-filters-form').reset();
  // Re-apply filters based on the empty inputs
  applyFilter(skipHistory);
}

function searchByTag(inputId, value) {
  // Set the value of the targeted search field
  document.getElementById(inputId).value = value;
  
  // Apply the filter to update the grid
  applyFilter();
  
  // Close the details panel so the user can see the filtered results
  closeDetails();
}

function showFavoritesOnly() {
  // Clear all text and select inputs
  document.getElementById('input-search').value = '';
  document.getElementById('input-brand').value = '';
  document.getElementById('input-manufacturer').value = '';
  document.getElementById('input-style').value = '';
  document.getElementById('input-diameter').value = '';
  document.getElementById('input-pcd').value = '';
  
  // Check the favorites only checkbox
  document.getElementById('input-favorite').checked = true;
  
  // Trigger the search
  applyFilter();

  // Scroll to top of results
  document.querySelector('main').scrollTo(0,0);
  document.getElementById('wheel-select').scrollTo(0,0);

  // Close the wheel details pane if open
  closeDetails();
}

function toggleFavorite(wheelId, event) {
  event.stopPropagation(); 
  const favorites = getFavorites();
  const index = favorites.indexOf(wheelId);
  const isNowFavorite = index === -1;

  if (isNowFavorite) {
    favorites.push(wheelId);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Update the heart icons in the background grid
  const gridIcons = document.querySelectorAll(`.favorite-btn[data-wheel-id="${wheelId}"]`);
  gridIcons.forEach(icon => {
    if (isNowFavorite) {
      icon.classList.replace('material-symbols-favorite-false', 'material-symbols-favorite-true');
      icon.setAttribute('tooltip', 'Remove favorite');
    } else {
      icon.classList.replace('material-symbols-favorite-true', 'material-symbols-favorite-false');
      icon.setAttribute('tooltip', 'Add favorite');
    }
  });

  // Update the text label in the details panel
  if (isNowFavorite) {
    document.getElementById('wheel-header-favorite-button').classList.replace('btn-secondary', 'btn-primary');
  } else {
    document.getElementById('wheel-header-favorite-button').classList.replace('btn-primary', 'btn-secondary');
  }

  // Update the heart icon next to the text in the details panel
  const detailIcons = document.querySelectorAll(`.favorite-icon-btn[data-wheel-id="${wheelId}"]`);
  detailIcons.forEach(icon => {
    if (isNowFavorite) {
      icon.classList.replace('material-symbols-favorite-false', 'material-symbols-favorite-true');
    } else {
      icon.classList.replace('material-symbols-favorite-true', 'material-symbols-favorite-false');
    }
  });
}

function toggleTheme() {
  const bodyClass = document.body.classList;
  const toggleBtn = document.getElementById('button-theme');

  if (bodyClass.contains('theme-light') || !bodyClass.contains('theme-dark')) {
    bodyClass.remove('theme-light');
    bodyClass.add('theme-dark');
    toggleBtn.innerHTML = 'light_mode';
    localStorage.setItem("theme", "theme-dark");
  } else {
    bodyClass.remove('theme-dark');
    bodyClass.add('theme-light');
    toggleBtn.innerHTML = 'dark_mode';
    localStorage.setItem("theme", "theme-light");
  }
}

function updateCount(currentCount) {
  const displayCountEl = document.getElementById("display-count");
  if (currentCount === 0) {
    displayCountEl.innerHTML = "No results found. <a href='#' onclick='resetFilter(); return false;'>Clear filters</a>.";
  } else {
    displayCountEl.innerHTML = `Displaying ${currentCount} of ${dataset.length} wheels`;
  }
}

function updateHistory() {
  const queryString = new URL(window.location);

  // Map input IDs to their URL parameter keys (removed input-favorite)
  const paramsMap = {
    'input-search': 'q',
    'input-brand': 'b',
    'input-manufacturer': 'm',
    'input-construction': 'c',
    'input-style': 's',
    'input-diameter': 'd',
    'input-pcd': 'p'
  };

  // Loop through text and select inputs and dynamically update URL parameters
  Object.entries(paramsMap).forEach(([inputId, paramKey]) => {
    const val = document.getElementById(inputId).value;
    if (val) {
      queryString.searchParams.set(paramKey, val);
    } else {
      queryString.searchParams.delete(paramKey);
    }
  });

  // Handle the favorites checkbox separately using .checked
  if (document.getElementById('input-favorite').checked) {
    queryString.searchParams.set('f', 'true');
  } else {
    queryString.searchParams.delete('f');
  }

  // Handle Detail View State in URL
  if (document.getElementById('wheel-details').classList.contains('open')) {
    const currentId = document.getElementById('wheel-id').textContent;
    queryString.searchParams.set('id', currentId);
  } else {
    queryString.searchParams.delete('id');
  }

  // Push the new URL
  window.history.pushState(null, '', queryString);
  
  // Sync the title during normal navigation
  updateTitle(); 
}

function updatePage(skipHistory = false) {
  const urlParams = new URLSearchParams(window.location.search);

  // Reset form
  document.getElementById('wheel-filters-form').reset();

  // Helper function to safely set select/input values if they exist in the URL
  const setInputValue = (inputId, paramKey) => {
    const paramVal = urlParams.get(paramKey);
    if (paramVal) document.getElementById(inputId).value = paramVal;
  };

  setInputValue('input-search', 'q');
  setInputValue('input-brand', 'b');
  setInputValue('input-manufacturer', 'm');
  setInputValue('input-style', 's');
  setInputValue('input-construction', 'c');
  setInputValue('input-diameter', 'd');
  setInputValue('input-pcd', 'p');

  // Handle the favorite checkbox state specifically
  if (urlParams.get('f') === 'true') {
    document.getElementById('input-favorite').checked = true;
  }

  // Apply filters based on the loaded URL params
  applyFilter(skipHistory);

  // Check if an ID is present in the URL to open details
  const urlId = urlParams.get('id');
  if (urlId) {
    const index = dataset.findIndex(wheel => wheel.id == urlId);
    if (index !== -1) {
      populateDetails(index, skipHistory);
    } else {
      closeDetails(skipHistory);
    }
  } else {
    closeDetails(skipHistory);
  }

  // Ensure the title syncs up when navigating via browser history
  updateTitle(); 
}

function updateTitle() {
  let newTitle = 'Wheel Database';

  // Check if any search or filter inputs have a value
  const isSearching = ['input-search', 'input-brand', 'input-manufacturer', 'input-style', 'input-diameter', 'input-pcd']
    .some(id => document.getElementById(id).value !== '');

  if (isSearching) {
    newTitle = 'Wheel Database - Search';
  }

  // Detail view overrides the search title
  if (document.getElementById('wheel-details').classList.contains('open')) {
    const currentBrand = document.getElementById('wheel-info-brand').textContent;
    const currentModel = document.getElementById('wheel-info-model').textContent;
    newTitle = `Wheel Database - ${currentBrand} ${currentModel}`;
  }

  document.title = newTitle;
}