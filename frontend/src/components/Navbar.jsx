export default function Navbar() {
    return (
        <nav className="navbar-mini fixed-top">
            <div className="container d-flex justify-content-between align-items-center">
                {/* Logo */}
                <span className="logo" aria-label="EL CRISCONCHA" title="EL CRISCONCHA">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 72" role="img"
                        style={{ height: "32px", verticalAlign: "middle" }}>
                        <defs>
                            <filter id="inset" colorInterpolationFilters="sRGB">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="b1" />
                                <feOffset in="b1" dx="1.4" dy="1.4" result="o1" />
                                <feComposite in="o1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="innerShadow" />
                                <feFlood floodColor="black" floodOpacity=".55" />
                                <feComposite in2="innerShadow" operator="in" result="shadowColor" />
                                <feComposite in="SourceGraphic" in2="shadowColor" operator="over" result="s1" />
                                <feGaussianBlur in="SourceAlpha" stdDeviation=".7" result="b2" />
                                <feOffset in="b2" dx="-1.2" dy="-1.2" result="o2" />
                                <feFlood floodColor="white" floodOpacity=".25" />
                                <feComposite in2="o2" operator="in" result="hiColor" />
                                <feComposite in="s1" in2="hiColor" operator="over" />
                            </filter>
                        </defs>
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
                            fontFamily="Georgia, 'Times New Roman', serif"
                            fontSize="46" fontWeight="700" letterSpacing=".06em"
                            fill="currentColor" filter="url(#inset)">
                            CRIS CONCHA
                        </text>
                    </svg>
                </span>

                {/* Social links */}
                <div className="d-flex gap-3">
                    <div className="social-icons">
                    {/* Instagram */}
                    <a href="https://www.instagram.com/elcrisconcha/" target="_blank" rel="noreferrer"
                        className="social-icon" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            width="24" height="24">
                            <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 
                       5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.65 0 3 1.35 3 3v10c0 
                       1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 
                       1.35-3 3-3zm10 1a1 1 0 100 2 1 1 0 000-2zM12 
                       7a5 5 0 100 10 5 5 0 000-10zm0 
                       2a3 3 0 110 6 3 3 0 010-6z"/>
                        </svg>
                    </a>

                    {/* YouTube */}
                    <a href="https://www.youtube.com/@CrisConchaMusico" target="_blank" rel="noreferrer"
                        className="social-icon" aria-label="YouTube">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M23.5 6.2c-.3-1.2-1.3-2.1-2.5-2.3C19 3.5 12 3.5 12 3.5s-7 0-9 .4c-1.2.2-2.2 1.1-2.5 2.3C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1.2 1.3 2.1 2.5 2.3 2 .4 9 .4 9 .4s7 0 9-.4c1.2-.2 2.2-1.1 2.5-2.3.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z" />
                        </svg>
                    </a>


                    {/* TikTok (disabled) */}
                    <button className="social-icon disabled" aria-label="TikTok (pronto)" title="Pronto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                            viewBox="0 0 24 24" width="24" height="24">
                            <path d="M12.53.02c1.31-.02 2.61-.01 
                       3.91 0 .08 1.53.63 3.09 1.75 
                       4.17 1.12 1.11 2.7 1.62 4.24 
                       1.79v4.03c-1.44-.05-2.89-.35-4.2-.97a8.5 
                       8.5 0 01-1.62-.93c-.01 2.92.01 
                       5.84-.02 8.75-.08 1.4-.54 
                       2.79-1.35 3.94-1.31 1.92-3.58 
                       3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 
                       1.12-3.72 2.58-4.96 1.66-1.44 
                       3.98-2.13 6.15-1.72.02 1.48-.04 
                       2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 
                       1.04-1.36 1.75-.21.51-.15 1.07-.14 
                       1.61.24 1.64 1.82 3.02 3.5 
                       2.87 1.12-.01 2.19-.66 
                       2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                    </button>
                </div>
            </div>
            </div>
        </nav>
    );
}
