// pacakges
import { Routes } from '@angular/router';

// route components
import { Login } from './routes/login/login';
import { Profile } from './routes/profile/profile';
import { Register } from './routes/register/register';
import { JobSearch } from './routes/job-search/job-search';
import { CreateJob } from './routes/create-job/create-job';
import { JobDetails } from './routes/job-details/job-details';
import { JobPostings } from './routes/job-postings/job-postings';

export const routes: Routes = [
  { path: '', component: Login },

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'profile', component: Profile },

  { path: 'job-post', component: CreateJob },
  { path: 'job-post/:id', component: CreateJob },
  { path: 'job-postings', component: JobPostings },

  { path: 'search', component: JobSearch },
  { path: 'job/:id', component: JobDetails },
  { path: '**', redirectTo: '' },
];
