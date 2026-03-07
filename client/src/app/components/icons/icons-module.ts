// packages
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { IconUser } from './user-icon';
import { IconEdit } from './edit-icon';
import { IconBack } from './back-icon';
import { IconInfo } from './info-icon';
import { IconLocation } from './location-icon';

const iconComponents = [IconUser, IconEdit, IconBack, IconLocation, IconInfo];

@NgModule({
  declarations: iconComponents,
  imports: [CommonModule],
  exports: iconComponents,
})
export class IconsModule { }
