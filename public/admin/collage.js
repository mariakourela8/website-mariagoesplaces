/**
 * "Photo collage" block for the story editor (the + button in the text toolbar).
 *
 * Saved in the story's Markdown as a small HTML block, for example:
 *   <figure class="collage" data-layout="row">
 *   <img src="/images/uploads/a.jpg" alt="">
 *   <img src="/images/uploads/b.jpg" alt="">
 *   <figcaption>Optional caption</figcaption>
 *   </figure>
 * The site styles it in src/styles/global.css (.collage). Keep the format in sync with that.
 */
(function () {
  var esc = function (s) {
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var unesc = function (s) {
    return String(s || '')
      .replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
  };
  // The list widget may hand back plain strings or { photo: "..." } objects
  var srcOf = function (p) { return typeof p === 'string' ? p : p && p.photo; };

  CMS.registerEditorComponent({
    id: 'collage',
    label: 'Photo collage',
    fields: [
      {
        name: 'photos',
        label: 'Photos (2, 3 or 4)',
        label_singular: 'photo',
        widget: 'list',
        collapsed: false,
        field: { name: 'photo', label: 'Photo', widget: 'image' },
      },
      {
        name: 'layout',
        label: 'Layout for 3 photos',
        widget: 'select',
        default: 'row',
        options: [
          { label: 'Three in a row', value: 'row' },
          { label: 'One big + two small', value: 'feature' },
        ],
        hint: 'Only used when the collage has exactly 3 photos.',
      },
      { name: 'caption', label: 'Caption', widget: 'string', required: false },
    ],
    pattern: /^<figure class="collage" data-layout="(\w+)">\n([\s\S]*?)\n<\/figure>$/m,
    fromBlock: function (match) {
      var inner = match[2];
      var photos = [];
      var re = /<img src="([^"]*)"/g;
      var m;
      while ((m = re.exec(inner))) photos.push(unesc(m[1]));
      var cap = inner.match(/<figcaption>([\s\S]*?)<\/figcaption>/);
      return { layout: match[1], photos: photos, caption: cap ? unesc(cap[1]) : '' };
    },
    toBlock: function (data) {
      var photos = (data.photos || []).map(srcOf).filter(Boolean);
      var lines = ['<figure class="collage" data-layout="' + (data.layout === 'feature' ? 'feature' : 'row') + '">'];
      photos.forEach(function (src) { lines.push('<img src="' + esc(src) + '" alt="">'); });
      if (data.caption) lines.push('<figcaption>' + esc(data.caption) + '</figcaption>');
      lines.push('</figure>');
      return lines.join('\n');
    },
    toPreview: function (data, getAsset) {
      var photos = (data.photos || []).map(srcOf).filter(Boolean);
      var imgs = photos.map(function (src) {
        var url = getAsset ? String(getAsset(src) || src) : src;
        return '<img src="' + esc(url) + '" alt="" style="flex:1;min-width:0;height:160px;object-fit:cover">';
      }).join('');
      return '<figure style="margin:1.5em 0"><div style="display:flex;gap:6px">' + imgs + '</div>' +
        (data.caption ? '<figcaption style="text-align:center;font-style:italic;margin-top:6px">' + esc(data.caption) + '</figcaption>' : '') +
        '</figure>';
    },
  });
})();
