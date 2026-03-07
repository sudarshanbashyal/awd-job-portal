import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.html',
  styleUrl: './tag.scss',
})
export class Tag {
  @Input() title: string = '';
  @Input() type: 'Success' | 'Error' | 'Warning' | 'Info' = 'Success';
}
