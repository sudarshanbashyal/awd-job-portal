// packages
import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';

// components
import { IconsModule } from '../icons/icons-module';

// services
import { ApiService, AuthService, ToastService } from '../../services';

@Component({
  selector: 'app-profile-resume',
  imports: [IconsModule, CommonModule],
  templateUrl: './profile-resume.html',
  styleUrl: './profile-resume.scss',
})
export class ProfileResume {
  user: UserProfile | null = null;
  resumeInfo: ResumeInfo | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastSerivce: ToastService,
  ) {
    effect(() => {
      const user = this.authService.getUser();
      if (user) {
        this.user = user;
        this.loadResumeInfo();
      }
    });
  }

  loadResumeInfo() {
    this.apiService.getResumeInfo().subscribe({
      next: (res) => {
        if (res?.data?.originalName) {
          this.resumeInfo = res.data;
        } else {
          this.resumeInfo = null;
        }
      },
    });
  }

  downloadResume() {
    this.apiService.downloadResume().subscribe({
      next: (res: Blob) => {
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = this.resumeInfo?.originalName || '';
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed', err);
      },
    });
  }

  generateResume() {
    const skills = this.user?.applicant?.skills;
    const education = this.user?.applicant?.education;

    if (!skills?.length || !education?.length) {
      this.toastSerivce.show(
        'Cannot generate resume.',
        'Please add skills and education first.',
        'warning',
      );
      return;
    }

    this.apiService.generateResume().subscribe({
      next: (res) => {
        if (res.ok) {
          this.authService.loadUser();
          this.toastSerivce.show(
            'Resume generated',
            'A new resume has been generated based on your profile.',
          );
        }
      },
      error: (err) => {
        console.error('Download failed', err);
      },
    });
  }

  deleteResume() {
    this.apiService.deleteResume().subscribe({
      next: (res) => {
        if (res.ok) {
          this.authService.loadUser();
          this.toastSerivce.show('Resume deleted', 'Your resume has been removed.');
        }
      },
      error: (err) => {
        console.error('Download failed', err);
      },
    });
  }

  uploadResume(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;

    if (fileList?.length !== 1) return;

    const [resumeFile] = fileList;
    if (resumeFile.type !== 'application/pdf') {
      this.toastSerivce.show('Invalid file format', 'Only pdf files are allowed', 'error');
      return;
    }

    this.apiService.uploadResume(resumeFile).subscribe({
      next: (res) => {
        if (res.ok) {
          this.authService.loadUser();
          this.toastSerivce.show('Resume uploaded', 'Your resume has been succesfully uploaded');
        }
      },
    });
  }
}
