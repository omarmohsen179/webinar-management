import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {
  @Input() parentForm!: FormGroup;

  registrationTypes = [
    {
      value: 'email',
      title: 'Register With Email Verification',
      description: 'Ensure secure access by requiring email addresses before granting entry.'
    },
    {
      value: 'link',
      title: 'Unique Link',
      subtitle: 'Share unique access links for seamless entry.',
      description: 'Effortless access through personalized link for seamless access'
    },
    {
      value: 'google',
      title: 'Sign In Via Google',
      description: 'Enable participants to register effortlessly using the email linked to their Google account.'
    },
    {
      value: 'form',
      title: 'Register with form',
      description: 'Build a custom registration page in a form style to gather attendee details. Attendees can easily sign up by completing the form.'
    },
    {
      value: 'invite',
      title: 'Only Invited People Can Enter',
      description: 'Restrict access to pre-approved attendees by uploading a guest list.'
    },
    {
      value: 'paid',
      title: 'Paid Registration (Ticket Purchase)',
      description: 'Create tickets for your event, with the option to include discount codes. Participants can register by purchasing a ticket.'
    },
    {
      value: 'open',
      title: 'Open Event (No Registration Or Login)',
      description: 'Make your event accessible to anyone who wants to register or log in.'
    }
  ];
}
