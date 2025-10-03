import { Component, OnInit } from '@angular/core';
import { PickableItemsService } from '../../../core/services/static-data/pickable-items.service';
import { PickableItemDto } from '../../../core/services/static-data/dtos/pickable-items.get.dto';
import { FantasyLineupService } from '../../../core/services/core-gameplay/fantasy-lineup.service';
import { FantasyLineupDto } from '../../../core/services/core-gameplay/dtos/fantay-lineup.get.dto';
import { StatisticService } from '../../../core/services/statistic/statistic.service';
import { RaceDto } from '../../../core/services/statistic/dtos/race.get.dto';
import {ContentContainerComponent} from '../../../shared/content-container/content-container.component';
import {CommonModule, DatePipe, NgIf} from '@angular/common';
import {AuthService} from '../../../core/services/auth/auth.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  imports: [ContentContainerComponent, DatePipe, NgIf, CommonModule],
  styleUrl: './transfers.component.scss',
})
export class TransfersComponent implements OnInit {
  lineup: FantasyLineupDto | null = null;
  lineupToUpdate: FantasyLineupDto | null = null;
  currentRace: RaceDto | null = null;
  pickableItems: PickableItemDto | null = null;
  currentUserId: number | null = null;
  lineupLimit: number = environment.LINEUP_PRICE_LIMIT;
  lineupValue: number = 0;
  freeTransfers: number = environment.FREE_TRANSFERS_PER_RACE;
  transfersMade: number = 0;
  transferSuccess: boolean = false;

  constructor(
    private authService: AuthService,
    private pickableItemsService: PickableItemsService,
    private fantasyLineupService: FantasyLineupService,
    private statisticService: StatisticService
  ) {}

  ngOnInit() {
    this.authService.userProfile$.subscribe((user) => {
      this.currentUserId = user?.id ?? null;
      if (this.currentUserId) {
        this.statisticService.getCurrentRace().subscribe({
          next: (data) => (this.currentRace = data),
        });
        this.fantasyLineupService
          .getCurrentLineupByUserId(this.currentUserId)
          .subscribe({
            next: (data) => {
              this.lineup = data;
              this.lineupToUpdate = JSON.parse(JSON.stringify(data));
              this.calculateLineupValue();
              this.updateInitialTransfersMade(data.transfersMade);            },
          });

        this.pickableItemsService.getPickableItems().subscribe({
          next: (data) => (this.pickableItems = data),
        });
      }
    });
  }

  updateInitialTransfersMade(transfers: number) {
    this.transfersMade = transfers;
  }


  updateTransfersMade() {
    if (this.lineup && this.lineupToUpdate) {
      this.transfersMade = this.calculateTransfersMade(this.lineup, this.lineupToUpdate) + this.lineup.transfersMade;
    }
  }

  calculateTransfersMade(
    currentLineup: FantasyLineupDto,
    newLineup: FantasyLineupDto
  ): number {
    const currentDriverIds = (currentLineup.drivers ?? []).map((d) => d.id);
    const newDriverIds = (newLineup.drivers ?? []).map((d) => d.id);

    const currentConstructorIds = (currentLineup.constructors ?? []).map(
      (c) => c.id
    );
    const newConstructorIds = (newLineup.constructors ?? []).map((c) => c.id);

    const replacedDrivers = currentDriverIds.filter(
      (id) => !newDriverIds.includes(id)
    );
    const driverTransfers = replacedDrivers.length;

    const replacedConstructors = currentConstructorIds.filter(
      (id) => !newConstructorIds.includes(id)
    );
    const constructorTransfers = replacedConstructors.length;
    return driverTransfers + constructorTransfers;
  }

  onPickDriver(driver: any, event?: Event) {
    if (!this.lineupToUpdate || this.lineupToUpdate.drivers.length >= 5) return;
    this.lineupToUpdate.drivers.push(driver);
    this.updateTransfersMade();
    this.calculateLineupValue();
    if (event && event.target instanceof HTMLButtonElement) {
      event.target.blur();
    }
  }

