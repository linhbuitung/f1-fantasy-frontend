import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ImageCropperComponent, ImageCroppedEvent, } from 'ngx-image-cropper';
import { DriverService } from '../../../../core/services/static-data/driver.service';
import { AdminService } from '../../../../core/services/admin/admin.service';
import {DriverGetDto, DriverSearchResultDto} from '../../../../core/services/static-data/dtos/driver.get.dto';
import { finalize } from 'rxjs/operators';
import {ImgUpdateDto} from '../../../../core/services/admin/dtos/img-update.dto';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-driver-img-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ImageCropperComponent],
  templateUrl: './driver-img-manager.component.html',
  styleUrl: './driver-img-manager.component.scss'
})
export class DriverImgManagerComponent {
  readonly MAX_FILE_SIZE = environment.MAX_FILE_SIZE || 5 * 1024 * 1024; // 5 MB
  readonly ALLOWED_EXT =  environment.ALLOWED_EXT || ['jpg', 'jpeg', 'png'];

  pageNum = 1;
  pageSize = 10;
  loading = false;
  submitted = false;
  error: string | null = null;
  total = 0;

  searchForm: FormGroup;
  drivers: DriverGetDto[] = [];
  selectedDriver: DriverGetDto | null = null;

  // file / crop state
  originalFile?: File;
  imageBase64?: string | null;
  croppedBlob?: Blob | null;
  croppedDataUrl?: string | null;

  uploading = false;
  serverError: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private adminService: AdminService
  ) {
    this.searchForm = this.fb.group({
      query: ['', [Validators.required, Validators.minLength(2)]]
    });  }

  onSearch(page: number = 1) {
    if (this.searchForm.invalid) return;
    this.loading = true;
    this.error = null;
    this.submitted = true;
    this.pageNum = page;
    this.driverService.SearchDrivers(this.searchForm.value.query, this.pageNum, this.pageSize)
      .subscribe({
        next: (res: DriverSearchResultDto) => {
          this.drivers = res.items;
          this.total = res.total;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to onSearch drivers. Please try again.';
          this.loading = false;
        }
      });
  }

  selectDriver(d: DriverGetDto) {
    this.selectedDriver = d;
    // reset images
    this.originalFile = undefined;
    this.imageBase64 = null;
    this.croppedBlob = null;
    this.croppedDataUrl = null;
    this.serverError = null;
    this.successMessage = null;
  }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    this.serverError = null;
    this.successMessage = null;

    if (!file) return;

    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!this.ALLOWED_EXT.includes(ext)) {
      this.serverError = 'Invalid file type. Allowed: .jpg, .jpeg, .png';
      return;
    }
    if (file.size > this.MAX_FILE_SIZE) {
      this.serverError = 'File too large. Maximum 5 MB.';
      return;
    }

    this.originalFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ngx-image-cropper callback
  imageCropped(event: ImageCroppedEvent) {
    this.croppedDataUrl = event.base64 ?? null;
    if ((event as any).blob) {
      this.croppedBlob = (event as any).blob as Blob;
    } else if (this.croppedDataUrl) {
      // fallback: convert base64 to blob
      this.croppedBlob = this.base64ToBlob(this.croppedDataUrl);
    } else {
      this.croppedBlob = null;
    }
  }

  // convert base64 dataUrl to Blob
  private base64ToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

  // convert any image Blob to JPEG File using canvas (returns File)
  private async blobToJpegFile(blob: Blob, filename: string, quality = 1, maxDim = 3048): Promise<File> {
    try {
      // decode efficiently
      const imgBitmap = await createImageBitmap(blob);

      // compute target size while preserving aspect ratio and clamping to maxDim
      const aspect = imgBitmap.width / imgBitmap.height;
      let targetW = imgBitmap.width;
      let targetH = imgBitmap.height;
      const maxSide = Math.max(targetW, targetH);
      if (maxSide > maxDim) {
        if (targetW >= targetH) {
          targetW = maxDim;
          targetH = Math.round(maxDim / aspect);
        } else {
          targetH = maxDim;
          targetW = Math.round(maxDim * aspect);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = true;
      // prefer 'high' quality resampling where supported
      try { (ctx as any).imageSmoothingQuality = 'high'; } catch { /* ignore */ }

      ctx.drawImage(imgBitmap, 0, 0, targetW, targetH);

      const outBlob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
      if (outBlob) return new File([outBlob], filename, { type: 'image/jpeg' });
      // fallback
      return new File([blob], filename, { type: blob.type });
    } catch {
      // on error, wrap original blob
      return new File([blob], filename, { type: blob.type });
    }
  }

    // Upload cropped image (or original if not cropped)
  async upload() {
    this.serverError = null;
    this.successMessage = null;
    if (!this.selectedDriver) {
      this.serverError = 'Select a driver first.';
      return;
    }

    const blob = this.croppedBlob ?? (this.originalFile ? this.originalFile : null);
    if (!blob) {
      this.serverError = 'Select and crop an image first.';
      return;
    }

    // ensure filename and mime are consistent (use .jpg)
    const safeName = (this.originalFile?.name ?? `driver-${this.selectedDriver.id}.jpg`).replace(/\.(png|jpe?g)$/i, '.jpg');

    // If we already have a File and it is jpeg, use it; otherwise convert blob->jpeg File
      let file: File;
    if (blob instanceof File) {
      if (blob.type === 'image/jpeg' || blob.type === 'image/jpg') {
          file = blob;
        } else {
          file = await this.blobToJpegFile(blob, safeName, 0.9);
        }
    } else {
      file = await this.blobToJpegFile(blob, safeName, 0.9);
    }

    // final client-side validation before sending
    if (file.size > this.MAX_FILE_SIZE) {
      this.serverError = 'Cropped file exceeds 5 MB.';
      return;
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!this.ALLOWED_EXT.includes(ext)) {
      this.serverError = 'Invalid file extension.';
      return;
    }

    // Build ImgUpdateDto and call the admin service (matches AdminService signature)
    const dto: ImgUpdateDto = {
      id: this.selectedDriver.id,
      file
    };

    this.uploading = true;
    this.adminService.updateDriverImage(this.selectedDriver.id, dto)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (updated) => {
          this.successMessage = 'Driver image updated successfully.';
          // reflect new image in UI if needed
          this.selectedDriver = { ...this.selectedDriver!, imgUrl: (updated as DriverGetDto).imgUrl };
        },
        error: (err) => {
          this.serverError = err?.error?.message || 'Upload failed.';
        }
      });
  }
}
