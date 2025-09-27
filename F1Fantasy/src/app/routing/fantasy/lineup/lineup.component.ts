import { Component, OnInit } from '@angular/core';
import { FantasyLineupService } from '../../../core/services/core-gameplay/fantasy-lineup.service';
import { FantasyLineupDto } from '../../../core/services/core-gameplay/dtos/fantay-lineup.get.dto';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-lineup',
  templateUrl: './lineup.component.html',
  styleUrl: './lineup.component.scss'
})
export class LineupComponent implements OnInit {
  lineup: FantasyLineupDto | null = null;
  currentUserId: number | null = null;

  constructor(
    private fantasyLineupService: FantasyLineupService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.userProfile$.subscribe(user => {
      this.currentUserId = user?.id ?? null;
      if (this.currentUserId) {
        this.fantasyLineupService.getCurrentLineup(this.currentUserId).subscribe({
          next: (data) => this.lineup = data
        });
      }
    });
  }
}
