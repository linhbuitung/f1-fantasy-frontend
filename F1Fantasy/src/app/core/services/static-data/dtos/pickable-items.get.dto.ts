import {DriverGetDto} from './driver.get.dto';
import {ConstructorGetDto} from './constructor.get.dto';

export interface PickableItemGetDto {
  drivers: DriverGetDto[];
  constructors: ConstructorGetDto[];
}
