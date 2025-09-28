import {DriverGetDto} from './driver.get.dto';
import {ConstructorGetDto} from './constructor.get.dto';

export interface PickableItemDto {
  drivers: DriverGetDto[];
  constructors: ConstructorGetDto[];
}
