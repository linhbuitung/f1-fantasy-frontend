import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { CircuitService } from '../../../../core/services/static-data/circuit.service';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { CircuitGetDto, CircuitSearchResultDto } from '../../../../core/services/static-data/dtos/circuit.get.dto';
import { finalize } from 'rxjs/operators';
import { ImgUpdateDto } from '../../../../core/services/admin/dtos/img.update.dto';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-circuit-img-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ImageCropperComponent],
  templateUrl: './circuit-img-manager.component.html',
  styleUrl: './circuit-img-manager.component.scss'
})
export class CircuitImgManagerComponent {
  readonly MAX_FILE_SIZE = environment.MAX_FILE_SIZE || 5 * 1024 * 1024;
  readonly ALLOWED_EXT = environment.ALLOWED_EXT || ['jpg', 'jpeg', 'png'];

  pageNum = 1;
  pageSize = 10;
  loading = false;
  error: string | null = null;
  total = 0;

  searchForm: FormGroup;
  circuits: CircuitGetDto[] = [];
  selectedCircuit: CircuitGetDto | null = null;

  originalFile?: File;
  imageBase64?: string | null;
  croppedBlob?: Blob | null;
  croppedDataUrl?: string | null;

  uploading = false;
  serverError: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private circuitService: CircuitService,
    private adminService: AdminService
  ) {
    this.searchForm = this.fb.group({ query: ['', [Validators.required, Validators.minLength(2)]] });
  }

  onSearch(page: number = 1) {
    if (this.searchForm.invalid) return;
    this.loading = true;
    this.error = null;
    this.pageNum = page;
    this.circuitService.SearchCircuits(this.searchForm.value.query, this.pageNum, this.pageSize)
      .subscribe({
        next: (res: CircuitSearchResultDto) => {
          this.circuits = res.items;
          this.total = res.total;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to search circuits. Please try again.';
          this.loading = false;
        }
      });
  }

  selectCircuit(c: CircuitGetDto) {
    this.selectedCircuit = c;
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
    reader.onload = () => { this.imageBase64 = reader.result as string; };
    reader.readAsDataURL(file);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedDataUrl = event.base64 ?? null;
    if ((event as any).blob) {
      this.croppedBlob = (event as any).blob as Blob;
    } else if (this.croppedDataUrl) {
      this.croppedBlob = this.base64ToBlob(this.croppedDataUrl);
    } else {
      this.croppedBlob = null;
    }
  }

  private base64ToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

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

  async upload() {
    this.serverError = null;
    this.successMessage = null;
    if (!this.selectedCircuit) {
      this.serverError = 'Select a circuit first.';
      return;
    }
    const blob = this.croppedBlob ?? (this.originalFile ? this.originalFile : null);
    if (!blob) {
      this.serverError = 'Select and crop an image first.';
      return;
    }
    const safeName = (this.originalFile?.name ?? `circuit-${this.selectedCircuit.id}.jpg`).replace(/\.(png|jpe?g)$/i, '.jpg');
    let file: File;
    if (blob instanceof File) {
      file = (blob.type === 'image/jpeg' || blob.type === 'image/jpg') ? blob : await this.blobToJpegFile(blob, safeName, 0.9);
    } else {
      file = await this.blobToJpegFile(blob, safeName, 0.9);
    }
    if (file.size > this.MAX_FILE_SIZE) {
      this.serverError = 'Cropped file exceeds 5 MB.';
      return;
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!this.ALLOWED_EXT.includes(ext)) {
      this.serverError = 'Invalid file extension.';
      return;
    }
    const dto: ImgUpdateDto = { id: this.selectedCircuit.id!, file };
    this.uploading = true;
    this.adminService.updateCircuitImage(this.selectedCircuit.id!, dto)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (updated) => {
          this.successMessage = 'Circuit image updated successfully.';
          this.selectedCircuit = { ...this.selectedCircuit!, imgUrl: (updated as CircuitGetDto).imgUrl };
        },
        error: (err) => {
          this.serverError = err?.error?.message || 'Upload failed.';
        }
      });
  }
}
