// packages
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { IconUser } from './user-icon';
import { IconEdit } from './edit-icon';
import { IconBack } from './back-icon';

const iconComponents = [IconUser, IconEdit, IconBack];

@NgModule({
  declarations: iconComponents,
  imports: [CommonModule],
  exports: iconComponents,
})
export class IconsModule {}
