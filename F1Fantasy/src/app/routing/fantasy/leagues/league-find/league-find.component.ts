import { Component } from '@angular/core';
import { LeagueService } from '../../../../core/services/leagues/league.service';
import { LeagueGetDto } from '../../../../core/services/leagues/dtos/league.get.dto';
import { LeagueSearchResultDto } from '../../../../core/services/leagues/dtos/league-search-result.dto';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContentContainerComponent } from '../../../../shared/content-container/content-container.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-league-find',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ContentContainerComponent, RouterLink],
  templateUrl: './league-find.component.html',
  styleUrl: './league-find.component.scss'
})
export class LeagueFindComponent {
  searchForm: FormGroup;
  results: LeagueGetDto[] = [];
  total = 0;
  pageNum = 1;
  pageSize = 10;
  loading = false;
  submitted = false;
  error: string | null = null;
  public Math = Math;

  constructor(
    private leagueService: LeagueService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      query: ['', [Validators.required, Validators.minLength(2)]]
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
}
