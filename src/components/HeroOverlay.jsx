import React from 'react';
import { ArrowRight, Terminal } from 'lucide-react';

export default function HeroOverlay() {
  return (
    <>
      <header className="header">
        <div className="container header-content">
          <div className="logo text-gradient">Lumina3D</div>
          <nav className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#showcase" className="nav-link">Showcase</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </nav>
        </div>
      </header>

      <div className="hero-container">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Next Generation <br />
              <span className="text-gradient">Web Experiences</span>
            </h1>
            <p className="hero-subtitle">
              Build stunning, interactive 3D landing pages with React Three Fiber.
              Immerse your users in a premium, hardware-accelerated visual journey
              that works seamlessly across desktop and mobile devices.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">
                Get Started <ArrowRight size={20} />
              </button>
              <button className="btn btn-secondary">
                <Terminal size={20} /> View Source
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
