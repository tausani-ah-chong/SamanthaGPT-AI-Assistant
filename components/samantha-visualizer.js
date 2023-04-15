import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SamanthaVisualizer = ({ scale, experienceStarted }) => {
  const wrapRef = useRef(null);
  const initializedRef = useRef(false);
  
  // https://codepen.io/psyonline/pen/yayYWg
  useEffect(() => {
    class CustomCurve extends THREE.Curve {
      constructor() {
        super();
      }
    
      getPoint(t) {
        const pi2 = Math.PI * 2;
        const length = 30;
        const radius = 5.6;
    
        const x = length * Math.sin(pi2 * t);
        const y = radius * Math.cos(pi2 * 3 * t);
        let z, p;
    
        p = t % 0.25 / 0.25;
        p = t % 0.25 - (2 * (1 - p) * p * -0.0185 + p * p * 0.25);
        if (Math.floor(t / 0.25) === 0 || Math.floor(t / 0.25) === 2) {
          p *= -1;
        }
        z = radius * Math.sin(pi2 * 2 * (t - p));
    
        return new THREE.Vector3(x, y, z);
      }
    }

    const wrap = wrapRef.current;
  
    const areaWidth = window.innerWidth;
    const areaHeight = window.innerHeight;

    const canvasSize = Math.min(areaWidth, areaHeight);
  
    const length = 30;
    const radius = 5.6;
  
    const rotatevalue = 0.035;
    let acceleration = 0;
    let animatestep = 0;
    let toend = false;
  
    const pi2 = Math.PI * 2;
  
    const group = new THREE.Group();
    let mesh, ringcover, ring;
  
    const camera = new THREE.PerspectiveCamera((50), 1, 1, 10000);
    camera.position.z = 150;
  
    const scene = new THREE.Scene();
    scene.add(group);
  
    mesh = new THREE.Mesh(
      new THREE.TubeGeometry(
        new CustomCurve(),
        200,
        1.1,
        2,
        true
      ),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
      })
    );
    group.add(mesh);
  
    ringcover = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 15, 1),
      new THREE.MeshBasicMaterial({ color: 0xdc5037, opacity: 0, transparent: true })
    );
    ringcover.position.x = length + 1;
    ringcover.rotation.y = Math.PI / 2;
    group.add(ringcover);
  
    ring = new THREE.Mesh(
      new THREE.RingGeometry(4.3, 5.55, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0, transparent: true })
    );
    ring.position.x = length + 1.1;
    ring.rotation.y = Math.PI / 2;
    group.add(ring);
  
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasSize, canvasSize);
    renderer.setClearColor("#DC5037");
  
    if (wrap.children.length > 0) {
      wrap.removeChild(wrap.firstChild);
    }
    wrap.appendChild(renderer.domElement);
  
    animate();

    if (experienceStarted === true) {
      console.log('experience started');

      start()
    }

    function start() {
      toend = true;
      setTimeout(() => {
        back()
      }, 2500);
    }
  
    function back() {
      toend = false;
    }
  
    function render() {
      let progress;
  
      animatestep = Math.max(0, Math.min(240, toend ? animatestep + 1 : animatestep - 4));
      acceleration = easing(animatestep, 0, 1, 240);

      renderer.render(scene, camera);
    }
  
    function animate() {
      mesh.rotation.x += rotatevalue + acceleration;
      render();
      requestAnimationFrame(animate);
    }

    function easing(t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
      return (c / 2) * ((t -= 2) * t * t + 2) + b;
    }
  }, [experienceStarted, scale]);

  return (
    <div
      style={{
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        backgroundColor: '#DC5037',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      }}
    >
      <div ref={wrapRef} id="wrap"/>
    </div>
  );
};

export default React.memo(SamanthaVisualizer);
