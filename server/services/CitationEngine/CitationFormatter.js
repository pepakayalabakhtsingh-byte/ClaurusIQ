class CitationFormatter {
  static format(metadata) {
    const { author, year, title, publisher, url, doi } = metadata;
    
    // Fallback helpers
    const fAuthor = author !== 'Unknown Author' ? author : 'Anonymous';
    const fYear = year !== 'Unknown Year' ? year : 'n.d.';
    const fTitle = title !== 'Unknown Title' ? title : 'Untitled Work';
    const fPublisher = publisher !== 'Unknown Publisher' ? publisher : '';

    let bibtexId = fAuthor.split(',')[0].split(' ')[0].toLowerCase() + fYear;
    if (bibtexId === 'anonymousn.d.') bibtexId = 'anon';

    return {
      apa: `${fAuthor}. (${fYear}). ${fTitle}. ${fPublisher}. ${url ? url : (doi ? 'https://doi.org/' + doi : '')}`.trim(),
      mla: `${fAuthor}. "${fTitle}." ${fPublisher}, ${fYear}. ${url || doi || ''}`.trim(),
      ieee: `${fAuthor}, "${fTitle}," ${fPublisher}, ${fYear}. [Online]. Available: ${url || doi || ''}`.trim(),
      chicago: `${fAuthor}. ${fYear}. "${fTitle}." ${fPublisher}. ${url || doi || ''}`.trim(),
      harvard: `${fAuthor}, ${fYear}. ${fTitle}. ${fPublisher}. Available at: ${url || doi || ''}`.trim(),
      bibtex: `@misc{${bibtexId},\n  author = {${fAuthor}},\n  title = {${fTitle}},\n  year = {${fYear}},\n  publisher = {${fPublisher}},\n  url = {${url || doi || ''}}\n}`.trim(),
      ris: `TY  - GEN\nAU  - ${fAuthor}\nTI  - ${fTitle}\nPY  - ${fYear}\nPB  - ${fPublisher}\nUR  - ${url || doi || ''}\nER  -`
    };
  }
}

module.exports = CitationFormatter;
