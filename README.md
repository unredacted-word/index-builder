# index builder

mark up your document with index annotations, by adding a classname to any tag
it'll be marked to indexing. By default index-builder will use the the
textContent of the tag, but you can customize the text with a data-attribute
if the index entry doesn't match the inline text.

* classname: `.ix`
* attribute: `data-ix`

```html
This is a block of text with <span class="ix">annotations</span>.
By default, the <span class="ix" data-ix"html DOM">textContent</span> in the tag
is used as the index entry. If you need to change the index entry, you can add
the data-ix attribute and specify different text. You can also use this
attribute to specify multiple entries, separated by ;
```

## examples

* `<span class="ix">Chipotle</span>` adds "Chipotle" to index.
* `<span class="ix" data-ix"McDonald, Ronald">Ronald McDonald</span>` adds "McDonald, Ronald" to index. Note, since it is a proper name, it doesn't add a subentry.
* `<span class="ix" data-ix"foods;snacks, fast food">junk food</span>` adds two
  entries to the index: "foods", and "snacks" with "fast food" as a subentry.

## usage

1. add `index.js` to your page
2. markup your document
3. add a placeholder `<div id="index-entries"></div>` where you want the index injected
4. invoke `buildIndex()` when the page is done loading. profit 💥

the script will collect all `.ix` tags and build the index
