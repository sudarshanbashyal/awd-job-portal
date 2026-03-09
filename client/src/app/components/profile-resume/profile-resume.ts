// packages
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';

// components
import { IconsModule } from '../icons/icons-module';

// services
import { ApiService, AuthService } from '../../services';

@Component({
  selector: 'app-profile-resume',
  imports: [IconsModule, CommonModule],
  templateUrl: './profile-resume.html',
  styleUrl: './profile-resume.scss',
})
export class ProfileResume {
  user: UserProfile | null = null;
  resumeInfo: ResumeInfo | null = null;

  toastr = inject(ToastrService);

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
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
      this.toastr.warning('Please add skills and education first.', 'Cannot generate resume.', {
        progressBar: false,
        positionClass: 'toast-top-center',
      });
      return;
    }

    this.apiService.generateResume().subscribe({
      next: (res) => {
        if (res.ok) {
          this.authService.loadUser();
          this.toastr.success(
            'A new resume has been generated based on your profile.',
            'Resume generated',
            {
              progressBar: false,
              positionClass: 'toast-top-center',
            },
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
          this.toastr.success('Your resume has been removed.', 'Resume deleted', {
            progressBar: false,
            positionClass: 'toast-top-center',
          });
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
      this.toastr.error('Only pdf files are allowed', 'Invalid file format', {
        progressBar: false,
        positionClass: 'toast-top-center',
      });
      return;
    }

    this.apiService.uploadResume(resumeFile).subscribe({
      next: (res) => {
        if (res.ok) {
          this.authService.loadUser();
          this.toastr.success('Your resume has been succesfully uploaded', 'Resume uploaded', {
            progressBar: false,
            positionClass: 'toast-top-center',
          });
        }
      },
    });
  }
}
