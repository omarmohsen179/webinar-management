import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss',
})
export class BasicInfoComponent implements OnInit {
  @Input() parentForm!: FormGroup;

  timeZones = [
    'Pakistan Standard Time (PST)',
    'Eastern Time (ET)',
    'Pacific Time (PT)',
    'Central European Time (CET)',
  ];

  languages = ['English (United States)', 'Spanish', 'French', 'German'];

  sessionTypes = ['Video Call', 'Audio Call', 'Webinar', 'Workshop'];

  ngOnInit() {
    if (!this.parentForm) {
      console.error('Form group not provided to BasicInfoComponent');
    }
  }
}
