import {Component, OnInit} from '@angular/core';
import { LeagueService } from '../../../../core/services/leagues/league.service';
import { LeagueGetDto } from '../../../../core/services/leagues/dtos/league.get.dto';
import { LeagueSearchResultDto } from '../../../../core/services/leagues/dtos/league-search-result.dto';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContentContainerComponent } from '../../../../shared/content-container/content-container.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {AuthService} from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-league-find',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ContentContainerComponent, RouterLink],
  templateUrl: './league-find.component.html',
  styleUrl: './league-find.component.scss'
})
export class LeagueFindComponent implements OnInit {
  searchForm: FormGroup;
  results: LeagueGetDto[] = [];
  total = 0;
  pageNum = 1;
  pageSize = 10;
  loading = false;
  submitted = false;
  error: string | null = null;
  ownedLeagues: LeagueGetDto[] = [];
  joinedLeagues: LeagueGetDto[] = [];
  currentUserId: number | null = null;

  constructor(
    private leagueService: LeagueService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.searchForm = this.fb.group({
      query: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {
    this.authService.userProfile$.subscribe(user => {
      this.currentUserId = user?.id ?? null;
      if (this.currentUserId) {
        this.leagueService.getOwnedLeagues(this.currentUserId).subscribe(leagues => {
          this.ownedLeagues = leagues;
          console.log('Owned leagues:', this.ownedLeagues);
        });
        this.leagueService.getJoinedLeagues(this.currentUserId).subscribe(leagues => {
          this.joinedLeagues = leagues;
        });
      }
    });
  }

  onSearch(page: number = 1) {
    if (this.searchForm.invalid) return;
    this.loading = true;
    this.error = null;
    this.submitted = true;
    this.pageNum = page;
    this.leagueService.SearchLeagues(this.searchForm.value.query, this.pageNum, this.pageSize)
      .subscribe({
        next: (res: LeagueSearchResultDto) => {
          this.results = res.items;
          this.total = res.total;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to search leagues. Please try again.';
          this.loading = false;
        }
      });
  }

  onPageChange(page: number) {
    this.onSearch(page);
  }

  isOwnedByCurrentUser(league: LeagueGetDto): boolean {
    return !!this.ownedLeagues.find(l => l.id === league.id);
  }

  isJoinedByCurrentUser(league: LeagueGetDto): boolean {
    return !!this.joinedLeagues.find(l => l.id === league.id);
  }

  protected readonly Math = Math;
}
