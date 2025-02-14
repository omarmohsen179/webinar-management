import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { WebinarService } from '../../services/webinar.service';
import { BasicInfoComponent } from '../steps/basic-info/basic-info.component';
import { AttendanceComponent } from '../steps/attendance/attendance.component';
import { AdditionalInfoComponent } from '../steps/additional-info/additional-info.component';
import { BrandingComponent } from "../steps/branding/branding.component";
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';

@Component({
  selector: 'app-webinar-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    BasicInfoComponent,
    AttendanceComponent,
    AdditionalInfoComponent,
    BrandingComponent,
    SuccessModalComponent,
    PageHeaderComponent,
  ],
  templateUrl: './webinar-create.component.html',
  styleUrl: './webinar-create.component.scss',
})
export class WebinarCreateComponent {
  webinarForm!: FormGroup;
  isLinear = true;
  isSubmitting = false;
  currentStep = 1;
  
  constructor(
    private fb: FormBuilder,
    private webinarService: WebinarService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.webinarForm = this.fb.group({
      basicInfo: this.fb.group({
        title: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        ],
        description: ['', [Validators.required, Validators.minLength(10)]],
        type: ['single', Validators.required],
        sessionType: ['Video Call', Validators.required],
        startDate: ['', Validators.required],
        startTime: ['', Validators.required],
        duration: ['', [Validators.required, Validators.min(15)]],
        timeZone: ['UTC', Validators.required],
        language: ['English (United States)', Validators.required],
      }),
      branding: this.fb.group({
        domain: ['', [Validators.required, Validators.pattern('^[a-z0-9-]*$')]],
        primaryColor: ['#FFFFFF'],
        secondaryColor: ['#000000'],
        contrastColor: ['#197DD2'],
        customCss: [''],
      }),
      attendance: this.fb.group({
        maxAttendees: ['', [Validators.min(1), Validators.max(10000)]],
        registrationType: ['public', Validators.required],
        requireApproval: [false],
        allowWaitlist: [false],
        registrationDeadline: [''],
        price: this.fb.group({
          amount: [0],
          currency: ['USD'],
        }),
      }),
      additionalInfo: this.fb.group({
        agenda: [''],
        organizerName: ['', Validators.required],
        supportEmail: ['', [Validators.required, Validators.email]],
        speakers: this.fb.array([]),
        materials: this.fb.array([]),
        tags: [[]],
        categories: [[]],
        description: ['', Validators.required],
      }),
    });
  }

  onSubmit(): void {
    if (this.webinarForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const basicInfo = this.webinarForm.get('basicInfo')?.value;
      const startDateTime = this.combineDateTime(basicInfo.startDate, basicInfo.startTime);
      
      const webinarData = {
        ...this.webinarForm.value,
        basicInfo: {
          ...basicInfo,
          startDateTime
        }
      };

      this.webinarService.createWebinar(webinarData).subscribe({
        next: (response) => {
          // Open the success modal
          const dialogRef = this.dialog.open(SuccessModalComponent, {
            width: '800px',
            disableClose: true,
            // height: '600px',
            data: { webinarId: response.id },
          });

          // Handle modal close actions
          dialogRef.afterClosed().subscribe(result => {
            if (result === 'home') {
              this.router.navigate(['/webinars']);
            }
            // 'preview' action is handled in the modal component
          });
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open(
            'Error creating webinar. Please try again.',
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            }
          );
          console.error('Error creating webinar:', error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.webinarForm);
    }
  }

  private combineDateTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes);
    return combined;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Form getters for template access
  get basicInfoForm() {
    return this.webinarForm.get('basicInfo') as FormGroup;
  }

  get brandingForm() {
    return this.webinarForm.get('branding') as FormGroup;
  }

  get attendanceForm() {
    return this.webinarForm.get('attendance') as FormGroup;
  }

  get additionalInfoForm() {
    return this.webinarForm.get('additionalInfo') as FormGroup;
  }

  // Helper methods for validation
  getErrorMessage(controlName: string, groupName: string = 'basicInfo'): string {
    const control = this.webinarForm.get(`${groupName}.${controlName}`);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      return `Maximum length is ${control.errors?.['maxlength'].requiredLength} characters`;
    }
    if (control?.hasError('min')) {
      return `Minimum value is ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `Maximum value is ${control.errors?.['max'].max}`;
    }
    return '';
  }

  // Add navigation methods
  nextStep(): void {
    if (this.currentStep < 4) {
      // Validate current step before proceeding
      const currentFormGroup = this.getCurrentFormGroup();
      if (currentFormGroup.valid) {
        this.currentStep++;
      } else {
        this.markFormGroupTouched(currentFormGroup);
        this.showValidationError();
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  private getCurrentFormGroup(): FormGroup {
    switch (this.currentStep) {
      case 1:
        return this.basicInfoForm;
      case 2:
        return this.brandingForm;
      case 3:
        return this.attendanceForm;
      case 4:
        return this.additionalInfoForm;
      default:
        return this.basicInfoForm;
    }
  }

  private showValidationError(): void {
    this.snackBar.open(
      'Please fill in all required fields correctly before proceeding.',
      'Close',
      {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      }
    );
  }
}
