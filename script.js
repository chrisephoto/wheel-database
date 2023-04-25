// event listeners
window.onload=function(){
  document.getElementById("wheel-details-close").addEventListener("click", closeDetails);
  populateFilters();
  for (let i = 0; i < dataset.length; i++) {
    populateGrid(i)
  }
}

window.onkeydown=function(e){
  if(e.which == 27) {
    closeDetails();
  }
}

document.addEventListener("click", event => {
  if (document.getElementById("wheel-details").classList.contains("open")) {
    const validClick1 = document.getElementById("wheel-details").contains(event.target)
    const validClick2 = document.getElementById("wheel-list").contains(event.target)
    if (!validClick1 && !validClick2) {
      closeDetails();
    }
  }
})

// functions
function populateFilters() {
  for (let i = 0; i < filters.brand.length; i++) {
    const input = document.getElementById("input-brand");
    const option = document.createElement("option");
    option.value = filters.brand[i];
    option.innerHTML = filters.brand[i];
    input.appendChild(option);
  }
  for (let i = 0; i < filters.style.length; i++) {
    const input = document.getElementById("input-style");
    const option = document.createElement("option");
    option.value = filters.style[i];
    option.innerHTML = filters.style[i];
    input.appendChild(option);
  }
  for (let i = 0; i < filters.diameter.length; i++) {
    const input = document.getElementById("input-diameter");
    const option = document.createElement("option");
    option.value = filters.diameter[i];
    option.innerHTML = filters.diameter[i] + "&quot;";
    input.appendChild(option);
  }
  for (let i = 0; i < filters.pcd.length; i++) {
    const input = document.getElementById("input-pcd");
    const option = document.createElement("option");
    option.value = filters.pcd[i];
    option.innerHTML = filters.pcd[i];
    input.appendChild(option);
  }
  for (let i = 0; i < filters.year.length; i++) {
    const input = document.getElementById("input-year");
    const option = document.createElement("option");
    option.value = filters.year[i];
    option.innerHTML = filters.year[i];
    input.appendChild(option);
  }
}

function populateGrid(i) {
  const content = document.getElementById("wheel-list");
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  const div = document.createElement("div");
  content.appendChild(figure);
  figure.onclick = function(){populateDetails(i)}
  figure.appendChild(img);
  img.src = dataset[i].images[0];
  figure.appendChild(figcaption);
  figcaption.innerHTML = dataset[i].shortname;
}

function populateDetails(i) {
  document.getElementById("wheel-info-shortname").innerHTML = dataset[i].shortname;
  document.getElementById("wheel-info-description").innerHTML = dataset[i].description;
  document.getElementById("wheel-info-brand").innerHTML = dataset[i].brand;
  document.getElementById("wheel-info-model").innerHTML = dataset[i].model;
  document.getElementById("wheel-info-manufacturer").innerHTML = dataset[i].manufacturer;
  document.getElementById("wheel-info-years").innerHTML = dataset[i].yearStart + " - " + dataset[i].yearEnd;
  document.getElementById("wheel-info-origin").innerHTML = dataset[i].origin;
  document.getElementById("wheel-info-construction").innerHTML = dataset[i].construction;
  document.getElementById("wheel-info-style").innerHTML = dataset[i].style;
  document.querySelector("#wheel-info-link a").href = dataset[i].link;
  for (let j = 0; j < dataset[i].sizes.length; j++) {
    const table = document.querySelector("#wheel-specs tbody");
    const row  = document.createElement("tr");
    table.appendChild(row);
    for (const data in dataset[i].sizes[j]) {
      const cell = document.createElement("td");
      const text = document.createTextNode(dataset[i].sizes[j][data]);
      row.appendChild(cell);
      cell.appendChild(text);
    }
  }
  for (let j = 0; j < dataset[i].images.length; j++) {
    const target = document.getElementById("wheel-images");
    const image  = document.createElement("img");
    target.appendChild(image);
    image.src = dataset[i].images[j];
  }
  document.getElementById("wheel-details").classList = "open";
}

function closeDetails() {
  //remove class to hide modal
  document.getElementById("wheel-details").classList = "";
  
  //clear details from modal
  setTimeout(function(){
    const images = document.querySelectorAll('#wheel-details img');
    images.forEach(images => {
      images.remove();
    });
    const rows = document.querySelectorAll('#wheel-specs tr:not(:first-of-type)');
    rows.forEach(rows => {
      rows.remove();
    });
  }, 200)
}

function applyFilter() {
  //create array
  filterIndexes = []
  
  //set filter params
  //filterSearch = document.getElementById("input-search").value;
  filterBrand = document.getElementById("input-brand").value;
  //filterMfg = document.getElementById("input-mfg").value;
  filterYear = [];
  for (var option of document.getElementById("input-year").options) {
      if (option.selected) {
          filterYear.push(option.value);
      }
  }
  //filterConstruction = document.getElementById("input-construction").value;
  filterStyle = document.getElementById("input-style").value;
  filterDiameter = [];
  for (var option of document.getElementById("input-diameter").options) {
      if (option.selected) {
          filterDiameter.push(option.value);
      }
  }
  filterPCD = [];
  for (var option of document.getElementById("input-pcd").options) {
      if (option.selected) {
          filterPCD.push(option.value);
      }
  }
    
  //check dataset for matches
  for (let i = 0; i < dataset.length; i++) {
    //matchSearch = true;
    matchBrand = true;
    //matchMfg = true;
    matchYear = false;
    //matchConstruction = true;
    matchStyle = true;
    matchSize = false;
    
    //matchSearch
    if (filterBrand && dataset[i].brand != filterBrand) {
      matchBrand = false;
    }
    
    //matchBrand
    if (filterBrand && dataset[i].brand != filterBrand) {
      matchBrand = false;
    }
    
    //matchMfg
    
    //matchYear
    for (let j = 0; j < filterYear.length; j++) {
      if ((filterYear[j] >= dataset[i].yearStart && filterYear[j] <= dataset[i].yearEnd) || !filterYear[j]) {
        matchYear = true;
        break;
      }
    }
    
    //matchConstruction
    
    //matchStyle
    if (filterStyle && dataset[i].style != filterStyle) {
      matchStyle = false;
    }
    
    //matchSize    
    matchSizeLoop: for (let j = 0; j < filterDiameter.length; j++) {
      for (let k = 0; k < dataset[i].sizes.length; k++) {
        if (dataset[i].sizes[k].diameter.includes(filterDiameter[j]) || !filterDiameter[j]) {
          for (let l = 0; l < filterPCD.length; l++) {
            if (dataset[i].sizes[k].pcd.includes(filterPCD[l]) || !filterPCD[l]) {
              matchSize = true;
              break matchSizeLoop;
            }
          }
        }
      }
    }
    
    //add matches to index list
    if (matchBrand && matchYear && matchStyle && matchSize) {
      filterIndexes.push(i);
    }
  }
  
  //clear wheel list
  document.getElementById("wheel-list").innerHTML = "";
  
  //populate wheel list
  for (let j = 0; j < filterIndexes.length; j++) {
    populateGrid(filterIndexes[j])
  }
}

function resetFilter() {
  //clear wheel list
  document.getElementById("wheel-list").innerHTML = "";
  
  //populate wheel list
  for (let i = 0; i < dataset.length; i++) {
    populateGrid(i)
  }
  
  //reset inputs
  document.getElementById("wheel-filters-form").reset()
}
