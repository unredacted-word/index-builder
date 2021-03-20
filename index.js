function getRanges(array) {
  var ranges = [],
    rstart,
    rend;
  for (var i = 0; i < array.length; i++) {
    rstart = array[i];
    rend = rstart;
    while (array[i + 1] - array[i] == 1) {
      rend = array[i + 1];
      i++;
    }
    ranges.push(rstart == rend ? rstart + "" : rstart + "-" + rend);
  }
  return ranges;
}

function renderItem(entry) {
  return `<li class="ix-entry">
    <span class="ix-entry-name">${entry.name}</span>:
    <span class="ix-entry-pages">${entry.pages.join(", ")}</span>
    ${render(entry.entries)}
  </li>`;
}

function render(entries) {
  if (entries.length === 0) return "";
  var output = "";
  for (var i = 0; i < entries.length; i++) {
    var item = renderItem(entries[i]);
    output = `${output}${item}`;
  }
  return `<ol>${output}</ol>`;
}

function getIndexEntryNames(e) {
  var text = "";
  if (e.hasAttribute("data-ix")) {
    text = e.getAttribute("data-ix");
  } else {
    text = e.textContent;
  }
  var entries = text.split(";");
  return entries.map(function (e) {
    return e.trim();
  });
}

function getEntryName(name) {
  /* if name is a proper name, return entire name
   * e.g. Hegel, Friedrich, return name
   */
  if (hasSubEntry(name)) {
    // has a subentry, so return first portion of name
    return name.split(",")[0].trim();
  } else {
    // a proper name, return entire entry name
    return name;
  }
}

function hasSubEntry(name) {
  // only return true if matches comma, and isn't a proper name
  if (name.match(/, [a-z]/)) {
    return true;
  }
  return false;
}

function createEntry(entries, name, element, pageNum) {
  var entryName = getEntryName(name);

  // find if entry already exists
  // TODO: this is a search, can be optimized
  var entry = null;
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].name === entryName) {
      entry = entries[i];
      break;
    }
  }

  // create a subentry record if the name has a comma
  if (hasSubEntry(name)) {
    var subEntryName = name.split(",")[1].trim();
    // create a subentry
    if (entry) {
      // update existing record
      entry.pages = [].concat(entry.pages).concat(pageNum);
      entry.entries = createEntry(
        entry.entries,
        subEntryName,
        element,
        pageNum
      );
      return entries;
    } else {
      // create new record
      entry = {
        name: entryName,
        element: element,
        pages: [pageNum],
        entries: createEntry([], subEntryName, element, pageNum),
      };
      return [].concat(entries).concat(entry);
    }
  } else {
    if (entry) {
      // update existing record
      entry.pages = [].concat(entry.pages).concat(pageNum);
      entry.entries = [].concat(entry.entries);
      return entries;
    } else {
      // create new record
      entry = {
        name: getEntryName(name),
        element: element,
        pages: [pageNum],
        entries: [],
      };
      return [].concat(entries).concat(entry);
    }
  }
}

function buildIndex() {
  var entries = [];
  var injectElement = document.getElementById("index-entries");

  // get all index elements
  var ixs = document.querySelectorAll(".ix");
  for (var a = 0; a < ixs.length; a++) {
    // get the index entry name
    var element = ixs[a];
    var names = getIndexEntryNames(element);
    // for each index entry name
    for (var b = 0; b < names.length; b++) {
      // get its page number
      var pageNum = Math.floor(Math.random() * 20);
      // for each index tag, create an index entry
      // { id, name, element, pages: [page], entries: [entry]}
      entries = createEntry(entries, names[b], element, pageNum);
    }
  }
  // sort the list case insensitive
  var sortedEntries = entries.sort(function (a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
  // sort and collapse the pages into ranges
  var rangedEntries = sortedEntries.map(function (j) {
    // sort page numbers
    var sortedPages = j.pages.sort(function (a, b) {
      return a - b;
    });
    // remove duplicate pages
    var deDupedPages = [];
    if (sortedPages.length > 1) {
      for (var i = 1; i < sortedPages.length; i++) {
        if (sortedPages[i] !== sortedPages[i - 1]) {
          deDupedPages.push(sortedPages[i]);
        }
      }
    } else {
      deDupedPages = [].concat(sortedPages);
    }
    var ranged = getRanges(deDupedPages);
    return {
      name: j.name,
      element: j.element,
      pages: ranged,
      entries: j.entries,
    };
  });
  // convert list to HTML list
  var str = render(rangedEntries);
  // inject html into the DOM
  injectElement.innerHTML = str;
}