import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';
import { DriverService } from '../../../core/services/static-data/driver.service';
import { CountryService } from '../../../core/services/static-data/country.service';
import { ConstructorService } from '../../../core/services/static-data/constructor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserGetDto } from '../../../core/services/user/dtos/user.get.dto';
import { UserUpdateDto } from '../../../core/services/user/dtos/user.update.dto';
import {ContentContainerComponent} from '../../../shared/content-container/content-container.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  imports: [
    FormsModule,
    ContentContainerComponent,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  editForm: FormGroup;
  user: UserGetDto | null = null;
  drivers: any[] = [];
  countries: any[] = [];
  constructors: any[] = [];
  serverError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private driverService: DriverService,
    private countryService: CountryService,
    private constructorService: ConstructorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      displayName: ['', Validators.maxLength(20)],
      dateOfBirth: [''],
      acceptNotification: [false],
      driverId: [null],
      constructorId: [null],
      countryId: [null]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getUserById(id).subscribe(user => {
        this.user = user;
        this.editForm.patchValue({
          displayName: user.displayName,
          dateOfBirth: user.dateOfBirth,
          acceptNotification: user.acceptNotification,
          driverId: user.driverId,
          constructorId: user.constructorId,
          countryId: user.countryId
        });
      });
    }
    this.driverService.getAllDrivers().subscribe(list => this.drivers = list);
    this.countryService.getAllCountries().subscribe(list => this.countries = list);
    this.constructorService.getAllConstructors().subscribe(list => this.constructors = list);
  }

  onSubmit() {
    if (this.editForm.invalid || !this.user) return;
    const update: UserUpdateDto = {
      ...this.editForm.value,
      id: this.user.id
    };
    this.userService.updateUser(this.user.id.toString(), update).subscribe({
      next: () => {
        this.router.navigate(['/profile', this.user!.id]);
      },
      error: (err) => {
        this.serverError = err?.error?.message || 'Failed to update profile.';
      }
    });
  }
}
