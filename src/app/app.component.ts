import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfettiService } from './services/confetti.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @ViewChild('confettiBtn', { static: true }) confettiBtn!: ElementRef<HTMLButtonElement>;

  title = 'Confetti';

  constructor(private confettiService: ConfettiService) {}

  ngOnInit(): void {
    this.confettiService.init();

  }

  celebrate(): void {
    if (this.confettiBtn) {
      const rect = this.confettiBtn.nativeElement.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;
      this.confettiService.launch(600, startX, startY);
    }
  }

}
