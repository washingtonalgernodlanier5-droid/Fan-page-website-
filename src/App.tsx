import React, { useEffect, useMemo, useState } from 'react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Tour', href: '/tour' },
  { label: 'Music + Videos', href: '/music-videos' },
  { label: 'About Plies', href: '/about' },
  { label: 'Shop Merch', href: '/shop' },
];

const streamingLinks = [
  { label: 'Spotify', href: 'https://open.spotify.com/' },
  { label: 'YouTube', href: 'https://www.youtube.com/' },
  { label: 'Apple Music', href: 'https://music.apple.com/' },
  { label: 'Deezer', href: 'https://www.deezer.com/' },
  { label: 'Tidal', href: 'https://listen.tidal.com/' },
];

const releaseList = [
  { title: 'Drip 4 Sale', year: '2024', image: 'D4S', color: 'red' },
  { title: 'All Thee Above', year: '2023', image: 'ATA', color: 'gold' },
  { title: 'Rock', year: '2022', image: 'ROCK', color: 'black' },
  { title: 'Check Callin', year: '2021', image: 'CALL', color: 'silver' },
  { title: 'Real Hitta', year: '2020', image: 'RH', color: 'cyan' },
  { title: 'Ran Off On Da Plug Twice', year: '2019', image: 'ROP', color: 'purple' },
  { title: 'Goon Affiliated', year: '2018', image: 'GA', color: 'orange' },
  { title: 'Da REAList', year: '2017', image: 'REAL', color: 'green' },
  { title: 'Definition of Real', year: '2015', image: 'DOR', color: 'maroon' },
  { title: 'The Real Testament', year: '2014', image: 'TRT', color: 'blue' },
];

const merchItems = [
  { name: 'NO BIH DANCE T-SHIRT (CHARCOAL)', price: '$35', image: 'CHARCOAL', accent: 'charcoal' },
  { name: 'NO BIH DANCE T-SHIRT (WHITE)', price: '$35', image: 'WHITE', accent: 'light' },
  { name: 'RAN OFF BUBBLE T-SHIRT', price: '$35', image: 'BUBBLE', accent: 'red' },
  { name: 'PLIES ROBE (GOLD EMBROIDERY)', price: '$85', image: 'ROBE', accent: 'gold' },
  { name: 'PLUG SLIPPERS (GOLD EMBROIDERY)', price: '$45', image: 'SLIPPERS', accent: 'brown' },
];

const tourDates = [
  { city: 'Miami', venue: 'The Fillmore', date: 'Nov 08, 2026' },
  { city: 'Atlanta', venue: 'Tabernacle', date: 'Nov 12, 2026' },
  { city: 'Houston', venue: 'House of Blues', date: 'Nov 16, 2026' },
  { city: 'Chicago', venue: 'Riot Fest Stage', date: 'Nov 21, 2026' },
];

const footerLinks = [
  { label: 'Press', href: 'https://www.pliesworldbih.com/' },
  { label: 'Terms of Use', href: 'https://www.pliesworldbih.com/' },
  { label: 'Privacy Policy', href: 'https://www.pliesworldbih.com/' },
  { label: 'Cookies Policy', href: 'https://www.pliesworldbih.com/' },
  { label: 'Cookie Settings', href: '#cookies' },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'YouTube', href: 'https://www.youtube.com/' },
  { label: 'Spotify', href: 'https://open.spotify.com/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/' },
  { label: 'Facebook', href: 'https://www.facebook.com/' },
];

function getPathname() {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname || '/';
}

