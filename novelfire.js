class NovelFire {
  constructor() {
    this.id = 'novelfire';
    this.name = 'Novel Fire';
    this.baseUrl = 'https://novelfire.net';
    this.lang = 'en';
  }

  headers() {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Referer': this.baseUrl,
      'Origin': this.baseUrl,
      'Accept': 'text/html,application/xhtml+xml'
    };
  }

  async popular(page = 1) {
    const res = await fetch(`${this.baseUrl}/home?page=${page}`, {
      headers: this.headers()
    });
    const html = await res.text();
    return this.parseList(html);
  }

  async search(query, page = 1) {
    const res = await fetch(
      `${this.baseUrl}/search?keyword=${encodeURIComponent(query)}&page=${page}`,
      { headers: this.headers() }
    );
    const html = await res.text();
    return this.parseList(html);
  }

  async detail(url) {
    const res = await fetch(url, { headers: this.headers() });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const chapters = [];
    doc.querySelectorAll('.chapter-list a').forEach(el => {
      chapters.push({
        name: el.textContent.trim(),
        url: this.absolute(el.getAttribute('href'))
      });
    });

    return {
      title: doc.querySelector('h1')?.textContent.trim(),
      cover: doc.querySelector('.book img')?.src,
      description: doc.querySelector('.summary')?.textContent.trim(),
      chapters: chapters.reverse()
    };
  }

  async chapter(url) {
    const res = await fetch(url, { headers: this.headers() });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    return {
      content: doc.querySelector('#chapter-content')?.innerHTML
    };
  }

  parseList(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const novels = [];

    doc.querySelectorAll('.book-item').forEach(el => {
      novels.push({
        title: el.querySelector('.title')?.textContent.trim(),
        cover: el.querySelector('img')?.src,
        url: this.absolute(el.querySelector('a')?.getAttribute('href'))
      });
    });

    return novels;
  }

  absolute(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return this.baseUrl + path;
  }
}

export default new NovelFire();
