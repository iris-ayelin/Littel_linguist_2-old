import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-exit-dialog',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './confirm-exit-dialog.component.html',
  styleUrl: './confirm-exit-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmExitDialogComponent { 
  constructor(public dialogRef: MatDialogRef<ConfirmExitDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