  onPickConstructor(constructor: any, event?: Event) {
    if (!this.lineupToUpdate || this.lineupToUpdate.constructors.length >= 2) return;
    this.lineupToUpdate.constructors.push(constructor);
    this.updateTransfersMade();
    this.calculateLineupValue();
    if (event && event.target instanceof HTMLButtonElement) {
      event.target.blur();
    }
  }

  onRemoveDriver(driver: any, event?: Event) {
    if (!this.lineupToUpdate) return;
    this.lineupToUpdate.drivers = this.lineupToUpdate.drivers.filter(d => d.id !== driver.id);
    this.updateTransfersMade();
    this.calculateLineupValue();
    if (event && event.target instanceof HTMLButtonElement) {
      event.target.blur();
    }
  }
  onRemoveConstructor(constructor: any, event?: Event) {
    if (!this.lineupToUpdate) return;
    this.lineupToUpdate.constructors = this.lineupToUpdate.constructors.filter(c => c.id !== constructor.id);
    this.updateTransfersMade();
    this.calculateLineupValue();
    if (event && event.target instanceof HTMLButtonElement) {
      event.target.blur();
    }
  }

  onReset() {
    if (!this.lineup) return;
    this.lineupToUpdate = JSON.parse(JSON.stringify(this.lineup));
    this.updateTransfersMade();
    this.calculateLineupValue();
  }

  onMakeTransfer() {
    if (!this.currentUserId || !this.lineupToUpdate) return;
    const dto = {
      id: this.lineupToUpdate.id,
      captainDriverId: (this.lineupToUpdate.drivers ?? []).find(d => d.isCaptain)?.id,
      driverIds: (this.lineupToUpdate.drivers ?? []).map(d => d.id),
      constructorIds: (this.lineupToUpdate.constructors ?? []).map(c => c.id)
    };
    this.fantasyLineupService.updateCurrentLineup(this.currentUserId, dto).subscribe({
      next: (updatedLineup) => {
        this.lineup = updatedLineup;
        this.lineupToUpdate = JSON.parse(JSON.stringify(updatedLineup));
        this.updateInitialTransfersMade(updatedLineup.transfersMade);
        this.calculateLineupValue();
        this.transferSuccess = true;
        console.log("after making transfer, transfersMade:", this.transfersMade, "freeTransfers:", this.freeTransfers);
      }
    });
  }

  calculateLineupValue() {
    if (!this.lineupToUpdate) return;
    const driverTotal = (this.lineupToUpdate.drivers ?? []).reduce((sum: number, d: any) => sum + (d.price ?? 0), 0);
    const constructorTotal = (this.lineupToUpdate.constructors ?? []).reduce((sum: number, c: any) => sum + (c.price ?? 0), 0);
    this.lineupValue = driverTotal + constructorTotal ;
  }

  isDriverPicked(driver: any): boolean {
    return !!this.lineupToUpdate?.drivers.find(d => d.id === driver.id);
  }

  isConstructorPicked(constructor: any): boolean {
    return !!this.lineupToUpdate?.constructors.find(c => c.id === constructor.id);
  }

  setCaptain(driverId: number) {
    if (!this.lineupToUpdate) return;
    (this.lineupToUpdate.drivers ?? []).forEach(d => d.isCaptain = d.id === driverId);
  }

  dismissTransferSuccess() {
    this.transferSuccess = false;
  }

  get overTransferCount(): number {
    return Math.max(0, this.transfersMade - this.freeTransfers);
  }

  get overTransferPenalty(): number {
    return this.overTransferCount * environment.PENALTY_PER_EXCEDDING_ITEM;
  }

  get isDriverLineupFull(): boolean {
    return (this.lineupToUpdate?.drivers?.length ?? 0) >= 5;
  }

  get isConstructorLineupFull(): boolean {
    return (this.lineupToUpdate?.constructors?.length ?? 0) >= 2;
  }
}