function App() {
  const [currentPath, setCurrentPath] = useState(getPathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(true);
  const [newsletter, setNewsletter] = useState({
    email: '',
    postal: '',
    country: 'United States',
    firstName: '',
    birthday: '',
    consent: false,
    preferences: true,
  });
  const [newsletterStatus, setNewsletterStatus] = useState('');

  useEffect(() => {
    const onPop = () => setCurrentPath(getPathname());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const accepted = localStorage.getItem('plies-cookie-consent');
    if (accepted) setCookieOpen(false);
  }, []);

  const page = useMemo(() => {
    if (currentPath === '/tour') return 'tour';
    if (currentPath === '/music-videos') return 'music';
    if (currentPath === '/about') return 'about';
    if (currentPath === '/shop') return 'shop';
    if (currentPath === '/Drip4Sale') return 'drip';
    return 'home';
  }, [currentPath]);

  const handleNavClick = (href: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', href);
      setCurrentPath(href);
    }
    setMobileOpen(false);
  };

  const handleNewsletterChange = (field: string, value: string | boolean) => {
    setNewsletter((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newsletter.email || !newsletter.email.includes('@')) {
      setNewsletterStatus('Please enter a valid email address.');
      return;
    }
    if (!newsletter.consent) {
      setNewsletterStatus('Please accept the consent checkbox before joining.');
      return;
    }

    setNewsletterStatus('Success! You are on the list.');
    setMailOpen(false);
    setNewsletter({
      email: '',
      postal: '',
      country: 'United States',
      firstName: '',
      birthday: '',
      consent: false,
      preferences: true,
    });
  };

  const acceptCookies = () => {
    localStorage.setItem('plies-cookie-consent', 'yes');
    setCookieOpen(false);
  };

  const renderHome = () => (
    <>
      <section className="hero-wrap">
        <div className="hero-art">
          <div className="art-badge">OFFICIAL RELEASE</div>
          <div className="art-title">DRIP 4 SALE</div>
        </div>

        <div className="hero-copy">
          <div className="eyebrow">NEW SINGLE</div>
          <h1>I GOT #DRIP4SALE</h1>
          <p>
            The latest release from Plies, a hard-hitting, unapologetic record built for the
            streets, the club, and the playlists.
          </p>

          <div className="cta-row">
            <a className="primary-btn" href="https://www.youtube.com/results?search_query=Plies+Drip+4+Sale" target="_blank" rel="noreferrer">
              Get It Now
            </a>
            <button className="secondary-btn" onClick={() => setMailOpen(true)}>
              Join mailing list
            </button>
          </div>

          <div className="streaming-row">
            {streamingLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="video-panel">
        <div className="video-shell">
          <div className="video-frame">
            <iframe
              src="https://www.youtube.com/embed/HnCiUiZjV9g?rel=0"
              title="Plies Drip 4 Sale"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="mailing-slab">
        <div className="mailing-left">
          <div className="eyebrow">STAY UPDATED</div>
          <h2>Join the Plies mailing list.</h2>
        </div>

        <form className="mailing-form" onSubmit={handleNewsletterSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={newsletter.email}
            onChange={(e) => handleNewsletterChange('email', e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </section>

      <section className="section-grid">
        <div className="half-panel">
          <div className="eyebrow">UPCOMING</div>
          <h3>Tour dates</h3>
          <div className="tour-list">
            {tourDates.map((tour) => (
              <div key={tour.city} className="tour-item">
                <span>{tour.date}</span>
                <strong>{tour.city}</strong>
                <small>{tour.venue}</small>
              </div>
            ))}
          </div>
          <a className="text-link" href="/tour" onClick={(e) => { e.preventDefault(); handleNavClick('/tour'); }}>
            See all dates
          </a>
        </div>

        <div className="half-panel">
          <div className="eyebrow">MERCH</div>
          <h3>Official merchandise</h3>
          <div className="merch-mini">
            {merchItems.slice(0, 3).map((item) => (
              <div key={item.name} className="mini-product">
                <div className={`mini-visual ${item.accent}`}>{item.image}</div>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.price}</span>
                </div>
              </div>
            ))}
          </div>
          <a className="text-link" href="/shop" onClick={(e) => { e.preventDefault(); handleNavClick('/shop'); }}>
            Shop all merch
          </a>
        </div>
      </section>

      <section className="music-grid">
        {releaseList.slice(0, 6).map((release) => (
          <article key={release.title} className="release-card">
            <div className={`release-cover ${release.color}`}>{release.image}</div>
            <h4>{release.title}</h4>
            <span>{release.year}</span>
          </article>
        ))}
      </section>
    </>
  );

  const renderTour = () => (
    <section className="content-page">
      <div className="page-header">
        <div className="eyebrow">LIVE</div>
        <h1>tour</h1>
      </div>

      <div className="content-block">
        <h2>plies tour dates</h2>
        <div className="tour-list extended">
          {tourDates.map((tour) => (
            <div key={tour.city} className="tour-item large">
              <span>{tour.date}</span>
              <strong>{tour.city}</strong>
              <small>{tour.venue}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="content-block promo-panel">
        <p>Listen to the latest tracks before the show.</p>
        <div className="streaming-row compact">
          {streamingLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="social-bar">
        {socialLinks.map((social) => (
          <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
            {social.label}
          </a>
        ))}
      </div>
    </section>
  );

  const renderMusic = () => (
    <section className="content-page">
      <div className="page-header">
        <div className="eyebrow">MUSIC</div>
        <h1>Music + Videos</h1>
      </div>

      <div className="catalog-grid">
        {releaseList.map((release) => (
          <article key={release.title} className="catalog-item">
            <div className={`release-cover big ${release.color}`}>{release.image}</div>
            <div className="catalog-copy">
              <h3>{release.title}</h3>
              <span>{release.year}</span>
              <div className="catalog-actions">
                <a href="https://open.spotify.com/" target="_blank" rel="noreferrer">Spotify</a>
                <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">Video</a>
                <a href="https://music.apple.com/" target="_blank" rel="noreferrer">Apple</a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <button className="primary-btn load-more">Load More</button>
    </section>
  );

  const renderAbout = () => (
    <section className="content-page about-page">
      <div className="page-header">
        <div className="eyebrow">ARTIST</div>
        <h1>About Plies</h1>
      </div>

      <div className="about-grid">
        <div className="bio-copy">
          <p>
            Plies is one of the most recognizable voices in Southern hip-hop. Known for his
            commanding delivery, memorable hooks, and relentless energy, Plies has built a fan base that
            spans multiple generations. His work connects with listeners through street anthems, emotional
            storytelling, and a style that is both authentic and magnetic.
          </p>
          <p>
            From early independent releases to major-label visibility, Plies has maintained an identity rooted
            in confidence, hustle, and community. His catalog, live shows, and brand presence have made him a
            defining figure in modern Southern rap culture.
          </p>
          <p>
            The artist’s records and performances are driven by a belief in expressing real-life experiences
            with style and conviction. That authenticity remains the center of the Plies brand.
          </p>
        </div>

        <div className="portrait-panel">
          <div className="portrait-box">PLIES</div>
        </div>
      </div>
    </section>
  );

  const renderShop = () => (
    <section className="content-page">
      <div className="page-header">
        <div className="eyebrow">STORE</div>
        <h1>Shop Merch</h1>
      </div>

      <div className="merch-grid">
        {merchItems.map((item) => (
          <article key={item.name} className="merch-item">
            <div className={`merch-visual ${item.accent}`}>{item.image}</div>
            <h3>{item.name}</h3>
            <div className="merch-meta">
              <span>{item.price}</span>
              <a href="https://www.shopify.com/" target="_blank" rel="noreferrer">Buy Now</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderDrip = () => (
    <section className="content-page drip-page">
      <div className="drip-topbar">
        <div className="drip-mark">DRIP 4 SALE</div>
        <a className="primary-btn" href="https://www.youtube.com/results?search_query=Plies+Drip+4+Sale" target="_blank" rel="noreferrer">
          Get It Now
        </a>
      </div>

      <div className="hero-wrap single-release">
        <div className="hero-art small-art">DRIP 4 SALE</div>
        <div className="hero-copy">
          <div className="eyebrow">OFFICIAL RELEASE</div>
          <h1>I GOT #DRIP4SALE</h1>
          <div className="streaming-row">
            {streamingLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="video-panel">
        <div className="video-shell">
          <div className="video-frame">
            <iframe
              src="https://www.youtube.com/embed/HnCiUiZjV9g?rel=0"
              title="Plies Drip 4 Sale"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <div className="mailing-slab">
        <div className="mailing-left">
          <div className="eyebrow">NEWSLETTER</div>
          <h2>Stay in the loop for the next drop.</h2>
        </div>
        <button className="primary-btn" onClick={() => setMailOpen(true)}>Join mailing list</button>
      </div>

      <div className="content-block">
        <h2>Tour information</h2>
        <div className="tour-list extended">
          {tourDates.map((tour) => (
            <div key={tour.city} className="tour-item large">
              <span>{tour.date}</span>
              <strong>{tour.city}</strong>
              <small>{tour.venue}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="brand-box">
          <div className="brand-mark">P</div>
          <div className="brand-copy">
            <span>PLIES</span>
            <small>WORLD BIH</small>
          </div>
        </div>

        <nav className={`nav ${mobileOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={currentPath === item.href ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button className="menu-toggle" onClick={() => setMobileOpen((v) => !v)}>
          Menu
        </button>
      </header>

      <main className="page-shell">
        {page === 'home' && renderHome()}
        {page === 'tour' && renderTour()}
        {page === 'music' && renderMusic()}
        {page === 'about' && renderAbout()}
        {page === 'shop' && renderShop()}
        {page === 'drip' && renderDrip()}
      </main>

      <footer className="site-footer">
        <div className="footer-logos">
          <span>PLIES</span>
          <span>WORLD BIH</span>
          <span>OFFICIAL</span>
        </div>

        <div className="footer-meta">
          <span>© 2026 PliesWorld BIH</span>
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={(e) => {
              if (link.href === '#cookies') {
                e.preventDefault();
                setCookieOpen(true);
              }
            }}>
              {link.label}
            </a>
          ))}
        </div>
      </footer>

      {mailOpen && (
        <div className="modal-backdrop" onClick={() => setMailOpen(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Join our mailing list</h3>
              <button type="button" onClick={() => setMailOpen(false)}>×</button>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <label>
                Email address
                <input
                  type="email"
                  value={newsletter.email}
                  onChange={(e) => handleNewsletterChange('email', e.target.value)}
                  required
                />
              </label>

              <div className="split-row">
                <label>
                  Postal code
                  <input
                    type="text"
                    value={newsletter.postal}
                    onChange={(e) => handleNewsletterChange('postal', e.target.value)}
                  />
                </label>
                <label>
                  Country
                  <select
                    value={newsletter.country}
                    onChange={(e) => handleNewsletterChange('country', e.target.value)}
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>

              <div className="split-row">
                <label>
                  First name
                  <input
                    type="text"
                    value={newsletter.firstName}
                    onChange={(e) => handleNewsletterChange('firstName', e.target.value)}
                  />
                </label>
                <label>
                  Birthday
                  <input
                    type="date"
                    value={newsletter.birthday}
                    onChange={(e) => handleNewsletterChange('birthday', e.target.value)}
                  />
                </label>
              </div>

              <label className="check-row">
                <input
                  type="checkbox"
                  checked={newsletter.preferences}
                  onChange={(e) => handleNewsletterChange('preferences', e.target.checked)}
                />
                Count me in for product, tour, and exclusive updates.
              </label>

              <label className="check-row consent">
                <input
                  type="checkbox"
                  checked={newsletter.consent}
                  onChange={(e) => handleNewsletterChange('consent', e.target.checked)}
                  required
                />
                I agree to receive marketing communications and understand I can opt out at any time.
              </label>

              <div className="privacy-line">
                <a href="https://www.pliesworldbih.com/" target="_blank" rel="noreferrer">Privacy Policy</a>
              </div>

              {newsletterStatus && <p className="form-status">{newsletterStatus}</p>}

              <div className="popup-actions">
                <button type="submit" className="primary-btn">Submit</button>
                <button type="button" className="secondary-btn" onClick={() => setMailOpen(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cookieOpen && (
        <div className="cookie-banner">
          <p>This site uses cookies to improve your experience and offer tailored updates.</p>
          <button type="button" className="primary-btn" onClick={acceptCookies}>Accept</button>
        </div>
      )}
    </div>
  );
}

export default App;
