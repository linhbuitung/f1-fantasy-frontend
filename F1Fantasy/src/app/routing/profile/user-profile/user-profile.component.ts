import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {UserService} from '../../../core/services/user/user.service';
import {UserGetDto} from '../../../core/services/user/dtos/user.get.dto';
import {ContentContainerComponent} from '../../../shared/content-container/content-container.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatePipe, NgIf} from '@angular/common';
import {AuthService} from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  imports: [
    ContentContainerComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  profile: UserGetDto | null = null;
  currentUserId: number | null = null;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getUserById(id).subscribe(profile => this.profile = profile);
    }
    this.authService.userProfile$.subscribe(user => {
      this.currentUserId = user?.id ?? null;
    });
  }
}
