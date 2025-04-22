import {Injectable} from '@angular/core';

interface Particle {
  x: number;
  y: number;
  size: number;
  tilt: number;
  tiltSpeed: number;
  velocityX: number;
  velocityY: number;
  color: string;
}

@Injectable({providedIn: 'root'})
export class ConfettiService {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animating = false;


  init(): void {
    this.canvas = document.createElement('canvas');
    Object.assign(this.canvas.style, {
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '9999'
    });
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;


    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });

    window.dispatchEvent(new Event('resize'));
  }


  launch(count = 400, startX = this.canvas.width / 2, startY = this.canvas.height / 2): void {
    const coneAngle = Math.PI / 2; // 60 degree cone
    const coneDirection = Math.PI / 2; // Upwards (in radians)

    for (let i = 0; i < count; i++) {
      // Spread angle within the cone
      const angle = coneDirection + (Math.random() - 0.5) * coneAngle;

      // Speed magnitude (randomized)
      const speed = 2 + Math.random() * 2;

      this.particles.push({
        x: startX,
        y: startY,
        size: 5 + Math.random() * 5,
        tilt: Math.random() * 10 - 10,
        tiltSpeed: Math.random() * 0.1 + 0.05,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
      });
    }
    if (!this.animating) this.animate();
  }


  private animate(): void {
    this.animating = true;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // update & draw
    this.particles = this.particles.filter(p => p.y > -20);
    for (const p of this.particles) {
      p.x += p.velocityX;
      p.y += p.velocityY;
      p.tilt += p.tiltSpeed;

      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.ellipse(p.x + Math.sin(p.tilt) * 5, p.y, p.size * 0.4, p.size, p.tilt, 0, Math.PI * 2, true);
      this.ctx.fill();
    }

    if (this.particles.length) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.animating = false;
    }
  }
}
