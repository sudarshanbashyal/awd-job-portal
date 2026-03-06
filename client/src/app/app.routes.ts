// pacakges
import { Routes } from '@angular/router';

// route components
import { Login } from './routes/login/login';
import { Register } from './routes/register/register';
import { JobSearch } from './routes/job-search/job-search';
import { CreateJob } from './routes/create-job/create-job';
import { JobPostings } from './routes/job-postings/job-postings';

export const routes: Routes = [
  { path: '', component: Login },

  { path: 'login', component: Login },
  { path: 'search', component: JobSearch },
  { path: 'register', component: Register },

  { path: 'job-postings', component: JobPostings },
  { path: 'job-post', component: CreateJob },
  { path: 'job-post/:id', component: CreateJob },
  { path: '**', redirectTo: '' },
];
