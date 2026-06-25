import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlslHills from './components/GlslHills';
import ShatterText from './components/ShatterText';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

const ABOUT_TEXT = "I’m Saif Ali Memon—a software developer who builds for the modern web. As a frontend dev and AI prompt engineer, I don't just write code; I create experiences. I spend my time building cinematic 3D web apps with React and Three.js, and figuring out how to make custom AI agents work smarter. I love living right at the intersection of great design and cutting-edge tech.";

function App() {
  const containerRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const leftScrollRef = useRef(null);
  const rightScrollRef = useRef(null);
  
  const aboutSectionRef = useRef(null);
  const aboutTitleRef = useRef(null);
  const aboutCardRef = useRef(null);
  const shatterProgressObjects = useRef([]);
  const [canvasFontSize, setCanvasFontSize] = useState(28);

  const handleShatterInit = (progressObjs) => {
    shatterProgressObjects.current = progressObjs;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCanvasFontSize(18);
      } else {
        setCanvasFontSize(28);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const hillsSectionRef = useRef(null);

  const meetSectionRef = useRef(null);
  const meetLeftTextRef = useRef(null);
  const meetRightTextRef = useRef(null);
  const meetLeftScrollRef = useRef(null);
  const meetRightScrollRef = useRef(null);
  useEffect(() => {
    // 1. ENTRANCE ANIMATION (Hero)
    gsap.set(leftTextRef.current, { x: '-100vw', opacity: 0 });
    gsap.set(rightTextRef.current, { x: '100vw', opacity: 0 });

    const tl = gsap.timeline();
    tl.to(leftTextRef.current, { x: 0, opacity: 1, duration: 1.5, ease: 'power4.out' }, 'start')
      .to(rightTextRef.current, { x: 0, opacity: 1, duration: 1.5, ease: 'power4.out' }, 'start');

    // 2. SCROLL ANIMATION (Hero Out)
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: true,
      }
    });

    scrollTl.to(leftScrollRef.current, { x: '-100vw', ease: 'power2.in' }, 0)
            .to(leftScrollRef.current, { y: '-40vh', ease: 'power2.out' }, 0)
            .to(leftScrollRef.current, { rotation: -25, opacity: 0, ease: 'power1.in' }, 0)
            .to(rightScrollRef.current, { x: '100vw', ease: 'power2.in' }, 0)
            .to(rightScrollRef.current, { y: '40vh', ease: 'power2.out' }, 0)
            .to(rightScrollRef.current, { rotation: 25, opacity: 0, ease: 'power1.in' }, 0);

    // 3. ABOUT SECTION ANIMATION
    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSectionRef.current,
        start: 'top top',
        end: '+=300%', // Pin it for 3 times the viewport height for slow drawing
        scrub: 1,
        pin: true,
      }
    });

    const isMobile = window.innerWidth < 768;
    const cardHeight = isMobile ? '480px' : '360px';
    const cardYOffset = isMobile ? -260 : -200;

    // Phase A: "ABOUT" moves to the top-left of the container (which perfectly aligns with the card)
    aboutTl.to(aboutTitleRef.current, {
      top: '50%',     // Keep base vertical position at center
      left: '0%',     // Aligns perfectly with the left edge of the card
      xPercent: 0,
      yPercent: -100, // Moves the bottom edge of the text to the 50% line
      y: cardYOffset,        
      scale: 0.4,     
      transformOrigin: 'left bottom', // Scale from the bottom-left so it stays anchored to the corner
      ease: 'power2.inOut',
      duration: 1
    });

    // Phase B: Tiny white line appears and grows horizontally
    aboutTl.to(aboutCardRef.current, { opacity: 1, duration: 0.1 })
           .to(aboutCardRef.current, {
             width: '100%', // Fills the container perfectly
             ease: 'power2.out',
             duration: 1.5
           });

    // Phase C: The line expands vertically to form a card shape
    aboutTl.to(aboutCardRef.current, {
             height: cardHeight,
             ease: 'power2.inOut',
             duration: 1.5
           });

    // Phase D: Reveal text letter by letter with shatter animation
    aboutTl.to(shatterProgressObjects.current, {
      progress: 1,
      stagger: 0.015,
      ease: 'power1.out',
      duration: 3
    });

    // 4. PARALLAX EFFECT TO THIRD SECTION
    // Makes the third section slide up smoothly at a slightly different speed
    gsap.fromTo(hillsSectionRef.current, 
      { yPercent: 30 }, 
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: hillsSectionRef.current,
          start: 'top bottom', // When top of hills hits bottom of viewport
          end: 'top top',      // When top of hills hits top of viewport
          scrub: true
        }
      }
    );

    // 5. MEET SECTION ANIMATION (Reversed Hero out animation) over the Hills
    const meetTl = gsap.timeline({
      scrollTrigger: {
        trigger: hillsSectionRef.current,
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
      }
    });

    meetTl.fromTo(meetLeftScrollRef.current, 
      { x: '100vw', y: '40vh', rotation: 25, opacity: 0 },
      { x: 0, y: 0, rotation: 0, opacity: 1, ease: 'power2.out' }, 
      0
    )
    .fromTo(meetRightScrollRef.current, 
      { x: '-100vw', y: '-40vh', rotation: -25, opacity: 0 },
      { x: 0, y: 0, rotation: 0, opacity: 1, ease: 'power2.out' }, 
      0
    );


    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <a 
        href="https://github.com/saifiimemon?tab=repositories" 
        target="_blank" 
        rel="noopener noreferrer"
        className="github-link"
        aria-label="GitHub Profile"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
          <path d="M9 18c-4.51 2-5-2-7-2"/>
        </svg>
      </a>

      {/* 1st Section: Hero */}
      <div ref={containerRef} className="hero-section">
        <div className="hero-wrapper">
          <div ref={leftScrollRef} className="scroll-wrapper">
            <span ref={leftTextRef} className="giant-text word-left">
              SAIF
            </span>
          </div>
          <div ref={rightScrollRef} className="scroll-wrapper">
            <span ref={rightTextRef} className="giant-text word-right">
              MEMON
            </span>
          </div>
        </div>
      </div>
      
      {/* 2nd Section: About */}
      <div ref={aboutSectionRef} className="about-section" style={{ zIndex: 10 }}>
        <div className="about-container">
          <h2 ref={aboutTitleRef} className="about-title">ABOUT</h2>
          
          <div ref={aboutCardRef} className="about-card">
            <p className="about-paragraph">
              <ShatterText
                text={ABOUT_TEXT}
                onInit={handleShatterInit}
                fontSize={canvasFontSize}
                fontStyle={`800 ${canvasFontSize}px Montserrat, sans-serif`}
                textColor="#ffffff"
              />
            </p>
          </div>
        </div>
      </div>

      {/* 3rd Section: GLSL Hills & Meet Overlay */}
      <div ref={hillsSectionRef} style={{ position: 'relative', zIndex: 5 }}>
        
        {/* We pin this wrapper to separate it from the yPercent parallax */}
        <div ref={meetSectionRef} style={{ position: 'relative', width: '100vw', height: '100vh' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
            <GlslHills />
          </div>

          <div className="meet-section" style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, backgroundColor: 'transparent', pointerEvents: 'none' }}>
            <div className="meet-wrapper">
              <div ref={meetLeftScrollRef} className="scroll-wrapper">
                <span ref={meetLeftTextRef} className="giant-text-smaller" style={{ display: 'inline-block' }}>
                  LET's
                </span>
              </div>
              <div ref={meetRightScrollRef} className="scroll-wrapper">
                <span ref={meetRightTextRef} className="giant-text-smaller" style={{ display: 'inline-block' }}>
                  MEET
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

    </>
  );
}

export default App;
